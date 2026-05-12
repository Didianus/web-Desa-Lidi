#!/bin/bash
# Custom dev script with auto-restart for sandbox environment
cd /home/z/my-project

# Run prisma setup
bun run db:push 2>/dev/null || true

# Auto-restart loop
while true; do
  echo "[$(date)] Starting Next.js dev server..."
  bun run db:push 2>/dev/null || true
  npx next dev -p 3000
  EXIT_CODE=$?
  echo "[$(date)] Next.js exited with code $EXIT_CODE, restarting in 3 seconds..."
  sleep 3
done
