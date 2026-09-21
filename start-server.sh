#!/usr/bin/env bash
# Aşçılık ders programını yerel olarak sunar.
# Kullanım:  bash start-server.sh            (varsayılan port 8080)
#            PORT=9000 bash start-server.sh
cd "$(dirname "$0")" || exit 1
exec node server.js
