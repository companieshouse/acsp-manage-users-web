#!/bin/bash
#
# Start script for acsp-manage-users-web

PORT=3000

export NODE_PORT=${PORT}
exec node /opt/server.js -- ${PORT}