import colors from "colors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import path from "path";
import fs from "fs";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import usersRoutes from "./routes/usersRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import notificationsRoutes from "./routes/notificationsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import { createServer } from "http";
import { Server } from "socket.io";

import { setLoginState, setLogoutState } from "./services/loginStateService.js";

const app = express();
const httpServer = createServer(app);
// Init dotenv :
dotenv.config();
// Connect Database :
connectDB();

// Init Middlewares
app.use(express.json({ extended: false }));

// Define Routes :
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/upload", uploadRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  const staticFolder = express.static(
    path.resolve(__dirname, "frontend", "build")
  );
  app.use(staticFolder);
  const buildFolder = path.join(__dirname, "frontend", "build");
  app.get("*", (req, res) => {
    if (fs.existsSync(buildFolder)) {
      const indexFile = path.resolve(
        __dirname,
        "frontend",
        "build",
        "index.html"
      );
      res.sendFile(indexFile);
    } else {
      res.send({
        message: "build folder not found !",
        path: buildFolder,
      });
    }
  });
} else {
  app.get("/", (req, res) => res.send("API is running..."));
}

// Init Error Middlewares :
app.use(notFound);
app.use(errorHandler);

// Init socket io :
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("user-connect", (id) => {
    socket.userId = id;
    setLoginState(id);
    io.emit("client-user-connect", id);
  });

  socket.on("user-disconnect", (id) => {
    setLogoutState(socket.userId);
    io.emit("client-user-disconnect", id);
  });

  socket.on("disconnect", () => {
    setLogoutState(socket.userId);
    io.emit("client-user-disconnect", socket.userId);
  });

  socket.on("send-message", (obj) => {
    io.emit("receive-message", obj);
  });

  socket.on("send-notification", (obj) => {
    io.emit("receive-notification", obj);
  });

  socket.on("user-typing", (obj) => {
    io.emit("client-user-typing", obj);
  });

  socket.on("user-stop-typing", (obj) => {
    io.emit("client-user-stop-typing", obj);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);
