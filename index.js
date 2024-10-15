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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const cors = require('cors')
app.use(cors())
// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }



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
    response.json(persons)
  })

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person){
        response.json(person)
    }
    else{
        //if the person is not identified
        response.status(404).end()
    }
    
  })
  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (request, response)=>{
    const id = Math.floor(Math.random() * 100)
    const b = request.body;
    if (!b.name || !b.number){
      return response.status(400).json({
        error:'name or number missing'
      })
    }
    const nameCheckEXIST = persons.some(person => person.name === b.name)
    if (nameCheckEXIST){
      return response.status(400).json({
        error:'name must be unique'
      })
    }

    
    const newPerson ={
        id: id.toString(),
        name: b.name,
        number: b.number
    };
    persons = persons.concat(newPerson)
    response.json(newPerson);
  })

  app.put('/persons/:id', (request, response)=>{
    const id = request.params.id
    const index = persons.findIndex(person => person.id === id);

    const updatePerson = request.body
    
    if (index === -1){
      return response.status(400).json({
        error:'person is not identified'
      })
    }
    persons[index].name = updatePerson.name
    persons[index].number = updatePerson.number
    
    response.json(persons[index])
    
  })

  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})