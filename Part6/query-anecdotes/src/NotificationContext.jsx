import { createContext, useReducer, useContext } from 'react'
const notificationReducer = (state, action) => {
    switch (action.type) {
        case "VIEW": {
            return action.payload
        }
        case "HIDE": {
            return ''
        }
        default:
            return state
    }
}

const NotificationContext = createContext()

let endTime
export const NotificationProvider = (props) => {
    const [notification, dispatch] = useReducer(notificationReducer, '')
    const notify = (message, seconds = 5) => {
        dispatch({type: 'VIEW', payload: message})
        if (endTime) clearTimeout(endTime)
        endTime = setTimeout(() => {
            dispatch({type: 'HIDE'})
            endTime = null
      }, seconds * 1000)
    }
    return (
      <NotificationContext.Provider value={{ notification, dispatch, notify }}>
        {props.children}
      </NotificationContext.Provider>
    )
}

export const useNotification = () => useContext(NotificationContext).notification
export const useNotify = () => useContext(NotificationContext).notify
export default NotificationContext
