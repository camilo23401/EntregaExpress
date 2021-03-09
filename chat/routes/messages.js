var express = require('express');
var router = express.Router();
const Joi = require("joi");
const WebSocket = require("ws")
const ws = new WebSocket("ws://localhost:3000");
const fs = require("fs")

var mensajes = []
var cargo = false;
var tsMsgs = []
/* GET users listing. */

router.get('/', function(req, res, next) {
  leerPersistidos()
  res.send(mensajes);
  if(!cargo)
  {
    mensajes.map((item) => 
  {
    ws.send(JSON.stringify(item));
  });
  cargo = true;
  }
});

router.get('/:id', function(req, res, next) {
  const mensajeBuscado = mensajes.find((c)=>c.ts === parseInt(req.params.id));
  if(!mensajeBuscado)
  {
    return res.status(404).send("No existe un mensaje con ese ts");
  }
  else{
    res.send(mensajeBuscado)
  }
});

 router.post("/", (req, res) => {
   
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string().pattern(new RegExp('^([a-zA-Z])+([ ])+([a-zA-Z])')).required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error);
  }

  const ts = new Date().valueOf();
  const msg = {
    message: req.body.message,
    author: req.body.author,
    ts: ts
  };

  res.send(msg);
  ws.send(JSON.stringify(msg));
  persistirJSON(msg)
});

router.put("/:id", (req, res) => {
  const mensajeBuscado = mensajes.find((c)=>c.ts === parseInt(req.params.id));
  if(!mensajeBuscado)
  {
    return res.status(404).send("No existe un mensaje con ese ts");
  }
  else
  {
    const schema = Joi.object({
      message: Joi.string().min(5).required(),
      author: Joi.string().required()
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).send(error);
    }
  
    mensajeBuscado.message = req.body.message;
    mensajeBuscado.author = req.body.author;
    
    res.send(mensajeBuscado);
  }
});

router.delete("/:id", (req, res) => {
  const mensajeBuscado = mensajes.find((c)=>c.ts === parseInt(req.params.id));
  if(!mensajeBuscado)
  {
    return res.status(404).send("No existe un mensaje con ese ts");
  }
  else{
  const index = mensajes.indexOf(mensajeBuscado);
  mensajes.splice(index, 1);
  } 
  res.send(mensajeBuscado);
});

function persistirJSON(mensaje){
  try {
       mensajes.push(mensaje);
       fs.writeFileSync('mensajesCliente.json', JSON.stringify(mensajes));
   } catch (error) {
       console.log(error);
   }
}

function leerPersistidos()
{
  try{
    let mensajesPersistidos = fs.readFileSync('mensajesCliente.json','utf-8');
        mensajesLeidos = JSON.parse(mensajesPersistidos);
        tsMensajes();
        for(var i in mensajesLeidos)
        {
          if(!tsMsgs.includes(mensajesLeidos[i].ts))
          {
            mensajes.push(mensajesLeidos[i]);
          }
        }
  } catch(error)
  {
    console.log(error)
  }
}

function tsMensajes()
{
  for(var i in mensajes)
  {
    if(tsMsgs.includes(mensajes[i].ts))
    {

    }
    else{
      tsMsgs.push(mensajes[i].ts);
    }
  }
}


module.exports = router;
