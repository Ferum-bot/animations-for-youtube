import type {RelatedVideoSpec} from '../../shared/related-video/types';

export const card = {
  "audioFile": "generated/008-notification-system/p00-a02-postgres-video.wav",
  "image": {
    "file": "assets/008-notification-system/related-videos/postgres.png",
    "sourceWidth": 466,
    "x": 12,
    "y": 18,
    "width": 445,
    "height": 250
  },
  "title": [
    "Не используй Postgres для всего,",
    "пока не посмотришь…"
  ],
  "linkLabel": "Ссылка в описании",
  "linkAtMs": 8633,
  "entrance": "rise",
  "accent": "primary"
} as const satisfies RelatedVideoSpec;
