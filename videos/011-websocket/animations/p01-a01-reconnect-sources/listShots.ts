import {captures} from './captures';
import type {publications} from './publications';

type Article = keyof typeof publications;
type CapturedArticle = {[K in Article]: (typeof publications)[K] extends {image: string} ? K : never}[Article];
type ListEntry = readonly [article: Article, mentionedAt?: number];

export type SourceListShot = {
  readonly start: number;
  readonly end: number;
  readonly heading: string;
  readonly entries: readonly ListEntry[];
  readonly detail?: {
    readonly article: CapturedArticle;
    readonly open: number;
    readonly close: number;
    readonly capture: (typeof captures)[keyof typeof captures];
    readonly original: string;
    readonly translation: string;
  };
};

// Cue times are relative to the 01:26 CapCut in-point. Mentions move only the row tint.
export const sourceLists: readonly SourceListShot[] = [
  {start: 28100, end: 33650, heading: 'Разборы инцидентов', entries: [
    ['gitter'], ['matrix'], ['hipchat'], ['ably'], ['convex'],
  ]},
  {start: 33300, end: 40950, heading: 'Slack и GitHub · отчёты об инцидентах', entries: [
    ['slack2017'], ['slack2022'], ['slack2026'], ['github2024'], ['github2026'],
  ]},
  {start: 40600, end: 44600, heading: 'Инциденты GitLab, Pusher и Grammarly', entries: [
    ['gitlab3477'], ['gitlab7729'], ['pusherEU'], ['pusherMt1'], ['grammarly'],
  ]},
  {start: 44250, end: 48500, heading: 'Статусы и инженерные публикации', entries: [
    ['netbird'], ['bitrix'], ['discordAPI'], ['scalingSlack'], ['discordElixir'],
  ]},
  {start: 48180, end: 60650, heading: 'Discord · пять инцидентов', entries: [
    ['discordMarch'], ['discordNovember'], ['discordJanuary', 58520], ['discordMay', 58520], ['discordVoice'],
  ], detail: {
    article: 'discordJanuary', open: 52150, close: 58150, capture: captures.discord,
    original: 'reconnect on the remaining servers', translation: 'подключиться к оставшимся серверам',
  }},
  {start: 60320, end: 65220, heading: 'Slack, GitHub и Atlassian · отчёты об инцидентах', entries: [
    ['slack2017', 60880], ['github2024', 62000], ['hipchat', 63730],
  ]},
  {start: 64880, end: 71560, heading: 'Отчёты и разборы компаний', entries: [
    ['gitlab7729', 65980], ['grammarly', 66590], ['pusherEU', 67050], ['ably', 67990],
    ['netbird', 68490], ['bitrix', 69420],
  ]},
  {start: 76600, end: 83000, heading: 'Архитектура · статьи и исследования', entries: [
    ['figma', 77930], ['trello', 78210], ['twitch', 78830], ['netflix', 79000],
    ['facebook', 80050], ['wechat', 81000], ['avito', 81600],
  ]},
];
