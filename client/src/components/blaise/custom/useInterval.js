import React from 'react'

export const useInterval = (interval, onFetch) => {
  const isUnmounted = React.useRef(false)
  const intervalRef = React.useRef()
  const [currentTime, setCurrentTime] = React.useState()

  const resetTimer = React.useCallback(() => {
    if (typeof onFetch === 'function') onFetch()

    clearInterval(intervalRef.current)
    setCurrentTime(interval)
    if (interval !== 0) {
      intervalRef.current = setInterval(() => {
        if (isUnmounted.current) return
        setCurrentTime(prev => prev - 1)
      }, 1000)
    }
  }, [interval, onFetch])

  React.useEffect(() => {
    setCurrentTime(0)
  }, [interval])
  React.useEffect(() => {
    if (currentTime <= 0) resetTimer()
  }, [currentTime, resetTimer])

  React.useEffect(() => {
    return () => {
      isUnmounted.current = true
      clearInterval(intervalRef.current)
    }
  }, [])

  return [currentTime, resetTimer]
}
export const useIntervalLazyLoad = (interval, increment, data = []) => {
  const [internalInterval, setInternalInterval] = React.useState(0)
  const [maxDisplay, setMaxDisplay] = React.useState(0)

  const onInterval = React.useCallback(() => {
    setMaxDisplay(prev => {
      const nextMaxDisplay = prev + increment

      // stop interval if nextMaxDisplay > array length
      if (nextMaxDisplay > data.length) {
        setInternalInterval(0)
        return prev
      }

      // continue interval
      setInternalInterval(interval)
      return nextMaxDisplay
    })
  }, [interval, increment, data.length])
  useInterval(internalInterval, onInterval)

  const newData = React.useMemo(() => {
    return data.slice(0, maxDisplay)
  }, [data, maxDisplay])
  const resetMaxDisplay = () => setMaxDisplay(0)
  return [newData, resetMaxDisplay]
}

export default useInterval
