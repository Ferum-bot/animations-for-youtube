import React from 'react';
import {RelatedVideo} from '../../shared/related-video/RelatedVideo';
import type {OverlayProps} from '../../shared/OverlayStage';
import {card} from './card';

const Composition: React.FC<OverlayProps> = (props) => <RelatedVideo {...props} card={card} />;
export default Composition;
