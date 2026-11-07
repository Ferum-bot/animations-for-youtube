Полноэкранная композиция в Studio: `P-03-ScyllaDB / p03-a03-scylla-benchmarks`.
Монтаж 24:31:00–26:18:00 (30 fps, выход исключающий), 3210 кадров.
Для Studio используется только вырезка WAV с 24:17.500 длительностью 107 с;
в общей композиции звук отключён.

Материалы: [два теста OCTO, 2015](https://blog.octo.com/scylladb-vs-cassandra-towards-a-new-myth),
[инженерный блог Discord и оригинальная схема объединения запросов](https://discord.com/blog/how-discord-stores-trillions-of-messages),
[методика, таблица и выдача benchANT для xlarge](https://benchant.com/blog/cassandra-5-benchant-ranking).
Снимки страниц и рисунки лежат локально в `public/assets/009-cassandra-scylladb/p03-benchmarks`
приложения Remotion. Координаты в `documents.json` — прямоугольники текста в CSS-пикселях
относительно снимка; тайминги реплик в `score.ts` — миллисекунды от соответствующей склейки.

Цифры Discord в кадре даны по первоисточнику: 177 узлов и 40–125 мс,
даже где голос округляет до 170 и 40–120. +23% у benchANT относится только
к 5.0.6 с базовой настройкой относительно 4.0.0 в конфигурации xlarge.
