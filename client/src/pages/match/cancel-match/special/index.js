import React from 'react'
import { connect } from 'react-redux'
import { Descriptions, Divider } from 'antd'
import actions from 'redux/cancel-match/actions'
import CancelSpecialOther from './special-other'
import CancelSpecialBasket from './special-basket'

const mapDispatchToProps = dispatch => ({
  CleanUpSpecial: () => dispatch({ type: actions.CLEAN_UP_SPECIAL }),
})

const SpecialCancelMatch = ({ specialValue, successCallback, CleanUpSpecial }) => {
  React.useEffect(() => CleanUpSpecial, [CleanUpSpecial])

  const { match_id, league_name, home_name, away_name, sport_id } = specialValue
  return (
    <>
      <Descriptions>
        <Descriptions.Item span={3} label="Match ID">
          {match_id}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="League">
          {league_name}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Home Away">
          {home_name} - {away_name}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      {sport_id === 12 || sport_id === 58 ? (
        <CancelSpecialBasket specialValue={specialValue} successCallback={successCallback} />
      ) : (
        <CancelSpecialOther specialValue={specialValue} successCallback={successCallback} />
      )}
    </>
  )
}

export default connect(null, mapDispatchToProps)(SpecialCancelMatch)
