import express from "express";
import daosContenedor from "./daos/index.js";
import products from "./data/FakerProducts.js";
import { faker } from '@faker-js/faker';
import cookieParser  from "cookie-parser"
import session from "express-session";

import MongoStore  from 'connect-mongo';
const advacedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const app = express();

//CONFIGURACION DE COOKIEPARSER
app.use(cookieParser())
//CONFIGURACION DE SESSION CON MONGO ATLAS
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://user:mongo123456@cluster0.tg0ib.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: advacedOptions,
        ttl: 60
    }),
    secret: 'mauro',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000
    }
}))


// ARCHIVOS ESTATICOS
app.use(express.static("views/layouts"));

// SERVER
import http from "http";
const server = http.createServer(app);

// PUERTO
const port = process.env.PORT || 8080;

import handlebars from "express-handlebars";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", "./views");
app.set("view engine", "hbs");

// Configuracion de handlebars
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index",
        layoutsDir: "./views/layouts",
        partialsDir: "./views/partials",
    })
);

// SERVER SOCKET
import { Server } from "socket.io";
const io = new Server(server);

// SERVER CONECTION
io.on("connection", (socket) => {
    console.log("Cliente conectado");
    //Nuevo mensaje para el chat
    socket.on("newMsg", (data) => {
        let newMsg = data;
        daosContenedor.getMessages().then((data) => {
            let mensajes = data.mensajes
            let id = mensajes.length > 0 ? mensajes[mensajes.length - 1].id + 1 : 1;
            newMsg = { ...newMsg, id: id}
            daosContenedor.saveMessage(newMsg).then(() => {
                console.log("Saved message");
                daosContenedor.compresion().then((compresion) => {
                    io.sockets.emit("newMsg", {newMsg, compresion});
                }).catch((err) => {
                    console.log(err)
                })
            }).catch((err) => {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
        })
    });
    socket.on("complete", () => {
        let user = { 
        email : faker.internet.email(),
        nombre : faker.name.firstName(),
        apellido: faker.name.lastName(),
        edad: faker.random.numeric(2),
        alias: faker.internet.userName(),
        avatar: faker.internet.avatar(),
        mensaje: faker.lorem.sentence(10)
        }
        io.sockets.emit("complete", user)
        })
});

// RUTA PRINCIPAL

app.get("/", (req, res) => {
    const user = req.session.user
    !user &&  res.redirect("/login")
    daosContenedor.getMessages().then((data) => {
        if(data.mensajes.length > 0) {
            daosContenedor.compresion().then((compresion)=> {
                res.render("products", { data: products, chat: data.mensajes , compresion: compresion, user: user })
            })
        } else {
            res.render("products", { data: products, chat: data.mensajes, user: user });
        }
    }).catch((err) => {
        console.log(err)
    })
});

app.get("/login", (req, res) => {
    req.session.user && res.redirect("/")
    res.render("login")
})

app.post("/login", (req, res) => {
    req.session.user = req.body.name
    res.redirect("/")
})

app.post("/logout", (req, res) => {
    res.redirect("/logout")
})

app.get("/logout", (req, res) => { 
    const user = req.session.user
    req.session.destroy();
    res.render("logout", {user: user})
})

server.listen(port, () => {
    console.log("Server is running on port " + port);
});
