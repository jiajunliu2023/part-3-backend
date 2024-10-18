//web server
const express = require('express')
const app = express()
const morgan = require('morgan')
const path = require('path');
const dotenv = require('dotenv');
// Load environment variables
dotenv.config()
// loads environment variables, the MONGODB_URI from .env file file into process.env

//Middleware to parse JSON in the request body
app.use(express.json());

const cors = require('cors')
app.use(cors())
// connect the frontend with the frontend as the localhost number in frontend and backend are different

const Phone = require('./models/phonebook')





// Middleware setup

app.use(express.static(path.join(__dirname, 'dist')));


  

app.use(morgan('tiny')); //‘tiny' configuration with morgan

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});
//only show the format like this: POST /api/persons 200 58 - 3.031 ms

// Use morgan to log body along with other details
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
//show the all details like this: POST /api/persons 200 58 - 3.031 ms {"name":"Jason Abramov","number":"12-53-234357"}

//get the persons from the mongodb database (scheme)








// request.body is undefined!

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}



app.use(requestLogger)


//     app.get('/', (request, response) => {
//     response.send('<h1>Hello World!</h1>')
//   })
    // app.get('/info', (request, response) =>{
    //     const time = new Date().toString();
    //     response.send(`
    //         <p> Phonebook has info for ${persons.length} people</p>
    //         <p>${time}</p>`
    //     )
    // })
    

  app.get('/api/persons', (request, response) => {
      Phone.find({}).then(person =>{
        response.json(person)
      })
  })

  

  app.get('/api/persons/:id', (request, response, next) => {
    
    
    Phone.findById(request.params.id)
    .then(person => {
      if (person){
        response.json(person)
      }
      else{
        //if the person is not identified
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  })
    
  
  app.delete('/api/persons/:id', (request, response, next) => {
   
    Phone.findByIdAndDelete(request.params.id)
    .then(result =>{
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next)=>{
    const {name, number} = request.body

    const updateBody = {name, number}

    // const person = {
    //     name: name,
    //     number: number
    // }
    Phone.findByIdAndUpdate(request.params.id, updateBody, {new: true, runValidators: true, context: 'query'})
    .then(updatednote =>{
      response.json(updatednote)
    })
    .catch(error=> next(error))
    })

    
    
 

    app.post('/api/persons', (request, response, next) => {
      const body = request.body
    
      if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'name or number missing' })
      }
    
      const person = new Phone({
        name: body.name,
        number: body.number,
      })
    
      person.save().then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error=>{
        if (error.name === "ValidationError"){
          return response.status(400).json({ error: error.message })
        }
        next(error);
      })
    })

  const unknownEndpoint = (request, response)=>{
    response.status(404).send({ error: 'unknown endpoint' })
  }

  // handler of requests with unknown endpoint
  app.use(unknownEndpoint);

  const errorHandler = (error, request, response, next) =>{
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }else if (error.name === 'ValidationError'){
      //if the field of phone object validate the constraints 
      return response.status(400).json({error: error.message})
    }
    next(error)
  }

  // this has to be the last loaded middleware, also all the routes should be registered before this!
  // handler of requests with result to errors
  app.use(errorHandler)

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})