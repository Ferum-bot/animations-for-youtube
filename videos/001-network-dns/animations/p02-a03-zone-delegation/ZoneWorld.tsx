import React, {useMemo} from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import * as THREE from 'three';

type Vector3Tuple = readonly [number, number, number];

const hierarchyPositions = [
  [-4.2, 2.55, 0],
  [-2.15, 1.35, 0],
  [-0.1, 0.15, 0],
  [1.95, -1.05, 0],
  [4.15, -2.35, 0],
] as const satisfies readonly Vector3Tuple[];

const toVector = ([x, y, z]: Vector3Tuple): THREE.Vector3 => new THREE.Vector3(x, y, z);

const Tube: React.FC<{
  readonly color: string;
  readonly opacity: number;
  readonly points: readonly Vector3Tuple[];
  readonly radius?: number;
}> = ({color, opacity, points, radius = 0.07}) => {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map(toVector)),
    [points],
  );

  return (
    <mesh>
      <tubeGeometry args={[curve, 72, radius, 12, false]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.26}
        metalness={0.62}
        opacity={opacity}
        roughness={0.24}
        transparent
      />
    </mesh>
  );
};

const AuthorityPair: React.FC<{
  readonly accent: string;
  readonly reveal: number;
}> = ({accent, reveal}) => (
  <group position={[0.47, -0.04, 0.34]} scale={Math.max(0.001, reveal)}>
    {[-0.19, 0.19].map((x) => (
      <group key={x} position={[x, 0, 0]}>
        {[0, 0.22, 0.44].map((y, index) => (
          <mesh key={y} position={[0, y, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.14, 24]} />
            <meshPhysicalMaterial
              clearcoat={0.7}
              color={index === 2 ? accent : '#252B34'}
              emissive={accent}
              emissiveIntensity={index === 2 ? reveal * 0.45 : 0}
              metalness={0.7}
              roughness={0.23}
            />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);

const ZoneSlab: React.FC<{
  readonly accent: string;
  readonly authorityReveal: number;
  readonly focus: number;
  readonly position: Vector3Tuple;
  readonly reveal: number;
}> = ({accent, authorityReveal, focus, position, reveal}) => (
  <group
    position={position}
    rotation={[0.04, -0.12, -0.04]}
    scale={0.9 + focus * 0.08}
  >
    <mesh>
      <boxGeometry args={[2.18, 0.92, 0.2]} />
      <meshPhysicalMaterial
        clearcoat={0.82}
        color={accent}
        depthWrite={false}
        metalness={0.58}
        opacity={reveal * (0.18 + focus * 0.24)}
        roughness={0.2}
        transparent
      />
    </mesh>
    <mesh position={[0, 0, 0.13]} scale={1.015}>
      <boxGeometry args={[2.18, 0.92, 0.2]} />
      <meshBasicMaterial
        color={accent}
        depthWrite={false}
        opacity={reveal * (0.34 + focus * 0.34)}
        transparent
        wireframe
      />
    </mesh>
    <AuthorityPair accent={accent} reveal={authorityReveal} />
  </group>
);

const ZoneCut: React.FC<{readonly reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();
  const position = [3.08, -1.72, 0.48] satisfies Vector3Tuple;

  return (
    <group position={position} rotation={[0, 0, -0.53]} scale={reveal}>
      <mesh>
        <boxGeometry args={[0.13, 1.75, 0.13]} />
        <meshStandardMaterial
          color={theme.signal}
          emissive={theme.signal}
          emissiveIntensity={1.1}
          metalness={0.3}
          roughness={0.18}
        />
      </mesh>
      <mesh scale={1.8}>
        <boxGeometry args={[0.13, 1.75, 0.13]} />
        <meshBasicMaterial color={theme.signal} opacity={0.16 * reveal} transparent />
      </mesh>
    </group>
  );
};

const NsReferral: React.FC<{
  readonly progress: number;
  readonly reveal: number;
}> = ({progress, reveal}) => {
  const theme = useChannelTheme();
  const start = hierarchyPositions[3];
  const end = hierarchyPositions[4];
  const x = start[0] + (end[0] - start[0]) * progress;
  const y = start[1] + (end[1] - start[1]) * progress + Math.sin(progress * Math.PI) * 0.72;
  const z = 0.72 + Math.sin(progress * Math.PI) * 0.22;

  return (
    <group position={[x, y, z]} rotation={[0.35, progress * Math.PI, 0.72]} scale={0.65 + reveal * 0.2}>
      <mesh>
        <boxGeometry args={[0.58, 0.38, 0.15]} />
        <meshPhysicalMaterial
          clearcoat={0.8}
          color={theme.signal}
          emissive={theme.signal}
          emissiveIntensity={1.2}
          metalness={0.38}
          opacity={reveal}
          roughness={0.18}
          transparent
        />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[0.33, 0.08, 0.03]} />
        <meshBasicMaterial color={theme.text} opacity={reveal} transparent />
      </mesh>
    </group>
  );
};

export const ZoneWorld: React.FC<{
  readonly authorityReveal: number;
  readonly cutReveal: number;
  readonly distributedReveal: number;
  readonly handoffProgress: number;
  readonly hierarchyReveal: number;
  readonly localScopeReveal: number;
}> = ({authorityReveal, cutReveal, distributedReveal, handoffProgress, hierarchyReveal, localScopeReveal}) => {
  const theme = useChannelTheme();
  const focusIndex = authorityReveal > 0.08 ? 4 : cutReveal > 0.08 ? 3 : 0;

  return (
    <group rotation={[0.04, -0.08 + distributedReveal * 0.06, 0]} scale={0.96 - distributedReveal * 0.04}>
      <ambientLight intensity={1.15} />
      <directionalLight color="#F3EEE4" intensity={2.7} position={[4, 8, 9]} />
      <pointLight color={theme.primary} distance={18} intensity={46} position={[-5, 3, 5]} />
      <pointLight color={theme.signal} distance={16} intensity={38} position={[5, -2, 5]} />

      <Tube color={theme.primary} opacity={hierarchyReveal} points={hierarchyPositions} />

      {hierarchyPositions.map((position, index) => {
        const slabReveal = clamp01(hierarchyReveal * 1.65 - index * 0.11);
        const isChild = index === hierarchyPositions.length - 1;
        const localAuthority = isChild
          ? authorityReveal
          : clamp01(localScopeReveal * 1.55 - index * 0.12);
        const accent = isChild ? theme.signal : index < 2 ? theme.primary : theme.success;

        return (
          <ZoneSlab
            key={index}
            accent={accent}
            authorityReveal={localAuthority}
            focus={index === focusIndex ? 1 : distributedReveal * 0.18}
            position={position}
            reveal={slabReveal}
          />
        );
      })}

      <ZoneCut reveal={cutReveal} />
      <NsReferral progress={handoffProgress} reveal={clamp01(handoffProgress * 4)} />

      <mesh position={[0, -3.78, -1.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 7]} />
        <meshStandardMaterial color="#11151C" opacity={0.42} transparent />
      </mesh>
      <gridHelper args={[16, 24, '#313741', '#171A20']} position={[0, -3.74, -1.05]} />
    </group>
  );
};
