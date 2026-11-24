import * as THREE from 'three';
import type { MuseumMaterialLibrary } from './materials';
import {
  createAchievementsRotundaGroup,
  createEducationCodexGroup,
  createExhibitSculpture,
  createExperiencePillarsGroup,
  createFinalPortalGroup,
  createInclinedMirrorsSculpture,
  createInfinitySculpture,
  createPhilosophyCycleGroup,
  createToolkitApseGroup,
  type AnimatedSculptureRefs,
} from './sculptures';

export interface RoomWaypoint {
  id: string;
  cameraPos: THREE.Vector3;
  lookAt: THREE.Vector3;
}

export const MUSEUM_WAYPOINTS: RoomWaypoint[] = [
  {
    id: 'home',
    cameraPos: new THREE.Vector3(1.1, 3.2, 10.2),
    lookAt: new THREE.Vector3(2.1, 2.75, 0),
  },
  {
    id: 'about',
    cameraPos: new THREE.Vector3(-1.4, 3.1, -9.2),
    lookAt: new THREE.Vector3(-2.3, 2.5, -18),
  },
  {
    id: 'exhibitions',
    cameraPos: new THREE.Vector3(0.0, 3.8, -26.5),
    lookAt: new THREE.Vector3(0.0, 2.1, -38.5),
  },
  {
    id: 'tech-stack',
    cameraPos: new THREE.Vector3(1.6, 3.3, -49.0),
    lookAt: new THREE.Vector3(2.1, 1.8, -58.5),
  },
  {
    id: 'experience',
    cameraPos: new THREE.Vector3(-1.8, 3.2, -68.5),
    lookAt: new THREE.Vector3(-1.5, 2.2, -78),
  },
  {
    id: 'achievements',
    cameraPos: new THREE.Vector3(1.6, 3.4, -88.2),
    lookAt: new THREE.Vector3(1.5, 1.7, -98),
  },
  {
    id: 'education',
    cameraPos: new THREE.Vector3(-1.4, 3.0, -107.2),
    lookAt: new THREE.Vector3(-1.6, 2.0, -116),
  },
  {
    id: 'research',
    cameraPos: new THREE.Vector3(1.4, 3.0, -125.2),
    lookAt: new THREE.Vector3(1.8, 1.9, -134),
  },
  {
    id: 'contact',
    cameraPos: new THREE.Vector3(0.0, 3.2, -141.5),
    lookAt: new THREE.Vector3(0.0, 2.8, -152),
  },
];

export interface BuiltMuseumWorld {
  refs: AnimatedSculptureRefs;
  motesMesh: THREE.InstancedMesh;
  moteBasePositions: Float32Array;
  cameraCurve: THREE.CatmullRomCurve3;
  lookAtCurve: THREE.CatmullRomCurve3;
  keyLight: THREE.DirectionalLight;
  dispose: () => void;
}

export function buildMuseumWorld(
  scene: THREE.Scene,
  mats: MuseumMaterialLibrary
): BuiltMuseumWorld {
  const refs: AnimatedSculptureRefs = {
    infinityGroup: new THREE.Group(),
    infinityOrb: new THREE.Mesh(),
    infinityCurve: new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3()),
    philosophyRings: [],
    projectGroups: [],
    sectionTargets: [],
    toolkitTotems: [],
    mirrorRays: [],
    portalRing: new THREE.Mesh(),
  };

  // Atmospheric background & horizon-matched fog (#EBE7DF warm alabaster-limestone)
  const fogColor = new THREE.Color(0xebe7df);
  scene.background = fogColor;
  scene.fog = new THREE.FogExp2(0xebe7df, 0.022);

  // 1. Continuous Travertine Gallery Floor (long architectural axis)
  const floorGeo = new THREE.PlaneGeometry(46, 220);
  const floor = new THREE.Mesh(floorGeo, mats.floorStone);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -76);
  floor.receiveShadow = true;
  scene.add(floor);

  // Subtle recessed central architectural walkway strip (y = 0.015 offset)
  const runnerGeo = new THREE.PlaneGeometry(3.8, 185);
  const runnerMat = new THREE.MeshStandardMaterial({
    color: 0xe2dcd1,
    roughness: 0.72,
    metalness: 0.05,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const runner = new THREE.Mesh(runnerGeo, runnerMat);
  runner.rotation.x = -Math.PI / 2;
  runner.position.set(0, 0.012, -74);
  runner.receiveShadow = true;
  scene.add(runner);

  // 2. Architectural Colonnade Rib Arches (InstancedMesh for low draw calls)
  const archCount = 16;
  const pillarGeo = new THREE.BoxGeometry(0.65, 9.2, 0.9);
  const lintelGeo = new THREE.BoxGeometry(17.5, 0.65, 0.9);
  const leftPillars = new THREE.InstancedMesh(pillarGeo, mats.archStone, archCount);
  const rightPillars = new THREE.InstancedMesh(pillarGeo, mats.archStone, archCount);
  const lintels = new THREE.InstancedMesh(lintelGeo, mats.plasterWall, archCount);

  leftPillars.castShadow = true;
  leftPillars.receiveShadow = true;
  rightPillars.castShadow = true;
  rightPillars.receiveShadow = true;

  const dummy = new THREE.Object3D();
  for (let i = 0; i < archCount; i++) {
    const z = 8 - i * 11;
    dummy.position.set(-8.4, 4.6, z);
    dummy.updateMatrix();
    leftPillars.setMatrixAt(i, dummy.matrix);

    dummy.position.set(8.4, 4.6, z);
    dummy.updateMatrix();
    rightPillars.setMatrixAt(i, dummy.matrix);

    dummy.position.set(0, 9.4, z);
    dummy.updateMatrix();
    lintels.setMatrixAt(i, dummy.matrix);
  }
  leftPillars.instanceMatrix.needsUpdate = true;
  rightPillars.instanceMatrix.needsUpdate = true;
  lintels.instanceMatrix.needsUpdate = true;
  leftPillars.computeBoundingSphere();
  rightPillars.computeBoundingSphere();
  lintels.computeBoundingSphere();

  scene.add(leftPillars, rightPillars, lintels);

  // 3. Place the 9 Museum Sculptural Chambers
  // Zone 01: Grand Atrium Infinity Sculpture
  const infinitySculpture = createInfinitySculpture(mats, refs);
  infinitySculpture.position.set(2.3, 0, 0);
  scene.add(infinitySculpture);

  // Zone 02: Philosophy Cycle Sculpture
  const philosophySculpture = createPhilosophyCycleGroup(mats, refs);
  philosophySculpture.position.set(-2.4, 0, -18);
  scene.add(philosophySculpture);

  // Zone 03: Three Interactive Exhibition Sculptures (Synthetic Log, PQShield, Hospital)
  const exhibit1 = createExhibitSculpture(
    'synthetic-log-generator',
    'PROJECT 01',
    'Synthetic Log Generator',
    mats,
    refs
  );
  exhibit1.position.set(-3.4, 0, -37.2);
  scene.add(exhibit1);

  const exhibit2 = createExhibitSculpture(
    'pqshield',
    'PROJECT 02',
    'PQShield: Hybrid Post-Quantum Security Platform',
    mats,
    refs
  );
  exhibit2.position.set(0.0, 0, -40.0);
  scene.add(exhibit2);

  const exhibit3 = createExhibitSculpture(
    'hospital-management-system',
    'PROJECT 03',
    'Hospital Management System',
    mats,
    refs
  );
  exhibit3.position.set(3.4, 0, -37.2);
  scene.add(exhibit3);

  // Zone 04: Tech Stack 7-Totem Apse
  const toolkitGroup = createToolkitApseGroup(mats, refs);
  toolkitGroup.position.set(2.1, 0, -58.5);
  scene.add(toolkitGroup);

  // Zone 05: Experience Chronology Pillars
  const expGroup = createExperiencePillarsGroup(mats, refs);
  expGroup.position.set(-1.5, 0, -78);
  scene.add(expGroup);

  // Zone 06: Achievements Rotunda
  const achGroup = createAchievementsRotundaGroup(mats, refs);
  achGroup.position.set(1.5, 0, -98);
  scene.add(achGroup);

  // Zone 07: Academic Codex
  const eduGroup = createEducationCodexGroup(mats, refs);
  eduGroup.position.set(-1.6, 0, -116);
  scene.add(eduGroup);

  // Zone 08: JETIR Optical Inclined Mirrors Sculpture
  const mirrorsGroup = createInclinedMirrorsSculpture(mats, refs);
  mirrorsGroup.position.set(1.8, 0, -134);
  scene.add(mirrorsGroup);

  // Zone 09: Final Infinity Portal
  const portalGroup = createFinalPortalGroup(mats, refs);
  portalGroup.position.set(0, 0, -152);
  scene.add(portalGroup);

  // 4. Instanced Atmospheric Dust / Light Motes
  const moteCount = 180;
  const moteGeo = new THREE.OctahedronGeometry(0.032, 0);
  const moteMat = new THREE.MeshBasicMaterial({
    color: 0x7774a9,
    transparent: true,
    opacity: 0.45,
  });
  const motesMesh = new THREE.InstancedMesh(moteGeo, moteMat, moteCount);
  const moteBasePositions = new Float32Array(moteCount * 3);

  for (let i = 0; i < moteCount; i++) {
    const x = (Math.random() - 0.5) * 14;
    const y = 0.6 + Math.random() * 6.5;
    const z = 8 - Math.random() * 165;
    moteBasePositions[i * 3] = x;
    moteBasePositions[i * 3 + 1] = y;
    moteBasePositions[i * 3 + 2] = z;

    dummy.position.set(x, y, z);
    dummy.scale.setScalar(0.6 + Math.random() * 0.9);
    dummy.updateMatrix();
    motesMesh.setMatrixAt(i, dummy.matrix);
  }
  motesMesh.instanceMatrix.needsUpdate = true;
  motesMesh.frustumCulled = false;
  scene.add(motesMesh);

  // 5. Studio Warm/Cool 3-Point Lighting Rig
  const hemiLight = new THREE.HemisphereLight(0xfaf8f5, 0xc9c2b8, 0.95);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff4e6, 1.85);
  keyLight.position.set(10, 18, 12);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 48;
  keyLight.shadow.camera.left = -16;
  keyLight.shadow.camera.right = 16;
  keyLight.shadow.camera.top = 16;
  keyLight.shadow.camera.bottom = -16;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.normalBias = 0.02;
  scene.add(keyLight);
  scene.add(keyLight.target);

  const rimLight = new THREE.DirectionalLight(0xb9c6d0, 0.85);
  rimLight.position.set(-10, 10, -14);
  scene.add(rimLight);

  // Accent museum gallery point lights over major exhibits (no shadows to stay fast)
  const exhibitSpot = new THREE.PointLight(0xffffff, 8, 22, 1.5);
  exhibitSpot.position.set(0, 7, -38.5);
  scene.add(exhibitSpot);

  const mirrorSpot = new THREE.PointLight(0xd9d7ee, 7, 18, 1.5);
  mirrorSpot.position.set(1.8, 6.2, -134);
  scene.add(mirrorSpot);

  // 6. Continuous Camera & LookAt Curves across all 9 waypoints
  const cameraCurve = new THREE.CatmullRomCurve3(
    MUSEUM_WAYPOINTS.map((w) => w.cameraPos),
    false,
    'catmullrom',
    0.45
  );
  const lookAtCurve = new THREE.CatmullRomCurve3(
    MUSEUM_WAYPOINTS.map((w) => w.lookAt),
    false,
    'catmullrom',
    0.45
  );

  return {
    refs,
    motesMesh,
    moteBasePositions,
    cameraCurve,
    lookAtCurve,
    keyLight,
    dispose: () => {
      runnerMat.dispose();
      moteMat.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh || (obj as THREE.LineSegments).isLineSegments) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else if (mesh.material) {
            mesh.material.dispose();
          }
        }
      });
    },
  };
}
