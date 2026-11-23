#!/usr/bin/env python3
"""Caption actual Playwright footage without altering the application view."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

root = Path(__file__).resolve().parents[1]
captions_files = list((root / "test-results").rglob("captions.json"))
if len(captions_files) != 1:
    raise SystemExit("Expected exactly one completed demo caption timeline")
caption_file = captions_files[0]
videos = list(caption_file.parent.glob("*.webm"))
if len(videos) != 1:
    raise SystemExit("Expected exactly one actual demo recording")
for executable in ("ffmpeg", "ffprobe"):
    if not shutil.which(executable):
        raise SystemExit(f"Install {executable} before packaging the demo")
timeline = json.loads(caption_file.read_text())
if not 120 < timeline["end"] < 240:
    raise SystemExit("Demo must run between two and four minutes")
output = root / "demo-output"
output.mkdir(exist_ok=True)

def timestamp(seconds):
    millis = round(seconds * 1000)
    hours, millis = divmod(millis, 3600000)
    minutes, millis = divmod(millis, 60000)
    whole, millis = divmod(millis, 1000)
    return f"{hours:02}:{minutes:02}:{whole:02},{millis:03}"

captions = timeline["captions"]
blocks = []
for index, caption in enumerate(captions):
    end = captions[index + 1]["start"] if index + 1 < len(captions) else timeline["end"]
    blocks.append(f"{index + 1}\n{timestamp(caption['start'])} --> {timestamp(end)}\n{caption['text']}\n")
(output / "MeU-Actual-Worksheet-Demo.srt").write_text("\n".join(blocks), encoding="utf-8")
destination = output / "MeU-Actual-Worksheet-Demo.mp4"
# Black space below the 1280x900 recording keeps captions off product controls.
subprocess.run([
    "ffmpeg", "-hide_banner", "-loglevel", "warning", "-y", "-i", str(videos[0]),
    "-vf", "pad=1280:1080:0:0:color=black,subtitles=MeU-Actual-Worksheet-Demo.srt:force_style='FontName=DejaVu Sans,FontSize=22,Alignment=2,MarginV=32,Outline=0'",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", "-an", str(destination),
], cwd=output, check=True)
duration = float(subprocess.check_output([
    "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(destination),
], text=True).strip())
if not 120 < duration < 240:
    raise SystemExit(f"Encoded duration {duration} is outside the contest limit")
digest = hashlib.sha256(destination.read_bytes()).hexdigest()
(output / "SHA256SUMS.txt").write_text(f"{digest}  {destination.name}\n")
metadata = {"duration_seconds": duration, "sha256": digest, "width": 1280, "height": 1080,
            "content": "Real browser recording with fictional entries; explanatory captions added below the unaltered application view.",
            "runtime_ai": False, "audio": False, "playback": "Real time; no accelerated or skipped footage."}
(output / "demo-metadata.json").write_text(json.dumps(metadata, indent=2) + "\n")
print(json.dumps(metadata))
