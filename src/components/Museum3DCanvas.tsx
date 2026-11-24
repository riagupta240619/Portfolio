import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createMuseumMaterials } from '../three/materials';
import { buildMuseumWorld, MUSEUM_WAYPOINTS } from '../three/museumWorld';
import type { InteractiveTargetMeta } from '../three/sculptures';
import { PROJECTS_CATALOG, type ProjectExhibit } from '../data/projects';

export type CameraMode = 'guided' | 'orbit';

interface Museum3DCanvasProps {
  scrollProgress: number;
  activeSection: string;
  cameraMode: CameraMode;
  onSelectProject: (project: ProjectExhibit) => void;
  onSelectSectionModal: (sectionId: string) => void;
  onHoveredTargetChange?: (target: InteractiveTargetMeta | null) => void;
}

// Pre-allocated math helpers outside render loop (zero per-frame GC)
const _camTargetPos = new THREE.Vector3();
const _camTargetLook = new THREE.Vector3();
const _curLookAt = new THREE.Vector3(2.1, 2.75, 0);
const _orbPos = new THREE.Vector3();
const _pointerNdc = new THREE.Vector2();
const _dummyObj = new THREE.Object3D();

export const Museum3DCanvas: React.FC<Museum3DCanvasProps> = ({
  scrollProgress,
  activeSection,
  cameraMode,
  onSelectProject,
  onSelectSectionModal,
  onHoveredTargetChange,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const scrollProgressRef = useRef(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  const activeSectionRef = useRef(activeSection);
  activeSectionRef.current = activeSection;

  const cameraModeRef = useRef<CameraMode>(cameraMode);
  const prevCameraModeRef = useRef<CameraMode>(cameraMode);

  const onSelectProjectRef = useRef(onSelectProject);
  onSelectProjectRef.current = onSelectProject;

  const onSelectSectionModalRef = useRef(onSelectSectionModal);
  onSelectSectionModalRef.current = onSelectSectionModal;

  const onHoverChangeRef = useRef(onHoveredTargetChange);
  onHoverChangeRef.current = onHoveredTargetChange;

  const orbitTargetGoalRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
    const wp =
      MUSEUM_WAYPOINTS.find((w) => w.id === activeSection) ?? MUSEUM_WAYPOINTS[0];
    if (cameraMode === 'orbit') {
      orbitTargetGoalRef.current = {
        pos: wp.cameraPos.clone(),
        target: wp.lookAt.clone(),
      };
    }
  }, [cameraMode, activeSection]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const probeCanvas = document.createElement('canvas');
    const glProbe = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!glProbe) {
      setWebglUnavailable(true);
      return;
    }

    const isSoftwareGl = (() => {
      try {
        const ext = glProbe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : glProbe.RENDERER;
        const gpu = String(glProbe.getParameter(param));
        glProbe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.setSize(
      container.clientWidth || window.innerWidth,
      container.clientHeight || window.innerHeight
    );
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 140);
    camera.position.copy(MUSEUM_WAYPOINTS[0].cameraPos);
    _curLookAt.copy(MUSEUM_WAYPOINTS[0].lookAt);
    camera.lookAt(_curLookAt);

    const materials = createMuseumMaterials(renderer, isSoftwareGl);
    const world = buildMuseumWorld(scene, materials);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.minDistance = 2.5;
    controls.maxDistance = 32;
    controls.target.copy(MUSEUM_WAYPOINTS[0].lookAt);
    controls.enabled = cameraModeRef.current === 'orbit';

    const handleControlStart = () => {
      orbitTargetGoalRef.current = null;
    };
    controls.addEventListener('start', handleControlStart);

    // Unified Raycasting for ALL 9 Museum Rooms (Projects + Section Sculptures)
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    let hoveredKey: string | null = null;
    let lastRaycastTime = 0;
    let pointerOffsetX = 0;
    let pointerOffsetY = 0;
    let pointerDownPos: { x: number; y: number } | null = null;

    const getAllInteractables = () => [
      ...world.refs.projectGroups.map((pg) => pg.group),
      ...world.refs.sectionTargets.map((st) => st.group),
    ];

    const extractMeta = (obj: THREE.Object3D): InteractiveTargetMeta | null => {
      const ud = obj.userData as Partial<InteractiveTargetMeta>;
      if (ud.interactionType === 'project' && ud.projectId) {
        return ud as InteractiveTargetMeta;
      }
      if (ud.interactionType === 'section' && ud.sectionId) {
        return ud as InteractiveTargetMeta;
      }
      return null;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointerOffsetX = nx * 0.45;
      pointerOffsetY = ny * 0.24;

      const now = performance.now();
      if (now - lastRaycastTime < 55) return;
      lastRaycastTime = now;

      _pointerNdc.set(nx, ny);
      raycaster.setFromCamera(_pointerNdc, camera);
      const hits = raycaster.intersectObjects(getAllInteractables(), true);
      const hitMeta = hits.length > 0 ? extractMeta(hits[0].object) : null;
      const nextKey = hitMeta
        ? hitMeta.interactionType === 'project'
          ? `project:${hitMeta.projectId}`
          : `section:${hitMeta.sectionId}`
        : null;

      if (nextKey !== hoveredKey) {
        hoveredKey = nextKey;
        renderer.domElement.style.cursor = nextKey
          ? 'pointer'
          : cameraModeRef.current === 'orbit'
          ? 'grab'
          : 'default';
        onHoverChangeRef.current?.(hitMeta);
      }
    };

    const onPointerClick = (e: MouseEvent) => {
      // Ignore orbit drag-release gestures (> 6px pointer movement)
      if (pointerDownPos) {
        const dx = e.clientX - pointerDownPos.x;
        const dy = e.clientY - pointerDownPos.y;
        if (dx * dx + dy * dy > 36) return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(_pointerNdc, camera);
      const hits = raycaster.intersectObjects(getAllInteractables(), true);
      if (hits.length > 0) {
        const hitMeta = extractMeta(hits[0].object);
        if (!hitMeta) return;
        if (hitMeta.interactionType === 'project' && hitMeta.projectId) {
          const proj = PROJECTS_CATALOG.find((p) => p.id === hitMeta.projectId);
          if (proj) onSelectProjectRef.current(proj);
        } else if (hitMeta.interactionType === 'section' && hitMeta.sectionId) {
          onSelectSectionModalRef.current(hitMeta.sectionId);
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('click', onPointerClick);

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    const onContextRestored = () => {
      setWebglUnavailable(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      const mode = cameraModeRef.current;
      if (mode !== prevCameraModeRef.current) {
        controls.enabled = mode === 'orbit';
        if (mode === 'orbit') {
          controls.target.copy(_curLookAt);
        }
        prevCameraModeRef.current = mode;
      }

      if (mode === 'guided') {
        const u = THREE.MathUtils.clamp(scrollProgressRef.current, 0, 1);
        world.cameraCurve.getPointAt(u, _camTargetPos);
        world.lookAtCurve.getPointAt(u, _camTargetLook);

        if (!prefersReducedMotion) {
          _camTargetPos.x += pointerOffsetX;
          _camTargetPos.y += pointerOffsetY;
        }

        const dampFactor = prefersReducedMotion ? 18 : 5.5;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _camTargetPos.x, dampFactor, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _camTargetPos.y, dampFactor, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _camTargetPos.z, dampFactor, delta);

        _curLookAt.x = THREE.MathUtils.damp(_curLookAt.x, _camTargetLook.x, dampFactor, delta);
        _curLookAt.y = THREE.MathUtils.damp(_curLookAt.y, _camTargetLook.y, dampFactor, delta);
        _curLookAt.z = THREE.MathUtils.damp(_curLookAt.z, _camTargetLook.z, dampFactor, delta);
        camera.lookAt(_curLookAt);
      } else {
        if (orbitTargetGoalRef.current) {
          const { pos, target } = orbitTargetGoalRef.current;
          camera.position.x = THREE.MathUtils.damp(camera.position.x, pos.x, 4.5, delta);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, pos.y, 4.5, delta);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, pos.z, 4.5, delta);
          controls.target.x = THREE.MathUtils.damp(controls.target.x, target.x, 4.5, delta);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, target.y, 4.5, delta);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, target.z, 4.5, delta);

          if (camera.position.distanceTo(pos) < 0.08) {
            orbitTargetGoalRef.current = null;
          }
        }
        controls.update();
        _curLookAt.copy(controls.target);
      }

      world.keyLight.position.set(10, 18, camera.position.z + 10);
      world.keyLight.target.position.set(0, 0, camera.position.z - 8);

      if (!prefersReducedMotion) {
        world.refs.infinityGroup.rotation.y = Math.sin(elapsed * 0.35) * 0.28;
        world.refs.infinityCurve.getPointAt((elapsed * 0.14) % 1, _orbPos);
        world.refs.infinityOrb.position.copy(_orbPos);

        world.refs.philosophyRings.forEach((ring, i) => {
          ring.rotation.z += delta * (0.12 + i * 0.03) * (i % 2 === 0 ? 1 : -1);
        });

        world.refs.projectGroups.forEach((pg, i) => {
          const isHovered = hoveredKey === `project:${pg.id}`;
          const targetScale = isHovered ? 1.12 : 1.0;
          pg.inner.scale.x = THREE.MathUtils.damp(pg.inner.scale.x, targetScale, 8, delta);
          pg.inner.scale.y = THREE.MathUtils.damp(pg.inner.scale.y, targetScale, 8, delta);
          pg.inner.scale.z = THREE.MathUtils.damp(pg.inner.scale.z, targetScale, 8, delta);
          pg.inner.rotation.y += delta * (isHovered ? 0.65 : 0.22 + i * 0.05);
        });

        world.refs.sectionTargets.forEach((st) => {
          const isHovered = hoveredKey === `section:${st.id}`;
          const targetScale = isHovered ? 1.07 : 1.0;
          st.inner.scale.x = THREE.MathUtils.damp(st.inner.scale.x, targetScale, 8, delta);
          st.inner.scale.y = THREE.MathUtils.damp(st.inner.scale.y, targetScale, 8, delta);
          st.inner.scale.z = THREE.MathUtils.damp(st.inner.scale.z, targetScale, 8, delta);
        });

        world.refs.toolkitTotems.forEach((totem, i) => {
          totem.rotation.y = Math.sin(elapsed * 0.4 + i) * 0.15;
        });

        world.refs.portalRing.rotation.z = elapsed * 0.08;

        const count = world.motesMesh.count;
        const base = world.moteBasePositions;
        for (let i = 0; i < count; i++) {
          const bx = base[i * 3];
          const by = base[i * 3 + 1];
          const bz = base[i * 3 + 2];
          _dummyObj.position.set(
            bx + Math.sin(elapsed * 0.3 + i) * 0.18,
            by + Math.cos(elapsed * 0.25 + i * 0.7) * 0.14,
            bz
          );
          _dummyObj.rotation.set(elapsed * 0.2 + i, elapsed * 0.15, 0);
          _dummyObj.updateMatrix();
          world.motesMesh.setMatrixAt(i, _dummyObj.matrix);
        }
        world.motesMesh.instanceMatrix.needsUpdate = true;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      controls.removeEventListener('start', handleControlStart);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('click', onPointerClick);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      world.dispose();
      materials.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (webglUnavailable) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 bg-gradient-to-b from-[#EBE7DF] via-[#F4F1EB] to-[#EBE7DF]"
      />
    );
  }

  return (
    <div
      ref={mountRef}
      aria-label="Interactive 3D Infinite Museum Architectural Corridor"
      className="no-print fixed inset-0 z-0 w-full h-full overflow-hidden"
    />
  );
};
