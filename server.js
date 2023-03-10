const express = require("express");
const mongoose = require("mongoose");
const saucesRoutes = require("./routes/saucesRoutes");
const authRoutes = require("./routes/authRoutes");
const path = require("path");
// const helmet = require("helmet");
const app = express();
const cors = require("cors");// CORS - partage de ressources entre serveurs

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoutes);

app.use("/api/sauces", saucesRoutes);

app.use(
  "/public/images",
  express.static(path.join(__dirname, "public/images"))
); // gestion images de manière statiques


// mongoose connect
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

  // app.use(mongoSanitize()); // En prévention des injections
  // app.use(helmet()); // helmet
  
  // app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  

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
const server = app.listen(port);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});
