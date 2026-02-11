#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="${SCRIPT_DIR}"
OUTPUT_ZIP="${SCRIPT_DIR}/../meeshomart-installable.zip"

if [[ ! -f "${THEME_DIR}/style.css" ]]; then
  echo "Error: style.css not found in theme directory: ${THEME_DIR}" >&2
  exit 1
fi

rm -f "${OUTPUT_ZIP}"

# Build zip with style.css at archive root (most compatible for WP uploader).
cd "${THEME_DIR}"
zip -r "${OUTPUT_ZIP}" . \
  -x "./.git/*" \
  -x "./node_modules/*" \
  -x "./.DS_Store" \
  -x "./Thumbs.db"

# Validate archive contains style.css at root.
if ! unzip -l "${OUTPUT_ZIP}" | awk '{print $4}' | grep -qx 'style.css'; then
  echo "Error: generated zip is invalid (style.css missing at archive root)." >&2
  exit 1
fi

echo "Theme package created: ${OUTPUT_ZIP}"
echo "Upload this file in WP Admin > Appearance > Themes > Add New > Upload Theme"
