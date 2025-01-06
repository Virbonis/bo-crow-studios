export const getStatusAcRj = (status, void_id, early_counter, ev_round) => {
  // Pending
  if (status === 0) return '[P]'

  let result = ''
  switch (void_id) {
    case 0:
      result = 'A'
      break
    case 90:
      result = 'RC'
      break
    case 91:
      result = 'RG'
      break
    case 92:
      result = 'RP'
      break
    case 93:
      result = 'CR'
      break
    default:
      result = 'Rj'
      break
  }
  // kalo Accept di EvRound 2 = HT
  if (status === 1 && ev_round === 2 && void_id === 0) result = 'HT'
  // artinya status -1 dan voidid 0
  if (status === -1 && void_id === 0) result = ''
  if (status === -1 && void_id === 0 && early_counter > 0) result = 'E'
  return result
}

export default getStatusAcRj
