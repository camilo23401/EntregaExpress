const ws = new WebSocket("ws://localhost:3000");


ws.onmessage = (msg) => {
  console.log(JSON.parse(msg.data))
  renderMessages(JSON.parse(msg.data));
};

const renderMessages = (data) => {
  const html = data.map((item) => `<p>${item.message} - Sent by: ${item.author} </p>`).join(" ");
  document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
  evt.preventDefault();
  const message = document.getElementById("message");
  const author = document.getElementById("author");
  const ts = new Date().valueOf();
  const info = 
  {
    message: message.value,
    author: author.value,
    ts: ts
  }
  ws.send(JSON.stringify(info));
  message.value = "";
  author.value = "";
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);



