import http from "http";
import express from "express";
import logger from "morgan";
import cors from "cors";
// mongo connection
import "./config/mongo.js";
// socket configuration
// routes
import indexRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import chatRoomRouter from "./routes/chatRoom.js";
import deleteRouter from "./routes/delete.js";
import professionalRouter from "./routes/professional.js";
// middlewares
import { decode } from './middlewares/jwt.js'
import fileUpload from "express-fileupload";

const app = express();

/** Get port from environment and store in Express. */
const port = process.env.PORT || "3000";
app.set("port", port);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload())
app.use("/public", decode, express.static('content'))
app.use("/", indexRouter);
app.use("/professionals", professionalRouter)
app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/room", decode, chatRoomRouter);
app.use("/delete", deleteRouter);

/** catch 404 and fo[rward to error handler */
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist'
  })
});
/** Create HTTP server. */
const server = http.createServer(app);
/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
})
  .on('error', () => {
    process.once("SIGUSR2", function () {
      process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function () {
      // this is only called on ctrl+c, not restart
      process.kill(process.pid, "SIGINT");
    });
  })