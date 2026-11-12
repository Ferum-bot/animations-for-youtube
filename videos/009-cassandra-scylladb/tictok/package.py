"""Replace the five-second YouTube outro in approved exports; preserve their audio."""
import argparse
import json
import shutil
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


def run(*args):
    return subprocess.check_output(args, text=True)


def probe(path):
    return json.loads(run('ffprobe', '-v', 'error', '-show_streams',
                          '-show_format', '-of', 'json', str(path)))


def audio_hash(path):
    return run('ffmpeg', '-v', 'error', '-i', str(path), '-map', '0:a:0',
               '-c:a', 'copy', '-f', 'hash', '-hash', 'sha256', '-')


def safe_body_filter(width, height, layout):
    """Fit the entire approved scene without cropping or changing its aspect ratio."""
    factor = width / layout['canvas']['width']
    even = lambda value: 2 * round(value / 2)
    body = layout['body']
    scaled_width = even(width * body['scale'])
    scaled_height = even(height * body['scale'])
    left, top = even(body['left'] * factor), even(body['top'] * factor)
    # Continue the source's empty corner in native YUV: no visible padding seam
    # and no duplicated RGB palette or implicit color conversion.
    return ('split=2[content][corner];'
            f'[corner]crop=2:2:0:0,scale={width}:{height}:flags=neighbor,setsar=1[background];'
            f'[content]scale={scaled_width}:{scaled_height}:flags=lanczos[inset];'
            f'[background][inset]overlay={left}:{top}:shortest=1')


def source_paths(row, args):
    slug, series = row['slug'], row['series']
    if series == 'architecture':
        return args.trash / f'{slug}.mp4', args.trash / f'{slug}-cover.png'
    parent = (args.trash / 'history-shorts' if series == 'history'
              else args.scylla_source) / slug
    return parent / f'{slug}.mp4', parent / f'{slug}.png'


def export(row, args):
    source, cover = source_paths(row, args)
    info = probe(source)
    video = next(s for s in info['streams'] if s['codec_type'] == 'video')
    expected_frames = round(row['durationMs'] * 30 / 1000)
    if video['avg_frame_rate'] != '30/1' or int(video['nb_frames']) != expected_frames:
        raise ValueError(f'Timing differs from approved animation: {source}')
    if (video['width'], video['height']) not in [(1080, 1920), (1440, 2560)]:
        raise ValueError(f'Unexpected dimensions: {source}')
    target = args.output / row['series'] / row['slug']
    target.mkdir(parents=True, exist_ok=True)
    destination = target / source.name
    pending = target / f'.{row["slug"]}.partial.mp4'
    # Exact frame trim prevents remnants of the old arrow at the splice.
    body_frames = expected_frames - 150
    # Older untagged exports use FFmpeg's default BT.601 interpretation.
    # Normalize explicitly so concat cannot insert implicit matrix conversions.
    matrix = video.get('color_space', 'bt601')
    color_tags = 'setparams=range=limited:colorspace=bt709:color_primaries=bt709:color_trc=bt709'
    body_color = (f'scale=in_color_matrix={matrix}:out_color_matrix=bt709:'
                  'in_range=tv:out_range=tv,' if matrix != 'bt709' else '')
    filters = (
        f'[0:v]trim=end_frame={body_frames},setpts=PTS-STARTPTS,setsar=1,'
        f'{body_color}{color_tags},'
        f'{safe_body_filter(video["width"], video["height"], args.layout)}[body];'
        f'[1:v]scale={video["width"]}:{video["height"]}:flags=lanczos:'
        'in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p,'
        f'trim=end_frame=150,setpts=PTS-STARTPTS,setsar=1,{color_tags}[card];'
        '[body][card]concat=n=2:v=1:a=0[out]'
    )
    subprocess.run([
        'ffmpeg', '-nostdin', '-v', 'error', '-n', '-threads', '2', '-i', str(source),
        '-loop', '1', '-framerate', '30', '-i', str(args.card),
        '-filter_complex_threads', '1', '-filter_complex', filters,
        '-map', '[out]', '-map', '0:a:0', '-c:v', 'libx264', '-preset', 'veryfast',
        '-crf', '16', '-threads', '4', '-pix_fmt', 'yuv420p', '-r', '30',
        '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709',
        '-color_trc', 'bt709', '-c:a', 'copy', '-map_metadata', '-1',
        '-movflags', '+faststart', str(pending),
    ], check=True)
    result = probe(pending)
    encoded = next(s for s in result['streams'] if s['codec_type'] == 'video')
    if int(encoded['nb_frames']) != expected_frames or audio_hash(source) != audio_hash(pending):
        raise ValueError(f'Frame count or copied audio mismatch: {pending}')
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-threads', '2',
                    '-i', str(pending), '-f', 'null', '-'], check=True)
    pending.replace(destination)
    shutil.copy2(cover, target / f'{row["slug"]}.png')
    if row['series'] == 'architecture':
        title, description = row['title'], row['description'] + '\n\n' + row['hashtags']
    else:
        title = (source.parent / 'Название.txt').read_text().strip()
        description = (source.parent / 'Описание.txt').read_text().strip()
    content, *tags = description.split('\n\n#', 1)
    description = (content + '\n\nПолный выпуск «Cassandra и ScyllaDB за 30 минут» '
                   '— на YouTube, канал @ma_popov.\n\n' + ('#' + tags[0] if tags else ''))
    (target / 'Название.txt').write_text(title + '\n')
    (target / 'Описание.txt').write_text(description.strip() + '\n')
    print(f'OK {row["series"]}/{row["slug"]}: {expected_frames} frames; audio identical', flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--trash', type=Path, default=Path.home() / '.Trash')
    parser.add_argument('--scylla-source', type=Path, required=True)
    parser.add_argument('--card', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--jobs', type=int, default=2)
    parser.add_argument('--replace', action='store_true', help='Replace existing exports only after validation')
    args = parser.parse_args()
    rows = json.loads(Path(__file__).with_name('shorts.json').read_text())
    # Validate the entire input batch before starting any encode.
    if not args.card.is_file():
        raise FileNotFoundError(args.card)
    args.layout = json.loads(Path(__file__).with_name('layout.json').read_text())
    for row in rows:
        for source in source_paths(row, args):
            if not source.is_file():
                raise FileNotFoundError(source)
        if not args.replace and (args.output / row['series'] / row['slug'] / f'{row["slug"]}.mp4').exists():
            raise FileExistsError(row['slug'])
    with ThreadPoolExecutor(max_workers=args.jobs) as pool:
        list(pool.map(lambda row: export(row, args), rows))


if __name__ == '__main__':
    main()
