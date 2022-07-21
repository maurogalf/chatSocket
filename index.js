import express from "express";
import http from "http";
import daosContenedor from "./daos/index.js";
import products from "./data/FakerProducts.js";
import handlebars from "express-handlebars";
import { faker } from '@faker-js/faker';
import passport from './passport/local-auth.js'
import session from 'express-session'

const app = express();


// ARCHIVOS ESTATICOS
app.use(express.static("views/layouts"));

// SERVER
const server = http.createServer(app);

// PUERTO
const port = process.env.PORT || 8080;

//SESSION
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 600000 },
    resave: true,
    saveUninitialized: true
}))

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());


// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Configuracion de handlebars
app.set("views", "./views");
app.set("view engine", "hbs");
app.engine("hbs", handlebars.engine({
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
            newMsg = { ...newMsg, id: id }
            daosContenedor.saveMessage(newMsg).then(() => {
                console.log("Saved message");
                daosContenedor.compresion().then((compresion) => {
                    io.sockets.emit("newMsg", { newMsg, compresion });
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
            email: faker.internet.email(),
            nombre: faker.name.firstName(),
            apellido: faker.name.lastName(),
            edad: faker.random.numeric(2),
            alias: faker.internet.userName(),
            avatar: faker.internet.avatar(),
            mensaje: faker.lorem.sentence(10)
        }
        io.sockets.emit("complete", user)
    })
});

// FUNCION DE CONTROL DE AUTENTICACION
const isAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect("/login")
const isNotAuthenticated = (req, res, next) => !req.isAuthenticated() ? next() : res.redirect("/")

// RUTA PRINCIPAL
app.get("/", isAuthenticated, (req, res) => {
    daosContenedor.getMessages().then((data) => {
        if (data.mensajes.length > 0) {
            daosContenedor.compresion().then((compresion) => {
                res.render("products", { data: products, chat: data.mensajes, compresion: compresion, user: req.user.username })
            })
        } else {
            res.render("products", { data: products, chat: data.mensajes, user: req.username });
        }
    }).catch((err) => {
        console.log(err)
    })
});

app.get("/login", isNotAuthenticated, (req, res) => {
    req.session.user && res.redirect("/")
    res.render("login")
})

app.post("/login", passport.authenticate('login', { successRedirect: '/', failureRedirect: '/faillogin' }), (req, res) => {
    res.redirect("/")
})

app.get("/faillogin", (req, res) => {
    res.render("login", { error: true })
});


app.get("/register", isNotAuthenticated, (req, res) => {
    res.render("register")
})

app.post("/register", passport.authenticate('register', { successRedirect: '/', failureRedirect: '/failregister' }), (req, res) => {
    res.redirect("/")
})

app.get("/failregister", (req, res) => {
    res.render("register", { error: true })
});


app.get("/logout", (req, res) => {
    req.logout(() => res.redirect("/login"));
})



server.listen(port, () => {
    console.log("Server is running on port " + port);
});
