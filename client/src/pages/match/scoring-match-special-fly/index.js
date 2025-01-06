import React from 'react'
import { Helmet } from 'react-helmet'
import { wrapperPopup } from 'components/blaise'
import SpecialScoringMatch from 'pages/match/scoring-match/special'

const ScoringMatchSpecialFly = props => {
  const { match_id, league_name, home_name, away_name, sport_id, title } = props
  return (
    <>
      <Helmet titleTemplate="" title={title} />
      <SpecialScoringMatch
        specialValue={{
          match_id: parseInt(match_id, 10),
          league_name,
          home_name,
          away_name,
          sport_id: parseInt(sport_id, 10),
        }}
      />
    </>
  )
}

export default wrapperPopup(ScoringMatchSpecialFly)
