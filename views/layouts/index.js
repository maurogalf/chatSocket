const socket = io();

socket.on("connect", () => {
    console.log("conectado");
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

const formChange = () => {
    let button = document.getElementById("btnSend");
    let username = document.getElementById("username");
    let name = document.getElementById("name");
    let address = document.getElementById("address");
    let age = document.getElementById("age");
    let phone = document.getElementById("phone");
    let avatar = document.getElementById("avatar");
    let password = document.getElementById("password");
    let passwordConfirm = document.getElementById("confirm-pw");

    if (
        username.value !== "" &&
        name.value !== "" &&
        address.value !== "" &&
        age.value !== "" &&
        phone.value !== "" &&
        avatar.value !== "" &&
        password.value !== ""
    ) {
        if (password.value !== passwordConfirm.value) {
            button.disabled = true;
            if (document.getElementById("message") === null) {
                button.parentElement.insertAdjacentHTML(
                    "afterbegin",
                    `<div id="message">Please confirm password. </div>`
                );
            }
        } else {
            document.getElementById("message") &&
                document.getElementById("message").remove();
            if (!isImage(avatar.value)) {
                button.parentElement.insertAdjacentHTML(
                    "afterbegin",
                    `<div id="message-image">Please image file only. </div>`
                );
            } else {
                document.getElementById("message-image") && document.getElementById("message-image").remove();
                button.disabled = false;
            }
        }
    } else {
        button.disabled = true;
    }
};

const getExtension = (filename) => {
    let extension = filename.split(".").pop().toLowerCase();
    return extension;
};

const isImage = (filename) => {
    let extension = getExtension(filename);
    switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "bmp":
        case "svg":
            return true;
    }
    return false;
};

//DESHABILITAR BOTTON
if (document.location.pathname === "/") {
    let button = document.getElementById("btnSend");
    let user = document.getElementById("email");
    user.addEventListener("change", () => {
        if (user != "") {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
}

// COMPLETAR FORMULARIO AUTOMATICAMENTE
function complete() {
    socket.emit("complete");
}
