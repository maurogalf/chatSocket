import session from "express-session";
import MongoStore from "connect-mongo";

const expTime = Number(process.env.SESSION_EXPIRATION);

const sessionMiddleware = session({
  secret: "secret",
  cookie: { maxAge: expTime },
  resave: true,
  rolling: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_ATLAS_CLUSTER,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  }),
  cookie: {
    maxAge: expTime,
  },
});

export default sessionMiddleware;
