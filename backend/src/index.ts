import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

//interfaces

import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./config/interfaces";

// import dotenv from "dotenv";
import "dotenv/config";

// route imports
import profRoutes from "./professor/prof.routes";
import chatRoutes from "./chat/chat.routes";
import rewardRoutes from "./rewards/rewards.routes";

import { connectDB } from "./config/db";
import setupSocket from "./config/socket";

const app = express();
// dotenv.config();
const PORT = process.env.PORT || 5173;

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api/prof", profRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/rewards", rewardRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Aura Stars!");
});

connectDB();

const server = createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
