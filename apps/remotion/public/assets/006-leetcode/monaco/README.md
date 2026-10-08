# Monaco reference image

`official-home-full-1280x2296.jpg` is an unedited screenshot of the official Monaco Editor home
page, captured on 2026-10-08 as a full-page image at 1280×2296. Source:
https://microsoft.github.io/monaco-editor/

It is used as a brief, identified website reference in `p01-a03-monaco-editor`.
The scene scrolls the image from the headline to the editor examples using
frame-derived timing; it does not access the live website during playback.
Use a new asset filename when replacing a screenshot with different contents so
an existing Studio tab cannot reuse a cached shorter image during the scroll.
The Two Sum page is an authored demonstration; its editor is the actual locally
bundled `monaco-editor` package, not part of this screenshot.
