# Реальный маршрут WebSocket

Композиция `Video-011-websocket-p02-a01-network-route` показывает пример маршрута с CDN, облачным балансировщиком и Kubernetes. Схема раскрывается по голосу. Варианты NAT оператора и sidecar зависят от сети и конфигурации. На узле kube-proxy настраивает пересылку к endpoint, а conntrack отслеживает потоки. [Kubernetes](https://kubernetes.io/docs/reference/networking/virtual-ips/), [Istio](https://istio.io/latest/docs/ops/deployment/architecture/).

Начало в CapCut — 05:14,000, конец — 06:03,200. Якорь `network-route-edit` уже включает оба разделителя. В `route.ts` время появления звеньев отсчитано от начала композиции.

Для восстановления локального звука Studio выполните из корня проекта

```bash
ffmpeg -ss 306 -i /Users/mdpopov/Movies/CapCut/websocket_audio.WAV -t 49.2 -ac 1 -ar 48000 -c:a aac -b:a 96k apps/remotion/public/generated/011-websocket/network-route.m4a
```
