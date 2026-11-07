# Standard animations

**Deprecated for new work.** Preserve existing consumers and composition IDs.
New inserts use [`@channel/motion-v2`](../motion-v2/README.md); if an equivalent
does not exist, implement the needed behavior in the approved v2 direction first.
The old subscription, clock and chapter designs are compatibility assets.

Reusable channel inserts rendered at 2560×1440 and 30 fps.

- `Standard-Subscribe` — compact transparent YouTube subscription callout. The
  component adapts its click timing to the composition duration and supports
  bottom-left or bottom-right placement.
- `Standard-Chapter-Delegation` and `Standard-Chapter-Route` — full-screen
  chapter separators.
- `Standard-Waiting-Clock-Light` and `Standard-Waiting-Clock-Dark` — compact
  clocks with a 10-second default duration, entrance and exit.
- `Standard-Waiting-Clock-Light-Loop` and `Standard-Waiting-Clock-Dark-Loop` —
  seamless 3-second clock cycles without entrance or exit.

See [Waiting clock](src/waiting-clock/README.md) for timing, placement, and reuse.

Existing episode timelines use a small video-local wrapper when they need to pin
copy, placement, or duration without changing the shared component.
