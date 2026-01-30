import mongoose from 'mongoose'

const persSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: (v) => /^\d{2,3}-\d+$/.test(v) && v.replace('-', '').length >= 8,
      message: (props) => `${props.value} is not a valid phone number`,
    }
  }
})

persSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('Person', persSchema)