# Use a multi-stage build to keep the runtime image small
FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies
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

# Copy the built app (standalone output includes production node_modules)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
