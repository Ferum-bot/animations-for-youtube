import {DataTexture, MeshPhysicalMaterial, MeshStandardMaterial, RedFormat, RepeatWrapping, LinearFilter} from 'three';

// A fine moulded finish catches the side light without breaking the one-pixel silhouette.
export const makeFinishes = () => {
  const size = 128;
  const samples = new Uint8Array(size * size);
  let seed = 475;
  for (let i = 0; i < samples.length; i++) {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    samples[i] = seed >>> 24;
  }
  const grain = new DataTexture(samples, size, size, RedFormat);
  grain.wrapS = grain.wrapT = RepeatWrapping;
  grain.minFilter = grain.magFilter = LinearFilter;
  grain.needsUpdate = true;
  return {
    orange: new MeshPhysicalMaterial({
      color: '#f16a08', roughness: 0.69, bumpMap: grain, bumpScale: 0.009,
      clearcoat: 0.12, clearcoatRoughness: 0.58,
    }),
    ink: new MeshStandardMaterial({color: '#110f10', roughness: 1, envMapIntensity: 0.02}),
  };
};
