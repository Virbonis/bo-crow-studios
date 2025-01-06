import React from 'react'
import { Helmet } from 'react-helmet'
import { wrapperPopup } from 'components/blaise'
import SpecialProcessMatch from 'pages/match/process-match/special'

const ProcessMatchSpecialFly = props => {
  const { match_id, league_name, home_name, away_name, sport_id, title } = props
  return (
    <>
      <Helmet titleTemplate="" title={title} />
      <SpecialProcessMatch
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

export default wrapperPopup(ProcessMatchSpecialFly)
