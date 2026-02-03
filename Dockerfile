FROM nginx:alpine

EXPOSE 10001

COPY . /usr/share/nginx/html
