const socket = io();

socket.on("connect", () => {
  if (
    document.location.pathname !== "/login" &&
    document.location.pathname !== "/register"
  ) {
    socket.emit("getMessages");
  }
  console.log("Chat conected");
});

socket.on("newMsg", (data) => {
  imprimirMensaje(data);
});

socket.on("sendMessages", ({ mensajes }) => {
  document.getElementById(
    "body"
  ).innerHTML += `<div id="chat" class="bg-light p-3" style="width: fit-content;">
  <div id="showChat" class="bg-dark p-3 rounded container justify-content-center"
      style="display:none; max-width: 500px;">
      <div class="d-flex justify-content-between">
          <h2 class="text-white text-center">Chat</h2>
          <button onclick="closeChat()" class="btn btn-outline-secondary me-4 mb-2">X</button>
      </div>
      <div id="chatBox" class="bg-light container justify-content-center rounded p-3"
          style="height: 300px; overflow: auto">
      </div>
      <form onsubmit="return sendMessage()" class="d-flex mt-2 justify-content-center">
          <div class="input-group">
              <textarea class="form-control" oninput="textChange()" id="mensaje" placeholder="Mensaje" aria-label="With textarea"
                  style="resize:none;"></textarea>
              <button disabled type="submit" id="btnSend" class="btn btn-primary">Send</button>
          </div>
      </form>
  </div>
  <div id="openChat">
      <button onclick="openChat()" class="btn btn-info"><i class="large material-icons">chat_bubble</i></button>
  </div>
</div>  `;

  mensajes.map((msg) => imprimirMensaje(msg));
});

//IMPRIMO MENSAJES
imprimirMensaje = (newMsg) => {
  document.querySelector("#chatBox").innerHTML += `
  <p>
    <img style="width:50px; height:50px" src="/${newMsg.author.avatar}" alt="">
    <spam class="fw-bold text-primary" >${newMsg.author.user}</spam>:  
    <spam class="fst-italic text-success">${newMsg.text}</spam> 
    </p>
    `;
  scrollChat();
};
//ENVIO MENSAJE
const sendMessage = () => {
  let text = document.getElementById("mensaje");
  const user = document.getElementById("user");
  let newMsg = {
    author: {
      user: user.textContent,
      id: user.textContent,
    },
    text: text.value,
  };
  socket.emit("newMsg", newMsg);
  text.value = "";
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
        document.getElementById("message-image") &&
          document.getElementById("message-image").remove();
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
    case "webp":
      return true;
  }
  return false;
};

const closeChat = () => {
  const chat = document.getElementById("showChat");
  chat.style.display = "none";
  const chatContainer = document.getElementById("chat");
  chatContainer.style.borderRadius = "50%";
  const opener = document.getElementById("openChat");
  opener.style.display = "block";
};

const openChat = () => {
  const chat = document.getElementById("showChat");
  chat.style.display = "block";
  scrollChat();
  const chatContainer = document.getElementById("chat");
  chatContainer.style.borderRadius = "15px";
  const opener = document.getElementById("openChat");
  opener.style.display = "none";
};

const scrollChat = () => {
  let chatBox = document.getElementById("chatBox");
  chatBox.scrollTop = chatBox.scrollHeight;
};
//DESHABILITAR BOTTON

const textChange = () => {
  const text = document.getElementById("mensaje").value;
  let button = document.getElementById("btnSend");
  if (text !== "") {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
};
