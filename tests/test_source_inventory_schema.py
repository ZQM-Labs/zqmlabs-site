"""Validate the reviewed source-comparison CSV's data contract; not a secret-scan exemption."""
import csv
import re
import unittest
from pathlib import Path

SOURCE = Path(__file__).resolve().parents[1] / "docs" / "DUAL_BRAND_FILE_INVENTORY.csv"
FIELDS = ("path", "canonical_blob_sha", "publisher_vendor_blob_sha",
          "blob_relation", "current_composite_source", "proposed_treatment", "review_state")
SHA = re.compile(r"[0-9a-f]{40}\Z")


def validate_inventory(path):
    with path.open(newline="", encoding="utf-8") as handle:
        rows = csv.DictReader(handle)
        if tuple(rows.fieldnames or ()) != FIELDS:
            raise ValueError("Source inventory schema changed unexpectedly")
        count = 0
        seen = set()
        for index, row in enumerate(rows, start=2):
            if None in row or any(row.get(k) is None for k in FIELDS):
                raise ValueError(f"Malformed inventory row {index}")
            name = row["path"]
            if not name or name.startswith("/") or "\\" in name or any(
                part in ("", ".", "..") for part in name.split("/")
            ):
                raise ValueError(f"Unsafe path at inventory row {index}")
            if name in seen:
                raise ValueError(f"Duplicate source path at row {index}")
            seen.add(name)
            for key in ("canonical_blob_sha", "publisher_vendor_blob_sha"):
                value = row[key]
                if value and not SHA.fullmatch(value):
                    raise ValueError(f"{key} is not a Git blob digest at row {index}")
            count += 1
    if count == 0:
        raise ValueError("Empty source inventory")
    return count


class InventorySchemaTests(unittest.TestCase):
    def test_source_inventory_contains_only_sha_digests_in_digest_columns(self):
        self.assertGreater(validate_inventory(SOURCE), 0)

    def test_flagged_snowflake_row_is_path_and_blob_metadata(self):
        with SOURCE.open(newline="", encoding="utf-8") as handle:
            rows = list(csv.DictReader(handle))
        matches = [row for row in rows if row["path"] == "content/games/snowflake-secret.md"]
        self.assertEqual(len(matches), 1)
        for col in ("canonical_blob_sha", "publisher_vendor_blob_sha"):
            self.assertRegex(matches[0][col], r"^[0-9a-f]{40}$")
        self.assertNotIn("=", matches[0]["path"])

    def test_malformed_digest_is_rejected(self):
        import tempfile
        with tempfile.TemporaryDirectory() as root:
            file = Path(root) / "test.csv"
            file.write_text(",".join(FIELDS) + "\n" +
                "item.md,not_a_digest,,different,source,keep,unresolved\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "not a Git blob digest"):
                validate_inventory(file)


if __name__ == "__main__":
    unittest.main()
