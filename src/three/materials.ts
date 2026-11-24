import * as THREE from 'three';

export interface MuseumMaterialLibrary {
  floorStone: THREE.MeshStandardMaterial;
  archStone: THREE.MeshStandardMaterial;
  plasterWall: THREE.MeshStandardMaterial;
  pedestalDark: THREE.MeshStandardMaterial;
  brushedCharcoal: THREE.MeshPhysicalMaterial;
  lavenderMetal: THREE.MeshPhysicalMaterial;
  mistGlass: THREE.MeshPhysicalMaterial;
  ivoryPorcelain: THREE.MeshStandardMaterial;
  mirrorPlate: THREE.MeshPhysicalMaterial;
  luminousRay: THREE.MeshBasicMaterial;
  contactShadow: THREE.MeshBasicMaterial;
  dispose: () => void;
}

function createLimestoneGridTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Warm ivory limestone base
  ctx.fillStyle = '#EAE5DC';
  ctx.fillRect(0, 0, size, size);

  // Subtle mineral speckles
  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const alpha = Math.random() * 0.045;
    ctx.fillStyle = i % 2 === 0 ? `rgba(36, 37, 34, ${alpha})` : `rgba(255, 255, 255, ${alpha * 1.4})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Architectural stone slab joints
  ctx.strokeStyle = 'rgba(36, 37, 34, 0.10)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, size - 2, size - 2);

  ctx.strokeStyle = 'rgba(36, 37, 34, 0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(size / 2, 0);
  ctx.lineTo(size / 2, size);
  ctx.moveTo(0, size / 2);
  ctx.lineTo(size, size / 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 68);
  texture.anisotropy = Math.min(8, maxAnisotropy || 1);
  texture.needsUpdate = true;
  return texture;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size * 0.5
  );
  grad.addColorStop(0, 'rgba(36, 37, 34, 0.42)');
  grad.addColorStop(0.55, 'rgba(36, 37, 34, 0.16)');
  grad.addColorStop(1, 'rgba(36, 37, 34, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createMuseumMaterials(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean
): MuseumMaterialLibrary {
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const floorTex = createLimestoneGridTexture(maxAniso);
  const shadowTex = createContactShadowTexture();

  const floorStone = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.84,
    metalness: 0.04,
  });

  const archStone = new THREE.MeshStandardMaterial({
    color: 0xe6e0d5,
    roughness: 0.78,
    metalness: 0.05,
  });

  const plasterWall = new THREE.MeshStandardMaterial({
    color: 0xf4f1eb,
    roughness: 0.9,
    metalness: 0.02,
  });

  const pedestalDark = new THREE.MeshStandardMaterial({
    color: 0x242522,
    roughness: 0.55,
    metalness: 0.18,
  });

  const brushedCharcoal = new THREE.MeshPhysicalMaterial({
    color: 0x2a2b28,
    roughness: 0.24,
    metalness: 0.88,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
  });

  const lavenderMetal = new THREE.MeshPhysicalMaterial({
    color: 0x7774a9,
    roughness: 0.22,
    metalness: 0.72,
    clearcoat: 0.65,
    clearcoatRoughness: 0.15,
  });

  const mistGlass = new THREE.MeshPhysicalMaterial({
    color: 0xb9c6d0,
    roughness: 0.08,
    metalness: 0.05,
    transmission: isSoftwareGl ? 0 : 0.82,
    transparent: true,
    opacity: isSoftwareGl ? 0.42 : 0.92,
    ior: 1.5,
    thickness: 0.6,
    depthWrite: isSoftwareGl ? true : false,
  });

  const ivoryPorcelain = new THREE.MeshPhysicalMaterial({
    color: 0xf7f4ee,
    roughness: 0.3,
    metalness: 0.06,
    clearcoat: 0.5,
  });

  const mirrorPlate = new THREE.MeshPhysicalMaterial({
    color: 0xdbe3ea,
    roughness: 0.04,
    metalness: 0.96,
    clearcoat: 1.0,
  });

  const luminousRay = new THREE.MeshBasicMaterial({
    color: 0x7774a9,
  });

  const contactShadow = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.55,
  });

  const allMaterials: THREE.Material[] = [
    floorStone,
    archStone,
    plasterWall,
    pedestalDark,
    brushedCharcoal,
    lavenderMetal,
    mistGlass,
    ivoryPorcelain,
    mirrorPlate,
    luminousRay,
    contactShadow,
  ];

  return {
    floorStone,
    archStone,
    plasterWall,
    pedestalDark,
    brushedCharcoal,
    lavenderMetal,
    mistGlass,
    ivoryPorcelain,
    mirrorPlate,
    luminousRay,
    contactShadow,
    dispose: () => {
      floorTex.dispose();
      shadowTex.dispose();
      allMaterials.forEach((m) => m.dispose());
    },
  };
}
