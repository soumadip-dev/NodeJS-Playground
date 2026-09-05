# Introduction to Docker

## What is Docker?

Docker is a containerization platform that helps us build, share, and run applications in isolated environments called **containers**. It's essential for large organizations and development teams.

***

## Why Do We Need Docker?

Traditional software development faces several challenges when working in teams.

### Example Scenario

* **Developer A has:** Node.js v16 + MongoDB v4.2 on Windows
* **Developer B needs to replicate the same environment:** on Mac

Manual setup leads to version mismatches and configuration errors.

### Common Problems

* **Manual Installation Errors** — Installing dependencies one by one
* **Version Compatibility Issues** — Different versions of the same technology
* **Environment Inconsistencies** — "It works on my machine" problem
* **Platform Dependencies** — OS-specific commands and configurations

***

## Problems Docker Solves

### The Classic Problem: "It Works on My Machine"

```text
Machine A (Developer 1)          Machine B (Developer 2)
├── Node.js v16                  ├── Node.js v20 (different version!)
├── MongoDB v4.2                 ├── MongoDB v6.0 (different version!)
└── Windows OS                   └── Mac OS (different OS!)
```

Suppose Developer 1 has Machine A (Linux) where they have built an application, and it’s working perfectly fine on their machine. However, when they share this application (e.g., via a GitHub repository) with Developer 2, it may throw errors on Machine B (Mac, Windows, or a different Linux environment) due to differences in dependency versions, configurations, or other environment-specific issues. There can be many reasons for these errors.

This is exactly the problem Docker solves — Developer 1 can containerize the application and share it with Developer 2. This ensures that the application runs consistently across different environments, regardless of the underlying system.

***

## Docker's Solution

Instead of installing dependencies individually, Docker packages:

* Application Code
* All Dependencies
* Runtime Environment
* System Libraries

Into a single, portable unit called a **Container**.

***

# Docker Core Concepts

## 1. Docker Container

A container is a single bundle/unit that contains:

* Your application
* All its dependencies
* Runtime environment

### Key Properties

* **Portable** — Can be shared across different systems
* **Lightweight** — Minimal overhead compared to Virtual Machines
* **Isolated** — Each container has its own environment

### Example

```text
Container 1: App A + Node.js v16 + Dependencies
Container 2: App B + Node.js v20 + Dependencies
```

***

## 2. Docker Image

A Docker Image is:

* An executable file containing instructions to build containers
* A static snapshot of what the environment should look like
* A blueprint for creating containers

### Relationship: Image vs Container

```text
Docker Image : Docker Container
      ↓               ↓
    Class     :     Object
  Blueprint   :    Instance
```

### Key Differences

| Docker Image                  | Docker Container              |
| ----------------------------- | ----------------------------- |
| Static snapshot               | Running instance              |
| Template/Blueprint            | Actual execution              |
| Minimal storage               | Uses system resources         |
| Shareable                     | Environment-specific          |
| Something like a class in OOP | Something like objects in OOP |

***

# Docker Installation

## For Mac/Windows

1. Visit `docker.com`
2. Download Docker Desktop
3. Install and follow the setup wizard
4. Accept recommended settings

***

## Verification Commands

```bash
# Check Docker version
docker --version

# Check if Docker is working
docker

# Test with hello-world
docker run hello-world
```

***

## Docker Desktop Features

* **Containers Tab** — View all running/stopped containers
* **Images Tab** — View all downloaded images
* **GUI Management** — Easy container management

***

# Docker Engine

On installation of Docker, it installs two things: **Docker CLI** and **Docker GUI**.

Docker Engine is the core component of the Docker platform, providing the runtime environment for containers and enabling users to build, run, and manage containerized applications.

Docker Engine consists of three parts:

1. Docker Daemon
2. REST API
3. CLI

### Workflow

When you use the Docker command-line interface (CLI) or other tools that interact with Docker, they send requests to the Docker daemon via this REST API.

The API defines the endpoints and methods available for performing various Docker operations, allowing for automation and integration of Docker functionalities within other applications and workflows.

***

# Docker Hub & Docker Lifecycle

## What is Docker Hub?

Docker Hub is like GitHub for Docker Images:

* Public collection of Docker images
* Official images for popular technologies
* Community-contributed images

***

## Accessing Docker Hub

* URL: `hub.docker.com`
* Search for images (e.g., `ubuntu`, `node`, `mongodb`)
* View documentation and usage examples

***

## Docker Lifecycle

A Dockerfile is a set of instructions used to build a Docker image (like a class in programming), which is pushed to Docker Hub (a public registry).

A Docker image can be created from a Dockerfile or downloaded from Docker Hub, and it serves as a blueprint to create a Docker container (like an instance or object), which represents the running application in a live environment.

***

# Essential Docker Commands

## 1. Docker Pull Command

Downloads an image from Docker Hub to the local system.

### Download Specific Image

```bash
docker pull hello-world
docker pull ubuntu
docker pull nginx
```

### Pull Specific Version/Tag

```bash
docker pull ubuntu:20.04
docker pull node:16
```

***

## 2. Docker Images Command

Lists all locally available images.

### List All Images

```bash
docker images
```

### Output Example

```text
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    feb5d9fea6a5   2 years ago    13.3kB
ubuntu        latest    ba6acccedd29   2 months ago   72.8MB
```

***

## 3. Docker Run Command

Creates and runs a new container from an image.

### Basic Syntax

```bash
docker run <image-name>
```

### Examples

```bash
docker run hello-world
docker run ubuntu
docker run nginx
```

> **Important:** `docker run` always creates a **NEW** container, even if one already exists.

***

# Working with Images

## Image Properties

* **Repository** — Image name (e.g., `ubuntu`, `hello-world`)
* **Tag** — Version identifier (e.g., `latest`, `v16`, `20.04`)
* **Image ID** — Unique identifier
* **Size** — Storage space used

***

## Example: Hello World Image

```bash
# Pull the image
docker pull hello-world

# Run container from image
docker run hello-world

# Output explains Docker workflow:
# 1. Docker client contacted Docker daemon
# 2. Docker daemon pulled image from Docker Hub
# 3. Docker daemon created new container
# 4. Container executed and produced output
```

***

# Working with Containers

## Container Lifecycle

```text
Image → docker run → Container (Running) → Exit → Container (Stopped)
```

## Container States

* **Running** — Currently executing
* **Stopped/Exited** — Finished execution
* **Paused** — Temporarily suspended

***

## Viewing Containers

### View Running Containers Only

```bash
docker ps
```

### View All Containers (Running + Stopped)

```bash
docker ps -a
```

### Example Output

```text
CONTAINER ID   IMAGE         COMMAND       CREATED         STATUS                     NAMES
abc123def456   ubuntu        "/bin/bash"   2 minutes ago   Exited (0) 1 minute ago    mystifying_tesla
789ghi012jkl   hello-world   "/hello"      5 minutes ago   Exited (0) 5 minutes ago   wonderful_darwin
```

***

# Interactive Mode

Docker's interactive mode allows direct interaction with a running container's shell, enabling real-time command execution and interaction with its file system.

This mode is particularly useful for debugging, development, and troubleshooting within a container.

## Running Containers Interactively

Use the `-it` flag for interactive terminal access:

```bash
# Run Ubuntu container in interactive mode
docker run -it ubuntu
```

### Breakdown

```text
-i : Interactive mode (keep STDIN open)
-t : Allocate pseudo-TTY (terminal)
```

***

## Inside Container Environment

```bash
# You're now inside Ubuntu container
root@abc123def456:/#

# Container has its own file system
ls                    # List files in container
mkdir test-folder     # Create directory
cd test-folder        # Navigate directories
printenv              # View environment variables

# Exit container
exit
```

### Key Points

* Container has isolated file system
* Changes inside container don't affect host
* Container stops when you exit interactive mode
* Each container gets unique ID and random name

***

# Detached Mode and Attached Mode

Docker containers can run in two primary modes:

* **Attached mode** (also known as foreground mode)
* **Detached mode** (also known as background mode)

***

## Attached Mode

In attached mode, the container's standard input, output, and error streams are directly connected to your terminal. You see the container's output in real-time in your terminal window.

This mode is suitable for interactive tasks, debugging, or applications that require direct user interaction or need to be stopped when the terminal is closed.

By default, `docker run` starts a container in attached mode unless specified otherwise.

### Example

```bash
docker run nginx
```

***

## Detached Mode

In detached mode, the container runs in the background, independent of your terminal session.

You do not see the container's output directly in your terminal, and your terminal remains free for other commands.

This mode is ideal for services or applications that need to run continuously without requiring immediate attention or user interaction.

You typically use the `-d` or `--detach` flag with `docker run` to start a container in detached mode.

### Example

```bash
docker run -d nginx
```

This command starts an Nginx web server in a container in the background. You will receive the container ID as confirmation, and your terminal will be available for other tasks.

***

## Attaching to and Detaching from a Detached Container

You can later attach to a running detached container to view its logs or interact with it using the `docker attach` command.

### Example

```bash
docker attach <container_id_or_name>
```

To detach from a container without stopping it, you typically use the key sequence:

```text
Ctrl+P followed by Ctrl+Q
```

***

# Difference Between Virtual Machines and Docker Containers

VMs are heavy, fully isolated machines with their own OS; Docker containers are lightweight, share the host OS kernel, and run applications faster with minimal resources.

***

# What Is an Operating System (OS) Kernel?

The Operating System (OS) Kernel is the core part of any operating system. It acts as a bridge between hardware and software.

It decides who (which process) gets to use what (CPU, memory, files, etc.) and when.

### Where It Sits in the System

```text
Your Applications
(e.g., Chrome, VSCode)
        ↓
OS Kernel
(Manages resources)
        ↓
Hardware
(CPU, RAM, Disk)
```

***

# What Actually Happens When You Pull a Docker Image?

When you pull an image like Ubuntu or Windows Server, you are not downloading the full operating system.

You are downloading only:

> Docker image = lightweight environment, not a full OS.

It's like:

> "A fake mini Ubuntu that looks and behaves like Ubuntu inside, but borrows the kernel from your host machine."

***

## How It Actually Runs

When you run a container, it uses:

So inside the container, you'll see:

```bash
$ cat /etc/os-release
Ubuntu 22.04
```

…but it's not actually Ubuntu OS — it's your host's Linux kernel + Ubuntu's userland.

***

# In Case of macOS

## The Logic in Simple Terms

### 1. Why Docker Desktop Needs a VM on macOS

### 2. How Docker Desktop Actually Does It

When you start Docker Desktop:

***

# Container Management

## Starting Existing Containers

### Start Stopped Container by Name

```bash
docker start <container-name>
```

### Start Stopped Container by ID

```bash
docker start <container-id>
```

### Example

```bash
docker start mystifying_tesla
docker start abc123def456
```

***

## Stopping Running Containers

### Stop Running Container by Name

```bash
docker stop <container-name>
```

### Stop Running Container by ID

```bash
docker stop <container-id>
```

### Example

```bash
docker stop mystifying_tesla
docker stop abc123def456
```

***

## Key Differences

| Command        | Purpose                          | Creates New Container? |
| -------------- | -------------------------------- | ---------------------- |
| `docker run`   | Create and start new container   | ✅ Yes                  |
| `docker start` | Start existing stopped container | ❌ No                   |
| `docker stop`  | Stop running container           | ❌ No                   |

***

# Container Management Workflow

```bash
# 1. Create and run new container
docker run -it ubuntu

# Container starts, you work inside, then exit

# 2. Container is now stopped, but exists
docker ps -a

# Shows stopped container

# 3. Restart the same container
docker start <container-name>

# 4. Stop when done
docker stop <container-name>
```

***

# Practical Examples

## Example 1: Hello World Container

```bash
# Pull image
docker pull hello-world

# Run container
docker run hello-world

# Check images
docker images

# Check containers
docker ps -a
```

***

## Example 2: Ubuntu Interactive Container

```bash
# Run Ubuntu in interactive mode
docker run -it ubuntu

# Inside container:
root@container:/# ls
root@container:/# mkdir my-app
root@container:/# echo "Hello Docker" > test.txt
root@container:/# cat test.txt
root@container:/# exit

# Back to host system
# Container is now stopped
docker ps -a
```

***

## Example 3: Container Lifecycle Management

```bash
# Start stopped container
docker ps -a  # Find container name
docker start tender_newton

# Check running containers
docker ps

# Stop the container
docker stop tender_newton

# Verify it's stopped
docker ps
```

***

# Docker Desktop Usage

## Containers Tab

* View all containers (running/stopped)
* See container status, names, IDs
* Start/stop containers with GUI
* Access container logs and stats

***

## Images Tab

* View all downloaded images
* See image sizes, tags, IDs
* Green dot indicates image is being used by containers
* Delete unused images

***

## Container Details

Click a container to see detailed information:

* View logs
* View environment variables
* Access file system (in some cases)
* Monitor resource usage

***

# Best Practices

## 1. Image Management

```bash
# Always check available images
docker images

# Remove unused images to save space
docker rmi <image-name>

# Pull specific versions when needed
docker pull ubuntu:20.04
```

***

## 2. Container Naming

Assign custom names to containers:

```bash
docker run --name my-ubuntu -it ubuntu
docker run --name my-app-container -it node:16
```

***

## 3. Resource Cleanup

### Remove Stopped Containers

```bash
docker rm <container-name>
```

### Remove All Stopped Containers

```bash
docker container prune
```

### Remove Unused Images

```bash
docker image prune
```

***

# What's Next?

This transcript covered the fundamental concepts of Docker. Future topics will include:

* Dockerization of custom applications
* Dockerfile creation and best practices
* Port mapping and networking
* Environment variables
* Volume mounting
* Docker Compose for multi-container applications
* Docker networking concepts
* Container troubleshooting

***

# Summary

Docker solves the **"It works on my machine"** problem by:

* Packaging applications with their dependencies
* Standardizing deployment across environments
* Isolating applications in lightweight containers
* Simplifying team collaboration and deployment

## Key Components

| Component             | Description           |
| --------------------- | --------------------- |
| **Docker Images**     | Blueprints/Templates  |
| **Docker Containers** | Running Instances     |
| **Docker Hub**        | Public Image Registry |
| **Docker Desktop**    | GUI Management Tool   |

## Essential Commands

```bash
docker pull <image>     # Download image
docker images           # List images
docker run <image>      # Create and run container
docker ps               # List running containers
docker ps -a            # List all containers
docker start <name>     # Start stopped container
docker stop <name>      # Stop running container
```
