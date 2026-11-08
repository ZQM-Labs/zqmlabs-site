"""No-network regression tests for pinned production static restore tool."""
import hashlib
import importlib.util
import tempfile
import unittest
import zipfile
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "preview" / "restore_production_static.py"
SPEC = importlib.util.spec_from_file_location("restore_static", SCRIPT)
mod = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(mod)
SOURCE = Path(__file__).resolve().parents[1] / "docs" / "production-static-restore-allowlist.txt"

class RestoreStaticTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.zip = self.root / "verified.zip"
        self.public = self.root / "public"
        self.public.mkdir()
        self.allowlist = self.root / "allowlist.txt"
        self.allowlist.write_text(SOURCE.read_text(encoding="utf-8"), encoding="utf-8")
        self.files = mod.read_allowlist(self.allowlist)
        with zipfile.ZipFile(self.zip, "w") as archive:
            for name in self.files:
                archive.writestr(name, ("verified bytes: " + name).encode("utf-8"))
            archive.writestr("release-manifest.json", b'{"production":true}')
        self.sha = hashlib.sha256(self.zip.read_bytes()).hexdigest()

    def tearDown(self):
        self.tmp.cleanup()

    def plan(self):
        return mod.restoration_plan(self.zip, self.public, self.allowlist, self.sha)

    def test_default_mode_only_plans_all_39(self):
        plans = self.plan()
        self.assertEqual(len(plans), 39)
        self.assertTrue(all(x["status"] == "restore" for x in plans))
        self.assertEqual(list(self.public.rglob("*")), [])

    def test_explicit_apply_restores_only_allowlist_with_checksum(self):
        plans = self.plan()
        mod.apply_plan(self.zip, self.public, plans)
        self.assertEqual(sum(p.is_file() for p in self.public.rglob("*")), 39)
        self.assertFalse((self.public / "release-manifest.json").exists())
        self.assertTrue(all(x["status"] == "identical" for x in self.plan()))

    def test_exact_baseline_checksum_required(self):
        with self.assertRaisesRegex(ValueError, "SHA-256 mismatch"):
            mod.restoration_plan(self.zip, self.public, self.allowlist, "0" * 64)

    def test_divergent_candidate_file_never_overwritten(self):
        target = self.public / self.files[0]
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(b"changed by candidate")
        with self.assertRaisesRegex(ValueError, "Refusing overwrite"):
            self.plan()
        self.assertEqual(target.read_bytes(), b"changed by candidate")

    def test_missing_archive_member_rejected(self):
        self.zip.unlink()
        with zipfile.ZipFile(self.zip, "w") as archive:
            archive.writestr(self.files[0], b"single")
        new_sha = hashlib.sha256(self.zip.read_bytes()).hexdigest()
        with self.assertRaisesRegex(ValueError, "absent"):
            mod.restoration_plan(self.zip, self.public, self.allowlist, new_sha)

    def test_symlink_destination_rejected(self):
        self.public.joinpath("img").symlink_to(self.root, target_is_directory=True)
        with self.assertRaisesRegex(ValueError, "Symlink"):
            self.plan()

    def test_allowlist_traversal_rejected(self):
        self.allowlist.write_text(self.allowlist.read_text() + "../escape\n")
        with self.assertRaisesRegex(ValueError, "39 distinct"):
            self.plan()

if __name__ == "__main__":
    unittest.main()
