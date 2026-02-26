# Real-Time Chat App — Frontend

A sleek, terminal-themed real-time chat application built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It connects to a WebSocket backend to enable instant messaging across chat rooms.

## 🔗 Live Demo

**[chatappfrontend-rho-six.vercel.app](https://chatappfrontend-rho-six.vercel.app)**

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [How It Works](#how-it-works)
- [WebSocket Communication Protocol](#websocket-communication-protocol)
- [Backend Overview](#backend-overview)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

- **Room-Based Chat** — Users create or join rooms using a unique room code. Messages are scoped to the room.
- **Real-Time Messaging** — Instant message delivery via WebSocket connections (no polling).
- **Live User Count** — Displays the number of active users in a room in real time.
- **Username Display** — Each message shows the sender's name; your own messages are labeled "YOU".
- **System Messages** — Join confirmations and connection status are displayed as system announcements.
- **Terminal / Hacker UI** — Dark, monospace-themed interface with pulsing connection indicator, carbon-fibre texture, and minimalist aesthetics.
- **Auto-Scroll** — Chat viewport automatically scrolls to the latest message.
- **Keyboard Support** — Press `Enter` to send messages instantly.
- **Responsive Design** — Works on desktop and mobile screens.
- **Connection Status Indicator** — Shows `CONNECTED` or `OFFLINE` based on WebSocket readiness.

---

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Framework  | Next.js 16 (App Router)             |
| UI Library | React 19                            |
| Language   | TypeScript 5                        |
| Styling    | Tailwind CSS v4                     |
| Fonts      | Geist & Geist Mono (Google)         |
| Real-Time  | Native WebSocket API                |
| Backend    | Node.js + `ws` library              |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
chatappfrontend/
├── app/
│   ├── globals.css          # Global styles & Tailwind import
│   ├── layout.tsx           # Root layout with Geist fonts
│   ├── page.tsx             # Home page — renders ChatApp component
│   └── components/
│       └── ChatApp.tsx      # Main chat application component
├── public/                  # Static assets
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts           # Next.js configuration
├── postcss.config.mjs       # PostCSS + Tailwind plugin
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies & scripts
└── README.md                # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm**, **yarn**, or **pnpm**
- The WebSocket backend running (either locally on `ws://localhost:5000` or the deployed instance at `wss://chatappbackend-rpft.onrender.com`)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd chatApp/chatappfrontend

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

> **Note:** By default, the frontend connects to the deployed WebSocket backend at `wss://chatappbackend-rpft.onrender.com`. To use a local backend, update the WebSocket URL in `app/components/ChatApp.tsx`:
>
> ```ts
> const socket = new WebSocket("ws://localhost:5000");
> ```

### Build for Production

```bash
npm run build
npm start
```

---

## How It Works

### 1. Join a Room

When the app loads, users see a **Join Terminal** screen where they enter:

- **Your Name** — Display name shown alongside messages.
- **Room Code** — A unique identifier (e.g., `ALPHA-1`) for the chat room.

Clicking **Enter Room** sends a `join` event over the WebSocket.

### 2. Send & Receive Messages

Once inside a room:

- Type a message and hit **SEND** (or press `Enter`).
- Messages from you appear on the **right** (white bubble, labeled "YOU").
- Messages from others appear on the **left** (dark bubble, labeled with their name).
- System messages (e.g., "Successfully Joined") appear **centered** in a muted style.

### 3. Live User Count

The header bar displays the number of users currently online in the room. This count updates automatically when users join or leave.

### 4. Disconnect Handling

When a user closes the tab or disconnects, the backend cleans up the user from the room and broadcasts an updated user count to all remaining participants.

---

## WebSocket Communication Protocol

### Client → Server

| Event  | Payload                                             | Description      |
| ------ | --------------------------------------------------- | ---------------- |
| `join` | `{ type: "join", payload: { roomId, name } }`       | Join a chat room |
| `chat` | `{ type: "chat", payload: { roomId, chat, name } }` | Send a message   |

### Server → Client

| Event          | Payload                                                  | Description                 |
| -------------- | -------------------------------------------------------- | --------------------------- |
| `update_users` | `{ type: "update_users", count: number }`                | Updated active user count   |
| Chat message   | `{ sender: "me" \| "them", name: string, text: string }` | A chat message from a user  |
| System string  | Plain text (e.g., `"Successfully Joined room X"`)        | Server status/info messages |

---

## Backend Overview

The WebSocket backend is built with **Node.js** and the **`ws`** library. Key details:

- **Port:** 5000 (local) / deployed on Render
- **Room Management:** Rooms are stored in a `Map<string, WebSocket[]>`, mapping room IDs to arrays of connected sockets.
- **Broadcasting:** Messages are sent to all users in the same room; the sender receives `sender: "me"` and others receive `sender: "them"`.
- **Cleanup:** On disconnect, the user is removed from all rooms and updated user counts are broadcast.

Backend source is located in the sibling `chatappbackend/` directory.

---

## Deployment

### Frontend (Vercel)

The frontend is deployed on **Vercel** with zero configuration:

1. Push the `chatappfrontend` directory to a GitHub repository.
2. Import the project on [vercel.com](https://vercel.com).
3. Vercel auto-detects Next.js and builds it.
4. Live at: **[chatappfrontend-rho-six.vercel.app](https://chatappfrontend-rho-six.vercel.app)**

### Backend (Render)

The WebSocket backend is deployed on **Render** as a Web Service:

- URL: `wss://chatappbackend-rpft.onrender.com`

---

## Available Scripts

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start development server (hot reload) |
| `npm run build` | Create optimized production build     |
| `npm start`     | Serve the production build            |
| `npm run lint`  | Run ESLint checks                     |

---

## Environment & Configuration

- **TypeScript** — Strict mode enabled with `bundler` module resolution.
- **Tailwind CSS v4** — Configured via PostCSS plugin (`@tailwindcss/postcss`).
- **Fonts** — Geist Sans (UI text) and Geist Mono (monospace) loaded via `next/font/google`.

---

## License

This project is open source and available under the [MIT License](LICENSE).
