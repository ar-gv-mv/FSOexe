import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import {useNotify} from '../NotificationContext'


const AnecdoteForm = () => {

  const queryClient = useQueryClient()
  const notify = useNotify()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['anecdotes']})
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if (content.length < 5) {
      notify('Anecdote must be at least 5 characters long', 5)
      return
    }
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, votes: 0})
    notify(`anecdote ${content} added`, 5)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
