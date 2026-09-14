import React, {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';

/** Flush committed geometry on every seek. Animation never depends on an R3F simulation clock. */
export const ThreeFrame: React.FC<{time: number}> = ({time}) => {
  const {gl, scene, camera} = useThree();
  useLayoutEffect(() => {
    gl.render(scene, camera);
  }, [camera, gl, scene, time]);
  return null;
};
