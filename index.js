//web server
const express =require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json());  //Middleware to parse JSON in the request body

app.use(morgan('tiny')); //‘tiny' configuration with morgan

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});
//only show the format like this: POST /api/persons 200 58 - 3.031 ms

// Use morgan to log body along with other details
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
//show the all details like this: POST /api/persons 200 58 - 3.031 ms {"name":"Jason Abramov","number":"12-53-234357"}

//get the persons from the mongodb database (scheme)


const dotenv = require('dotenv');
dotenv.config()
// loads environment variables, the MONGODB_URI from .env file file into process.env


// connect the frontend with the frontend as the localhost number in frontend and backend are different 
const cors = require('cors')
app.use(cors())
// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

const Phone = require('./models/phonebook')

// app.use(requestLogger)

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)

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
    const path = require('path');
    app.use(express.static(path.join(__dirname, 'dist')));

    app.get('/api/persons', (request, response) => {
      Phone.find({}).then(person =>{
        response.json(person)
      })
  })

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    
    Phone.findById(id).then(person=>{
      if (person){
        response.json(person)
      }
      else{
        //if the person is not identified
        response.status(404).end()
      }
    })
    
  })
  app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Phone.findByIdAndDelete(id)
    .then(result =>{
      response.status(204).end()
    })
    .catch(error=> next(error))
  })

  app.put('/api/persons/:id', (request, response, next)=>{
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }
    Phone.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatednote =>{
      response.json(updatednote)
    })
    .catch(error=> next(error))
    })

    
    
 

    app.post('/api/persons', (request, response) => {
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
    })

  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})