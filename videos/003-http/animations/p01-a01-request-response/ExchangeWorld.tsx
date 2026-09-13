import React, {Suspense, useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useLoader, useThree} from '@react-three/fiber';
import {continueRender, delayRender} from 'remotion';
import {ExtrudeGeometry, Shape, SRGBColorSpace, TextureLoader} from 'three';
import {exchangeCues} from '../../shared/partOneTiming';
import {httpTheme as theme} from '../../shared/theme';
import {reveal} from '../../shared/timing';

const inscription = (text: string, color: string): string => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="256"><text x="384" y="165" fill="${color}" font-family="monospace" font-weight="700" font-size="105" text-anchor="middle">${text}</text></svg>`,
)}`;
const requestInscription = inscription('GET /', theme.primary);
const responseInscription = inscription('200 OK', theme.text);

const makeBracket = (): ExtrudeGeometry => {
  const shape = new Shape();
  shape.moveTo(0.64, 1.62);
  shape.lineTo(-0.65, 1.62);
  shape.lineTo(-0.65, -1.62);
  shape.lineTo(0.64, -1.62);
  shape.lineTo(0.4, -1.44);
  shape.lineTo(-0.45, -1.44);
  shape.lineTo(-0.45, 1.44);
  shape.lineTo(0.4, 1.44);
  shape.closePath();
  return new ExtrudeGeometry(shape, {depth: 0.38, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.025, bevelThickness: 0.025});
};

const World: React.FC<{timeMs: number; onReady: () => void}> = ({timeMs, onReady}) => {
  const requestTexture = useLoader(TextureLoader, requestInscription);
  const responseTexture = useLoader(TextureLoader, responseInscription);
  const bracket = useMemo(makeBracket, []);
  const {gl, scene, camera} = useThree();
  useLayoutEffect(() => {
    requestTexture.colorSpace = SRGBColorSpace;
    responseTexture.colorSpace = SRGBColorSpace;
    requestTexture.needsUpdate = true;
    responseTexture.needsUpdate = true;
    // Suspense can resolve after ThreeCanvas has advanced its still frame.
    // Draw the committed geometry before releasing Remotion's asset wait.
    gl.render(scene, camera);
    onReady();
  }, [camera, gl, onReady, requestTexture, responseTexture, scene, timeMs]);
  useEffect(() => () => bracket.dispose(), [bracket]);
  const send = reveal(timeMs, exchangeCues.send - 300, 900);
  const response = reveal(timeMs, exchangeCues.response - 260, 1_000);
  const settle = reveal(timeMs, 0, 1_500);
  const web = reveal(timeMs, exchangeCues.web, 800);
  const requestVisible = timeMs >= 1_900 && timeMs < exchangeCues.response - 300;
  const responseVisible = timeMs >= exchangeCues.response - 300;

  return <>
    <ambientLight intensity={1.25} />
    <directionalLight position={[-4, 6, 8]} intensity={3} color={theme.text} />
    <directionalLight position={[5, -1, 4]} intensity={1.3} color={theme.primary} />
    <group rotation={[-0.22 + settle * 0.08, 0.24 - settle * 0.08, 0]} scale={1 - web * 0.08} position={[0, web * 0.25, 0]}>
      {([-3.5, 3.5] as const).map((x) => <group key={x} position={[x, 0, 0]}>
        <mesh geometry={bracket} position={[-0.8, 0, 0]}>
          <meshStandardMaterial color={theme.text} metalness={0.24} roughness={0.34} />
        </mesh>
        <mesh geometry={bracket} position={[0.8, 0, 0]} rotation={[0, Math.PI, 0]}>
          <meshStandardMaterial color={theme.text} metalness={0.24} roughness={0.34} />
        </mesh>
        <mesh position={[-1.35, 0.72, 0.15]}>
          <boxGeometry args={[0.12, 0.42, 0.28]} />
          <meshStandardMaterial color={theme.primary} roughness={0.4} />
        </mesh>
      </group>)}
      {[0.66, -0.66].map((y) => <mesh key={y} position={[0, y, -0.18]}>
        <boxGeometry args={[4.25, 0.018, 0.02]} />
        <meshBasicMaterial color={theme.line} />
      </mesh>)}
      <group position={[-3.5 + send * 7, 0.66, 0.48]} visible={requestVisible}
        scale={0.92 + reveal(timeMs, 1_900, 400) * 0.08}>
        <mesh><boxGeometry args={[2.08, 0.84, 0.12]} /><meshStandardMaterial color={theme.surface} roughness={0.32} metalness={0.15} /></mesh>
        <mesh position={[0, 0, 0.065]}><planeGeometry args={[1.85, 0.62]} /><meshBasicMaterial map={requestTexture} transparent toneMapped={false} /></mesh>
        <mesh position={[0, -0.41, 0.07]}><boxGeometry args={[2.08, 0.035, 0.01]} /><meshBasicMaterial color={theme.primary} /></mesh>
      </group>
      <group position={[3.5 - response * 7, -0.66, 0.5]} visible={responseVisible}>
        <mesh><boxGeometry args={[2.08, 0.84, 0.12]} /><meshStandardMaterial color={theme.surface} roughness={0.32} metalness={0.15} /></mesh>
        <mesh position={[0, 0, 0.065]}><planeGeometry args={[1.85, 0.62]} /><meshBasicMaterial map={responseTexture} transparent toneMapped={false} /></mesh>
      </group>
    </group>
  </>;
};

export const ExchangeWorld: React.FC<{timeMs: number}> = ({timeMs}) => {
  const [handle] = useState(() => delayRender('HTTP message textures'));
  const onReady = useMemo(() => () => continueRender(handle), [handle]);
  useEffect(() => () => continueRender(handle), [handle]);
  return <div style={{position: 'absolute', left: 90, top: 390, width: 1180, height: 650, overflow: 'hidden'}}>
    <ThreeCanvas width={1180} height={650} orthographic camera={{position: [0, 0, 10], zoom: 102, near: 0.1, far: 40}}
      gl={{alpha: true, antialias: true}} style={{background: 'transparent'}}>
      <Suspense fallback={null}><World timeMs={timeMs} onReady={onReady} /></Suspense>
    </ThreeCanvas>
  </div>;
};
