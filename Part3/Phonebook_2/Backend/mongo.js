import mongoose from 'mongoose'

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)

const persSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', persSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(p => console.log(`${p.name} ${p.number}`))
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const person = new Person({ name, number })
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  mongoose.connection.close()
}