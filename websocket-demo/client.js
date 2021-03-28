const WebSocket = require('ws');
const express = require('express');

const app = express();

 
 
app.use('/send/:mes',(req,res)=>{

const ws = new WebSocket('ws://10.135.123.39:8080');
  ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function incoming(data) {
  
  res.sendStatus(200);
 console.log(data);
});
  ws.send(req.params.mes);
});

app.listen(3000);
