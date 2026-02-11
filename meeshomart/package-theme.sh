#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="${SCRIPT_DIR}"
OUTPUT_ZIP="${SCRIPT_DIR}/../meeshomart-theme.zip"

rm -f "${OUTPUT_ZIP}"

cd "$(dirname "${THEME_DIR}")"
zip -r "${OUTPUT_ZIP}" "$(basename "${THEME_DIR}")" \
  -x "*/.git/*" \
  -x "*/node_modules/*" \
  -x "*/.DS_Store" \
  -x "*/Thumbs.db"

echo "Theme package created: ${OUTPUT_ZIP}"
