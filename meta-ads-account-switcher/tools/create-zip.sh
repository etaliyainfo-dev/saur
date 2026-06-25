#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
cd ..
rm -f meta-ads-account-switcher.zip
zip -r meta-ads-account-switcher.zip meta-ads-account-switcher \
  -x 'meta-ads-account-switcher/tools/*' \
  -x 'meta-ads-account-switcher/.DS_Store'
echo "Created meta-ads-account-switcher.zip"
