FROM nginx:stable-alpine
COPY dist /usr/share/nginx/html

COPY entrypoint.sh /docker-entrypoint.d/my_entrypoint.sh
COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN chmod +x /docker-entrypoint.d/my_entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.d/my_entrypoint.sh"]
CMD ["nginx"]
