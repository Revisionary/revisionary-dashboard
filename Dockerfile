FROM node:14-alpine

# Create the directory
ENV APP_ROOT /dashboard
RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}

# NPM Build Files
COPY package.json ${APP_ROOT}
COPY yarn.lock ${APP_ROOT}
COPY nuxt.config.js ${APP_ROOT}
COPY jsconfig.json ${APP_ROOT}
RUN yarn --frozen-lockfile --production

# Source Files
ADD ./src ${APP_ROOT}/src
RUN yarn build

# Environment Variables
ENV HOST 0.0.0.0
ENV PORT 3000
ENV START_COMMAND start

# Entrypoint
ENTRYPOINT yarn ${START_COMMAND}
