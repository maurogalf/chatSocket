import express from "express";
import http from "http";

import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { faker } from "@faker-js/faker";
import cookieParser from "cookie-parser";

import passport from "./tools/passport/local-auth.js";
import daosContenedor from "./data/modules/chat/daoFactory.js";
import router from "./routes/routes.js";
import apiRouter from "./routes/api.routes.js";
import logger from "./tools/winston.js";
import sessionMiddleware from "./tools/session/middleware.js";

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
  app.use(express.static("src/public"));

  // PASSPORT
  app.use(passport.initialize());
  app.use(passport.session());

  // LOGGER VALID ROUTES
  app.use((req, res, next) => {
    logger.info(`Route: ${req.url}, Method: ${req.method}`);
    next();
  });

  //ROUTES
  app.use("/", router);
  app.use("/api", apiRouter);

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
    socket.on("newMsg", (data) => {
      let newMsg = data;
      daosContenedor
        .getMessages()
        .then((data) => {
          let mensajes = data.mensajes;
          let id =
            mensajes.length > 0 ? mensajes[mensajes.length - 1].id + 1 : 1;
          newMsg = { ...newMsg, id: id };
          daosContenedor
            .saveMessage(newMsg)
            .then(() => {
              logger.info("Saved message");
              daosContenedor
                .compresion()
                .then((compresion) => {
                  io.sockets.emit("newMsg", {
                    newMsg,
                    compresion,
                  });
                })
                .catch((err) => {
                  logger.error(err);
                });
            })
            .catch((err) => {
              logger.error(err);
            });
        })
        .catch((err) => {
          logger.error(err);
        });
    });
    socket.on("complete", () => {
      let user = {
        email: faker.internet.email(),
        nombre: faker.name.firstName(),
        apellido: faker.name.lastName(),
        edad: faker.random.numeric(2),
        alias: faker.internet.userName(),
        avatar: faker.internet.avatar(),
        mensaje: faker.lorem.sentence(10),
      };
      io.sockets.emit("complete", user);
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
