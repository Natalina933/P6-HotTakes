const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const app = express();
const authRouter = require("./routes/authRoutes");
const cors=require("cors")
app.use(cors())
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/api/auth", authRouter);

mongoose
  .connect(process.env.mongodb_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/****************return of a valid port provided in the form of a number or a string**************/
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
/****************return of a valid port provided in the form of a number or a string**************/
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
/**
 * createServer() react to incoming requests and receive as arguments: the object requête/responce/next
 * production = const server = https.createServer(app);
 */
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
