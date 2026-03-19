import AnecdoteForm from './components/AnecdoteForm.jsx'
import AnecdoteList from './components/AnecdoteList.jsx'
import Filter from './components/Filtering.jsx'
import Notification from './components/Notification.jsx'
import { useEffect } from 'react'
import { initializeAnecdote } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'



const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeAnecdote())
  }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <Notification />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App