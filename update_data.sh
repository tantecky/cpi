#!/bin/bash
set -eu

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd ${SCRIPTPATH}
SCRAPPER=$(realpath scrapper/scrapper)
cd ./frontend/dist/cpi/assets
$SCRAPPER