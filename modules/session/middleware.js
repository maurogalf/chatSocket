import session from "express-session";
import MongoStore from "connect-mongo";


const sessionMiddleware = 
    session({
        secret: "secret",
        cookie: { maxAge: 600000 },
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
            maxAge: 600000,
        },
    });

export default sessionMiddleware;