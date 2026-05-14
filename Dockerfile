# Dockerfile for XenoSolutions Billing Portal
# Multi-stage build: build with Node, serve with nginx

# ─── Build Stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (use pnpm if pnpm-lock.yaml exists, otherwise npm)
RUN npm install -g pnpm@9 2>/dev/null; \
    if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else npm install; fi

# Copy source code
COPY . .

# Build the app
ENV NODE_ENV=production
RUN npx vite build

# ─── Production Stage ────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for SPA routing (all paths serve index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000 (Coolify will map this to 3002 on the host)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

# ─── Dev Stage (optional, for local development) ─────────────────────────────
FROM node:22-alpine AS dev

WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm@9 2>/dev/null; pnpm install --frozen-lockfile
COPY . .

EXPOSE 3000

CMD ["npx", "vite", "dev", "--host", "0.0.0.0", "--port", "3000"]