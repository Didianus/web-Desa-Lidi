#!/bin/bash
cd /home/z/my-project

# Auto-restart loop for Next.js dev server
while true; do
  npx next dev -p 3000
  echo "[$(date)] Next.js exited, restarting in 3 seconds..."
  sleep 3
done
