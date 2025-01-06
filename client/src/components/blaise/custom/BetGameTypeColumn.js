import React from 'react'
import { Space } from 'antd'
import { gameTypeDescription, getParlayComboTicket } from 'helper'

// gametypeDescription, status live, parlay combo ticket
export const BetGameTypeColumn = ({
  game_type,
  bet_live_status,
  tickets,
  folds,
  game_type_name_bti,
}) => {
  let gameTypeText = gameTypeDescription[game_type]?.long
  if (game_type_name_bti) gameTypeText = game_type_name_bti

  return (
    <Space direction="vertical" size={0}>
      {gameTypeText}
      {bet_live_status === 'Y' && <span className="text-danger">Live</span>}
      {game_type === -1 && tickets !== 1 && (
        <>
          <span className="font-weight-bold">{getParlayComboTicket(folds)}</span>
          <span className="font-weight-bold">{`(${tickets} tickets)`}</span>
        </>
      )}
    </Space>
  )
}

export default BetGameTypeColumn
