# Opening claim and references

Studio: `Videos / V-007-just-use-postgres / P-01-Intro`.
The composition covers narration 00:00.000–00:30.300. Its placement starts at 0;
no chapter divider precedes the introduction. Later placements must use
`shared/edit-timing.ts`, which adds 4500 ms per preceding chapter insertion.
Do not add the shift a second time when aligning to a newly exported audio track.
The December 2022 history belongs to a later, separate animation and is not included here.

The opening text uses the left 1460 px of the frame, with the main title raised
onto the wall above the monitor. The presenter remains clear on the right.
Authored text has no backing plate: cobalt lettering with a thick cream outline keeps it
readable over both bright and dark footage. Native article crops retain their original backgrounds.
`previewBackground` is for Studio; use `transparent` and `withAudio: false` for an overlay export.
The default `footage` preview uses the user's 2026-10-18 screenshot, cropped to
the video area. This still is a placement reference, not a synchronized video layer.
Studio defaults include the original narration for timing review. Regenerate its ignored audio with:

```sh
ffmpeg -i /Users/mdpopov/Movies/CapCut/not_use_pg_audio.WAV -t 30.3 -ac 1 -ar 48000 apps/remotion/public/generated/007-just-use-postgres/p01-a01-intro.wav
```

`scene.ts` holds source URLs and approximate word anchors from local Whisper.
The three Habr assets are real screenshot crops captured on 2026-10-18. Cropping
removes unrelated navigation and advertising; article text and metadata are unchanged.
The YouTube screenshot was supplied by the user on 2026-10-18 and is shown unchanged.

Motion comes only from the composition frame: reveal the claim, replace the named
technology, accumulate article clippings, then show the video screenshot. During
the technology list, the opening claim disappears; each technology takes its
place in large bold type, without logos. The claim returns after the list.
QA stills belong outside the repository. No clip render is required for this draft.
