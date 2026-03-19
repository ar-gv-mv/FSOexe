import { createSlice } from '@reduxjs/toolkit'


const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotificationState(state, action) {
            console.log("is it here")
            return action.payload
        },
        setNul() {
            return ''
        }
    }
})

export const { setNul, setNotificationState} = notificationSlice.actions

let endTime
export const setNotification = (notif, time) => {
    return dispatch => {
        dispatch(setNotificationState(notif))
        if (endTime) {
            clearTimeout(endTime)
        }
        endTime = setTimeout(() => {
            dispatch(setNul())
            endTime = null
        }, time * 1000)
    }
}

export default notificationSlice.reducer