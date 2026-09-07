# Production-Ready Docker Images — Concepts

## Why dev-shaped images should not be the final production images

The earlier images were simple but not production-ready.

Typical issues with development-shaped images include:

- Unnecessary dependencies remaining in the final runtime image.
- Larger image sizes than necessary.
- The frontend being served using Vite's development or preview server instead of a dedicated web server.
- Build responsibilities and runtime responsibilities being handled in the same image stage.

---

## What Does a Multi-Stage Build Solve?

A multi-stage build separates the **build environment** from the **runtime environment**.

### Builder Stage

The builder stage contains everything required to create the application's production artifact.

It typically:

- Installs dependencies.
- Copies the application source code.
- Runs TypeScript compilation or frontend build commands.
- Generates the final production files.

This stage can be larger because it is used only during the image build process.

### Runtime Stage

The runtime stage contains only what is required to run the final application.

This makes the final image:

- Smaller.
- Cleaner.
- More secure by reducing unnecessary packages.
- Easier to maintain.
- Better suited for production.

The core idea is:

> **Build with one environment, run with another.**

### Backend Multi-Stage Build Flow

For a TypeScript backend:

```text
Builder Stage
    |
    |-- Install all dependencies
    |-- Copy source code
    |-- Compile TypeScript
    |
    └──> Generate /app/dist
              |
              v
Runtime Stage
    |
    |-- Install only production dependencies
    |-- Copy /app/dist from builder
    |
    └──> Run compiled JavaScript
```

The final runtime image does not need the complete TypeScript source code or development dependencies.

### Frontend Multi-Stage Build Flow

For a React/Vite frontend:

```text
Builder Stage
    |
    |-- Install Node.js dependencies
    |-- Copy source code
    |-- Run npm run build
    |
    └──> Generate /app/dist
              |
              v
Runtime Stage
    |
    |-- Use Nginx
    |-- Copy /app/dist
    |
    └──> Serve static frontend files
```

The final frontend image does not need Node.js, the source code, or the frontend build tools.

---

## Why Use Nginx Instead of Vite Preview?

Vite's preview server is useful for locally testing a production build. However, it is not the preferred production web-server pattern.

Nginx is a better fit because it can:

- Serve static files efficiently.
- Support SPA fallback routing.
- Act as a reverse proxy for API requests.
- Provide a single public entry point for the frontend and backend.

---

## Nginx as a Reverse Proxy

A **reverse proxy** is a server that receives client requests and forwards them to another server or service.

With Nginx in front of the application:

- The browser communicates with Nginx.
- Nginx serves the built frontend files directly.
- Requests to `/api/` are forwarded to the backend service.
- The backend does not need to be directly exposed to the browser.

This creates a cleaner architecture:

```text
Browser
   |
   | HTTP
   v
Nginx
   |
   +---- /       ---> React static files
   |
   +---- /api/   ---> Backend
                         |
                         v
                      MongoDB
```

The browser sees one public entry point, while Nginx handles communication with the backend through the Docker Compose network.

This can also simplify CORS configuration because frontend and API requests can use the same origin.

---

---

# Production-Ready Docker Images — Practical Implementation

## 1. Rewrite the Backend Dockerfile as a Multi-Stage Build

Create:

```text
server/Dockerfile
```

```dockerfile
# ============================================================
# Stage 1: Build Stage
# ============================================================
# Use Node.js to install dependencies and build the application.
FROM node:20-alpine AS builder

# Set /app as the working directory inside the container.
WORKDIR /app

# Copy package.json and package-lock.json first.
# This allows Docker to cache the dependency layer.
COPY package*.json ./

# Install all dependencies, including development dependencies
# required to compile the TypeScript application.
RUN npm install

# Copy the remaining application source code.
COPY . .

# Compile the TypeScript application.
# The compiled JavaScript files are generated in /app/dist.
RUN npm run build


# ============================================================
# Stage 2: Runtime Stage
# ============================================================
# Start with a fresh Node.js image for the production runtime.
FROM node:20-alpine AS runtime

# Set /app as the working directory inside the runtime container.
WORKDIR /app

# Copy package.json and package-lock.json into the runtime image.
COPY package*.json ./

# Install only production dependencies.
# --omit=dev prevents npm from installing devDependencies.
RUN npm install --omit=dev

# Copy only the compiled application from the builder stage.
# The source TypeScript files and development dependencies
# are not copied into the final image.
COPY --from=builder /app/dist ./dist

# Document the port used by the backend application.
EXPOSE 5000

# Start the compiled JavaScript application.
CMD ["node", "dist/server.js"]
```

## 2. Create the Nginx Configuration for the Frontend

Create:

```text
client/nginx/default.conf
```

```nginx
server {
  # Listen for HTTP requests on port 80.
  listen 80;

  # Accept requests for any hostname or domain.
  server_name _;

  # Directory containing the compiled React/Vite files.
  root /usr/share/nginx/html;

  # Use index.html as the default file.
  index index.html;

  # Handle frontend routes.
  # If the requested file does not exist, serve index.html.
  # This allows React client-side routing to work correctly.
  location / {
    try_files $uri /index.html;
  }

  # Handle API requests.
  location /api/ {
    # Forward API requests to the backend container.
    # "server" is the Docker Compose service name.
    # 5000 is the port used by the backend inside the Docker network.
    proxy_pass http://server:5000;

    # Use HTTP/1.1 when communicating with the backend.
    proxy_http_version 1.1;

    # Forward the original Host header.
    proxy_set_header Host $host;

    # Forward the client's real IP address.
    proxy_set_header X-Real-IP $remote_addr;

    # Forward the client's IP through the proxy chain.
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    # Tell the backend whether the original request used HTTP or HTTPS.
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

---

## 3. Create the Frontend Dockerfile

Create:

```text
client/Dockerfile
```

```dockerfile
# ============================================================
# Stage 1: Build Stage
# ============================================================
# Use Node.js to install dependencies and build the React app.
FROM node:20-alpine AS builder

# Set /app as the working directory inside the container.
WORKDIR /app

# Vite environment variables are embedded into the frontend
# during the build process.
#
# /api is used as the default API path so that API requests
# are handled by Nginx.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Copy package.json and package-lock.json first.
# This allows Docker to cache the dependency layer.
COPY package*.json ./

# Install dependencies required to build the React application.
RUN npm install

# Copy the remaining frontend source code.
COPY . .

# Build the React/Vite application.
# The production-ready static files are generated in /app/dist.
RUN npm run build


# ============================================================
# Stage 2: Runtime Stage
# ============================================================
# Use Nginx as the production web server for the frontend.
FROM nginx:alpine AS runtime

# Replace Nginx's default configuration with our custom configuration.
# This configuration serves the React application and forwards
# /api/ requests to the backend container.
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy only the compiled frontend files from the builder stage.
# Node.js, source code, and build dependencies are not included
# in the final runtime image.
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx listens on port 80 inside the container.
EXPOSE 80

# Start Nginx in the foreground.
# "daemon off;" keeps Nginx running as the main container process.
CMD ["nginx", "-g", "daemon off;"]
```

---

## 4. Update `docker-compose.yml` for the Production-Shaped Local Stack

```yaml
services:
  # MongoDB database container
  mongo:
    image: mongo:8

    # Automatically restart the container unless it was manually stopped.
    restart: unless-stopped

    # Persist MongoDB data outside the container.
    volumes:
      - mongo-data:/data/db

    # Expose MongoDB to the host machine for local development.
    ports:
      - '27017:27017'

  # Node.js/Express backend container
  server:
    build:
      context: ./server

    # Automatically restart the container unless it was manually stopped.
    restart: unless-stopped

    environment:
      PORT: ${SERVER_PORT}
      MONGODB_URI: ${MONGODB_URI}

    # Start the backend after the MongoDB container is started.
    depends_on:
      - mongo

    # Expose the backend port to the host machine.
    ports:
      - '${SERVER_PORT}:${SERVER_PORT}'

  # React frontend served by Nginx
  client:
    build:
      context: ./client

      # VITE_API_URL is passed to the frontend build process.
      args:
        VITE_API_URL: /api

    # Automatically restart the container unless it was manually stopped.
    restart: unless-stopped

    # Start the frontend after the backend container is started.
    depends_on:
      - server

    # Map the host port to Nginx's port 80 inside the container.
    ports:
      - '${CLIENT_PORT}:80'

# Persistent MongoDB storage.
# The data remains available even if the MongoDB container is removed.
volumes:
  mongo-data:
```

---

## 5. Complete Request Flow

The complete application flow is:

```text
                    Browser
                       |
                       | http://localhost:<CLIENT_PORT>
                       v
              ┌─────────────────┐
              │  Client/Nginx   │
              │    Port 80      │
              └────────┬────────┘
                       |
              ┌────────┴─────────┐
              |                  |
              v                  v
       Frontend Request      API Request
              |                  |
              v                  v
     React Static Files      server:5000
                                 |
                                 v
                            Node/Express
                                 |
                                 v
                              MongoDB
```
