# Multi-stage build to keep the runtime image small and deterministic
FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies (shared for builder and runtime)
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm install --include=dev

# Build the Next.js app
FROM deps AS builder
# Default build-time env so docker builds succeed even without a .env file
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

# Production runtime image
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy app manifest so Next.js can read metadata at runtime
COPY package.json package-lock.json ./
# Copy production dependencies built in the deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy build output (server and static assets)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

# Use Next.js production server
CMD ["npm", "run", "start"]
