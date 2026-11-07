# Animations for YouTube

Кодовые 2D- и 3D-анимации для YouTube-канала о computer science. Основа — Remotion, React, TypeScript и Three.js.

Новые анимации используют **[Motion v2](packages/motion-v2/README.md)**:
утверждённые геометрические заставки, простые предметные рисунки и реальные
страницы с точными цитатами. Все остальные визуальные наборы deprecated для
новой работы, но сохранены для готовых выпусков. В Studio их папки начинаются
с `Deprecated-`. Инфраструктура тайминга, тем и экспорта остаётся действующей.

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
task animation:new VIDEO=001-topic PART=02 ORDER=03 ANIMATION=request-flow TITLE="Request flow"
task video:ingest VIDEO=001-topic AUDIO=/path/final.wav TRANSCRIPT=/path/transcript.srt
task render:capcut VIDEO=001-topic ANIMATION=p02-a03-request-flow
```

После создания анимации поправьте семантический якорь в `anchors.json` и её размещение в `timeline.json`. Таймкоды хранятся в миллисекундах; номера кадров вычисляются автоматически.

Идентификатор анимации имеет вид `pNN-aNN-slug`: `pNN` — часть видео, `aNN` — номер внутри части. Общие вставки относятся к `p00`, а разделитель части всегда имеет номер `a00`. Remotion Studio автоматически группирует композиции по папкам частей.

## Где что лежит

- `videos/<video>/animations/` — анимации конкретного выпуска.
- `videos/<video>/shared/` — локальные компоненты выпуска.
- `packages/motion-v2/` — текущие компоненты и повторяемые анимации.
- `packages/` — также общие темы, тайминг и синхронизация.
- `packages/standard-animations/` — deprecated-вставки для совместимости.
- `examples/animations/` — восемь frozen исторических примеров, не основа нового дизайна.
- `docs/style/` — обязательные правила и источники визуального направления.
- `config/design-system-policy.json` — явный каталог deprecated-композиций для проверок.
- `AGENTS.md` — обязательный контекст для AI-агентов.

Базовые правила разработки и приёмки описаны в [`CONTRIBUTING.md`](CONTRIBUTING.md). Агенты обязаны дополнительно читать [`AGENTS.md`](AGENTS.md). Git commit и push выполняются только по прямой просьбе пользователя.

`task render:capcut` создаёт ProRes 4444 с premultiplied alpha для CapCut.
Рендер запускать только по прямому запросу. Старый `render:overlay` сохраняется
для straight-alpha редакторов и не является CapCut-мастером. Выходные файлы
не попадают в Git; полное видео автоматически не собирать.
