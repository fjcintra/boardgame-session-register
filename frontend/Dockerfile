# Stage 1: Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Copy package descriptors first to optimize layer caching
COPY package.json package-lock.json ./

# Install dependencies (frozen-lockfile equivalent for npm)
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Set Vite API URL to target /api (which is proxied by Nginx)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build the production bundle (generates output in /app/dist)
RUN npm run build

# Stage 2: Production serve stage
FROM nginx:1.25-alpine

# Copy static assets from build stage to Nginx default HTML root
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
