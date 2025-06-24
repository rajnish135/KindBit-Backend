import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import http from 'http'; 
import { Server } from 'socket.io'; 

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
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ Attach io instance globally
app.set('io', io);

// ✅ Middleware
app.use(cors({
  origin: 'https://kind-bite.vercel.app', 
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

// ✅ Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

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
