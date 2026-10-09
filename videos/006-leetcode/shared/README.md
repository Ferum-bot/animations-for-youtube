# Episode-local editor components

`theme.ts` adapts the channel's semantic theme to a JetBrains-inspired code surface.
`OverlayStage.tsx` shares deterministic entrance/exit, theme, preview backgrounds
and optional audio between code inserts and the worker-settings reference table.
The table's content and layout remain local to its animation.
`code/CodePanel.tsx` draws a centered editor panel with token-level focus and a
short synchronized explanation. Code content and spoken timing remain in each
animation directory; this component does not own episode-specific commands.
`code/CodeScene.tsx` connects the common stage to code-panel content and cues.
`CodePanel` accepts local baseline/line spacing when
adjacent enlarged SQL rows need more room; Docker keeps its original spacing.
Its `single-line` variant fits short commands such as the gVisor runtime example
in a compact panel, sharing typography, focus motion and captions with listings.

`docker/` shares the exact command and scene between the overview and flag
explanation. Each animation passes its own local cues, duration and audio excerpt.

`useOverlayTiming.ts` owns the episode's entrance/exit profiles, including the
fully transparent last frame. Docker, SQL and Monaco use this lifecycle.
Monaco's runtime, model and demonstration UI stay local to its animation.

`isolate/` shares the supplied three-command example between the sandbox
lifecycle and limits explanation. Commands, typed focus IDs and anchor mapping
stay episode-local; both scenes reuse the same code panel and overlay timing.
