#!/usr/bin/env python3
"""Preview-only, pinned-production static asset restoration; dry-run by default.

No network, publisher writes, Cloudflare actions or manifest synthesis.
"""
import argparse
import hashlib
import json
import os
import sys
import zipfile
from pathlib import Path, PurePosixPath

BASELINE_SHA256 = "254de65c0769a9f133f6c6257f33a03fc880c14176f57380eb5722b79dfdd393"

def sha256(data):
    return hashlib.sha256(data).hexdigest()

def safe_name(name):
    return (bool(name) and not name.startswith("/") and "\\" not in name
            and not name.endswith("/") and all(p not in ("", ".", "..") for p in name.split("/"))
            and PurePosixPath(name).as_posix() == name)

def read_allowlist(path):
    entries = [x.strip() for x in path.read_text(encoding="utf-8").splitlines()
               if x.strip() and not x.lstrip().startswith("#")]
    if len(entries) != 39 or len(entries) != len(set(entries)):
        raise ValueError("Expected exactly 39 distinct frozen static asset entries")
    if any(not safe_name(x) or x == "release-manifest.json" for x in entries):
        raise ValueError("Unsafe restoration allowlist path")
    return sorted(entries)

def restoration_plan(baseline_zip, destination, allowlist, baseline_sha=BASELINE_SHA256):
    if sha256(baseline_zip.read_bytes()) != baseline_sha:
        raise ValueError("Immutable production ZIP SHA-256 mismatch")
    if not destination.is_dir() or destination.is_symlink():
        raise ValueError("Destination must be a regular directory")
    files = read_allowlist(allowlist)
    plans = []
    with zipfile.ZipFile(baseline_zip) as archive:
        names = set()
        for member in archive.infolist():
            if member.is_dir():
                continue
            if not safe_name(member.filename) or member.filename in names:
                raise ValueError("Unsafe or duplicate production member: " + member.filename)
            if member.is_dir() or (member.external_attr >> 16) & 0o170000 == 0o120000:
                raise ValueError("Symlink in production archive: " + member.filename)
            names.add(member.filename)
        for name in files:
            if name not in names:
                raise ValueError("Approved file absent from production archive: " + name)
            out = destination / name
            if any(p.is_symlink() for p in [out, *out.parents] if p == destination or destination in p.parents):
                raise ValueError("Symlink in destination path: " + name)
            expected = archive.read(name)
            if out.exists():
                if not out.is_file() or sha256(out.read_bytes()) != sha256(expected):
                    raise ValueError("Refusing overwrite of divergent candidate asset: " + name)
                status = "identical"
            else:
                status = "restore"
            plans.append({"path": name, "status": status, "sha256": sha256(expected),
                          "bytes": len(expected)})
    return plans

def apply_plan(baseline_zip, destination, plans):
    with zipfile.ZipFile(baseline_zip) as archive:
        for item in plans:
            if item["status"] != "restore":
                continue
            name = item["path"]
            out = destination / name
            if out.exists() or any(p.is_symlink() for p in [out, *out.parents] if p == destination or destination in p.parents):
                raise ValueError("Destination changed during restoration: " + name)
            payload = archive.read(name)
            if sha256(payload) != item["sha256"]:
                raise ValueError("Restoration member checksum mismatch: " + name)
            out.parent.mkdir(parents=True, exist_ok=True)
            with open(out, "xb") as file:
                file.write(payload)
            if sha256(out.read_bytes()) != item["sha256"]:
                raise ValueError("Restored asset checksum mismatch: " + name)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--baseline-zip", type=Path, required=True)
    parser.add_argument("--public-dir", type=Path, required=True)
    parser.add_argument("--allowlist", type=Path, default=Path("docs/production-static-restore-allowlist.txt"))
    parser.add_argument("--apply", action="store_true", help="Opt in to copying precisely approved missing files")
    args = parser.parse_args()
    try:
        plan = restoration_plan(args.baseline_zip, args.public_dir, args.allowlist)
        if args.apply:
            apply_plan(args.baseline_zip, args.public_dir, plan)
        report = {"mode": "apply" if args.apply else "dry-run", "entries": len(plan),
                  "to_restore": sum(x["status"] == "restore" for x in plan),
                  "already_identical": sum(x["status"] == "identical" for x in plan),
                  "files": plan,
                  "release_manifest_generated": False, "production_deployed": False}
        print(json.dumps(report, sort_keys=True, indent=2))
        return 0
    except (ValueError, OSError, zipfile.BadZipFile) as error:
        print(json.dumps({"error": str(error), "pass": False}), file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main())
