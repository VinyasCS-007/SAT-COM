# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Start dev server (hot reload)
CMD ["npm", "run", "dev"]