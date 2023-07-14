FROM nginx:latest
USER root
WORKDIR /app
COPY dist /app/dist
COPY deploy/docker/conf/nginx/nginx.conf /etc/nginx/
COPY deploy/docker/conf/nginx/dauthweb.conf /etc/nginx/conf.d/
RUN mv /app/dist /www
EXPOSE 9810

