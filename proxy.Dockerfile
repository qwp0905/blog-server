FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./private.key /etc/ssl/
COPY ./cert.crt /etc/ssl/

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]