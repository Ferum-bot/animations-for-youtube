import {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

export const episodeFontFamily = 'Cassandra Manrope';
let fontPromise: Promise<void> | undefined;

const loadEpisodeFont = (): Promise<void> => {
  fontPromise ??= (async () => {
    const face = new FontFace(
      episodeFontFamily,
      `url("${staticFile('assets/009-cassandra-scylladb/fonts/Manrope.ttf')}")`,
      {weight: '200 800', style: 'normal'},
    );
    const loaded = await face.load();
    document.fonts.add(loaded);
  })();
  return fontPromise;
};

export const useEpisodeFont = (): void => {
  const [handle] = useState(() => delayRender('Loading local Manrope with Cyrillic'));
  useEffect(() => {
    loadEpisodeFont().then(() => continueRender(handle)).catch((error: unknown) => {
      cancelRender(error instanceof Error ? error : new Error(String(error)));
    });
  }, [handle]);
};
