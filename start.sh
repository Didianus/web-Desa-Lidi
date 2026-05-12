#!/bin/bash
# Start MariaDB if not running
export LD_LIBRARY_PATH=/home/z/mysql/lib:$LD_LIBRARY_PATH

if ! ss -tlnp 2>/dev/null | grep -q ":3306 "; then
  echo "Starting MariaDB..."
  rm -f /tmp/mysqld/mysqld.sock /tmp/mysqld/mysqld.pid
  /home/z/mysql/bin/mysqld \
    --datadir=/home/z/mysql/data \
    --basedir=/home/z/mysql \
    --socket=/tmp/mysqld/mysqld.sock \
    --port=3306 \
    --user=z \
    --skip-grant-tables \
    --pid-file=/tmp/mysqld/mysqld.pid \
    --log-error=/tmp/mysqld/error.log \
    --innodb_buffer_pool_size=32M \
    --max_connections=5 \
    --performance_schema=OFF &

  # Wait for MariaDB to be ready
  for i in $(seq 1 15); do
    if /home/z/mysql/bin/mysql -u root --socket=/tmp/mysqld/mysqld.sock -e "SELECT 1;" &>/dev/null; then
      echo "MariaDB is ready!"
      break
    fi
    sleep 1
  done
fi

# Start Next.js with explicit DATABASE_URL
export DATABASE_URL="mysql://root:@localhost:3306/desa_db"
exec npx next dev -p 3000
