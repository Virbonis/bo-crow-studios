export const TimerFormat = (eventRound, timer) => {
  let result = ''
  let isValid = false

  if (eventRound !== 0) isValid = true
  if (!timer) isValid = false

  if (isValid) {
    const minute = Math.abs(Math.floor(timer / 60))
    const second = Math.abs(timer % 60)
    result = `${minute}:${second < 10 ? `0${+second}` : second}`
  }
  return result
}

export default TimerFormat
