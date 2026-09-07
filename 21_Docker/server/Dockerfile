# Stage 1: Build Stage
FROM node:20-alpine AS builder

# Set /app as the working directory inside the container.
WORKDIR /app

# Copy package.json and package-lock.json into the container.
COPY package*.json ./

# Install all dependencies, including development dependencies.
RUN npm install

# Copy the remaining application source code into the container.
COPY . .

# Build the TypeScript application.
# The build process compiles the TypeScript code into /app/dist.
RUN npm run build


# Stage 2: Runtime Stage
FROM node:20-alpine AS runtime

# Set /app as the working directory inside the runtime container.
WORKDIR /app

# Copy package.json and package-lock.json into the runtime image.
COPY package*.json ./

# Install only production dependencies.
# --omit=dev tells npm not to install devDependencies.
RUN npm install --omit=dev

# Copy only the compiled application from the builder stage.
# The build output is stored in /app/dist in the builder stage.
COPY --from=builder /app/dist ./dist

# Expose the application port.
EXPOSE 5000

# The TypeScript code has already been compiled into JavaScript
# inside the dist folder, so Node.js runs /app/dist/server.js.
CMD ["node", "dist/server.js"]