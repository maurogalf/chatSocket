const socket = io()

socket.on('connect', () => {
    console.log("conectado")
}
)
socket.on("productAdded", (data) => {
    imprimirProducto(data);
})

socket.on("newMsg", (data) => {
    imprimirMensaje(data);
})
//ENVIO PRODUCTO
addProduct = () => {
    let pr = {
        title : document.querySelector("#title").value,
        price : document.querySelector("#price").value,
        thumbnail : document.querySelector("#thumbnail").value
    }
    console.log(pr)
    socket.emit("newproduct", pr)
    document.querySelector("#title").value = "";
    document.querySelector("#price").value = "";
    document.querySelector("#thumbnail").value = "";
    return false
}
//IMPRIMO PRODUCTOS
imprimirProducto = (newPr) => {
    document.querySelector("#form").innerHTML += `    
    <tr>
    <th scope="row">${newPr.id}</th>
    <td>
    ${newPr.title}
    </td>
    <td>$ ${newPr.price}
    </td>
    <td>
    <img  style="max-width: 50px;" src=${newPr.thumbnail} >
    </td>
    </tr>
    `
}
//IMPRIMO MENSAJES
imprimirMensaje = (newMsg) => {
    document.querySelector("#chatBox").innerHTML += `
    <p><spam class="fw-bold text-primary" >${newMsg.user}</spam> <spam style="color: brown" >${newMsg.date}</spam> :  <spam class="fst-italic text-success">${newMsg.message}</spam> </p>
    `
}
//ENVIO MENSAJE
sendMessage = () => {
    let msg = {
        user : document.querySelector("#user").value,
        date: new Date(),
        message : document.querySelector("#message").value
    }
    socket.emit("newMsg", msg)
    document.querySelector("#message").value = "";
    document.querySelector("#user").disabled;
    return false
}

//DESHABILITAR BOTTON
let button = document.getElementById("btnSend");
let user = document.getElementById("user");
user.addEventListener("keyup", () => {
    if (user.value != "") {
        button.disabled = false;
    }
    else {
        button.disabled = true;
    }
}
)







