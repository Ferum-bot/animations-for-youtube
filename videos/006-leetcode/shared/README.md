# Episode-local editor components

`theme.ts` adapts the channel's semantic theme to a JetBrains-inspired code surface.
`code/CodePanel.tsx` draws a centered editor panel with token-level focus and a
short synchronized explanation. Code content and spoken timing remain in each
animation directory; this component does not own episode-specific commands.

`docker/` shares the exact command and scene between the overview and flag
explanation. Each animation passes its own local cues, duration and audio excerpt.
