# Stage 1: Build Stage
FROM node:20-alpine AS builder

# Set /app as the working directory inside the container.
WORKDIR /app

# Vite exposes environment variables to the frontend at build time.
# The default API URL is /api, so requests go through Nginx.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies required to build the React application.
RUN npm install

# Copy the remaining frontend source code into the container.
COPY . .

# Build the React/Vite application.
# The production-ready static files are generated in /app/dist.
RUN npm run build

# Use Nginx as a lightweight web server for the production build.
FROM nginx:alpine AS runtime

# Replace Nginx's default configuration with our custom configuration.
# This configuration serves the React app and forwards /api requests
# to the backend container.
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy only the compiled frontend files from the builder stage.
# The source code and Node.js are not included in the final image.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for HTTP traffic.
EXPOSE 80

# Start Nginx in the foreground.
# "daemon off;" keeps Nginx running as the main container process.
CMD ["nginx", "-g", "daemon off;"]