# Рукопожатие по шагам

В Studio открыть `Video-011-websocket-p02-a06-handshake`. Интервал в CapCut — 08:44,000–09:37,000. Начало уже включает 8 секунд двух разделителей. Реплики и две ветки схемы взяты из главы II, §3 файла `~/Downloads/WebSocket_в_проде_все_материалы.md`. Схема показывает заголовки, о которых говорит автор. В выводе учтена оговорка темы 8, §1.12 о прокси, читающих HTTP.

Для восстановления звука Studio выполнить из корня проекта

```sh
ffmpeg -ss 516 -i ~/Movies/CapCut/websocket_audio.WAV -t 53 -ac 1 -ar 48000 -c:a aac -b:a 96k apps/remotion/public/generated/011-websocket/handshake.m4a
```
