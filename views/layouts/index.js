import logger from "../../winston.js";
const socket = io();

socket.on("connect", () => {
    logger.info("conectado");
});

socket.on("newMsg", (data) => {
    imprimirMensaje(data);
});

socket.on("complete", (user) => {
    document.getElementById("email").value = user.email;
    document.getElementById("nombre").value = user.nombre;
    document.getElementById("apellido").value = user.apellido;
    document.getElementById("edad").value = user.edad;
    document.getElementById("alias").value = user.alias;
    document.getElementById("avatar").value = user.avatar;
    document.getElementById("mensaje").value = user.mensaje;
    document.getElementById("btnSend").disabled = false;
});

//IMPRIMO MENSAJES
imprimirMensaje = ({ newMsg, compresion }) => {
    document.querySelector("#chatBox").innerHTML += `
    <p>
        <img style="width:50px; height:50px" src=${newMsg.author.avatar} alt="">
        <spam class="fw-bold text-primary" >${newMsg.author.nombre} ${newMsg.author.apellido}</spam> :  
        <spam class="fst-italic text-success">${newMsg.text}</spam> 
    </p>
    `;
    if (newMsg.id > 1) {
        document.querySelector("#compresion").innerText = compresion;
    } else {
        document.querySelector("#compBox").innerHTML = `
        <h3 class="text-white text-center">Compression percentage : <span id="compresion">${compresion}</span>%</h3>
        `;
    }
};
//ENVIO MENSAJE
const sendMessage = () => {
    let author = {
        id: document.getElementById("email").value,
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        edad: document.getElementById("edad").value,
        alias: document.getElementById("alias").value,
        avatar: document.getElementById("avatar").value,
    };
    let text = document.getElementById("mensaje").value;
    let newMsg = {
        author: author,
        text: text,
    };
    socket.emit("newMsg", newMsg);
    document.getElementById("mensaje").value = "";
    document.getAnimations("email").disabled;
    return false;
};

//DESHABILITAR BOTTON
let button = document.getElementById("btnSend");
let user = document.getElementById("email");
user.addEventListener("change", () => {
    if (user != "") {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
});
// COMPLETAR FORMULARIO AUTOMATICAMENTE
const complete = () => {
    socket.emit("complete");
};
