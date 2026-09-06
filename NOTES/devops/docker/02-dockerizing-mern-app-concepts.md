# Dockerizing the MERN App — Concepts

## 1. MERN Components

A MERN application consists of multiple runtime services:

- **Client** — React + Vite frontend
- **Server** — Express + TypeScript backend
- **Mongo** — MongoDB database

Docker provides each service with a consistent, isolated runtime environment.

---

## 2. Stateless vs Stateful

### Stateless

The **frontend and backend** are **stateless** because they do not own persistent business data. If a container is removed and recreated, the application can still be rebuilt and replaced as long as the image and configuration remain available.

### Stateful

**MongoDB** is **stateful** because it owns persistent application data that should not disappear when the container is recreated.

- The container can be replaced.
- Database data must survive container replacement.
- Persistent storage is required, typically through a **Docker volume**.

The practical rule is simple:

- The **Mongo container** can be replaced.
- The **Mongo data** should stay outside that container's disposable layer.

---

## 3. Dockerfile

A Dockerfile defines how an application image is built.

Typical structure:

```text
FROM → WORKDIR → COPY → RUN → EXPOSE → CMD
```

### `FROM`

This selects the base image. For the Node.js services in this case, it is `node:20-alpine`.

### `WORKDIR`

This sets the working directory inside the image. All following commands run relative to that folder.

It keeps the image organized and avoids writing long absolute paths in every step.

### `COPY`

This copies files from the project into the image.

A very useful Docker habit is:

1. Copy `package.json` and `package-lock.json` first.
2. Install dependencies.
3. Copy the rest of the source code.

This order helps Docker reuse cached layers when dependencies do not change.

### `RUN`

This executes build-time commands inside the image, such as:

- `npm install`
- `npm run build`

These commands happen while the image is being created, not when the container is already running for users.

### `EXPOSE`

This documents which port the application listens on inside the container.

Important distinction:

- `EXPOSE` documents the internal port.
- It does **not** publish the port to the host by itself.

### `CMD`

This defines the default startup command for the container.

This is what runs when the container starts.

---

## 4. Mapping the Backend to a Docker Image

The backend is an Express + TypeScript application.

To run it inside Docker, we need to:

- Use a Node.js base image.
- Create a working folder.
- Copy the package files.
- Install the dependencies.
- Copy the source code.
- Build the TypeScript code.
- Expose port `5000`.
- Start the backend server.

Although it is intentionally simple, the backend image is not yet optimized for production size.

---

## 5. Mapping the Frontend to a Docker Image

The frontend is also a Node.js application, but it works differently from the backend.

The frontend Dockerfile needs to:

- Use a Node.js base image.
- Get the frontend API URL.
- Install dependencies.
- Copy the source code.
- Build the Vite application.
- Serve the built application.

This is a simple way to use `vite preview` to serve the frontend for basic testing. Later, it can be replaced with Nginx.

---

## 6. Why `VITE_API_URL` Matters

Frontend configuration is not the same as backend configuration.

The **backend reads environment variables at runtime** when the **server process starts**.

A Vite frontend works differently.

Variables starting with `VITE_` are added to the frontend when the application is built. So, the frontend needs the API URL during the Docker image build.

These two cases are different:

- **Backend runtime config** → read when the server starts.
- **Frontend build config** → embedded when the frontend is built.

---
