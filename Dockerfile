FROM node:latest

ENV APP_ROOT /dashboard

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

RUN npm install
RUN npm run build

ENV HOST 0.0.0.0
ENV PORT 3000