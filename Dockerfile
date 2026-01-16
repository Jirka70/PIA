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
