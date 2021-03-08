const WebSocket = require("ws");
const fs = require("fs");
const { ifError } = require("assert");
const { send } = require("process");

const clients = [];
const messages = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
     clients.push(ws);
     sendMessages();

    ws.on("message", (info) => {
      const infoArreglada = JSON.parse(info)
      messages.push(infoArreglada);     
      sendMessages();
      ws.send(JSON.stringify(infoArreglada))
    });
  });

  const sendMessages = () => { 
    clients.forEach((client) => client.send(JSON.stringify(messages)));
  };
};

exports.wsConnection = wsConnection;