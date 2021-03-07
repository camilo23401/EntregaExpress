const WebSocket = require("ws");
const fs = require("fs");

const clients = [];
const messages = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
     clients.push(ws);
     fs.readFile('mensajesCliente.json', (err, data) => {
      if (err) 
      {
        sendMessages();
        throw err;
      }
      else{  
        let persistedMessagesString = JSON.stringify(data)
        var persistedMessages = JSON.parse(persistedMessagesString)
        messages.concat(persistedMessages.message);
        sendMessages();
      }
    });

    ws.on("message", (message) => {
      messages.push(message);     
      sendMessages();
      const jsons = messages.map(volverJson)
      fs.writeFile('mensajesCliente.json',JSON.stringify(jsons),(err)=>
      {
        if(err)
        {
          throw err;
        }
      })
    });
  });

  function volverJson(message)
  {
    const mensaje = {
      message: message
    }
    return mensaje;
  }

  const sendMessages = () => { 
    clients.forEach((client) => client.send(JSON.stringify(messages)));
  };
};

exports.wsConnection = wsConnection;