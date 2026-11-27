# Лавина переподключений

Открыть в Studio композицию `Video-011-websocket-p01-a01-reconnect-sources`.
Предпросмотр использует кадр ведущего и отрывок исходного WAV. На таймлайне выпуска сцена прозрачная и без собственной звуковой дорожки.

Якорь `reconnect-sources-edit` задан в монтажном времени CapCut. Локальный ноль композиции соответствует 01:26 монтажа и 01:22 WAV. Конец интервала — 02:49 монтажа.

Если локальный звук для Studio отсутствует, выполнить из корня проекта:

```bash
mkdir -p apps/remotion/public/generated/011-websocket
ffmpeg -i /Users/mdpopov/Movies/CapCut/websocket_audio.WAV -ss 82 -t 83 -ac 1 -ar 48000 -c:a aac -b:a 96k apps/remotion/public/generated/011-websocket/reconnect-sources.m4a
```

В `shots.ts` заданы реплики и время появления отдельных страниц. В `publications.ts` собраны оригинальные названия, даты, издатели и прямые ссылки для экранных списков. В `listShots.ts` заданы порядок строк, таймкоды упоминаний и выдержка выбранного фрагмента относительно начала композиции. В Studio по названию можно открыть публикацию. В `captures.ts` хранятся адреса и координаты выделений на снимках страниц.

Кадр статьи Netflix TechBlog взят из [архивной копии страницы издателя](https://web.archive.org/web/20261005153719/https://netflixtechblog.com/pushy-to-the-limit-evolving-netflixs-websocket-proxy-for-the-future-b468bc0ff658).
