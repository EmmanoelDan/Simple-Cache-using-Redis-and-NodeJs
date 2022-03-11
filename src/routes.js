const express = require('express');
const { getShips } = require('./models/getShips');
const routes = express.Router();
const bodyParser = require('body-parser')

routes.use(bodyParser.json())

// middleware que mostra Nome da Rota/ Verbo HTTP
routes.use((req, res, next)=>{
    console.log(`
        request type: ${req.method} \n
        name route: ${req.url}
        `)
    next()
})


routes.get('/ships/:ship_id', getShips)


module.exports = routes;
