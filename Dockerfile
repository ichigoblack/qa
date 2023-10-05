FROM nginx:1.17.1-alpine

COPY --from=build-step /app/dist/nirsa-workflow/ /usr/share/nginx/html/nirsa-workflow

CMD ["nginx", "-g", "daemon off;"]