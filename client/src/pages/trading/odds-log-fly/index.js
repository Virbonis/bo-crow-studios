import React from 'react'
import { Helmet } from 'react-helmet'
import { wrapperPopup } from 'components/blaise'
import OddsLog from 'pages/trading/odds-log'

const OddsLogFly = ({ match_id, line, game_type, title }) => {
  return (
    <>
      <Helmet titleTemplate="" title={title} />
      <OddsLog
        editValue={{
          match_id: Number(match_id),
          line: Number(line),
          game_type: Number(game_type),
        }}
      />
    </>
  )
}

export default wrapperPopup(OddsLogFly)
