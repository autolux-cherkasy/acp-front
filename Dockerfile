# syntax=docker/dockerfile:1

# ---- deps: install once, reused by the build stage ----
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@11.5.2
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---- build: bake NEXT_PUBLIC_* into the client bundle ----
FROM node:22-alpine AS build
WORKDIR /app
RUN npm install -g pnpm@11.5.2
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time only — see .env.example. Defaults keep a plain `docker build` safe;
# NEXT_PUBLIC_ENABLE_DEV_AUTH=true is refused by scripts/assert-prod-env.mjs
# (runs automatically as the `prebuild` script, below).
ARG NEXT_PUBLIC_API_URL=/api/v1
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_ENABLE_DEV_AUTH=false
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID \
    NEXT_PUBLIC_ENABLE_DEV_AUTH=$NEXT_PUBLIC_ENABLE_DEV_AUTH \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN pnpm build

# ---- runtime: Next.js standalone output only ----
FROM node:22-alpine AS runtime
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 -G nodejs nextjs

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# 127.0.0.1, not localhost: busybox wget resolves "localhost" to ::1 first and
# the app only binds IPv4, so "localhost" fails with connection refused.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

# API_PROXY_TARGET and GOOGLE_CLIENT_ID are runtime-only — supplied via container
# env (docker-compose), not baked in here. See .env.example.
CMD ["node", "server.js"]
