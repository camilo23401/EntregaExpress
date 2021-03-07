var express = require('express');
var router = express.Router();
const Joi = require("joi");
const WebSocket = require("ws")
const ws = new WebSocket("ws://localhost:3000");

const mensajes = []
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(mensajes);
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
    author: Joi.string().required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error);
  }

  const msg = {
    ts: mensajes.length + 1,
    message: req.body.message,
    author: req.body.author
  };

  mensajes.push(msg);
  res.send(msg);
  ws.send(msg.message);
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
 

module.exports = router;
