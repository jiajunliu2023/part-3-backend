import axios from 'axios'
import { useState, useEffect } from 'react';
import './index.css';

const SuccessNotification= ({message})=>{
  if (message === null){
    return null
  }
  return (
    <div className='success'>
      {message}
    </div>
  )
}
const ErrorNotification= ({message})=>{
  if (message === null){
    return null
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}
function App() {
  const [allpersons, setAllpersons] = useState([]) //used for keeping the original list
  const [persons, setPersons] = useState([]) // used for showing the filtered list result
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [wordType, setwordType] = useState('')
  const [successMessage, setsuccessMessage]= useState(null)
  const [errorMessage, seterrorMessage]= useState(null)


  const addFilter = (event)=>{
    event.preventDefault()
    const filterResult = allpersons.filter((person)=> person.name.toLowerCase().includes(wordType.toLowerCase()))
    setPersons(filterResult)
    
  }

  useEffect(()=>{
    console.log("effect")

    axios.get('http://localhost:3001/api/persons').then(response=>{
      console.log('promise fulfilled')
      setAllpersons(response.data)
      setPersons(response.data)
    })
  },[])

   const addNumber = (event) =>{
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name:newName,
      // important: Math.random() < 0.5,
      number:newNumber,
      id: String(persons.length + 1),
      
    }
    
    // check whether the name is already existed
    if (persons.some(person => person.name === newName)){
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const person = persons.find(person => person.name === newName)
        const id = parseInt(person.id)
        console.log(id);
          axios
              .put(`http://localhost:3001/api/persons/${id}`, personObject)
              .then(response=>{
                console.log('updated person', response.data);
                setPersons(persons.map(person => person.id !== id ? person : response.data))
              })
              
              .catch(error =>{
                console.log(error.message)
                seterrorMessage(
                  `Information of ${personObject.name} has already been removed from server`
                )
                setTimeout(() => {
                  seterrorMessage(null)
                }, 5000);
              }
        
              )
      }
    }else{
      axios
          .post('http://localhost:3001/api/persons',personObject)
          .then(response =>{
            setPersons(persons.concat(response.data))
            setsuccessMessage(
              `Added ${response.data.name}`
            )
            setTimeout(() => {
              setsuccessMessage(null)
            }, 5000);
            //set the sucess message to null after 5 seconds 
          })
          
    // the method does not mutate the original person, but creating a new copy of the array with new added item
      
    }
    setNewName('')
    setNewNumber('')
    
  }
  const deleteNumber=(person)=>{
    if (window.confirm(`Delete ${person.name}`)){
      const id = parseInt(person.id)
      console.log(id);
      axios.delete('http://localhost:3001/api/persons/' + id).then((response)=>{
        console.log(response);
      })
      
      
    }

  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      
      <form onSubmit={addFilter}>
        <div>
          filter shown with
          <input value={wordType}
          onChange={(event)=>setwordType(event.target.value)}/>
          <button type="submit">search</button>
        </div>
      </form>

      <SuccessNotification message={successMessage}/>
      <ErrorNotification message={errorMessage}/>
      <h2>Add a new</h2>
      <form onSubmit={addNumber}>
        <div>
          name: <input value={newName}
          onChange={(event)=> setNewName(event.target.value)}/>
        </div>

        <div>
          number: <input value={newNumber}
          onChange={(event)=> setNewNumber(event.target.value)}/>
        </div>
        <div>
            <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
          <div>
            {
              persons.map((person)=>
                <div key={person.id}>
                  <p>{person.name} {person.number} <button onClick={()=> deleteNumber(person)}>delete</button></p>
                </div>
              )
            }
          </div>
    </div>
  );
}

export default App;