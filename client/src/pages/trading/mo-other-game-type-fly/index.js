import React from 'react'
import { Helmet } from 'react-helmet'
import { wrapperPopup } from 'components/blaise'
import MOOtherGameType from 'pages/trading/mo-other-game-type'

const MOOtherGameTypeFly = ({
  match_id,
  match_date,
  home_name,
  away_name,
  sport_id,
  st_live,
  title,
}) => {
  return (
    <>
      <Helmet titleTemplate="" title={title} />
      <MOOtherGameType
        match={{
          match_id: Number(match_id),
          match_date,
          home_name,
          away_name,
          sport_id: Number(sport_id),
          st_live,
        }}
      />
    </>
  )
}

export default wrapperPopup(MOOtherGameTypeFly)
