import React from 'react'
import dayjs from 'dayjs'
import {
  GetDateTimeBusinessHour,
  GetDateTimeDBServer,
  GetLastGLDate,
  GetLastMemberTrackerDate,
} from 'services/general'

export const getDateRangeTime = showTime => {
  const now = dayjs().utcOffset(8)
  let startDate = dayjs().utcOffset(8)
  let endDate = dayjs().utcOffset(8)
  if (showTime) {
    if (now.hour() >= 12) {
      startDate = startDate.hour(12).minute(0)
      endDate = endDate
        .add(1, 'day')
        .hour(11)
        .minute(59)
    } else {
      startDate = startDate
        .subtract(1, 'day')
        .hour(12)
        .minute(0)
      endDate = endDate.hour(11).minute(59)
    }
  } else {
    // eslint-disable-next-line
    if (now.hour() >= 12) {
    } else {
      startDate = startDate.subtract(1, 'day')
      endDate = endDate.subtract(1, 'day')
    }
  }

  return { startDate, endDate }
}

export const useGetDateTimeDBServer = () => {
  const [dateTime, setDateTime] = React.useState()

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await GetDateTimeDBServer()
      setDateTime(dayjs.utc(response.data))
    }
    fetchData()
  }, [])

  return dateTime
}

export const useGetDateTimeBusinessHour = () => {
  const [dateTime, setDateTime] = React.useState()

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await GetDateTimeBusinessHour()
      setDateTime(dayjs.utc(response.data))
    }
    fetchData()
  }, [])

  return dateTime
}

export const useGetLastGLDate = () => {
  const [dateTime, setDateTime] = React.useState()

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await GetLastGLDate()
      setDateTime(dayjs.utc(response.data))
    }
    fetchData()
  }, [])

  return dateTime
}

export const useGetLastMemberTrackerDate = () => {
  const [dateTime, setDateTime] = React.useState()

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await GetLastMemberTrackerDate()
      setDateTime(dayjs.utc(response.data))
    }
    fetchData()
  }, [])

  return dateTime
}

export default getDateRangeTime
