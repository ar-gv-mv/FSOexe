import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    voting(state, action) {
      const content = action.payload
      const anecdote = state.find(n => n.id === content.id)
      if (anecdote) {
        anecdote.votes = content.votes
      }
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    appendNote(state, action) {
      state.push(action.payload)
    }
  }
})

export const { voting, setAnecdotes, appendNote } = anecdoteSlice.actions

export const initializeAnecdote = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendNote(newAnecdote))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const voteUpdated = {...anecdote, votes: anecdote.votes+1}
    const anecdoteUpd = await anecdoteService.update(voteUpdated)
    dispatch(voting(anecdoteUpd))
  }
}


export default anecdoteSlice.reducer