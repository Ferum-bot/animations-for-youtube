"""Build the source proxy used by Studio from an episode's cuts.json, webcam and edited WAV."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import tempfile


def prepare(folder: Path, camera: Path, voice: Path) -> None:
    episode = folder.resolve().parents[1]
    project = episode.parents[1]
    slug = folder.name.split("-", 2)[2]
    target = project / "apps/remotion/public/generated" / episode.name / slug / "presenter.mp4"
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=target.parent) as temp:
        work = Path(temp)
        parts = []
        for index, cut in enumerate(json.loads((folder / "cuts.json").read_text())):
            frames = round(cut["lengthMs"] * 30 / 1000)
            duration = frames / 30
            inputs = []
            for start, source in [(cut["cameraMs"], camera), (cut["voiceMs"], voice)]:
                inputs.extend(["-ss", str(start / 1000), "-t", str(duration + 0.1), "-i", str(source)])
            filters = (f"[0:v]fps=30,trim=end_frame={frames},scale=1280:720,setsar=1,setpts=PTS-STARTPTS[v];"
                       f"[1:a]aresample=48000,atrim=end_sample={frames*1600},asetpts=PTS-STARTPTS,"
                       f"afade=t=in:d=0.007,afade=t=out:st={duration-.008}:d=0.008[a]")
            part = work / f"part{index}.mov"
            subprocess.run(["ffmpeg", "-nostdin", "-v", "error", *inputs, "-filter_complex", filters,
                            "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-threads", "4", "-preset",
                            "veryfast", "-crf", "17", "-g", "30", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le",
                            str(part)], check=True)
            parts.append(f"file '{part.name}'\nduration {duration:.9f}\n")
        manifest = work / "parts.txt"
        manifest.write_text("".join(parts))
        proxy = work / "presenter.mp4"
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-f", "concat", "-i", str(manifest),
                        "-c:v", "copy", "-c:a", "aac", "-b:a", "224k", "-movflags", "+faststart",
                        str(proxy)], check=True)
        os.replace(proxy, target)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("folder", type=Path)
    parser.add_argument("camera", type=Path)
    parser.add_argument("voice", type=Path)
    args = parser.parse_args()
    prepare(args.folder, args.camera, args.voice)
