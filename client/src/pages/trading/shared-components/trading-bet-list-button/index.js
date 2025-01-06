import React, { useState } from 'react'
import { Drawer } from 'antd'
import { getBetChoiceTrading } from 'helper'
import BetList from './bet-list'

const BetListButton = ({ record, isMixParlay = false }) => {
  const [visible, setVisible] = useState(false)
  const [bet_choice, setBetChoice] = useState(false)
  const { game_type } = record
  const betListHandler = value => {
    setVisible(true)
    setBetChoice(value)
  }

  const getBetListButton = () => {
    // OUTRIGHT
    if (game_type === 11)
      return <BetListButtonOutright betListHandler={betListHandler} record={record} />
    if (
      record.choice
      // CS, FHCS
      // [10, 13].includes(game_type) ||
      // CSH, FGM, TOTFG, ITA, WM
      // [40, 21, 25, 27, 35].includes(game_type) ||
      // TG, FHTG, FGLG, HTFT
      // [7, 36, 14, 9].includes(game_type)
    )
      return <BetListButtonChoice betListHandler={betListHandler} record={record} />

    // 1x2, HSHHT, HSHAT, HWMC, HSH, 3WH
    if ([1, 8, 48, 49, 30, 29, 39].includes(game_type)) {
      return (
        <>
          <BetListButtonHome betListHandler={betListHandler} record={record} /> <br />
          <BetListButtonAway betListHandler={betListHandler} record={record} /> <br />
          <BetListButtonDraw betListHandler={betListHandler} record={record} />
        </>
      )
    }

    // DC=15
    if (game_type === 15) {
      return (
        <>
          <BetListButtonHome betListHandler={betListHandler} record={record} /> <br />
          <BetListButtonDraw betListHandler={betListHandler} record={record} /> <br />
          <BetListButtonAway betListHandler={betListHandler} record={record} />
        </>
      )
    }
    return (
      <>
        <BetListButtonHome betListHandler={betListHandler} record={record} /> <br />
        <BetListButtonAway betListHandler={betListHandler} record={record} />
      </>
    )
  }

  return (
    <>
      {getBetListButton()}
      {visible && (
        <Drawer
          title="Bet List"
          width="70%"
          open={visible}
          onClose={() => setVisible(false)}
          destroyOnClose
          // footer={
          //   <Space>
          //     <Button onClick={() => setVisible(false)}>Close</Button>
          //   </Space>
          // }
        >
          <BetList
            record={{
              ...record,
              bet_choice,
              isMixParlay,
            }}
          />
        </Drawer>
      )}
    </>
  )
}

const BetListButtonHome = ({ record, betListHandler }) => {
  const { jml_home, t_home, game_type } = record
  const choice = getBetChoiceTrading(game_type, 'H')

  return (
    jml_home > 0 && (
      <button
        type="button"
        className="p-0 btn_plain font-weight-bold betList"
        onClick={() => betListHandler(choice)}
      >
        {jml_home}/{Math.round(t_home)}
      </button>
    )
  )
}
const BetListButtonAway = ({ record, betListHandler }) => {
  const { jml_away, t_away, game_type } = record
  const choice = getBetChoiceTrading(game_type, 'A')

  return (
    jml_away > 0 && (
      <button
        type="button"
        className="p-0 btn_plain font-weight-bold betList"
        onClick={() => betListHandler(choice)}
      >
        {jml_away}/{Math.round(t_away)}
      </button>
    )
  )
}
const BetListButtonDraw = ({ record, betListHandler }) => {
  const { jml_draw, t_draw, game_type } = record
  const choice = getBetChoiceTrading(game_type, 'D')

  return (
    jml_draw > 0 && (
      <button
        type="button"
        className="p-0 btn_plain font-weight-bold betList"
        onClick={() => betListHandler(choice)}
      >
        {jml_draw}/{Math.round(t_draw)}
      </button>
    )
  )
}
const BetListButtonChoice = ({ record, betListHandler }) => {
  const { jml, choice, t } = record
  // kalo by choice langsung dari prop choice
  return (
    jml > 0 && (
      <button
        type="button"
        className="p-0 btn_plain font-weight-bold betList"
        onClick={() => betListHandler(choice)}
      >
        {jml}/{Math.round(t)}
      </button>
    )
  )
}
const BetListButtonOutright = ({ record, betListHandler }) => {
  const { t_jml, t_amount } = record
  return (
    t_jml > 0 && (
      <button
        type="button"
        className="p-0 btn_plain font-weight-bold betList"
        onClick={() => betListHandler('')}
      >
        {t_jml}/{Math.round(t_amount)}
      </button>
    )
  )
}

export default BetListButton
