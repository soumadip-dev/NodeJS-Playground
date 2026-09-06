# Linux File System

The Linux file system is organized as a hierarchical tree structure. The top-level directory is `/`, called the **root directory**.

A simplified Linux file system looks like this:

```text
/
├── home
├── root
├── etc
├── var
├── usr
├── opt
├── tmp
├── dev
└── proc
```

## Important Linux Directories

### 1. `/home`

The `/home` directory contains the home directories of normal users.

Each user typically has their own directory inside `/home`.

Examples:

```text
/home/soumadip/
/home/ankit/
```

For example:

```text
/home/soumadip/Desktop
/home/ankit/Documents
```

---

### 2. `/root`

`/root` is the **home directory of the root user** (the system administrator).

It is different from `/`, which is the root of the entire file system.

```text
/root
```

---

### 3. `/etc`

The `/etc` directory contains **system-wide and application configuration files**.

This directory is especially important in DevOps and system administration.

Common examples:

```text
/etc/ssh/
/etc/nginx/
```

- `/etc/ssh/` → SSH configuration
- `/etc/nginx/` → Nginx configuration

Other important configuration files may include:

```text
/etc/hosts
/etc/fstab
/etc/passwd
/etc/environment
```

---

### 4. `/var`

The `/var` directory contains **variable data**—data that changes while the system is running.

This directory is very important in DevOps, especially when working with **logs and application data**.

Important subdirectories include:

```text
/var/log/
/var/lib/
```

- `/var/log/` → System and application logs
- `/var/lib/` → Persistent data maintained by applications and services

For example:

```text
/var/log/nginx/
```

may contain Nginx access and error logs.

---

### 5. `/opt`

The `/opt` directory is commonly used for **optional or third-party software**.

It is often a suitable location for manually installed applications that are not managed by the system package manager.

Example:

```text
/opt/myApp/
```

---

### 6. `/tmp`

The `/tmp` directory is used for **temporary files** created by applications and users.

Example:

```text
/tmp/my-file.txt
```

Do not store important or permanent data here because temporary files may be automatically removed by the system.

---

---

# Essential Linux Commands

## `pwd`

**Print Working Directory**

Displays the absolute path of the current working directory.

```bash
pwd
```

Output:

```text
/home/user/documents
```

---

## `cd`

**Change Directory**

Used to move between directories.

### Move into a directory

```bash
cd projects
```

### Move to the parent directory

```bash
cd ..
```

### Move to the home directory

```bash
cd ~
```

### Move to the previous directory

```bash
cd -
```

---

## `ls`

**List**

Displays files and directories in the current directory.

```bash
ls
```

Example output:

```text
notes.txt  photos/  projects/
```

### Useful options

```bash
ls -l
```

Displays detailed information.

```bash
ls -la
```

Displays detailed information, including hidden files.

---

## `mkdir`

**Make Directory**

Creates a new directory.

```bash
mkdir new_project
```

### Create nested directories

```bash
mkdir -p projects/frontend/src
```

The `-p` option creates parent directories if they do not already exist.

---

## `touch`

Creates a new empty file.

If the file already exists, `touch` updates its timestamps without changing its contents.

```bash
touch script.js
```

---

## `cp`

**Copy**

Copies files or directories from one location to another.

### Copy a file

```bash
cp report.txt report_backup.txt
```

### Copy a file to another directory

```bash
cp report.txt /home/user/documents/
```

### Copy a directory recursively

```bash
cp -r project project_backup
```

---

## `mv`

**Move**

Moves a file or directory to another location.

It can also be used to rename files or directories.

### Rename a file

```bash
mv old_name.txt new_name.txt
```

### Move a file to another directory

```bash
mv new_name.txt /home/user/documents/archive/
```

---

## `rm`

**Remove**

Deletes files.

```bash
rm temporary_file.log
```

### Delete a directory and its contents

```bash
rm -r folder_name
```

> Be careful with `rm`, especially `rm -r`, because deleted files are generally not moved to a recycle bin.

---

## `rmdir`

Removes a directory **only if the directory is empty**.

```bash
rmdir empty_folder
```

If the directory contains files or other directories, `rmdir` will fail.

For a non-empty directory, use:

```bash
rm -r folder_name
```

---

## `cat`

Displays the contents of a file.

```bash
cat grocery_list.txt
```

Output:

```text
Milk
Eggs
Bread
```

It can also be used to concatenate multiple files.

---

## `nano`

Opens a file in the **Nano text editor**.

```bash
nano filename
```

For example:

```bash
nano script.js
```

---

## `head`

Displays the beginning of a file.

### Display the first 2 lines

```bash
head -n 2 grocery_list.txt
```

Output:

```text
Milk
Eggs
```

---

## `tail`

Displays the end of a file.

### Display the last 2 lines

```bash
tail -n 2 grocery_list.txt
```

Output:

```text
Eggs
Bread
```

---

## `tail -f`

Continuously displays new lines as they are added to a file.

This is particularly useful for **monitoring logs in real time**.

```bash
tail -f /var/log/application.log
```

For example, when a new log entry is written to the file, it will immediately appear in the terminal.

Press:

```text
Ctrl + C
```

to stop following the file.

---
