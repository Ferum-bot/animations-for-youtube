# Запуск Inbox Search и первые результаты

`p01-a04-history-launch`, папка Studio `P-01-History`.
2560×1440, 30 fps, 786 кадров. CapCut: **00:05:58:00–00:06:24:06**.
Накладывать поверх монтажа без раздвижения. До 06:13:00 — слева;
раскрытие заканчивается в 06:13:22, на склейке исходного видео.
Последний кадр сохраняет графитовый фон перед существующей заставкой архитектуры.
Исходное аудио: 353500–379700 ms; монтажный сдвиг первой заставки +4500 ms.

Просмотр: `task studio`,
http://localhost:3000/Video-009-cassandra-scylladb-p01-a04-history-launch.
Фото и короткий AAC — в игнорируемом `public/generated/009-cassandra-scylladb/`,
префикс `history-launch`. Полный видеоклип не копируется.
Для отдельно разрешённого экспорта: `previewBackground: "transparent", withAudio: false`,
через `task render:capcut`. В начале есть alpha, после раскрытия фон непрозрачен.

`scene.ts` хранит миллисекунды; отдельные компоненты отвечают за архивный интерфейс,
PDF, сайт и рисунок. Скролл, выделения, раскрытие и финальный уход зависят только от кадра.
Крупные числа и цитата — живой текст, не увеличенные фрагменты скриншота.

## Источники и ассеты

- Повторно используется `p01/inbox-2008.png`: исторический Inbox Search,
  [Inside Facebook, 19.06.2008](https://web.archive.org/web/20080829234751/http://www.insidefacebook.com/2008/06/19/facebook-launches-inbox-search-screenshot/).
- `p01-launch/cassandra-title.jpg`, `cassandra-results.jpg`: страницы 1 и 5
  [Cassandra, LADIS 2009](https://research.cs.cornell.edu/ladis2009/papers/lakshman-ladis2009.pdf),
  растрированы в 2200 и 3000 px по ширине. § 6.1: 50+ TB, 150 узлов,
  восток/запад США. Таблица Median: Search Interactions 15.69 ms, Term Search 18.27 ms.
  Это замеры поисковых операций из статьи, не универсальная задержка Cassandra.
- `p01-launch/facebook-scroll.jpg`: реальная страница
  [анонса Facebook от 25.08.2008](https://engineering.fb.com/2008/08/25/core-infra/cassandra-a-structured-storage-system-on-a-p2p-network/),
  снимок 1280×3400 от 07.11.2026. Цитата: “Performance of the system has been well within our SLA requirements”.

Год 2009 виден рядом с замерами: они не приписываются моменту запуска в июне 2008.
Финальное сообщение «Завтра у офиса» — условный пример из предыдущих рисунков,
не содержимое исторического интерфейса. Оригиналы PDF/Whisper и исследование хранятся вне репозитория.
