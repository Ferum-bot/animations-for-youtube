# Ресурсы открытого соединения

В Studio композиция `Video-011-websocket-p02-a02-connection-resources` использует фотографию ведущего и реплику из исходного WAV. Монтажный интервал 06:06,000–06:22,700 соответствует 05:58,000–06:14,700 в WAV. Команда для восстановления дорожки из корня проекта

```sh
ffmpeg -ss 358 -i ~/Movies/CapCut/websocket_audio.WAV -t 16.7 -ac 1 -ar 48000 -c:a aac -b:a 96k apps/remotion/public/generated/011-websocket/connection-resources.m4a
```

Для примера с ALB взят миллион постоянно активных соединений в us-east-1 при обычном TLS. На 3 000 активных соединений приходится одна LCU. При ставке 0,008 доллара за LCU-час расчёт за 730 часов даёт около 1 947 долларов. AWS выставляет счёт по наибольшему из четырёх измерений LCU и отдельно тарифицирует часы работы балансировщика. [Тарифы AWS](https://aws.amazon.com/elasticloadbalancing/pricing/)

Прокси расходует память и держит дескрипторы открытых сокетов. При отслеживании потока в ядре появляется запись conntrack. При трансляции исходящего TCP-соединения с портом внешний адрес и порт входят в сопоставление NAT. [NGINX](https://nginx.org/en/docs/ngx_core_module.html#worker_connections) · [Cloudflare о conntrack](https://blog.cloudflare.com/conntrack-tales-one-thousand-and-one-flows/) · [RFC 5382](https://www.rfc-editor.org/rfc/rfc5382)
