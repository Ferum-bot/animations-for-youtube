# Четыре типа звеньев

В Studio открыть `Video-011-websocket-p02-a03-tcp-link-types`. Монтажный якорь 06:23,000 соответствует 06:15,000 исходного WAV. Тайминги в `types.ts` отсчитываются от этого места. Время первой реплики следующего блока в монтаже — 07:31,500.

Звук предпросмотра можно восстановить из корня проекта

```sh
ffmpeg -ss 375 -i ~/Movies/CapCut/websocket_audio.WAV -t 68.5 -ac 1 -ar 48000 -c:a aac -b:a 96k apps/remotion/public/generated/011-websocket/tcp-link-types.m4a
```

Кружки отмечают концы отдельных TCP-соединений. Прямоугольник обозначает промежуточное звено. У прокси линии упираются в его границы. При сквозной пересылке линия проходит через звено целиком. Пояснение про прямой ответ относится к DSR. Для NAT изменение адреса и учёт потока подписаны отдельно. [NGINX WebSocket](https://nginx.org/en/docs/http/websocket.html) · [Google Cloud Proxy NLB](https://docs.cloud.google.com/load-balancing/docs/proxy-network-load-balancer) · [Google Cloud Passthrough NLB](https://docs.cloud.google.com/load-balancing/docs/passthrough-network-load-balancer) · [RFC 5382](https://www.rfc-editor.org/rfc/rfc5382)
