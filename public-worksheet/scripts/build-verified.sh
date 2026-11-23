#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
vinext_bin="${project_root}/node_modules/.bin/vinext"

if [[ ! -x "${vinext_bin}" ]]; then
  echo "vinext is unavailable. Run npm ci before building." >&2
  exit 69
fi

command -v timeout >/dev/null || {
  echo "GNU timeout is required for a bounded production build." >&2
  exit 69
}

cd "${project_root}"
export WRANGLER_WRITE_LOGS=false
export WRANGLER_LOG_PATH="${project_root}/.wrangler/wrangler.log"
export MINIFLARE_REGISTRY_PATH="${project_root}/.wrangler/registry"

echo "Running bounded Me+U production build..."
timeout --signal=TERM --kill-after=10s 3m "${vinext_bin}" build
