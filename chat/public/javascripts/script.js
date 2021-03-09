const ws = new WebSocket("ws://localhost:3000");

(async function fetchMessages()
{
    const mensajes = await fetch("http://localhost:3000/chat/api/messages");
})()

async function postMessages(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST', 
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', 
    referrerPolicy: 'no-referrer', 
    body: JSON.stringify(data) 
  });
  return response.json(); 
}

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
  const info = 
  {
    message: message.value,
    author: author.value,
  }
  try{
    const objeto = postMessages("http://localhost:3000/chat/api/messages",info)
    objeto.then(data => alert(data.details[0].message))
  }
  catch(err)
  {
     
  }
  message.value = "";
  author.value = "";
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);



