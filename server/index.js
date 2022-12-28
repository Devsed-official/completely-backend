import http from "http";
import https from "https";
import express from "express";
import logger from "morgan";
import cors from "cors";
import fs from "fs"
// mongo connection
import "./config/mongo.js";
// socket configuration
import { Server } from "socket.io";
import WebSockets from "./utils/WebSockets.js";

// routes
import indexRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import chatRoomRouter from "./routes/chatRoom.js";
import deleteRouter from "./routes/delete.js";
import blogRouter from "./routes/blog.js";
import checkoutRouter from "./routes/checkout.js";
import professionalRouter from "./routes/professional.js";
import orderRouter from "./routes/order.js";
// middlewares
import { decode } from "./middlewares/jwt.js";
import { parser } from "./middlewares/bodyParser.js";

import fileUpload from "express-fileupload";

const app = express();

const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.completely.ch/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/api.completely.ch/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/api.completely.ch/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

/** Get port from environment and store in Express. */
const port = process.env.PORT || "443";
app.set("port", port);
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** File Management */
app.use(fileUpload());
app.use("/public", parser, express.static("content"));

/**API's */
app.use("/", parser, indexRouter);
app.use("/professionals", parser, professionalRouter);
app.use("/users", parser, userRouter);
app.use("/admin", parser, adminRouter);
app.use("/room", parser, chatRoomRouter);
app.use("/checkout", parser, checkoutRouter);
app.use("/orders", parser, orderRouter);
app.use("/delete", parser, deleteRouter);
app.use("/blogs", parser, blogRouter);

/** catch 404 and fo[rward to error handler */
app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doesnt exist",
  });
});
/** Create HTTP server. */
// const server = http.createServer(app);
const server = https.createServer(credentials, app);


global.io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
global.io.on("connection", (client) => {
  WebSockets.connection(client);
});
/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server
  .on("listening", () => {
    console.log(`Listening on port:: http://localhost:${port}/`);
  })
  .on("error", () => {
    process.once("SIGUSR2", function () {
      process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function () {
      // this is only called on ctrl+c, not restart
      process.kill(process.pid, "SIGINT");
    });
  });

  // Starting both http & https servers
// const httpServer = http.createServer(app);

// httpServer.listen(80, () => {
// 	console.log('HTTP Server running on port 80');
// });

// httpsServer.listen(443, () => {
// 	console.log('HTTPS Server running on port 443');
// });