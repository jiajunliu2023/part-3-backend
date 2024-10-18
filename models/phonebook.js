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
  name: {
    type: String,
    minLength: [3, 'The number of name character is at least 3'],
    required: [true, 'The name is required']
  },
  number: {
    type: String,
    minLength: [8, 'The number of phone number character is at least 8'],
    validate:{
      validator: function(v){
        return /^\d{2,3}-\d+$/.test(v);
        //(2 or 3 numbers) - numbers
      },
      message: props =>`${props.value} is not a valid phone number`
  },
    required: [true, 'The phone number is required']
  }
}
)


//transform the id in a object to a string type data 
PhoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phone', PhoneSchema)