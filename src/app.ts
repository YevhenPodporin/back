import express, {
  Errback,
  Express,
  NextFunction,
  Request,
  Response,
} from "express";
import dotenv from "dotenv";

dotenv.config();

import compression from "compression";
import serverRoutes from "./api/routes";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
import cors from "cors";
import { createServer } from "http";
import socketMiddleware from "./middlewares/socketMiddleware";
import socketController from "./api/controllers/socketController";
import { Server } from "socket.io";
import { SocketWithUser } from "./types/ChatTypes";

export const app: Express = express();

export const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
  maxHttpBufferSize: 1e8,
});

io.use((socket, next) => socketMiddleware(socket as SocketWithUser, next));
io.on("connection", (socket) => socketController(socket as SocketWithUser));

app.use(cors({ origin: "*" }));
app.use(limiter);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", serverRoutes);
app.use("/image", (req, res) => {
  res.download(process.cwd() + "/src/storage/files" + req.url);
});

app.get("/", (req, res) => {
  res.json("Welcome to the server");
});

app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    status: 500,
    message: err,
  });
  next();
});

module.exports = { app, server };
