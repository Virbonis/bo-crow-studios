import React from 'react'
import { Amount } from 'components/blaise'
import { choiceOptions } from 'helper'
import BetListButton from 'pages/trading/shared-components/trading-bet-list-button'

const RenderSubMatchByChoice = ({ record, index }) => {
  const { game_type } = record

  return (
    <div className="d-flex justify-content-between">
      <Amount bold value={record[`odds${index + 1}`]} />
      <BetListButton
        record={{
          ...record,
          jml: record[`jml${index + 1}`],
          t: record[`t${index + 1}`],
          choice: choiceOptions[game_type][index]?.value,
        }}
      />
    </div>
  )
}

export default RenderSubMatchByChoice
