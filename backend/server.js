import colors from "colors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import path from "path";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import usersRoutes from "./routes/usersRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import notificationsRoutes from "./routes/notificationsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();
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

app.get("/", (req, res) => res.json({ message: "API is running..." }));

// Init Error Middlewares :
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);
