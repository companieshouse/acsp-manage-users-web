#!/usr/bin/env bash

# This script updates the local Redis session store with ACSP data required for
# the acsp-manage-users-web module to function. It takes a session cookie/SID and
# the target ACSP number you would like to manage. This script exists primarily to
# test the implementation of the ACSP unlock accounts work, where an internal
# admin will be permitted to add new users to an ACSP if no owner has access.

set -euo pipefail

COOKIE="${COOKIE:-${1:-}}"
ACSP="${ACSP:-${2:-}}"
REDIS_HOST="${REDIS_HOST:-127.0.0.1}"
REDIS_PORT="${REDIS_PORT:-6379}"

if [[ -z "$COOKIE" || -z "$ACSP" ]]; then
  echo "Usage: COOKIE='<session_cookie>' ACSP='<acsp_number>' $0"
  echo "   or: $0 '<session_cookie>' '<acsp_number>'"
  exit 1
fi

SID="${COOKIE:0:28}"
RAW="$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" --raw GET "$SID")"

if [[ -z "$RAW" ]]; then
  echo "No Redis session found for SID: $SID"
  exit 1
fi

NEW="$(
node - "$RAW" "$ACSP" <<'NODE'
const m = require("msgpack5")();
const s = m.decode(Buffer.from(process.argv[2], "base64"));
const acspNumber = process.argv[3];

const signinInfo = s.signin_info;
signinInfo.acsp_number = acspNumber;

const tokenPermissions = signinInfo.user_profile.token_permissions;
tokenPermissions.acsp_number = acspNumber;
tokenPermissions.acsp_members = "read";
tokenPermissions.acsp_owners = "create,update,delete";
tokenPermissions.acsp_admins = "create,update,delete";
tokenPermissions.acsp_standard = "create,update,delete";


process.stdout.write(m.encode(s).toString("base64"));
NODE
)"

redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" SET "$SID" "$NEW" KEEPTTL >/dev/null

echo "Updated session data to include the following ACSP data:"
echo "- signin_info.acsp_number: '$ACSP'"
echo "- signin_info.user_profile.token_permissions.acsp_number: '$ACSP'"
echo "- signin_info.user_profile.token_permissions.acsp_members: 'read'"
echo "- signin_info.user_profile.token_permissions.acsp_owners: 'create,update,delete'"
echo "- signin_info.user_profile.token_permissions.acsp_admins: 'create,update,delete'"
echo "- signin_info.user_profile.token_permissions.acsp_standard: 'create,update,delete'"
echo "Session ID: '$SID'"
