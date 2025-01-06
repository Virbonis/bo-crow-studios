import React from 'react'
import { Amount } from 'components/blaise'
import { countOddsMargin } from 'helper'

const OddsMargin = ({ record }) => {
  const oddsMargin = getOddsMargin(record)

  return (
    <span>
      % margin :
      <Amount
        value={oddsMargin}
        int={oddsMargin === 0}
        keepRed={
          [7, 9, 10, 13, 14, 36].includes(record.game_type) ? oddsMargin < 1 : oddsMargin < 0
        }
      />
    </span>
  )
}

const getOddsMargin = ({
  game_type,

  odds_home,
  odds_away,
  odds_draw,

  odds1,
  odds2,
  odds3,
  odds4,
  odds5,
  odds6,
  odds7,
  odds8,
  odds9,
  odds10,
  odds11,
  odds12,
  odds13,
  odds14,
  odds15,
  odds16,
  odds17,
  odds18,
  odds19,
  odds20,
  odds21,
  odds22,
  odds23,
  odds24,
  odds25,
  odds26,
  odds27,
}) => {
  // #deadball
  // dc, ml
  if ([15, 12].includes(game_type)) return countOddsMargin([odds_home, odds_away, odds_draw])
  // TG, FHTG
  if ([7, 36].includes(game_type)) return countOddsMargin([odds1, odds2, odds3, odds4])
  // cs, fhcs
  if ([10, 13].includes(game_type))
    return countOddsMargin([
      odds1,
      odds2,
      odds3,
      odds4,
      odds5,
      odds6,
      odds7,
      odds8,
      odds9,
      odds10,
      odds11,
      odds12,
      odds13,
      odds14,
      odds15,
      odds16,
      odds17,
      odds18,
      odds19,
      odds20,
      odds21,
      odds22,
      odds23,
      odds24,
      odds25,
      odds26,
      odds27,
    ])
  // FGLG
  if (game_type === 14) return countOddsMargin([odds1, odds2, odds3, odds4, odds5])
  // HTFT
  if (game_type === 9)
    return countOddsMargin([odds1, odds2, odds3, odds4, odds5, odds6, odds7, odds8, odds9])

  // #deadballspecial
  // TOTFG
  if (game_type === 25) return countOddsMargin([odds1, odds2])
  // CSH
  if (game_type === 40) return countOddsMargin([odds1, odds2, odds3])
  // FGM, ITA
  if ([21, 27].includes(game_type)) return countOddsMargin([odds1, odds2, odds3, odds4, odds5])
  // WM
  if (game_type === 35)
    return countOddsMargin([odds1, odds2, odds3, odds4, odds5, odds6, odds7, odds8, odds9])
  // HWMC, HSH, 3WH, HSHHT, HSHAT
  if ([29, 30, 39, 48, 49].includes(game_type)) return countOddsMargin([odds1, odds2])
  // sisanya cuma 1 choice,
  return countOddsMargin([odds1])
}

export default OddsMargin
