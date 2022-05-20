const express = require("express");
const knex = require("./db");

const app = express();

// ARCHIVOS ESTATICOS
app.use(express.static("views/layouts"));

// ARREGLO DE CHAT
const chat = [];

// SERVER
const http = require("http");
const server = http.createServer(app);

// PUERTO
const port = process.env.PORT || 8080;

const handlebars = require("express-handlebars");
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
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials",
    })
);

// SERVER SOCKET
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("Cliente conectado");
    //AGREGO NUEVO PRODUCTO
    socket.on("newproduct", (data) => {
        let newPr = data;
        knex("products")
            .insert(newPr)
            .then(() => {
                console.log("Producto agregado");
                io.sockets.emit("productAdded", newPr);
                return false;
            })
            .catch((err) => {
                console.log(err);
            });
    });

    socket.on("newMsg", (data) => {
        let newMsg = data;
        knex("chat")
            .insert(newMsg)
            .then(() => {
                console.log("Mensaje agregado");
                io.sockets.emit("newMsg", newMsg);
                return false;
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

// RUTA PRINCIPAL

app.get("/", (req, res) => {
    knex
        .select()
        .table("products")
        .then((data) => {
            let array = data;
            knex
                .select()
                .table("chat")
                .then((data) => {
                    let chat = data;
                    res.render("products", { data: array, chat: chat });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

// ELIMINAR PRODUCTO

app.delete("/delete/:id", (req, res) => {
    knex
        .select()
        .table("products")
        .where("id", req.params.id)
        .del()
        .then((data) => {
            console.log("Producto eliminado");
            res.send("Producto eliminado");
        })
        .catch((err) => {
            console.log(err);
        });
});

// ACTUALIZAR PRODUCTO

app.put("/update/:id", (req, res) => {
    knex
        .select()
        .table("products")
        .where("id", req.params.id)
        .update(req.body)
        .then((data) => {
            console.log("Producto actualizado");
            res.send("Producto actualizado");
        })
        .catch((err) => {
            console.log(err);
        });
});

server.listen(port, () => {
    console.log("Server is running on port " + port);
});
