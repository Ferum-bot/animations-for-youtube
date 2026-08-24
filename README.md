# Animations for YouTube

Кодовые 2D- и 3D-анимации для YouTube-канала о computer science. Основа — Remotion, React, TypeScript и Three.js.

## Быстрый старт

Нужны Node.js, pnpm и [Task](https://taskfile.dev/).

```bash
task setup
task studio
task check
```

Основные команды:

```bash
task video:new VIDEO=001-topic TITLE="Название видео"
task animation:new VIDEO=001-topic ANIMATION=request-flow TITLE="Request flow"
task video:ingest VIDEO=001-topic AUDIO=/path/final.wav TRANSCRIPT=/path/transcript.srt
task render:animation VIDEO=001-topic ANIMATION=request-flow
task render:overlay VIDEO=001-topic
task render:standard NAME=Subscribe
```

После создания анимации поправьте семантический якорь в `anchors.json` и её размещение в `timeline.json`. Таймкоды хранятся в миллисекундах; номера кадров вычисляются автоматически.

## Где что лежит

- `videos/<video>/animations/` — анимации конкретного выпуска.
- `videos/<video>/shared/` — локальные компоненты выпуска.
- `packages/` — глобальные темы, UI, тайминг и синхронизация.
- `packages/standard-animations/` — подписка и другие повторяемые вставки.
- `examples/animations/` — восемь исходных дизайн-референсов.
- `docs/style/` — исследование уникального визуального стиля.
- `AGENTS.md` — обязательный контекст для AI-агентов.

Базовые правила разработки и приёмки описаны в [`CONTRIBUTING.md`](CONTRIBUTING.md). Агенты обязаны дополнительно читать [`AGENTS.md`](AGENTS.md). Git commit и push выполняются только по прямой просьбе пользователя.

`task render:overlay` создаёт прозрачный ProRes 4444, который кладётся поверх смонтированного видео с отметки `00:00`. H.264-превью и рендеры находятся в `renders/` и не попадают в Git.
