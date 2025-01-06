import React from 'react'

export const getMatchRound = match_round => {
  switch (match_round) {
    case 0:
      return 'Not Started'
    case 1:
      return (
        <>
          1<sup>st</sup> Half
        </>
      )
    case 2:
      return 'Half Time Break'
    case 3:
      return (
        <>
          2<sup>nd</sup> Half
        </>
      )
    case 4:
      return 'Extra Time Break'
    case 5:
      return 'Extra 1'
    case 6:
      return 'Extra 2'
    default:
      return null
  }
}

export default getMatchRound
