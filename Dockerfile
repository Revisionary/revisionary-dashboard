FROM node:latest

# Create the directory
ENV APP_ROOT /dashboard
RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}

# NPM Build Files
COPY package.json ${APP_ROOT}
COPY package-lock.json ${APP_ROOT}
COPY nuxt.config.js ${APP_ROOT}
COPY jsconfig.json ${APP_ROOT}
COPY README.md ${APP_ROOT}
RUN npm ci

# Source Files
ADD ./src ${APP_ROOT}/src
# RUN npm run build

# Environment Variables
ENV HOST 0.0.0.0
ENV PORT 3000
