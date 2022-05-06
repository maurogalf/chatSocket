const express = require('express');
const fs = require("fs");

const app = express();

// ARCHIVOS ESTATICOS
app.use(express.static('views/layouts'));

// ARREGLO DE CHAT
const chat = [];


// SERVER
const http = require("http")
const server = http.createServer(app);

// PUERTO
const port = process.env.PORT || 8080;


const handlebars = require('express-handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set("views", "./views")
app.set("view engine", "hbs")


// Configuracion de handlebars
app.engine( "hbs", handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
}));

// SERVER SOCKET
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("Cliente conectado");
    //AGREGO NUEVO PRODUCTO
    socket.on("newproduct", (data) => {
        let newPr = data;
        fs.readFile("./data/productos.json", "utf-8", (err, data) =>{
        if (err) {
            console.log("Error al leer el archivo")
        } else {
            let array  = JSON.parse(data);
            let id = array.length + 1;
            newPr.id = id;
            array.push(newPr);
            fs.writeFile("./data/productos.json", JSON.stringify(array), (err) => {
                if (err) {
                    console.log("Error al escribir el archivo")
                } else {
                    console.log("Producto agregado")
                }
            })
            io.sockets.emit("productAdded", newPr);
            return false;
        }})
    })
    socket.on("newMsg", (data) => {
        let newMsg = data;
        fs.readFile("./data/chat.json", "utf-8", (err, data) =>{
        if (err) {
            console.log("Error al leer el archivo")
        } else {
            if (data == "") {
                let array = [];
                array.push(newMsg);
                fs.writeFile("./data/chat.json", JSON.stringify(array), (err) => {
                    if (err) {
                        console.log("Error al escribir el archivo")
                    } else {
                        console.log("Mensaje agregado")
                    }
                }
                )
                io.sockets.emit("newMsg", newMsg);
                return false;
            } else {
            let array  = JSON.parse(data);
            array.push(newMsg);
            fs.writeFile("./data/chat.json", JSON.stringify(array), (err) => {
                if (err) {
                    console.log("Error al escribir el archivo")
                } else {
                    console.log("Mensaje agregado")
                }
            })
            io.sockets.emit("newMsg", newMsg);
            return false;
        }}})
        
    })
})


// RUTA PRINCIPAL

app.get("/", (req, res)=> {
    fs.readFile("./data/productos.json", "utf-8", (err, data) =>{
        if (err) {
            res.send("Error al leer el archivo")
        } else {
            let array  = JSON.parse(data); // ARRAY DE PRODUCTOS
            fs.readFile("./data/chat.json", "utf-8", (err, data) =>{
                if (err) {
                    res.send("Error al leer el archivo")
                } else {
                    if(data.length > 0){
                        let chat = JSON.parse(data);    // ARRAY DE CHAT
                        res.render("products", {data:array, chat:chat});           
                    } else {
                        res.render("products", {data:array});
                    }
                }
            })
            }           
    })
})



app.post("/newproduct", (req, res) => {
    let newPr = req.body;
    fs.readFile("./data/productos.json", "utf-8", (err, data) =>{
        if (err) {
            res.send("Error al leer el archivo")
        } else {
            let array  = JSON.parse(data);
            let id = array.length + 1;
            newPr.id = id;
            array.push(newPr);
            fs.writeFile("./data/productos.json", JSON.stringify(array), (err) => {
                if (err) {
                    res.send("Error al escribir el archivo")
                } else {
                    res.redirect("/getall")
                }
            })
        }
    }
    )
})


server.listen(port, () => {
    console.log('Server is running on port ' + port);
});
