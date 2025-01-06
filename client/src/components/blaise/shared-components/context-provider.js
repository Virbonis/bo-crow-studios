import { merge } from 'lodash'
import React from 'react'

export const Context = React.createContext()

const contextReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PAYLOAD':
      return merge({}, state, action.payload)
    case 'RESET_PAYLOAD':
      return initialState
    default:
      return state
  }
}

export const ContextProvider = ({ children }) => {
  const value = useContextValue()
  return <Context.Provider value={value}>{children}</Context.Provider>
}

const initialState = {}
const useContextValue = () => {
  const [payload, dispatch] = React.useReducer(contextReducer, initialState)

  const updatePayload = React.useCallback(newPayload => {
    dispatch({ type: 'UPDATE_PAYLOAD', payload: newPayload })
  }, [])

  const resetPayload = React.useCallback(() => {
    dispatch({ type: 'RESET_PAYLOAD' })
  }, [])

  return {
    payload,
    updatePayload,
    resetPayload,
  }
}

export default Context
