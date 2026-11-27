import React, {useEffect, useMemo} from 'react';
import {ExtrudeGeometry, Path, Shape} from 'three';
import type {Material} from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {makeFinishes} from './finishes';
import type {ClawdPose} from './pose';

// The front-facing sprite in Claude.app's clawd-laptop animation uses a 12 × 8 grid.
// Its torso is 8 × 6. Each eye and each of the four legs is one pixel wide.
const cell = 0.42;
const depth = 2.8;
const eyeCenters = [-2.5, 2.5] as const;
const legCenters = [-3.5, -1.5, 1.5, 3.5] as const;

function makeTorso() {
  const face = new Shape();
  face.moveTo(-4, -3);
  face.lineTo(-4, 3);
  face.lineTo(4, 3);
  face.lineTo(4, -3);
  face.closePath();

  for (const center of eyeCenters) {
    const hole = new Path();
    hole.moveTo(center - 0.5, 1);
    hole.lineTo(center + 0.5, 1);
    hole.lineTo(center + 0.5, 2);
    hole.lineTo(center - 0.5, 2);
    hole.closePath();
    face.holes.push(hole);
  }
  const geometry = new ExtrudeGeometry(face, {
    depth, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.042, bevelThickness: 0.052,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

const Brick: React.FC<{
  width: number; height: number; depth: number; surface: Material;
}> = ({width, height, depth: thickness, surface}) => {
  const geometry = useMemo(
    () => new RoundedBoxGeometry(width, height, thickness, 3, 0.052),
    [width, height, thickness],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} material={surface} castShadow receiveShadow/>;
};

export const Clawd: React.FC<{pose: ClawdPose}> = ({pose}) => {
  const torso = useMemo(makeTorso, []);
  const finish = useMemo(makeFinishes, []);
  useEffect(() => () => {
    torso.dispose();
    finish.orange.bumpMap?.dispose();
    finish.orange.dispose();
    finish.ink.dispose();
  }, [finish, torso]);

  return <group position={[pose.x, -0.16 + pose.bounce, 0]} rotation={[0, pose.yaw, pose.roll]} scale={0.6}>
    <group scale={cell}>
      <mesh geometry={torso} material={finish.orange} castShadow receiveShadow/>
      {eyeCenters.map(x => <mesh key={x} position={[x, 1.5, depth / 2 - 0.19]} material={finish.ink}>
        <boxGeometry args={[1.08, 1.08, 0.12]}/>
      </mesh>)}
      {[-1, 1].map(side => {
        const wave = side === 1 ? pose.lift : 0;
        const angle = wave * (0.48 + 0.28 * pose.wag) + 0.09 * pose.walking * Math.sin(pose.stride);
        return <group key={side} position={[side * 3.92, 1.55 * wave, 0.26]}
          rotation={[0, 0, side * angle]}>
          <group position={[side * 1.005, 0, 0]}>
            <Brick width={2.16} height={2} depth={1.90} surface={finish.orange}/>
          </group>
        </group>;
      })}
      {legCenters.map((x, i) => {
        const phase = pose.stride + (i % 2) * Math.PI;
        const swing = pose.walking * Math.sin(phase);
        const lift = pose.walking * Math.max(0, Math.cos(phase));
        return <group key={x} position={[x, -2.94 + 0.45 * lift, 0.25]}
          rotation={[0.20 * swing, 0, 0.34 * swing]}>
          <group position={[0, -0.99, 0]}>
            <Brick width={1} height={2.14} depth={1.46} surface={finish.orange}/>
          </group>
        </group>;
      })}
    </group>
  </group>;
};
