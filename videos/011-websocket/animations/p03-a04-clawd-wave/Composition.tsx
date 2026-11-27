import React, {useLayoutEffect} from 'react';
import {AbsoluteFill} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {PMREMGenerator} from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {PresenterPreview, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {Clawd} from './Model';
import {clawdPose} from './pose';

const StudioLighting = () => {
  const {gl,scene} = useThree();
  useLayoutEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const reflections = generator.fromScene(room,0.025);
    scene.environment = reflections.texture;
    scene.environmentIntensity = 0.36;
    generator.dispose();
    room.dispose();
    return () => {
      scene.environment = null;
      reflections.dispose();
    };
  }, [gl,scene]);
  return <>
    <hemisphereLight args={['#fff4e6','#806e77',0.46]}/>
    <directionalLight color="#fff0db" intensity={2.05} position={[-4,7,6]} castShadow
      shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0006}
      shadow-normalBias={0.018} shadow-camera-left={-6} shadow-camera-right={6}
      shadow-camera-top={4} shadow-camera-bottom={-4}/>
    <directionalLight color="#ffe0c8" intensity={2.3} position={[3,4,-5]}/>
    <directionalLight color="#d5e5ff" intensity={0.55} position={[5,1,3]}/>
  </>;
};

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs} = useSceneTime();
  const pose = clawdPose(timeMs);
  return <AbsoluteFill>
    <PresenterPreview {...props} media={{
      photoSrc: 'assets/011-websocket/reconnect/presenter.jpg',
      audioSrc: 'generated/011-websocket/clawd-wave.m4a',
    }}/>
    <ThreeCanvas width={1500} height={1440} shadows="percentage" orthographic camera={{position:[0,0,12],zoom:239,near:0.1,far:40}}
      gl={{alpha:true,antialias:true}} dpr={1} style={{position:'absolute',left:0,top:0}}>
      <StudioLighting/>
      <group rotation={[0.135,0,0]}>
        <Clawd pose={pose}/>
      </group>
    </ThreeCanvas>
  </AbsoluteFill>;
};

export default Composition;
