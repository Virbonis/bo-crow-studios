export const StatusAutoOdds = followLeeching => {
  switch (followLeeching) {
    case '0':
      return ''
    case '1':
      return 'S'
    case '2':
      return 'I'
    case 'S':
      return '1'
    case 'I':
      return '2'
    default:
      return '0'
  }
}

export default StatusAutoOdds
