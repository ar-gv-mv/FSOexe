import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdote = () => 
    axios.get(baseUrl).then(res => res.data)

export const createAnecdote = (newAnecdote) => 
    axios.post(baseUrl, newAnecdote).then(res => res.data)

export const voteAnecdote = async (updatedAnecdote) => {
    const response = await axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote)
    return response.data
}