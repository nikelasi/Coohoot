#!/bin/bash
while true; do
  cd /var/www/html && php artisan schedule:run >> /dev/null 2>&1
  sleep 60
done