const { Router }= require('express'); 
const axios = require('axios')
const routes = Router()
const { setAsync, getAsync } = require('../src/config/redisConfig')

routes.get('/rockets', async (req, res, next)=>{
    try {
        const reply = await getAsync('rockets')
        if(reply){
            console.log('using cached data')
            res.send(JSON.parse(reply))
            next
        }
        const response = await axios.get('http://api.spacexdata.com/v3/rockets/')
        const saveResult = await setAsync('rockets', JSON.stringify(response.data), 'EX', 5)
        console.log('new data cached', saveResult)
        res.send(response.data)
    } catch (error) {
        res.send(500)
    }
})
routes.post('/rockets', async (req, res, next)=>{
    try {
        const reply = await getAsync('rockets')
        if(reply){
            console.log('using cached data')
            res.send(JSON.parse(reply))
            return
        }
        const response = await axios.get('http://api.spacexdata.com/v3/rockets')
        const saveResult = await setAsync('rockets', JSON.stringify(response.data), 'EX', 5)
        console.log('new data cached', saveResult)
        res.send(response.data)
    } catch (error) {
        res.send(500)
    }
})

module.exports = routes;