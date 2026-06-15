# CollabSpace 

A full-stack collaborative workspace application featuring live whiteboard syncing and real-time interactions. Built to facilitate interactive remote learning and seamless team collaboration.

**Live Demo:** [CollabSpace](https://collabspaceongo.vercel.app/)

## Features
* **Real-Time Collaboration:** Instant, lag-free whiteboard syncing across multiple clients.
* **Secure Authentication:** User registration and secure login utilizing JWT and bcrypt.
* **Persistent Storage:** Drawings and canvas states are securely saved to the database for future retrieval.
* **Room-Based Workspaces (Future Scope):** Isolated environments for individual classes or teams to collaborate without overlapping data, alongside synchronized note-taking.

## Tech Stack
* **Frontend:** React.js, HTML5 Canvas API
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas), Mongoose
* **Real-Time Engine:** Socket.io

## Architectural Decisions
During the development of CollabSpace, a deliberate architectural choice was made regarding database logic abstraction (Fat Controllers vs. Fat Models/Services). 

To ensure maximum performance, the Socket.io implementation is optimized to broadcast raw `(x, y)` coordinates directly between clients without interacting with the database. The actual database "Save" operation only occurs via a deliberate HTTP POST request when the user finalizes the board. 

Because the WebSockets bypass the database entirely, abstracting the saving logic into the Model to make it "reusable" across the app would have been unnecessary over-engineering. Therefore, the application utilizes a **Fat Controller** pattern for HTTP saves, strictly adhering to the *You Aren't Gonna Need It (YAGNI)* principle to maintain codebase simplicity, efficiency, and readability.

## Local Setup

### Prerequisites
* Node.js installed on your machine
* A MongoDB Atlas cluster or local MongoDB instance

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/atchyutbhallamudi/collabspace.git](https://github.com/atchyutbhallamudi/collabspace.git)
   cd collabspace
### Author
Sai Atchyut Bhallamudi
