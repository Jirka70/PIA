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

COPY package.json package-lock.json ./
# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules
# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]
