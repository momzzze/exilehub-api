#!/bin/sh
set -e

echo "Waiting for database to be ready..."

# Keep trying to connect until it's truly ready
until npx prisma db execute --url "$DATABASE_URL" --command "SELECT 1;" >/dev/null 2>&1; do
  echo "Database not ready yet... waiting"
  sleep 1
done

echo "Database is ready!"

npx prisma migrate deploy
npx prisma generate

exec "$@"
