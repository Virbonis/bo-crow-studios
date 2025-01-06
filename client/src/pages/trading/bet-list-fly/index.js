import React from 'react'
import { Helmet } from 'react-helmet'
import { wrapperPopup } from 'components/blaise'
import MOBetList from 'pages/trading/bet-list'

const MOBetListFly = ({ match_id, sub_match_id, game_type, gt, choice_code, stock, title }) => {
  return (
    <>
      <Helmet titleTemplate="" title={title} />
      <MOBetList
        editValue={{
          match_id: Number(match_id),
          sub_match_id: Number(sub_match_id),
          game_type: Number(game_type),
          gt,
          choice_code,
          stock: Number(stock),
        }}
      />
    </>
  )
}

export default wrapperPopup(MOBetListFly)
