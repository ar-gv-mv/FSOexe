import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import Person from './models/person.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

const app = express()
const PORT = process.env.PORT || 3003

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).json({ error:'malformatted id' })
  } else if (error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) =>
  req.method === 'POST' ? JSON.stringify(req.body) : ''
)

app.use(morgan('tiny :body'))

app.get('/', (request, response) => {
  response.send('Hi')
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


app.get('/persons', (request, response) => {
  response.json(persons)
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(pers => {
      if (pers) {
        response.json(pers)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const person = {
    name: name,
    number: number,
  }
  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updPers => {
      if (updPers) {
        response.json(updPers)
      } else {
        response.status(404).end()
      }})
    .catch(next)
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(next)
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {res.send(`Phonebook has info for ${count} people<br/>${new Date()}`)})
    .catch(next)
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  Person.findOne({ name })
    .then(found => {
      if (found) {
        return res.status(400).json({ error: 'name must be unique' })
      }

      const person = new Person({ name, number })
      return person.save().then(saved => res.json(saved))
    })
    .catch(next)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(unknownEndpoint)
app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})