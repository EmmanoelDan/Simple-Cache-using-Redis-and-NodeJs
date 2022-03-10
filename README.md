# Simple-Cache-using-Redis-and-NodeJs
Node JS API with Express

The objective of the activity, and the construction of an api node, using the redis.
Redis is an open source in-memory data store that offers response times of less than milliseconds.In this way, we created an application that uses this tool as a cache in a public api.

Public Api - http://api.spacexdata.com/v3/rockets/

The idea was to build a simple api, no need to use an api. But I had some problems with the machine. So I decided to use a public api and do Redis' methods.
Before you start the project, you must create a redis container in docker. Recommend, use the hub docker, it teaches step by step the installation and startup of a container(https://hub.docker.com/).
Next, we'll start our project in vscode or in the code editor of your choice.

Creating the project root folder - mkdir <nome-da-pasta>

When we create the folder, we need to start a node project in our folder, it is quite simple. the command used to start the project and npm init -y. Next we install all the modules that we will use in the project.

npm install nodemon redis express

	Redis is the module that will handle cache requests in our project, nodemon monitors changes in our code and updates even when running our server, and express is a Javascript library, which handles http requests.

#Iniciando nosso servidor HTTP

const express = require('express');
const PORT = process.env.PORT || 3333;
 
const app = express()
 
app.listen(3333, () =>{
   console.log(`App listening port ${PORT}`)
});


	That way, we start an express server. Now you need to create the routes of our server.

#GET/
app.get('/rockets', async (req, res, next)=>{
   try {
       const reply = await getAsync('rockets')
       if(reply){
           console.log('using cached data')
           res.send(JSON.parse(reply))
           return
       }
     const response = await       axios.get('http://api.spacexdata.com/v3/rockets/')
       const saveResult = await setAsync('rockets', JSON.stringify(response.data), 'EX', 5)
       console.log('new data cached', saveResult)
       res.send(response.data)
   } catch (error) {
       res.send(500)
   }
})


#POST/
The post method is not working 100% the correct way, we have to solve this problem. It's going to be on github, end of that document.

#Starting REDIS

We started the redis module, first we need to import.

const redis = require('redis');

	Next, let's declare our connection to the createClient. And so we can start our redis methods.

A definition of the methods:
the get returns the current value set, and the set at the same time that it sets a new stored value.



const client = redis.createClient(PORT_REDIS);
 
const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)

It is noticed, that I called my methods getAsync and setAsync, within my http request.
const reply = await getAsync('rockets')
       if(reply){
           console.log('using cached data')
           res.send(JSON.parse(reply))
           return
       }

If i already have a cache created, it returns a console.log('using cached data') and returns the data to me in res.send, transformed into JSON.
If it has no cache created, it returns the setAsync method.

const saveResult = await setAsync('rockets', JSON.stringify(response.data), 'EX', 5)
       console.log('new data cached', saveResult)
       res.send(response.data)

As I talked earlier about the set method, it will set a new value stored in the cache, in which case we store in a variable called saveResult and then return the values with a response.data.

Result

	To test if it worked we tested in the file rest.http:
### GEt all rockets
 
GET http://localhost:3333/rockets

	When we made a send, we received the value in milliseconds that it took to show our list.

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 7736
ETag: W/"1e38-qt5hfLKtC7N05LKfA7P+FqW6WTc"
X-Response-Time: 772.251ms
Date: Thu, 10 Mar 2022 19:31:00 GMT
Connection: close

	When making our request, we have a value of 772,251 ms for our request. When you place the request, it shows on our console that "new data cached OK". We created our cache, now let's make another request, and see the time in ms.
	Our X-Response-Time result: 0.933ms, improving and greatly improving our response time. In our console, we show that we are using the saved cache, "using cached data".

#Conclusion

Building a web application isn't just about using a database. should think about optimizing tasks, and using various technologies that help in our work. Redis becomes an important factor in the performance and quality of a project. The learning process is arduous, but with dedication we were able to accomplish our goals, despite not delivering the activity in the desired way. I learned a little more about development and our best allies.
