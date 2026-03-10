#!/bin/sh
set -e

echo "Pushing database schema..."
npx prisma db push --accept-data-loss 2>&1 || echo "Schema push failed, DB may already be up to date"

echo "Starting server..."
exec node server.js
