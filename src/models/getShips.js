const axios = require('axios');
const {setAsync, getAsync} = require('../config/redisConfig');

const getShips = async (req, res, next)=>{
    try {
        const {ship_id} = req.params;
        const response = await axios.get(`https://api.spacexdata.com/v3/ships/${ship_id}`)
    
        const reply = await getAsync(ship_id)
            
        if(!reply){  // cache hit
            const saveResult = await setAsync(ship_id,JSON.stringify(response.data),'EX',10)
            console.log('Create Cache', saveResult)
            res.send(response.data)
                
        } else if (reply) { // cache miss
            console.log('Using cache ....')
            res.send(JSON.parse(reply))
        } else{
            next()
        }
    }
    catch (error) {
        res.send(error)
    }
    console.log(req.params)
}

module.exports = {getShips}
