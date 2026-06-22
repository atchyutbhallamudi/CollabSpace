# CollabSpace — Real-Time Collaborative Whiteboard

> A full-stack collaborative workspace where multiple users can draw, annotate, and brainstorm together in real time — with zero lag.

**Live Demo →** [collabspaceongo.vercel.app](https://collabspaceongo.vercel.app/)
&nbsp;&nbsp;|&nbsp;&nbsp;
**Author →** Sai Atchyut Bhallamudi

---

## What Is CollabSpace?

CollabSpace is a browser-based collaborative whiteboard built for real-time, multi-user drawing sessions. Think of it as a lightweight Miro/FigJam clone — users can create private canvases, invite collaborators by email, and draw simultaneously with instant sync across all connected clients.

The project was built from scratch to explore the challenges of real-time state synchronization, conflict-free collaborative editing, and scalable WebSocket architecture.

---

## Key Features

| Feature | Description |
|---|---|
| **Real-Time Sync** | Drawings propagate instantly to all connected users via Socket.io WebSockets — no polling, no refresh needed |
| **Drawing Tools** | Freehand brush, line, rectangle, circle, arrow, text, and eraser — each with configurable stroke color, fill color, and size |
| **Undo / Redo** | Full history stack with keyboard shortcuts (`Ctrl+Z` / `Ctrl+Y`) |
| **Persistent Storage** | Canvas state is saved to MongoDB Atlas so drawings survive page refreshes and reconnections |
| **Auth & Access Control** | JWT-based authentication; canvases are private by default — owners share access by email |
| **Canvas Management** | Create, rename, delete, and share multiple canvases from a personal dashboard |
| **Export** | Download any canvas as a PNG with one click |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js, HTML5 Canvas API | UI and rendering engine |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **Real-Time** | Socket.io (client) | Bidirectional WebSocket communication |
| **Drawing** | `roughjs`, `perfect-freehand` | Sketch-style shapes and smooth brush strokes |
| **Backend** | Node.js, Express.js | REST API and WebSocket server |
| **Database** | MongoDB Atlas, Mongoose | Persistent canvas and user storage |
| **Auth** | JWT, bcrypt | Stateless authentication and password hashing |
| **Deployment** | Vercel (frontend), Render (backend) | CI/CD pipeline via GitHub |

---

## Architecture & Design Decisions

### 1. WebSocket-First Rendering, HTTP for Persistence

The real-time drawing path **never touches the database**. When a user draws, element data is emitted directly over Socket.io to all peers in the same canvas room. The HTTP `PUT /api/canvas/update` endpoint is only called on `mouseUp` (when a stroke is finalized), keeping write frequency low while keeping the experience lag-free.

This separation means:
- **P99 rendering latency is unaffected** by database I/O
- Database writes are batched per-stroke, not per-pixel
- The system degrades gracefully: if the DB is slow, live collaboration still works

### 2. Room-Based Canvas Isolation via Socket.io

Each canvas has a dedicated Socket.io room keyed by `canvasId`. Clients emit `joinCanvas` on load and receive `receiveDrawingUpdate` events only from that room. Authorization is enforced server-side — the socket handler validates the JWT and checks canvas ownership/sharing before allowing a join, preventing unauthorized access even over the WebSocket layer.

### 3. Fat Controller Pattern (YAGNI)

Canvas save logic lives in `canvasController.js` rather than in the Mongoose model. Because the Socket.io path bypasses HTTP entirely, abstracting save logic into the model for "reusability" would have added complexity with no benefit. This is a deliberate application of the **YAGNI (You Aren't Gonna Need It)** principle.

### 4. Immutable State via useReducer

All whiteboard state (elements, undo history, active tool) is managed through a single `boardReducer`. Each action returns a new state object — mutations are never performed in place. This makes the undo/redo history stack trivially correct and the state flow easy to reason about.

### 5. Element Serialization & Restoration

`roughjs` elements contain non-serializable properties (canvas generators, internal state). Before saving to MongoDB, elements are stored as plain JSON objects. On load, `restoreElements()` reconstructs `roughEle` and `Path2D` instances from the stored coordinates so they can be re-rendered correctly on the canvas.

---

## Project Structure

```
CollabSpace/
│
├── Backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   ├── controllers/
│   │   ├── canvasController.js    # CRUD + share logic for canvases
│   │   └── userController.js      # Register, login, get user
│   ├── middlewares/
│   │   └── authMiddleware.js      # JWT verification middleware
│   ├── models/
│   │   ├── canvasModel.js         # Mongoose schema: Canvas
│   │   └── userModel.js           # Mongoose schema: User (bcrypt hashing)
│   ├── routes/
│   │   ├── canvasRoutes.js        # /api/canvas/* endpoints
│   │   └── userRoutes.js          # /api/users/* endpoints
│   └── index.js                   # Express server + Socket.io setup
│
└── Frontend/whiteboard-frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Board/             # Canvas element + mouse event handlers
        │   ├── Toolbar/           # Tool selector (brush, shapes, eraser, etc.)
        │   └── Toolbox/           # Stroke/fill/size controls per tool
        ├── pages/
        │   ├── Login.js           # Auth page
        │   ├── Register.js        # Registration page
        │   ├── Profile.js         # Dashboard — canvas list, create, share, delete
        │   └── Canvas.js          # Whiteboard page (loads canvas by ID)
        ├── store/
        │   ├── BoardProvider.js   # useReducer state + socket listeners
        │   ├── board-context.js
        │   ├── ToolboxProvider.js # Tool settings state
        │   └── toolbox-context.js
        ├── utils/
        │   ├── element.js         # createElement, restoreElements, getSvgPath
        │   ├── math.js            # Distance, proximity, arrow head helpers
        │   ├── api.js             # updateCanvas, loadCanvas HTTP helpers
        │   └── socket.js          # Socket.io client initialization
        ├── constants.js           # TOOL_ITEMS, COLORS, ACTION_TYPES
        ├── App.js                 # React Router setup
        └── index.js               # React root
```

---

## API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users/register` | Register a new user |
| `POST` | `/api/users/login` | Login, receive JWT |
| `GET` | `/api/users/me` | Get authenticated user profile |

### Canvas

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/canvas/create` | ✅ | Create a new canvas |
| `GET` | `/api/canvas/list` | ✅ | List all canvases owned or shared with user |
| `GET` | `/api/canvas/load/:id` | ✅ | Load canvas by ID |
| `PUT` | `/api/canvas/update` | ✅ | Persist canvas elements |
| `PUT` | `/api/canvas/share/:id` | ✅ | Share canvas with a user by email |
| `PUT` | `/api/canvas/unshare/:id` | ✅ | Revoke a user's access |
| `DELETE` | `/api/canvas/delete/:id` | ✅ | Delete a canvas (owner only) |

### WebSocket Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `joinCanvas` | Client → Server | `{ canvasId }` | Authorize and join a canvas room |
| `loadCanvas` | Server → Client | `elements[]` | Deliver current canvas state on join |
| `drawingUpdate` | Client → Server | `{ canvasId, elements[] }` | Broadcast a new stroke |
| `receiveDrawingUpdate` | Server → Client | `elements[]` | Receive a peer's stroke |
| `unauthorized` | Server → Client | `{ message }` | Emitted if JWT is invalid or access is denied |

---

## Local Setup

### Prerequisites
- Node.js v18+
- A MongoDB Atlas URI (or local MongoDB)

### Backend

```bash
cd Backend
npm install

# Create a .env file
echo "MONGO_URL=your_mongodb_uri" >> .env
echo "JWT_SECRET=your_jwt_secret" >> .env

node index.js
# Server runs on http://localhost:5000
```

### Frontend

```bash
cd Frontend/whiteboard-frontend
npm install

# Create a .env file
echo "REACT_APP_API_BASE_URL=http://localhost:5000" >> .env

npm start
# App runs on http://localhost:3000
```

---

## Roadmap

- [ ] **Cursor presence** — show live cursor positions of all collaborators
- [ ] **Room-based workspaces** — isolated sessions for teams or classrooms
- [ ] **Synchronized notes** — text notes panel alongside the canvas
- [ ] **Role-based permissions** — view-only vs. editor access per collaborator
- [ ] **Canvas versioning** — named snapshots with rollback

---

## Author

**Sai Atchyut Bhallamudi**

Built with the goal of understanding real-time distributed systems, WebSocket architecture, and collaborative state management from first principles.
