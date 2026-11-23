#!/usr/bin/env python3
"""Caption actual Playwright footage without altering the application view."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

root = Path(__file__).resolve().parents[1]
captions_files = list((root / "test-results" / "demo").rglob("captions.json"))
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

def ass_timestamp(seconds):
    centis = round(seconds * 100)
    hours, centis = divmod(centis, 360000)
    minutes, centis = divmod(centis, 6000)
    whole, centis = divmod(centis, 100)
    return f"{hours}:{minutes:02}:{whole:02}.{centis:02}"

# Explicit resolution prevents SRT's default ASS scaling from covering the UI.
ass = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 1280", "PlayResY: 1080",
       "WrapStyle: 0", "", "[V4+ Styles]",
       "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
       "Style: Default,DejaVu Sans,28,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,2,32,32,40,1",
       "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
for index, caption in enumerate(captions):
    end = captions[index + 1]["start"] if index + 1 < len(captions) else timeline["end"]
    text = caption["text"]
    if any(character in text for character in "{}\\"):
        raise SystemExit("Caption contains unsupported ASS control characters")
    text = text.replace("\n", r"\N")
    ass.append(f"Dialogue: 0,{ass_timestamp(caption['start'])},{ass_timestamp(end)},Default,,0,0,0,,{text}")
(output / "MeU-Actual-Worksheet-Demo.ass").write_text("\n".join(ass) + "\n", encoding="utf-8")
destination = output / "MeU-Actual-Worksheet-Demo.mp4"
# Black space below the 1280x900 recording keeps captions off product controls.
subprocess.run([
    "ffmpeg", "-hide_banner", "-loglevel", "warning", "-y", "-i", str(videos[0]),
    "-vf", "pad=1280:1080:0:0:color=black,ass=MeU-Actual-Worksheet-Demo.ass",
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
