#!/bin/bash
set -eu

git checkout main
git pull
cd frontend
npm ci
npm run build
cd ../scrapper
go build
../update_data.sh