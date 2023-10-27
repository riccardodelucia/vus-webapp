#!/bin/sh

JSON_STRING='window.configs = { \
  "VITE_URL_BACKEND":"'"${VITE_URL_BACKEND}"'", \
}'
sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html

exec "$@"