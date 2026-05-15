#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
WEBUI_DIR="$ROOT_DIR/webui"
HTML_FILE="$WEBUI_DIR/index.html"
PORT="${WEBUI_PORT:-8420}"
PID_FILE="$ROOT_DIR/.webui.pid"
LOG_FILE="$ROOT_DIR/.webui.log"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info()  { printf "${CYAN}[INFO]${NC}  %s\n" "$1"; }
log_ok()    { printf "${GREEN}[OK]${NC}    %s\n" "$1"; }
log_warn()  { printf "${YELLOW}[WARN]${NC}  %s\n" "$1"; }
log_error() { printf "${RED}[ERROR]${NC} %s\n" "$1" >&2; }

cleanup() {
  if [ -f "$PID_FILE" ]; then
    local pid
    pid="$(cat "$PID_FILE" 2>/dev/null || true)"
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
      log_info "Stopping server (PID: $pid)..."
      kill "$pid" 2>/dev/null || true
      wait "$pid" 2>/dev/null || true
    fi
    rm -f "$PID_FILE"
  fi
}
trap cleanup EXIT INT TERM

check_port_free() {
  if lsof -iTCP:"$PORT" -sTCP:LISTEN -P -n >/dev/null 2>&1; then
    return 1
  fi
  return 0
}

find_free_port() {
  local candidate="$PORT"
  for i in $(seq 0 20); do
    if check_port_free; then
      echo "$candidate"
      return 0
    fi
    candidate=$((PORT + i + 1))
    PORT="$candidate"
  done
  return 1
}

validate_files() {
  if [ ! -d "$WEBUI_DIR" ]; then
    log_error "webui directory not found: $WEBUI_DIR"
    exit 1
  fi
  if [ ! -f "$HTML_FILE" ]; then
    log_error "index.html not found: $HTML_FILE"
    exit 1
  fi
}

start_server() {
  validate_files

  if ! find_free_port; then
    log_error "Could not find an available port after 20 attempts"
    exit 1
  fi

  log_ok "Using port: $PORT"
  log_info "Serving: $WEBUI_DIR"

  if command -v python3 >/dev/null 2>&1; then
    log_info "Backend: python3 http.server"
    python3 -m http.server "$PORT" --directory "$WEBUI_DIR" > "$LOG_FILE" 2>&1 &
    SERVER_PID=$!
  elif command -v python >/dev/null 2>&1; then
    log_info "Backend: python http.server"
    python -m http.server "$PORT" --directory "$WEBUI_DIR" > "$LOG_FILE" 2>&1 &
    SERVER_PID=$!
  elif command -v npx >/dev/null 2>&1; then
    log_info "Backend: npx serve"
    npx serve "$WEBUI_DIR" -l "$PORT" --no-clipboard > "$LOG_FILE" 2>&1 &
    SERVER_PID=$!
  else
    log_error "No HTTP server available. Install python3 or Node.js/npm."
    exit 1
  fi

  echo "$SERVER_PID" > "$PID_FILE"

  local waited=0
  while [ $waited -lt 30 ]; do
    if ! kill -0 "$SERVER_PID" 2>/dev/null; then
      log_error "Server process exited unexpectedly. Check $LOG_FILE"
      cat "$LOG_FILE" 2>/dev/null || true
      exit 1
    fi
    if curl -s -o /dev/null "http://localhost:$PORT/" 2>/dev/null; then
      return 0
    fi
    sleep 0.5
    waited=$((waited + 1))
  done

  log_error "Server did not respond within 15 seconds. Check $LOG_FILE"
  exit 1
}

open_browser() {
  local url="http://localhost:$PORT"
  log_ok "Server running at $url"

  if [ "$(uname)" = "Darwin" ]; then
    open "$url" 2>/dev/null || true
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" 2>/dev/null || true
  elif command -v wslview >/dev/null 2>&1; then
    wslview "$url" 2>/dev/null || true
  fi

  log_info "Press Ctrl+C to stop"
}

stop_existing() {
  if [ -f "$PID_FILE" ]; then
    local old_pid
    old_pid="$(cat "$PID_FILE" 2>/dev/null || true)"
    if [ -n "$old_pid" ] && kill -0 "$old_pid" 2>/dev/null; then
      log_warn "Stopping existing server (PID: $old_pid)..."
      kill "$old_pid" 2>/dev/null || true
      sleep 1
      if kill -0 "$old_pid" 2>/dev/null; then
        kill -9 "$old_pid" 2>/dev/null || true
      fi
    fi
    rm -f "$PID_FILE"
  fi
}

main() {
  echo ""
  printf "${CYAN}  ╔══════════════════════════╗${NC}\n"
  printf "${CYAN}  ║   Skills4Coder · 能力树   ║${NC}\n"
  printf "${CYAN}  ╚══════════════════════════╝${NC}\n"
  echo ""

  local action="${1:-start}"

  case "$action" in
    start)
      stop_existing
      start_server
      open_browser
      wait "$SERVER_PID" 2>/dev/null || true
      ;;
    stop)
      stop_existing
      log_ok "Server stopped"
      ;;
    restart)
      stop_existing
      start_server
      open_browser
      wait "$SERVER_PID" 2>/dev/null || true
      ;;
    status)
      if [ -f "$PID_FILE" ]; then
        local pid
        pid="$(cat "$PID_FILE" 2>/dev/null || true)"
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
          log_ok "Server running (PID: $pid) at http://localhost:$PORT"
        else
          log_warn "Stale PID file. Server is not running."
          rm -f "$PID_FILE"
        fi
      else
        log_warn "Server is not running"
      fi
      ;;
    *)
      echo "Usage: $0 {start|stop|restart|status}"
      echo ""
      echo "Commands:"
      echo "  start    Start the webui server (default)"
      echo "  stop     Stop the running server"
      echo "  restart  Restart the server"
      echo "  status   Check if server is running"
      echo ""
      echo "Environment:"
      echo "  WEBUI_PORT  Port to use (default: 8420)"
      exit 0
      ;;
  esac
}

main "$@"
