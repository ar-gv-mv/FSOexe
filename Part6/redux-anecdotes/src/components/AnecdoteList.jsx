import { useSelector, useDispatch } from 'react-redux'
import {voteAnecdote} from '../reducers/anecdoteReducer'
import { setNotification} from '../reducers/notificationReducer'

const AnecdoteList = () => {

  const anecdotes = useSelector(({filter, anecdotes}) => {
    const sortedAnecdotes = [...anecdotes]
    sortedAnecdotes.sort((a,b) => b.votes - a.votes)

    if (filter === '') {
      return sortedAnecdotes
    } else {
      return sortedAnecdotes.filter((anecdote) => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    }
  })

  const dispatch = useDispatch()

  const vote = (anecdote) => {
    console.log(anecdote)
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
  }

  return (
    <div>
        {anecdotes.map(anecdote =>
            <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote)}>vote</button>
            </div>
            </div>
        )}
    </div>
  )
}

export default AnecdoteList