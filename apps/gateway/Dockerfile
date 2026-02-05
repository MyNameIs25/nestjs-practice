FROM node:24-alpine AS development

ENV CI=true

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm
COPY apps/gateway apps/gateway
COPY libs libs

RUN pnpm install

RUN pnpm exec nest build gateway

FROM node:24-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV CI=true

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/gateway/package.json apps/gateway/package.json

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development /usr/src/app/dist/apps/gateway ./dist/apps/gateway
COPY proto proto

CMD ["node", "dist/apps/gateway/main"]
