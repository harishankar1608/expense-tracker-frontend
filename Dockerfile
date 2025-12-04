# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=24.11.1-alpine
ARG NGINX_VERSION=alpine3.22

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION} as base


# Set working directory for all build stages.
WORKDIR /app

COPY package*.json ./

ARG BACKEND_URL

ENV REACT_APP_BACKEND_URL=$BACKEND_URL


RUN npm ci

COPY . .

# RUN --mount=type=secret,id=REACT_BACKEND_URL \
#     export REACT_BACKEND_URL=$(cat /run/secrets/REACT_BACKEND_URL) \
RUN npm run build

FROM nginxinc/nginx-unprivileged:${NGINX_VERSION}

USER nginx

COPY nginx.conf /etc/nginx/nginx.conf

# copy | set ownership to ngnix for copied files | copy build file from src to dst
COPY --chown=nginx:nginx --from=base /app/build /usr/share/nginx/html

EXPOSE 3000

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]

CMD ["-g", "daemon off;"]



