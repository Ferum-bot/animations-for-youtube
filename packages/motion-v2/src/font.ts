import {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

export const v2FontFamily = 'Channel Manrope';
let fontPromise: Promise<void> | undefined;

const loadV2Font = (): Promise<void> => {
  fontPromise ??= (async () => {
    const face = new FontFace(
      v2FontFamily,
      `url("${staticFile('assets/channel-v2/fonts/Manrope.ttf')}")`,
      {weight: '200 800', style: 'normal'},
    );
    const loaded = await face.load();
    document.fonts.add(loaded);
  })();
  return fontPromise;
};

export const useV2Font = (): void => {
  const [handle] = useState(() => delayRender('Loading local Manrope with Cyrillic'));
  useEffect(() => {
    loadV2Font().then(() => continueRender(handle)).catch((error: unknown) => {
      cancelRender(error instanceof Error ? error : new Error(String(error)));
    });
  }, [handle]);
};
