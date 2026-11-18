"""Restore the pilot camera proxy from the original webcam MP4 and narration WAV."""
import subprocess
import sys
from pathlib import Path

folder = Path(__file__).resolve().parent
prepare = folder.parents[1] / "shared/vertical/prepare_presenter.py"
subprocess.run([sys.executable, str(prepare), str(folder), *sys.argv[1:]], check=True)
