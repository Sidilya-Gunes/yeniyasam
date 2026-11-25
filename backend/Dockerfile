# ==========================================
# Strapi 5 Production Dockerfile
# ==========================================
FROM node:20-alpine AS base

# Install build dependencies for better-sqlite3 and native modules
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm vips-dev git python3

WORKDIR /opt/app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install dependencies (including devDependencies required for build)
RUN npm ci

# Copy application source
COPY . .

# Build Strapi admin and TypeScript code
ENV NODE_ENV=production
RUN npm run build

# Expose Strapi port
EXPOSE 1337

# Default environment
ENV HOST=0.0.0.0
ENV PORT=1337

CMD ["npm", "run", "start"]
