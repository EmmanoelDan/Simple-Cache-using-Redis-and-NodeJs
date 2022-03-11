const express = require ('express');
const responseTime = require('response-time');
const routes = require('./routes')

const PORT = process.env.PORT || 3333;

const server = express();

server.use(responseTime());

server.use(routes);

server.listen(3333, () =>{
    console.log(`Server is Running ${PORT}`)
});