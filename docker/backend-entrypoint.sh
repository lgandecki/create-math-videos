#!/usr/bin/env bash
set -euo pipefail

delay="${CLAUDE_AUTH_RETRY_DELAY:-30}"
dest_dir="${DEST_DIR:-/app/packages/ai-math-maker/public}"
manim_dir="${MANIM_DIR:-/app/packages/math-image-creator}"
app_user="${APP_USER:-appuser}"
claude_dir="${CLAUDE_AUTH_DIR:-/root/.anthropic}"

if [[ "$(id -u)" -eq 0 ]]; then
  mkdir -p "${dest_dir}" "${manim_dir}" "${claude_dir}"
  chown -R "${app_user}:${app_user}" "${dest_dir}" "${manim_dir}" "${claude_dir}"
else
  mkdir -p "${dest_dir}" "${manim_dir}" "${claude_dir}"
fi

if [[ "${CLAUDE_AUTH_CHECK_DISABLED:-0}" == "1" ]]; then
  echo "[Claude Auth] Check disabled via CLAUDE_AUTH_CHECK_DISABLED."
  exec "$@"
fi

echo "[Claude Auth] Verifying Claude authentication status..."

while true; do
  set +e
  if [[ "$(id -u)" -eq 0 ]]; then
    status_output="$(gosu "${app_user}" claude auth status 2>&1)"
  else
    status_output="$(claude auth status 2>&1)"
  fi
  status_code=$?
  set -e

  if [[ ${status_code} -eq 0 ]]; then
    echo "[Claude Auth] Authentication confirmed."
    break
  fi

  echo "[Claude Auth] Claude not authenticated."
  echo "[Claude Auth] Please run the following command in another terminal:"
  echo "  docker exec -u ${app_user} -it ${CLAUDE_CONTAINER_NAME:-$(hostname)} claude auth login"
  echo "[Claude Auth] After completing the browser flow, the backend will continue."
  echo "[Claude Auth] Full status output:"
  echo "${status_output}"
  echo "[Claude Auth] Retrying in ${delay}s..."
  sleep "${delay}"
done

if [[ "$(id -u)" -eq 0 ]]; then
  exec gosu "${app_user}" "$@"
else
  exec "$@"
fi
