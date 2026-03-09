# MERNTasks

A RESTful API for a Task Management application built with Node.js, Express, MongoDB, and TypeScript. It supports user authentication, project management, and task tracking with user-based data isolation.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Projects](#projects)
  - [Tasks](#tasks)
- [Project Structure](#project-structure)
- [Data Models](#data-models)
- [License](#license)

---

## Features

- User registration and JWT-based authentication
- Create, read, update, and delete projects
- Create, read, update, and delete tasks within projects
- Task completion state tracking
- User-based data isolation (users only access their own data)
- Cascading deletion of tasks when a project is removed
- Input validation on all endpoints
- Secure password hashing with bcryptjs

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Runtime      | Node.js                                 |
| Language     | TypeScript                              |
| Framework    | Express.js v5                           |
| Database     | MongoDB                                 |
| ODM          | Mongoose                                |
| Auth         | JSON Web Tokens (jsonwebtoken)          |
| Hashing      | bcryptjs                                |
| Validation   | express-validator                       |
| Package mgr  | pnpm                                    |

## Prerequisites

- **Node.js** v18 or later
- **pnpm** v8 or later (`npm install -g pnpm`)
- A running **MongoDB** instance (local or cloud, e.g. MongoDB Atlas)

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/jorgeadev/merntasks.git
cd merntasks

# 2. Install dependencies
pnpm install

# 3. Create your environment file
# Create a new .env file in the project root and add the variables listed below
touch .env

# 4. Start the development server
pnpm dev
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable    | Required | Default | Description                                      |
| ----------- | -------- | ------- | ------------------------------------------------ |
| `DB_MONGO`  | ✅ Yes   | —       | MongoDB connection string (e.g. `mongodb://...`) |
| `SECRET_KEY`| ✅ Yes   | —       | Secret used to sign JWT tokens                   |
| `PORT`      | ❌ No    | `4000`  | Port the HTTP server listens on                  |

Example `.env`:

```env
DB_MONGO=mongodb://localhost:27017/merntasks
SECRET_KEY=your_super_secret_key
PORT=4000
```

## Running the Project

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `pnpm dev`        | Start development server with hot-reload     |
| `pnpm typecheck`  | Run TypeScript type-checking without emitting|

The server will be available at `http://localhost:4000` (or the port you configured).

---

## API Reference

All protected routes require a valid JWT token in the `x-auth-token` header:

```
x-auth-token: <your_jwt_token>
```

Tokens are returned in the response body after a successful login or registration and expire after **24 hours**.

### Authentication

#### Login

```
POST /api/auth
```

**Body**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response `200`**

```json
{
  "token": "<jwt_token>"
}
```

---

#### Get current user

```
GET /api/auth
```

*Requires authentication.*

**Response `200`**

```json
{
  "_id": "...",
  "name": "Jane Doe",
  "email": "user@example.com"
}
```

---

### Users

#### Register a new user

```
POST /api/users
```

**Body**

```json
{
  "name": "Jane Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response `200`**

```json
{
  "token": "<jwt_token>"
}
```

---

### Projects

All project routes require authentication.

#### Create a project

```
POST /api/projects
```

**Body**

```json
{
  "name": "My Project"
}
```

**Response `200`**

```json
{
  "_id": "...",
  "name": "My Project",
  "createdBy": "<user_id>",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

#### List all projects

```
GET /api/projects
```

Returns all projects belonging to the authenticated user.

**Response `200`**

```json
[
  {
    "_id": "...",
    "name": "My Project",
    "createdBy": "<user_id>"
  }
]
```

---

#### Update a project

```
PUT /api/projects/:id
```

**Body**

```json
{
  "name": "Updated Project Name"
}
```

**Response `200`**

```json
{
  "_id": "...",
  "name": "Updated Project Name",
  "createdBy": "<user_id>"
}
```

---

#### Delete a project

```
DELETE /api/projects/:id
```

Deletes the project and all tasks associated with it.

**Response `200`**

```json
{
  "msg": "Project deleted"
}
```

---

### Tasks

All task routes require authentication.

#### Create a task

```
POST /api/tasks
```

**Body**

```json
{
  "name": "Design mockups",
  "projectId": "<project_id>"
}
```

**Response `200`**

```json
{
  "_id": "...",
  "name": "Design mockups",
  "state": false,
  "projectId": "<project_id>",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

#### Get tasks by project

```
GET /api/tasks?projectId=<project_id>
```

**Response `200`**

```json
[
  {
    "_id": "...",
    "name": "Design mockups",
    "state": false,
    "projectId": "<project_id>"
  }
]
```

---

#### Update a task

```
PUT /api/tasks/:id
```

**Body**

```json
{
  "name": "Design mockups",
  "state": true,
  "projectId": "<project_id>"
}
```

**Response `200`**

```json
{
  "_id": "...",
  "name": "Design mockups",
  "state": true,
  "projectId": "<project_id>"
}
```

---

#### Delete a task

```
DELETE /api/tasks/:id
```

**Response `200`**

```json
{
  "msg": "Task deleted"
}
```

---

## Project Structure

```
merntasks/
├── src/
│   ├── config/
│   │   └── database.ts        # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.ts  # Login & get current user logic
│   │   ├── project-controller.ts
│   │   ├── task-controller.ts
│   │   └── userController.ts  # User registration logic
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication middleware
│   ├── models/
│   │   ├── project.ts         # Project Mongoose model
│   │   ├── task.ts            # Task Mongoose model
│   │   └── user.ts            # User Mongoose model
│   ├── plugins/
│   │   └── envs-plugin.ts     # Environment variable parsing
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── tasks.ts
│   │   └── users.ts
│   └── index.ts               # Application entry point
├── .env                       # Environment variables (not committed)
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

## Data Models

### User

| Field       | Type   | Description                    |
| ----------- | ------ | ------------------------------ |
| `name`      | String | User's display name (required) |
| `email`     | String | Unique email address (required)|
| `password`  | String | Bcrypt-hashed password         |
| `createdAt` | Date   | Auto-generated timestamp       |
| `updatedAt` | Date   | Auto-generated timestamp       |

### Project

| Field       | Type     | Description                         |
| ----------- | -------- | ----------------------------------- |
| `name`      | String   | Project name (required)             |
| `createdBy` | ObjectId | Reference to the owning User        |
| `createdAt` | Date     | Auto-generated timestamp            |
| `updatedAt` | Date     | Auto-generated timestamp            |

### Task

| Field       | Type     | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| `name`      | String   | Task description (required)                    |
| `state`     | Boolean  | Completion status (`false` = pending, default) |
| `projectId` | ObjectId | Reference to the parent Project                |
| `createdAt` | Date     | Auto-generated timestamp                       |
| `updatedAt` | Date     | Auto-generated timestamp                       |

## License

This project is licensed under the **MIT License**.
