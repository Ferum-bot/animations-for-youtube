# Deprecated visual library

`@channel/design-system` is deprecated for **new work**. Use
[`@channel/motion-v2`](../motion-v2/README.md).

Keep existing consumers intact. `MotionStage` intentionally retains its old
1920×1080 design coordinate system and automatic fade; silently changing it
would alter already approved episodes. `ServiceCard`, `DataPacket`,
`TechnicalLabel` and `FeatheredBackground` are compatibility APIs, not new style references.
Theme and timing infrastructure remain supported through their own packages.
