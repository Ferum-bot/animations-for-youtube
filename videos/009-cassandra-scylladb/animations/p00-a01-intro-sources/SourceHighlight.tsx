import React from 'react';
import {QuoteHighlight} from '../../shared/source-documents/QuoteHighlight';
import {scene, type Highlight} from './scene';
import {crops, type CropId} from './sources';
export {highlightProgress} from '../../shared/source-documents/QuoteHighlight';

export const SourceHighlight: React.FC<{
  readonly mark: Highlight;
  readonly cropId: CropId;
  readonly timeMs: number;
}> = ({mark, cropId, timeMs}) => {
  const crop = crops[cropId];
  const sourceScale = scene.width / crop.width;
  return <QuoteHighlight mark={mark} timeMs={timeMs} width={scene.width}
    height={crop.height * sourceScale} sourceScale={sourceScale} background={crop.background} />;
};
