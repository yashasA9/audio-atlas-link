# CodeVerse

> A real-time collaborative code editor with multi-language execution, an integrated terminal, live preview, and an AI-powered coding assistant.

## Overview

CodeVerse is a browser-based collaborative development environment designed to bring core coding workflow features into a single workspace.

Users can edit code using the Monaco Editor, execute programs in multiple languages, interact through a terminal, collaborate in shared rooms, preview web applications, and use an AI coding assistant powered by Gemini.

The project combines a React/TypeScript frontend with a Node.js/Express backend and Socket.IO-based real-time collaboration.

## Features

*  **Monaco Code Editor** — VS Code-style editing experience in the browser
*  **Real-Time Collaboration** — Shared coding rooms with synchronized editor state
*  **Collaborative Chat** — Communicate with other participants inside a room
*  **Participant Management** — Track users connected to collaborative rooms
*  **Multi-Language Code Execution** — Execute Python, JavaScript, C, C++, Java, Go, and Rust
*  **Integrated Terminal** — Execute supported commands directly from the workspace
*  **Live Web Preview** — Preview HTML/CSS/JavaScript projects inside the IDE
*  **Gemini AI Assistant** — Explain, fix, refactor, and assist with code
*  **Workspace & File Explorer** — Manage files inside the coding workspace
*  **Command Palette & Search** — Quickly access editor functionality
*  **Dark IDE Interface** — VS Code-inspired development environment

## Architecture

```text
                         ┌─────────────────────┐
                         │       User          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                    ┌────────────────────────────┐
                    │ React + TypeScript Client  │
                    │                            │
                    │ Monaco Editor              │
                    │ File Explorer              │
                    │ Terminal                   │
                    │ Live Preview               │
                    │ Collaboration UI           │
                    └─────────────┬──────────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
          Socket.IO          REST API          Gemini API
                │                 │                 │
                ▼                 ▼                 │
       Collaboration        Node.js/Express       │
          Server                Server             │
                │                 │                 │
       ┌────────┴───────┐    ┌────┴─────────┐      │
       │                │    │              │      │
       ▼                ▼    ▼              ▼      ▼
   Room State         Chat  Code         Terminal  AI
   & Editor Events         Execution     Commands  Assistant
                              │
                       ┌──────┴───────┐
                       │              │
                       ▼              ▼
                  Local Runtime     Judge0
                    Execution       Fallback
```

## Technology Stack

### Frontend

* React 19
* TypeScript
* Vite
* Monaco Editor
* Tailwind CSS
* Zustand
* Lucide React

### Backend

* Node.js
* Express
* Socket.IO
* TypeScript

### Code Execution

* Local runtime execution
* Judge0 API fallback
* Python
* JavaScript
* C
* C++
* Java
* Go
* Rust

### AI

* Google Gemini API
* Gemini 2.5 Flash

### Terminal

* xterm.js
* Custom command execution layer
* Runtime and dependency management

## How It Works

### 1. Collaborative Editing

A user enters or creates a collaborative room. The client establishes a Socket.IO connection with the backend.

Editor changes, cursor positions, room events, and chat messages are communicated through Socket.IO event handlers.

```text
User A
   │
   │ Editor change
   ▼
Socket.IO Client
   │
   ▼
Collaboration Server
   │
   ├── Room State
   ├── Editor Events
   └── Participant Events
   │
   ▼
Other Connected Users
```

This allows participants in the same room to see shared workspace activity in real time.

### 2. Code Execution

Code can be executed through the `/api/run` backend endpoint.

The execution layer determines the requested runtime and attempts local execution where supported. Judge0 can be used as a fallback execution mechanism.

```text
Code
 │
 ▼
/api/run
 │
 ▼
Execution Manager
 │
 ├── Local Runtime
 │
 └── Judge0 Fallback
 │
 ▼
Execution Result
 │
 ├── stdout
 ├── stderr
 ├── exit code
 └── execution time
```

### 3. Integrated Terminal

CodeVerse includes an xterm.js-based terminal interface.

Supported commands include operations such as:

```text
python <file.py>
node <file.js>
gcc <file.c>
pip install <package>
npm install <package>
ls
cat <filename>
pwd
echo <text>
clear
help
```

The terminal routes supported commands through the backend execution layer.

### 4. AI Coding Assistant

The AI assistant uses the Gemini API through a server-side endpoint.

It supports coding operations such as:

* Code explanation
* Bug identification and fixing
* Refactoring
* General coding assistance

For example:

```text
User Request
     │
     ▼
AI Assistant UI
     │
     ▼
/api/ai/assistant
     │
     ▼
Gemini API
     │
     ▼
Generated Response
     │
     ▼
CodeVerse Editor
```

The Gemini API key is kept server-side through environment configuration rather than being exposed directly in the frontend.

## Key Backend Endpoints

| Endpoint                  | Purpose                             |
| ------------------------- | ----------------------------------- |
| `GET /api/health`         | Server health check                 |
| `GET /api/runtime`        | Runtime availability information    |
| `POST /api/run`           | Execute source code                 |
| `POST /api/terminal/exec` | Execute supported terminal commands |
| `POST /api/ai/assistant`  | Send coding requests to Gemini      |

## Project Structure

```text
CodeVerse/
├── src/
│   ├── components/
│   │   ├── collaboration/
│   │   ├── editor/
│   │   ├── explorer/
│   │   ├── layout/
│   │   ├── output/
│   │   ├── preview/
│   │   ├── search/
│   │   ├── settings/
│   │   └── terminal/
│   ├── services/
│   ├── store/
│   ├── hooks/
│   └── types/
│
├── server/
│   ├── collaboration/
│   │   ├── socket/
│   │   ├── services/
│   │   └── utils/
│   └── execution/
│
├── server.ts
├── package.json
└── vite.config.ts
```

## Installation

### Prerequisites

* Node.js
* npm
* A Gemini API key for AI features

### Clone the repository

```bash
git clone https://github.com/yashasA9/CodeVerse-master.git
cd CodeVerse-master/CodeVerse-master
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file based on `.env.example`.

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
```

Do not commit API keys or other secrets to the repository.

### Start the development server

```bash
npm run dev
```

The application runs on the configured local port, using the Node.js server together with the Vite development middleware.

## Production Build

```bash
npm run build
npm start
```

## My Contributions

My work on CodeVerse focused on the development and integration of key coding-environment features, including:

* Contributed to the frontend UI and IDE experience.
* Integrated Monaco Editor for browser-based code editing.
* Integrated Judge0-based code execution.
* Added support for executing multiple programming languages.
* Integrated the Gemini API for AI-assisted coding functionality.
* Contributed to the collaborative editor experience using Socket.IO.
* Worked with terminal and workspace functionality.

## Future Improvements

* Persistent collaborative workspace storage
* More robust concurrent editing conflict resolution
* Expanded language/runtime support
* Containerized and sandboxed code execution
* Improved AI context management across larger workspaces
* Authentication and role-based collaboration management
* Automated testing for collaboration and execution flows

## Repository

[GitHub Repository](https://github.com/yashasA9/CodeVerse-master)
