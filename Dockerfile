# Multi-stage build to keep the runtime image small and deterministic
FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies (shared for builder/migrate)
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# Build the Next.js app
FROM deps AS builder
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG BETTER_AUTH_URL=http://localhost:3000
ARG DATABASE_URL=postgresql://app:app@db:5432/app
ARG SMTP_HOST=mailhog
ARG SMTP_PORT=1025
ARG SMTP_SECURE=false
ARG MAIL_FROM="Dev <dev@example.test>"
ARG BETTER_AUTH_SECRET=dev_only_change_me_but_at_least_32_chars_long
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    BETTER_AUTH_URL=$BETTER_AUTH_URL \
    DATABASE_URL=$DATABASE_URL \
    SMTP_HOST=$SMTP_HOST \
    SMTP_PORT=$SMTP_PORT \
    SMTP_SECURE=$SMTP_SECURE \
    MAIL_FROM=$MAIL_FROM \
    BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET \
    GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
    GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
COPY . .
ENV NODE_ENV=production
RUN npm run build

# ---- migrate stage (contains drizzle config + migrations + schema) ----
FROM deps AS migrate
WORKDIR /app
COPY package.json package-lock.json ./
# copy only what drizzle-kit needs
COPY drizzle.config.ts ./drizzle.config.ts
# schema imports are usually from src/
COPY src ./src
# some setups need tsconfig.json for TS path aliases
COPY tsconfig.json ./tsconfig.json

# migrations (you have these folders)
COPY migrations ./migrations
COPY db/migrations ./db/migrations

CMD ["npm","run","db:migrate"]

# Production runtime image
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start"]
