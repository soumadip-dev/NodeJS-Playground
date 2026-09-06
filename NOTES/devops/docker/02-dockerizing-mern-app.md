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

# Dockerizing the MERN App — Practical Implementation

## 1. Set Up MongoDB with Docker

For MongoDB, you can use the official MongoDB image:

```text
mongo:8
```

### What Is a Docker Volume?

A Docker container is temporary. If you delete the container:

```bash
docker rm mongo
```

anything stored only inside the container can be lost.

MongoDB stores its database files inside:

```text
/data/db
```

A Docker volume allows the database files to persist independently of the container.

```text
Docker Volume                  Container

mongo-data  ───────────────→  /data/db
                                  ↑
                              MongoDB
```

The volume exists independently of the container.

For example:

```text
Container 1 → mongo-data → Container deleted

mongo-data still exists → Container 2 → same mongo-data → old database comes back
```

### Create the MongoDB Volume

Create a Docker volume named `mongo-data`:

```bash
docker volume create mongo-data
```

### Check the Available Volumes

To check the available Docker volumes:

```bash
docker volume ls
```

### Inspect the MongoDB Volume

Docker will show information about the volume, including where Docker stores it internally.

```bash
docker volume inspect mongo-data
```

### Create the MongoDB Container

Create and run the MongoDB container using the `mongo-data` volume:

```bash
docker run -d --name mongo --mount source=mongo-data,target=/data/db -p 27017:27017 mongo:8
```

Here:

- `-d` → runs the container in detached mode.
- `--name mongo` → gives the container the name `mongo`.
- `--mount source=mongo-data,target=/data/db` → mounts the `mongo-data` volume to MongoDB's data directory.
- `-p 27017:27017` → maps host port `27017` to container port `27017`.
- `mongo:8` → specifies the MongoDB image to use.

### Connect to MongoDB

The MongoDB connection URI from the host machine is:

```text
mongodb://localhost:27017
```

> You can connect to MongoDB using **MongoDB Compass** with this URI.

---

## 2. Dockerize the Backend

### Create the Backend Dockerfile

Create:

```text
server/Dockerfile
```

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### What This Dockerfile Does

- Starts from a Node.js 20 Alpine base image.
- Creates `/app` as the working directory.
- Copies the package files.
- Installs the dependencies.
- Copies the backend source code.
- Builds the TypeScript output.
- Documents port `5000`.
- Starts the backend using the default `npm start` command.

### Add `.dockerignore` for the Backend

The `.dockerignore` file prevents unnecessary files from being sent to the Docker build context.

Create:

```text
server/.dockerignore
```

Example:

```text
node_modules
dist
.env
.git
npm-debug.log
```

### Build the Backend Image

Run:

```bash
docker build -t docker-demo-server ./server
```

Here:

- `docker build` → builds a Docker image.
- `-t docker-demo-server` → gives the image a name/tag.
- `./server` → specifies the backend directory as the build context.

### Run the Backend Container

Run:

```bash
docker run -d --name server -e PORT=5000 -e MONGODB_URI="mongodb://host.docker.internal:27017/temp" -p 5000:5000 docker-demo-server
```

> If you think the MongoDB URL is `mongodb://localhost:27017`, then where does `mongodb://host.docker.internal:27017` come from? `localhost` refers to the **current container**, while `host.docker.internal` is a special Docker hostname that refers to the **host machine (your computer)**.

Here:

- `-d` → runs the container in detached mode.
- `--name server` → gives the container the name `server`.
- `-e PORT=5000` → passes the `PORT` environment variable to the container.
- `-e MONGODB_URI=...` → passes the MongoDB connection string to the container.
- `-p 5000:5000` → maps host port `5000` to container port `5000`.
- `docker-demo-server` → specifies the Docker image to use.

### Port Mapping

```text
-p 5000:5000
   │     │
   │     └── Container port (set in the Dockerfile)
   └──────── Host port (the port we want to run on)
```

---

## 3. Dockerize the Frontend

### Create the Frontend Dockerfile

Create:

```text
client/Dockerfile
```

```dockerfile
FROM node:20-alpine

WORKDIR /app

ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
```

### What This Dockerfile Does

- Starts from a Node.js 20 Alpine base image.
- Accepts a build-time frontend API URL.
- Sets the API URL as an environment variable.
- Copies the package files.
- Installs frontend dependencies.
- Copies the Vite source code.
- Builds the production bundle.
- Documents port `5173`.
- Starts Vite Preview on port `5173`.

> The Vite frontend needs its API URL during the build. That is why `ARG` and `ENV` are used inside the Dockerfile.

### Add `.dockerignore` for the Frontend

As with the backend, create a `.dockerignore` file in the frontend directory.

Create:

```text
client/.dockerignore
```

### Build the Frontend Image

Run:

```bash
docker build --build-arg VITE_API_URL=http://localhost:5000 -t docker-demo-client ./client
```

Here:

- `--build-arg VITE_API_URL=...` → provides the frontend API URL during the image build.
- `-t docker-demo-client` → gives the image a name/tag.
- `./client` → specifies the frontend directory as the build context.

### Run the Frontend Container

Run:

```bash
docker run -d --name client -p 5173:5173 docker-demo-client
```

Here:

- `-d` → runs the container in detached mode.
- `--name client` → gives the container the name `client`.
- `-p 5173:5173` → maps host port `5173` to container port `5173`.
- `docker-demo-client` → specifies the Docker image to use.

The frontend can then be accessed through:

```text
http://localhost:5173
```
