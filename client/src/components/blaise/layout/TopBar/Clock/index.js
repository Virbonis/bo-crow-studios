import dayjs from 'dayjs'
import React from 'react'

const Clock = () => {
  const [clockTime, setClockTime] = React.useState()

  const UpdateClockTime = () => {
    setClockTime(
      dayjs()
        .utcOffset(8)
        .format('ddd, DD MMM YYYY HH:mm:ss'),
    )
  }
  setInterval(UpdateClockTime)
  return <span>{clockTime}</span>
}

export default Clock
