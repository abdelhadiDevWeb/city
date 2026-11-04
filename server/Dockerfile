FROM oven/bun:1-slim

WORKDIR /app

# Copy dependency files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Environment
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["bun", "index.ts"]

