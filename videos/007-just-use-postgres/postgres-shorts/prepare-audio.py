"""Prepare Studio narration only. Never renders video. Run with the original Opus path."""
import array
import json
import math
from pathlib import Path
import subprocess
import sys
import tempfile
import wave

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
OUTPUT = ROOT / 'apps/remotion/public/generated/007-just-use-postgres/postgres-shorts'
RATE = 48000
CHANNELS = 2


def verify(samples, label):
    def rms(values):
        return math.sqrt(sum(v * v for v in values) / max(1, len(values))) / 32768
    window = RATE * CHANNELS
    levels = [rms(samples[i:i + window]) for i in range(0, len(samples) - window + 1, window)]
    assert rms(samples[:window]) > 0.001, f'{label}: silent opening'
    assert rms(samples[-window:]) > 0.001, f'{label}: silent ending'
    assert not any(all(v < 0.001 for v in levels[i:i + 3]) for i in range(len(levels) - 2)), f'{label}: silent tail or gap'
    assert max(abs(v) for v in samples) < 32767, f'{label}: clipping'
    return 20 * math.log10(rms(samples[-window:]))


def main():
    source = Path(sys.argv[1]).expanduser().resolve(strict=True)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='postgres-audio-') as scratch:
        decoded = Path(scratch) / 'source.wav'
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', str(source), '-ar', str(RATE),
                        '-ac', str(CHANNELS), '-c:a', 'pcm_s16le', str(decoded)], check=True)
        with wave.open(str(decoded)) as original:
            for clip in json.loads((HERE / 'clips.json').read_text()):
                samples = array.array('h')
                for cut in clip['cuts']:
                    original.setpos(round(cut['startMs'] * RATE / 1000))
                    part = array.array('h', original.readframes(round((cut['endMs'] - cut['startMs']) * RATE / 1000)))
                    if sys.byteorder != 'little':
                        part.byteswap()
                    fade = round(RATE * 0.008) * CHANNELS
                    for i in range(fade):
                        part[i] = round(part[i] * i / fade)
                        part[-1 - i] = round(part[-1 - i] * i / fade)
                    samples.extend(part)
                # One fixed gain across this series, with a peak ceiling for source variations.
                gain = min(10 ** (4 / 20), 32767 * 10 ** (-1.5 / 20) / max(abs(v) for v in samples))
                samples = array.array('h', (round(v * gain) for v in samples))
                tail = verify(samples, clip['slug'])
                target = OUTPUT / (clip['slug'] + '.wav')
                if sys.byteorder != 'little':
                    samples.byteswap()
                with wave.open(str(target), 'wb') as output:
                    output.setnchannels(CHANNELS)
                    output.setsampwidth(2)
                    output.setframerate(RATE)
                    output.writeframes(samples.tobytes())
                print(f"{clip['number']:02d} {clip['slug']}: {len(samples) / RATE / CHANNELS:.2f}s; final-second RMS {tail:.1f} dBFS", flush=True)


if __name__ == '__main__':
    main()
