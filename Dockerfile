# Use Node.js LTS (Hydrogen) as base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install dependencies required for Playwright
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxcb1 \
    libxkbcommon0 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install chromium

# Copy the rest of the application
COPY . .

# Set environment variables
ENV CI=true
ENV NODE_ENV=test

# Command to run tests (can be overridden)
CMD ["npm", "run", "test:cucumber:no-open"] 
