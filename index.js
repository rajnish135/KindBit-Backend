import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import http from 'http'; 
import { Server } from 'socket.io'; 
import jwt from 'jsonwebtoken';

dotenv.config();

import { connectDB } from './config/connectDB.js';
import { router } from './routes/index.js';

const app = express();
const PORT = 5000;

// ✅ Create HTTP server and attach socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://kind-bite.vercel.app',
    // origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ Attach io instance globally
app.set('io', io);

// ✅ Middleware
app.use(cors({
  origin: 'https://kind-bite.vercel.app',
  // origin: 'http://localhost:5173', 
  credentials: true               
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ✅ Static file handling
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use('/api', router);

// ✅ Authenticate BEFORE connection
io.use((socket, next) => {

  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("jwt must be provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attach user info to socket
    return next();// ✅ Allow connection
  } 
  catch (err) {
    return next(new Error("Invalid token: " + err.message));
  }
});

// ✅ Handle connection AFTER authentication
io.on('connection', (socket) => {

  const userId = socket.user.userId; // from token

  socket.join(userId); // Join room
  console.log(`✅ Socket ${socket.id} joined room for user: ${userId}`);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  
});


// ✅ Connect to DB and start server (use server.listen)
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("✅ Server with Socket.IO started on port", PORT);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
