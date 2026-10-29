import type {RelatedVideoSpec} from '../../shared/related-video/types';

export const card = {
  "audioFile": "generated/008-notification-system/p00-a01-sharding-video.wav",
  "image": {
    "file": "assets/008-notification-system/related-videos/sharding.png",
    "sourceWidth": 892,
    "x": 40,
    "y": 34,
    "width": 840,
    "height": 464
  },
  "title": [
    "Тебе НЕ НУЖНО Шардирование",
    "System Design Basics"
  ],
  "linkLabel": "Ссылка в подсказках",
  "linkAtMs": 3067,
  "entrance": "side",
  "accent": "signal"
} as const satisfies RelatedVideoSpec;
