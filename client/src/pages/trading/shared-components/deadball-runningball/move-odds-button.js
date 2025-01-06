import React from 'react'
import { connect } from 'react-redux'
import { Space, Tooltip, message } from 'antd'
import { Amount, usePopupID } from 'components/blaise'
import actions from 'redux/trading-floor/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  UpdateMoveOdds: payload => {
    dispatch({
      type: actions.UPDATE_TRADING_MOVE_ODDS,
      payload,
      successCallback,
      source: 'Trading Floor',
    })
  },
})

// currently used in HDP, O/U, OE
const MoveOddsButton = ({ record, UpdateMoveOdds }) => {
  const { match_id, sub_match_id, game_type, sport_id, match_time_slot } = record
  const popup_id = usePopupID()

  const moveOddsHandler = direction => {
    if (match_time_slot === 'Started') return message.error('Not Allowed')
    return UpdateMoveOdds({
      match_id,
      sub_match_id,
      game_type,
      popup_id,
      move_direction: direction,
    })
  }

  const disabled = sport_id === 10 && [0, 2, 5, 6].includes(game_type)
  const buttons = getButtons(record)
  return (
    <Space direction="vertical" size={0}>
      {buttons.map(({ title, direction, children }) => {
        if (disabled) return children
        return (
          <Tooltip key={direction} title={`GO Move Odds ${title} more expensive`} placement="right">
            <button
              type="button"
              className="p-0 btn_plain font-weight-bold"
              onClick={() => moveOddsHandler(direction)}
            >
              {children}
            </button>
          </Tooltip>
        )
      })}
    </Space>
  )
}

const getButtons = record => {
  const { odds_home, odds_away, game_type, sub_match_pause_status } = record

  const classOddsHome = sub_match_pause_status.toString() === '1' ? 'oddsPause' : ''
  const classOddsAway = sub_match_pause_status.toString() === '2' ? 'oddsPause' : ''
  switch (game_type) {
    case 0:
    case 2:
      return [
        {
          title: 'Home',
          direction: 'H',
          children: <Amount key="H" value={odds_home} bold noColor className={classOddsHome} />,
        },
        {
          title: 'Away',
          direction: 'A',
          children: <Amount key="A" value={odds_away} bold noColor className={classOddsAway} />,
        },
      ]
    case 5:
    case 6:
      return [
        {
          title: 'Over',
          direction: 'O',
          children: <Amount key="O" value={odds_home} bold noColor className={classOddsHome} />,
        },
        {
          title: 'Under',
          direction: 'U',
          children: <Amount key="U" value={odds_away} bold noColor className={classOddsAway} />,
        },
      ]
    case 3:
    case 16:
      return [
        {
          title: 'Odd',
          direction: 'O',
          children: <Amount key="O" value={odds_home} bold noColor className={classOddsHome} />,
        },
        {
          title: 'Even',
          direction: 'E',
          children: <Amount key="E" value={odds_away} bold noColor className={classOddsAway} />,
        },
      ]
    default:
      return []
  }
}

export default connect(null, mapDispatchToProps)(MoveOddsButton)
