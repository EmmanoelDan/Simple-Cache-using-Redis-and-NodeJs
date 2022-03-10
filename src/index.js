const express = require('express'); 
const axios = require('axios')
const redis = require('redis');
const responseTime = require('response-time');
const {promisify} = require('util')

const PORT = process.env.PORT || 3333;
const PORT_REDIS = process.env.PORT_REDIS || 6379

const app = express()

app.use(responseTime())


const client = redis.createClient(PORT_REDIS);

const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)


app.get('/rockets', async (req, res, next)=>{
    try {
        const reply = await getAsync('rockets')
        if(reply){
            console.log('using cached data')
            res.send(JSON.parse(reply))
            return
        }
        const response = await axios.get('http://api.spacexdata.com/v3/rockets/')
        const saveResult = await setAsync('rockets', JSON.stringify(response.data), 'EX', 5)
        console.log('new data cached', saveResult)
        res.send(response.data)
    } catch (error) {
        res.send(500)
    }
})
app.post('/rockets', async (req, res, next)=>{
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

app.listen(3333, () =>{
    console.log(`App listening port ${PORT}`)
});