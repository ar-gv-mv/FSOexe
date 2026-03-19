import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdote, voteAnecdote } from './requests'
import {useNotify} from './NotificationContext'

const App = () => {

  const queryClient = useQueryClient()
  const notify = useNotify()

  const updateAnecdoteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
})

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes+1 })
    notify(`anecdote ${anecdote.content} voted`, 5)
  }


  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdote,
    retry: false
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>Loading...</div>
  }

  if ( result.isError ) {
    return <div>anecdote service not available due to problems in server</div>
  }


  const anecdotes = result.data

  console.log(result)

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
