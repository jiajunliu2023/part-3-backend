const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

//get the mongodb url from the .env file 
const url = process.env.MONGODB_URI;

console.log('connecting to', url)


mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })


const PhoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})


//transform the id in a object to a string type data 
PhoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phone', PhoneSchema)