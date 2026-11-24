import * as THREE from 'three';
import type { MuseumMaterialLibrary } from './materials';

export interface InteractiveTargetMeta {
  interactionType: 'project' | 'section';
  projectId?: string;
  sectionId?: string;
  kicker: string;
  title: string;
}

/**
 * Generates a 3D parametric Lemniscate of Bernoulli curve with gentle Z-ribbon relief
 */
class Lemniscate3DCurve extends THREE.Curve<THREE.Vector3> {
  private rx: number;
  private ry: number;
  private rz: number;

  constructor(rx = 2.2, ry = 1.65, rz = 0.42) {
    super();
    this.rx = rx;
    this.ry = ry;
    this.rz = rz;
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const angle = t * Math.PI * 2;
    const denom = 1 + Math.sin(angle) * Math.sin(angle);
    const x = (this.rx * Math.cos(angle)) / denom;
    const y = (this.ry * Math.sin(angle) * Math.cos(angle)) / denom;
    const z = this.rz * Math.sin(angle);
    return optionalTarget.set(x, y, z);
  }
}

function addGroundedPlinth(
  group: THREE.Group,
  mats: MuseumMaterialLibrary,
  radiusTop = 1.5,
  radiusBottom = 1.68,
  height = 0.9,
  shadowRadius = 2.5
) {
  // Soft contact shadow plane slightly above floor (y = 0.02)
  const shadowGeo = new THREE.PlaneGeometry(shadowRadius * 2, shadowRadius * 2);
  const shadow = new THREE.Mesh(shadowGeo, mats.contactShadow);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  // Lower stone plinth
  const baseGeo = new THREE.CylinderGeometry(radiusBottom, radiusBottom + 0.12, 0.16, 48);
  const base = new THREE.Mesh(baseGeo, mats.archStone);
  base.position.y = 0.08;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // Main charcoal pedestal drum
  const drumGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 48);
  const drum = new THREE.Mesh(drumGeo, mats.pedestalDark);
  drum.position.y = 0.16 + height / 2;
  drum.castShadow = true;
  drum.receiveShadow = true;
  group.add(drum);

  // Top porcelain cap collar
  const capGeo = new THREE.CylinderGeometry(radiusTop + 0.05, radiusTop + 0.02, 0.08, 48);
  const cap = new THREE.Mesh(capGeo, mats.ivoryPorcelain);
  cap.position.y = 0.16 + height + 0.04;
  cap.castShadow = true;
  cap.receiveShadow = true;
  group.add(cap);

  return 0.16 + height + 0.08; // top Y coordinate
}

function attachCollider(
  root: THREE.Group,
  size: [number, number, number],
  centerY: number,
  meta: InteractiveTargetMeta
) {
  const colliderGeo = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const colliderMat = new THREE.MeshBasicMaterial({ visible: false });
  const collider = new THREE.Mesh(colliderGeo, colliderMat);
  collider.position.y = centerY;
  collider.userData = { ...meta };
  collider.layers.enable(1);
  root.add(collider);
}

export interface AnimatedSculptureRefs {
  infinityGroup: THREE.Group;
  infinityOrb: THREE.Mesh;
  infinityCurve: THREE.Curve<THREE.Vector3>;
  philosophyRings: THREE.Mesh[];
  projectGroups: Array<{
    id: string;
    group: THREE.Group;
    inner: THREE.Group;
    meta: InteractiveTargetMeta;
  }>;
  sectionTargets: Array<{
    id: string;
    group: THREE.Group;
    inner: THREE.Group;
    meta: InteractiveTargetMeta;
  }>;
  toolkitTotems: THREE.Mesh[];
  mirrorRays: THREE.Mesh[];
  portalRing: THREE.Mesh;
}

export function createInfinitySculpture(
  mats: MuseumMaterialLibrary,
  refs: AnimatedSculptureRefs
): THREE.Group {
  const root = new THREE.Group();
  const topY = addGroundedPlinth(root, mats, 1.45, 1.65, 0.95, 2.7);

  // Brushed charcoal mounting cradle
  const stemGeo = new THREE.CylinderGeometry(0.1, 0.18, 0.9, 24);
  const stem = new THREE.Mesh(stemGeo, mats.brushedCharcoal);
  stem.position.y = topY + 0.45;
  stem.castShadow = true;
  root.add(stem);

  const collarGeo = new THREE.TorusGeometry(0.28, 0.035, 16, 48);
  const collar = new THREE.Mesh(collarGeo, mats.lavenderMetal);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = topY + 0.12;
  root.add(collar);

  // Sculptural Infinity Assembly
  const infinityGroup = new THREE.Group();
  infinityGroup.position.y = topY + 1.85;

  const curve = new Lemniscate3DCurve(2.15, 1.55, 0.42);
  const tubeGeo = new THREE.TubeGeometry(curve, 160, 0.11, 24, true);
  const tube = new THREE.Mesh(tubeGeo, mats.brushedCharcoal);
  tube.castShadow = true;
  infinityGroup.add(tube);

  // Inner mist-glass accent ribbon slightly offset
  const innerCurve = new Lemniscate3DCurve(2.15, 1.55, -0.42);
  const innerTubeGeo = new THREE.TubeGeometry(innerCurve, 128, 0.045, 16, true);
  const innerTube = new THREE.Mesh(innerTubeGeo, mats.mistGlass);
  infinityGroup.add(innerTube);

  // Outer architectural gimbal ring
  const gimbalGeo = new THREE.TorusGeometry(2.55, 0.025, 16, 96);
  const gimbal = new THREE.Mesh(gimbalGeo, mats.lavenderMetal);
  gimbal.rotation.x = Math.PI / 3;
  infinityGroup.add(gimbal);

  // Orbiting luminous sphere
  const orbGeo = new THREE.SphereGeometry(0.14, 24, 24);
  const orb = new THREE.Mesh(orbGeo, mats.lavenderMetal);
  orb.castShadow = true;
  infinityGroup.add(orb);

  root.add(infinityGroup);
  refs.infinityGroup = infinityGroup;
  refs.infinityOrb = orb;
  refs.infinityCurve = curve;

  const meta: InteractiveTargetMeta = {
    interactionType: 'section',
    sectionId: 'home',
    kicker: '01 — The Grand Entrance',
    title: 'The Infinite Museum ∞ · Identity & Overview',
  };
  attachCollider(root, [5.0, 5.2, 3.4], 2.7, meta);
  refs.sectionTargets.push({ id: 'home', group: root, inner: infinityGroup, meta });

  return root;
}

export function createPhilosophyCycleGroup(
  mats: MuseumMaterialLibrary,
  refs: AnimatedSculptureRefs
): THREE.Group {
  const root = new THREE.Group();
  const topY = addGroundedPlinth(root, mats, 1.3, 1.45, 0.75, 2.3);

  const inner = new THREE.Group();
  inner.position.y = topY + 1.55;

  // 5 concentric stepped architectural rings symbolizing Understand -> Explore -> Design -> Test -> Learn
  for (let i = 0; i < 5; i++) {
    const radius = 0.55 + i * 0.24;
    const ringGeo = new THREE.TorusGeometry(radius, 0.04, 16, 64);
    const mat = i % 2 === 0 ? mats.brushedCharcoal : mats.lavenderMetal;
    const ring = new THREE.Mesh(ringGeo, mat);
    ring.rotation.x = Math.PI * 0.18 * (i + 1);
    ring.rotation.y = Math.PI * 0.14 * i;
    ring.castShadow = true;
    inner.add(ring);
    refs.philosophyRings.push(ring);
  }

  // Central porcelain core
  const coreGeo = new THREE.OctahedronGeometry(0.32, 0);
  const core = new THREE.Mesh(coreGeo, mats.ivoryPorcelain);
  core.castShadow = true;
  inner.add(core);

  root.add(inner);

  const meta: InteractiveTargetMeta = {
    interactionType: 'section',
    sectionId: 'about',
    kicker: '02 — About',
    title: 'The Story Behind the Work · Build. Break. Learn. Repeat.',
  };
  attachCollider(root, [3.6, 4.4, 3.6], 2.2, meta);
  refs.sectionTargets.push({ id: 'about', group: root, inner, meta });

  return root;
}

export function createExhibitSculpture(
  projectId: string,
  projectNumber: string,
  projectTitle: string,
  mats: MuseumMaterialLibrary,
  refs: AnimatedSculptureRefs
): THREE.Group {
  const root = new THREE.Group();
  const topY = addGroundedPlinth(root, mats, 1.15, 1.28, 1.05, 2.0);

  const inner = new THREE.Group();
  inner.position.y = topY + 1.25;

  if (projectId === 'synthetic-log-generator') {
    for (let i = 0; i < 4; i++) {
      const slabGeo = new THREE.BoxGeometry(1.3 - i * 0.14, 0.08, 0.9 - i * 0.08);
      const slab = new THREE.Mesh(slabGeo, i % 2 === 0 ? mats.mistGlass : mats.ivoryPorcelain);
      slab.position.y = -0.45 + i * 0.28;
      slab.rotation.y = i * 0.25;
      slab.castShadow = true;
      inner.add(slab);
    }
    const coreGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.25, 6);
    const core = new THREE.Mesh(coreGeo, mats.brushedCharcoal);
    core.castShadow = true;
    inner.add(core);

    const ringGeo = new THREE.TorusGeometry(0.88, 0.03, 16, 64);
    const ring = new THREE.Mesh(ringGeo, mats.lavenderMetal);
    ring.rotation.x = Math.PI / 2.4;
    inner.add(ring);
  } else if (projectId === 'pqshield') {
    const crystalGeo = new THREE.IcosahedronGeometry(0.62, 0);
    const crystal = new THREE.Mesh(crystalGeo, mats.lavenderMetal);
    crystal.castShadow = true;
    inner.add(crystal);

    const shieldGeo = new THREE.IcosahedronGeometry(0.88, 1);
    const shieldEdges = new THREE.EdgesGeometry(shieldGeo);
    const shieldWire = new THREE.LineSegments(
      shieldEdges,
      new THREE.LineBasicMaterial({ color: 0x242522 })
    );
    inner.add(shieldWire);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.028, 14, 64), mats.brushedCharcoal);
    ring1.rotation.x = Math.PI / 3;
    inner.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.025, 14, 64), mats.mistGlass);
    ring2.rotation.y = Math.PI / 3;
    inner.add(ring2);
  } else {
    const frameGeo = new THREE.BoxGeometry(1.35, 0.95, 0.08);
    const frame = new THREE.Mesh(frameGeo, mats.ivoryPorcelain);
    frame.castShadow = true;
    inner.add(frame);

    const glassCardGeo = new THREE.BoxGeometry(0.95, 0.65, 0.06);
    const glassCard = new THREE.Mesh(glassCardGeo, mats.mistGlass);
    glassCard.position.set(0.2, 0.18, 0.24);
    inner.add(glassCard);

    const pill1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.12), mats.lavenderMetal);
    pill1.position.set(-0.32, -0.22, 0.22);
    inner.add(pill1);

    const baseBar = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.1, 0.35), mats.brushedCharcoal);
    baseBar.position.y = -0.58;
    inner.add(baseBar);
  }

  const meta: InteractiveTargetMeta = {
    interactionType: 'project',
    projectId,
    kicker: `${projectNumber} · Interactive Exhibit`,
    title: projectTitle,
  };

  attachCollider(root, [2.4, 3.6, 2.4], topY + 0.9, meta);
  root.add(inner);
  refs.projectGroups.push({ id: projectId, group: root, inner, meta });
  return root;
}

export function createToolkitApseGroup(
  mats: MuseumMaterialLibrary,
  refs: AnimatedSculptureRefs
): THREE.Group {
  const root = new THREE.Group();

  const daisShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(9.5, 5.5),
    mats.contactShadow
  );
  daisShadow.rotation.x = -Math.PI / 2;
  daisShadow.position.y = 0.02;
  root.add(daisShadow);

  const dais = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.4, 0.22, 48), mats.archStone);
  dais.position.y = 0.11;
  dais.receiveShadow = true;
  root.add(dais);

  const inner = new THREE.Group();

  // 7 vertical sculptural totems representing the 7 Tech Stack collections
  const heights = [1.8, 2.4, 2.1, 2.7, 1.95, 2.5, 2.2];
  for (let i = 0; i < 7; i++) {
    const angle = -Math.PI * 0.42 + (i / 6) * Math.PI * 0.84;
    const radius = 2.8;
    const x = Math.sin(angle) * radius;
    const z = -Math.cos(angle) * radius + 1.1;
    const h = heights[i];

    const colGeo = new THREE.BoxGeometry(0.38, h, 0.38);
    const colMat = i % 3 === 1 ? mats.lavenderMetal : i % 2 === 0 ? mats.pedestalDark : mats.ivoryPorcelain;
    const col = new THREE.Mesh(colGeo, colMat);
    col.position.set(x, 0.22 + h / 2, z);
    col.castShadow = true;
    col.receiveShadow = true;
    inner.add(col);
    refs.toolkitTotems.push(col);

    const crown = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.16, 0),
      mats.mistGlass
    );
    crown.position.set(x, 0.22 + h + 0.25, z);
    inner.add(crown);
  }

  root.add(inner);

  const meta: InteractiveTargetMeta = {
    interactionType: 'section',
    sectionId: 'tech-stack',
    kicker: '04 — Tech Stack',
    title: 'The Engineering Toolkit · 7 Technical Collections',
  };
  attachCollider(root, [7.6, 3.6, 4.8], 1.8, meta);
  refs.sectionTargets.push({ id: 'tech-stack', group: root, inner, meta });

  return root;
}

export function createExperiencePillarsGroup(
  mats: MuseumMaterialLibrary,
  refs: AnimatedSculptureRefs
): THREE.Group {
  const root = new THREE.Group();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(7, 4), mats.contactShadow);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  root.add(shadow);

  const inner = new THREE.Group();

  // Two chronological architectural pillars (C3R & GDG) linked by a suspended datum beam
  const positions = [-1.7, 1.7];
  const heights = [3.6, 3.0];

  positions.forEach((x, idx) => {
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.22, 1.1), mats.archStone);
    base.position.set(x, 0.11, 0);
    base.receiveShadow = true;
    inner.add(base);

    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, heights[idx], 0.68),
      idx === 0 ? mats.pedestalDark : mats.ivoryPorcelain
    );
    pillar.position.set(x, 0.22 + heights[idx] / 2, 0);
    pillar.castShadow = true;
    inner.add(pillar);

    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(0.84, 0.1, 0.84),
      mats.lavenderMetal
    );
    cap.position.set(x, 0.22 + heights[idx] + 0.05, 0);
    inner.add(cap);
  });

  const beam = new THREE.Mesh(
    new THREE.BoxGeometry(4.4, 0.08, 0.16),
    mats.lavenderMetal
  );
  beam.position.set(0, 2.35, 0);
  beam.castShadow = true;
  inner.add(beam);

  root.add(inner);

  const meta: InteractiveTargetMeta = {
    interactionType: 'section',
    sectionId: 'experience',
    kicker: '05 — Experience',
    title: 'Professional Journey · C3R & Google Developer Groups',
  };
  attachCollider(root, [5.2, 4.2, 2.2], 2.1, meta);
  refs.sectionTargets.push({ id: 'experience', group: root, inner, meta });

  return root;
}

export function createAchievementsRotundaGroup(
  mats: MuseumMaterialLibrary,
  refs: AnimatedSculptureRefs
): THREE.Group {
  const root = new THREE.Group();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), mats.contactShadow);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  root.add(shadow);

  const inner = new THREE.Group();

  // 5 stepped milestone plinths
  const heights = [1.8, 1.35, 2.25, 1.6, 2.05];
  for (let i = 0; i < 5; i++) {
    const x = (i - 2) * 1.25;
    const z = Math.abs(i - 2) * 0.35;
    const h = heights[i];

    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.38, h, 24),
      i === 2 ? mats.lavenderMetal : mats.archStone
    );
    col.position.set(x, h / 2, z);
    col.castShadow = true;
    col.receiveShadow = true;
    inner.add(col);

    const finial = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      i % 2 === 0 ? mats.brushedCharcoal : mats.ivoryPorcelain
    );
    finial.position.set(x, h + 0.22, z);
    inner.add(finial);
  }

  root.add(inner);

  const meta: InteractiveTargetMeta = {
    interactionType: 'section',
    sectionId: 'achievements',
    kicker: '06 — Achievements',
    title: 'Milestones · LeetCode, SIH, TryHackMe & Competitions',
  };
  attachCollider(root, [6.4, 3.0, 2.6], 1.5, meta);
  refs.sectionTargets.push({ id: 'achievements', group: root, inner, meta });

  return root;
}

export function createEducationCodexGroup(
  mats: MuseumMaterialLibrary,
  refs: AnimatedSculptureRefs
): THREE.Group {
  const root = new THREE.Group();
  const topY = addGroundedPlinth(root, mats, 1.25, 1.4, 0.85, 2.2);

  const inner = new THREE.Group();

  // Minimalist open architectural codex / angled stone plates
  const leftLeaf = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 1.25, 0.07),
    mats.ivoryPorcelain
  );
  leftLeaf.position.set(-0.46, topY + 0.82, 0);
  leftLeaf.rotation.y = 0.35;
  leftLeaf.rotation.x = -0.22;
  leftLeaf.castShadow = true;
  inner.add(leftLeaf);

  const rightLeaf = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 1.25, 0.07),
    mats.ivoryPorcelain
  );
  rightLeaf.position.set(0.46, topY + 0.82, 0);
  rightLeaf.rotation.y = -0.35;
  rightLeaf.rotation.x = -0.22;
  rightLeaf.castShadow = true;
  inner.add(rightLeaf);

  const spine = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1.26, 16),
    mats.lavenderMetal
  );
  spine.position.set(0, topY + 0.8, 0.14);
  spine.rotation.x = -0.22;
  inner.add(spine);

  root.add(inner);

  const meta: InteractiveTargetMeta = {
    interactionType: 'section',
    sectionId: 'education',
    kicker: '07 — Education',
    title: 'Academic Foundation · Chitkara University',
  };
  attachCollider(root, [3.0, 3.2, 2.8], 1.6, meta);
  refs.sectionTargets.push({ id: 'education', group: root, inner, meta });

  return root;
}

export function createInclinedMirrorsSculpture(
  mats: MuseumMaterialLibrary,
  refs: AnimatedSculptureRefs
): THREE.Group {
  const root = new THREE.Group();
  const topY = addGroundedPlinth(root, mats, 1.45, 1.6, 0.88, 2.5);

  const inner = new THREE.Group();

  // Calibrated optical goniometer protractor disc
  const dial = new THREE.Mesh(
    new THREE.CylinderGeometry(1.22, 1.22, 0.06, 48),
    mats.brushedCharcoal
  );
  dial.position.y = topY + 0.03;
  inner.add(dial);

  const thetaRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.018, 12, 48, Math.PI / 3),
    mats.lavenderMetal
  );
  thetaRing.rotation.x = Math.PI / 2;
  thetaRing.position.set(0, topY + 0.08, 0.4);
  inner.add(thetaRing);

  const mirrorGeo = new THREE.BoxGeometry(1.45, 1.7, 0.05);

  const mirror1 = new THREE.Mesh(mirrorGeo, mats.mirrorPlate);
  mirror1.position.set(-0.56, topY + 0.92, 0.02);
  mirror1.rotation.y = Math.PI / 6;
  mirror1.castShadow = true;
  inner.add(mirror1);

  const mirror2 = new THREE.Mesh(mirrorGeo, mats.mirrorPlate);
  mirror2.position.set(0.56, topY + 0.92, 0.02);
  mirror2.rotation.y = -Math.PI / 6;
  mirror2.castShadow = true;
  inner.add(mirror2);

  const frameGeo = new THREE.BoxGeometry(1.52, 1.76, 0.03);
  const back1 = new THREE.Mesh(frameGeo, mats.pedestalDark);
  back1.position.set(-0.58, topY + 0.92, 0.0);
  back1.rotation.y = Math.PI / 6;
  inner.add(back1);

  const back2 = new THREE.Mesh(frameGeo, mats.pedestalDark);
  back2.position.set(0.58, topY + 0.92, 0.0);
  back2.rotation.y = -Math.PI / 6;
  inner.add(back2);

  const rayPoints = [
    new THREE.Vector3(-1.1, topY + 1.15, 0.85),
    new THREE.Vector3(-0.35, topY + 1.0, 0.25),
    new THREE.Vector3(0.45, topY + 0.85, 0.15),
    new THREE.Vector3(-0.18, topY + 0.72, -0.35),
    new THREE.Vector3(0.95, topY + 0.58, 0.8),
  ];

  for (let i = 0; i < rayPoints.length - 1; i++) {
    const start = rayPoints[i];
    const end = rayPoints[i + 1];
    const segCurve = new THREE.LineCurve3(start, end);
    const segGeo = new THREE.TubeGeometry(segCurve, 8, 0.018, 8, false);
    const segMesh = new THREE.Mesh(segGeo, mats.luminousRay);
    inner.add(segMesh);
    refs.mirrorRays.push(segMesh);
  }

  root.add(inner);

  const meta: InteractiveTargetMeta = {
    interactionType: 'section',
    sectionId: 'research',
    kicker: '08 — Research & Publications',
    title: 'JETIR Publication · Plane Mirrors Inclined at Angle θ',
  };
  attachCollider(root, [3.4, 3.4, 3.2], 1.7, meta);
  refs.sectionTargets.push({ id: 'research', group: root, inner, meta });

  return root;
}

export function createFinalPortalGroup(
  mats: MuseumMaterialLibrary,
  refs: AnimatedSculptureRefs
): THREE.Group {
  const root = new THREE.Group();
  const topY = addGroundedPlinth(root, mats, 1.5, 1.65, 0.75, 2.6);

  const inner = new THREE.Group();

  // Circular architectural ring portal framing a floating infinity mark
  const portalGeo = new THREE.TorusGeometry(2.1, 0.09, 20, 96);
  const portal = new THREE.Mesh(portalGeo, mats.brushedCharcoal);
  portal.position.y = topY + 2.25;
  portal.castShadow = true;
  inner.add(portal);
  refs.portalRing = portal;

  const innerHalo = new THREE.Mesh(
    new THREE.TorusGeometry(1.75, 0.025, 16, 96),
    mats.lavenderMetal
  );
  innerHalo.position.y = topY + 2.25;
  inner.add(innerHalo);

  const curve = new Lemniscate3DCurve(1.15, 0.85, 0.22);
  const miniInf = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 100, 0.06, 16, true),
    mats.ivoryPorcelain
  );
  miniInf.position.y = topY + 2.25;
  inner.add(miniInf);

  root.add(inner);

  const meta: InteractiveTargetMeta = {
    interactionType: 'section',
    sectionId: 'contact',
    kicker: '09 — Contact',
    title: 'The Final Room · Connect with Ria Gupta',
  };
  attachCollider(root, [4.8, 5.4, 3.0], 2.8, meta);
  refs.sectionTargets.push({ id: 'contact', group: root, inner, meta });

  return root;
}
