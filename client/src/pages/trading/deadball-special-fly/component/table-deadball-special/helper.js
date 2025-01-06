export const getChoiceHome = (game_type, handicap) => {
  game_type = game_type.toString()
  switch (game_type) {
    case '20':
    case '22':
    case '41':
    case '42':
    case '43':
    case '44':
    case '45':
    case '46':
    case '47':
      return 'Y'

    case '23':
    case '24':
    case '26':
    case '28':
    case '33':
    case '34':
    case '38':
      return 'H'

    case '37':
      return 'A'

    case '29':
    case '30':
    case '48':
    case '49':
      return '1H'
    case '39':
      if (handicap > 0) return ''
      return handicap
    default:
      return ''
  }
}
export const getChoiceAway = (game_type, handicap) => {
  game_type = game_type.toString()
  switch (game_type) {
    case '20':
    case '41':
    case '22':
    case '42':
    case '43':
    case '44':
    case '45':
    case '46':
    case '47':
      return 'N'

    case '23':
    case '24':
    case '26':
    case '28':
    case '33':
    case '34':
      return 'A'

    case '37':
    case '38':
      return 'D'

    case '29':
    case '30':
    case '48':
    case '49':
      return '2H'
    case '39':
      if (handicap > 0) return handicap
      return null
    default:
      return ''
  }
}
export const getChoiceDraw = game_type => {
  game_type = game_type.toString()
  switch (game_type) {
    case '29':
    case '30':
    case '48':
    case '49':
      return 'D'
    default:
      return ''
  }
}
