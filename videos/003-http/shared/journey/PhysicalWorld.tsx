import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {palette as p} from './theme';
import {lerp, progress} from './timing';
import {ThreeFrame} from './ThreeFrame';

type Vector = [number, number, number];
const Bar: React.FC<{position: Vector; size: Vector; color?: string; luminous?: boolean}> = ({
  position,
  size,
  color = p.surface,
  luminous = false,
}) => (
  <mesh position={position}>
    <boxGeometry args={size} />
    <meshStandardMaterial
      color={color}
      roughness={0.36}
      metalness={0.38}
      emissive={luminous ? color : p.deep}
      emissiveIntensity={luminous ? 0.38 : 0}
    />
  </mesh>
);

const Shell: React.FC<{
  width: number;
  height: number;
  depth: number;
  color: string;
  spread: number;
}> = ({width: w, height: h, depth: d, color, spread}) => (
  <group>
    {([-1, 1] as const).map((side) => (
      <group key={side}>
        <Bar position={[0, side * (h / 2 + spread), d / 2]} size={[w, 0.085, 0.1]} color={color} />
        <Bar position={[0, side * (h / 2 + spread), -d / 2]} size={[w, 0.085, 0.1]} color={color} />
        <Bar position={[(side * w) / 2, 0, d / 2]} size={[0.085, h, 0.1]} color={color} />
        <Bar position={[(side * w) / 2, 0, -d / 2]} size={[0.085, h, 0.1]} color={color} />
        <Bar
          position={[(side * w) / 2, h / 2 + spread, 0]}
          size={[0.085, 0.085, d]}
          color={color}
        />
        <Bar
          position={[(side * w) / 2, -h / 2 - spread, 0]}
          size={[0.085, 0.085, d]}
          color={color}
        />
      </group>
    ))}
  </group>
);

const Packing: React.FC<{time: number}> = ({time}) => {
  const ip = progress(time, 'p09-journey-ip', 1100),
    ether = progress(time, 'p09-journey-ethernet', 1700),
    wire = progress(time, 'p09-journey-wire', 1100);
  return (
    <group
      rotation={[-0.34, -0.3 + ether * 0.13, -0.025]}
      position={[-wire * 7, 0, 0]}
      scale={1 - wire * 0.35}
    >
      <Bar position={[0, 0, 0]} size={[5.9, 1.0, 1.6]} color={p.surface} />
      <Bar position={[-2.75, 0, 0.86]} size={[0.3, 1.04, 0.08]} color={p.primary} luminous />
      {Array.from({length: 10}, (_, i) => (
        <Bar
          key={i}
          position={[-2.3 + i * 0.51, 0, 0.86]}
          size={[0.35, 0.55, 0.035]}
          color={i < 3 ? p.primary : p.rim}
        />
      ))}
      <group visible={ip > 0} position={[0, (1 - ip) * 2.5, 0]}>
        <Shell width={8.3} height={2.4} depth={2.8} color={p.blue} spread={(1 - ip) * 0.5} />
        <Bar position={[-3.9, 0, 0]} size={[0.45, 2.4, 2.8]} color={p.blue} />
      </group>
      <group visible={ether > 0} position={[0, -(1 - ether) * 2.6, 0]}>
        <Shell width={11.5} height={3.8} depth={4.0} color={p.rim} spread={(1 - ether) * 0.5} />
        <Bar position={[5.65, 0, 0]} size={[0.16, 3.8, 4.0]} color={p.rim} />
      </group>
    </group>
  );
};

const Transport: React.FC<{time: number}> = ({time}) => {
  const independent = progress(time, 'p09-journey-independent', 1200),
    spread = progress(time, 'p09-journey-below', 1400);
  return (
    <group rotation={[0.69, -0.1, -0.03]} position={[0, 0.25, 0]}>
      {([-6.8, 6.8] as const).map((x) => (
        <Bar key={x} position={[x, -1.25, 0]} size={[0.2, 0.28, 5.0]} color={p.edge} />
      ))}
      {([-1, 0, 1] as const).map((lane) => {
        const z = lane * 2.05,
          gateX = lerp(2.1, 4.5 - lane * 0.9, independent);
        return (
          <group key={lane} position={[0, 0, z]}>
            <Bar position={[0, -1 + spread * 0.35, 0]} size={[15, 0.16, 0.72]} color={p.edge} />
            <Bar
              position={[0, -0.89 + spread * 0.35, 0.37]}
              size={[15, 0.025, 0.025]}
              color={lane === 0 ? p.primary : p.blue}
              luminous
            />
            <Bar
              position={[gateX, 0.2, 0]}
              size={[0.11, 2.35, 1.2]}
              color={lane === 0 ? p.primary : p.rim}
            />
            {[0, 1, 2].map((i) => (
              <Bar
                key={i}
                position={[-5 + i * 2 + independent * (lane === 0 ? 0 : 2), -0.3, 0.02]}
                size={[1.25, 0.6, 0.87]}
                color={lane === 0 ? p.primary : p.blue}
              />
            ))}
          </group>
        );
      })}
      <Bar
        position={[2.1, 1.33, 0]}
        size={[0.12, 0.12, lerp(5.8, 0.1, independent)]}
        color={p.text}
      />
    </group>
  );
};

export const PhysicalWorld: React.FC<{time: number; kind: 'packing' | 'transport'}> = ({
  time,
  kind,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 250,
      top: 385,
      width: 2050,
      height: 690,
      pointerEvents: 'none',
    }}
  >
    <ThreeCanvas
      width={2050}
      height={690}
      orthographic
      camera={{position: [0, 0, 20], zoom: 105, near: 0.1, far: 60}}
      gl={{alpha: true, antialias: true}}
      style={{background: 'transparent'}}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[-5, 9, 8]} color={p.text} intensity={3.1} />
      <directionalLight position={[6, -1, 4]} color={p.blue} intensity={2.1} />
      <pointLight position={[0, 0, 6]} color={p.primary} intensity={16} />
      {kind === 'packing' ? <Packing time={time} /> : <Transport time={time} />}
      <ThreeFrame time={time} />
    </ThreeCanvas>
  </div>
);
