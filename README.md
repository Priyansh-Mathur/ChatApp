# ChatApp - Real-Time Messaging Platform

ChatApp is a full-stack real-time messaging application inspired by WhatsApp Web. It allows users to sign up, log in securely, view available contacts, and communicate through private one-to-one conversations in real time.

The project is built using React.js, Node.js, Express.js, Socket.IO, MongoDB, and JWT authentication. It focuses on real-time communication, clean UI design, secure authentication, and message storage.

## Features

- User signup and login
- JWT-based authentication
- Secure password hashing
- Private one-to-one messaging
- Real-time message sending and receiving
- Online/offline user status
- Typing indicator
- Chat history storage in MongoDB
- WhatsApp Web-like responsive UI
- User search in sidebar
- Protected routes for authenticated users

## Tech Stack

**Frontend:** React.js, Axios, Socket.IO Client, React Router DOM, CSS

**Backend:** Node.js, Express.js, Socket.IO, MongoDB, Mongoose, JWT, bcrypt.js, CORS, dotenv

## Project Structure

```bash
ChatApp/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── api.js
    │   ├── socket.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```
##Live Link
chattinga.netlify.app

