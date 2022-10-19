import express from "express";
import http from "http";
import { Server } from "socket.io";

import handlebars from "express-handlebars";

import cookieParser from "cookie-parser";
import passport from "./tools/passport/local-auth.js";
import frontRouter from "./routes/front.routes.js";
import apiUsersRouter from "./routes/api.users.routes.js";
import logger from "./tools/winston.js";
import sessionMiddleware from "./tools/session/middleware.js";
import { chat } from "./services/chat/chat.service.js";
import { userService } from "./services/users/userInfo.service.js";
import apiCartsRouter from "./routes/api.carts.routes.js";
import apiOrdersRouter from "./routes/api.orders.routes.js";
import apiProductsRouter from "./routes/api.products.routes.js";

const runServer = (port) => {
  const app = express();

  // ARCHIVOS ESTATICOS
  app.use(express.static("./views/layouts"));

  //SESSION
  app.use(cookieParser());
  app.use(sessionMiddleware);

  // MIDDLEWARES
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("src/public/thumbnails"));
  app.use(express.static("src/public/avatars"));

  // PASSPORT
  app.use(passport.initialize());
  app.use(passport.session());

  // LOGGER VALID ROUTES
  app.use((req, res, next) => {
    logger.info(`Route: ${req.url}, Method: ${req.method}`);
    next();
  });

  //ROUTES
  app.use("/", frontRouter);
  app.use("/api/products", apiProductsRouter);
  app.use("/api/users", apiUsersRouter);
  app.use("/api/carts", apiCartsRouter);
  app.use("/api/orders", apiOrdersRouter);

  //LOGGER INVALID ROUTES
  app.use((req, res) => {
    logger.warn(`Invalid route: ${req.url}, Method: ${req.method}`);
    res.sendStatus(404);
  });

  // Configuracion de handlebars
  app.set("views", "./views");
  app.engine(
    "hbs",
    handlebars.engine({
      defaultLayout: "index",
      layoutsDir: "./views/layouts",
      partialsDir: "./views/partials",
      extname: ".hbs",
    })
  );
  app.set("view engine", "hbs");

  // SERVER
  const server = http.createServer(app);

  // SERVER SOCKET
  const io = new Server(server);

  // SERVER CONECTION
  io.on("connection", (socket) => {
    //Nuevo mensaje para el chat
    socket.on("newMsg", async (data) => {
      let newMsg = data;
      const collection = await chat.getMessages();
      let id =
        collection.mensajes.length > 0 ? collection.mensajes.length + 1 : 1;
      newMsg = { ...newMsg, id: id };
      const userInfo = await userService.getUserByEmail(newMsg.author.user);
      newMsg.author.avatar = userInfo.avatar;
      await chat.saveMessage(newMsg);
      logger.info("Message saved successfully");
      io.sockets.emit("newMsg", newMsg);
    });
    socket.on("getMessages", async () => {
      const messages = await chat.getMessages();
      socket.emit("sendMessages", messages);
    });
  });

  server.listen(port, (error) => {
    if (error) {
      logger.error("Initialized server failed", error);
      process.exit();
    }
    logger.info(`Listening on port ${port} with process id: ${process.pid}`);
  });
};

export default runServer;
