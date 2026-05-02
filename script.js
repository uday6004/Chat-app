const socket = io();

// unique id
const myId = Math.random().toString(36).substr(2, 9);

// avatar
const myAvatar = "https://i.pravatar.cc/40?u=" + myId;

// send message
function sendMessage() {
  let input = document.getElementById("message");
  let imageInput = document.getElementById("imageInput");

  let message = input.value;
  let file = imageInput.files[0];

  if (message === "" && !file) return;

  if (file) {
    let reader = new FileReader();

    reader.onload = function () {
      socket.emit("send-message", {
        text: message,
        image: reader.result,
        sender: myId,
        avatar: myAvatar
      });
    };

    reader.readAsDataURL(file);
  } else {
    socket.emit("send-message", {
      text: message,
      image: null,
      sender: myId,
      avatar: myAvatar
    });
  }

  input.value = "";
  imageInput.value = "";
}

// receive
socket.on("receive-message", (data) => {
  let type = data.sender === myId ? "sent" : "received";
  addMessage(data.text, type, data.avatar, data.image);
});

// display
function addMessage(text, type, avatarUrl, image) {
  let chatBox = document.getElementById("chat-box");

  let row = document.createElement("div");
  row.classList.add("message-row", type + "-row");

  let avatar = document.createElement("img");
  avatar.src = avatarUrl;
  avatar.classList.add("avatar");

  let msg = document.createElement("div");
  msg.classList.add("message", type);

  if (text) {
    let textNode = document.createElement("div");
    textNode.innerText = text;
    msg.appendChild(textNode);
  }

  if (image) {
    let img = document.createElement("img");
    img.src = image;
    msg.appendChild(img);
  }

  if (type === "sent") {
    row.appendChild(msg);
    row.appendChild(avatar);
  } else {
    row.appendChild(avatar);
    row.appendChild(msg);
  }

  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}
