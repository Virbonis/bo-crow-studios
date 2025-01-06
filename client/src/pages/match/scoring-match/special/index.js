import React from 'react'
import { connect } from 'react-redux'
import { Affix, Button, Descriptions, Divider } from 'antd'
import actions from 'redux/scoring-match/actions'
import ScoringSpecialBasket from './special-basket'
import ScoringSpecialOther from './special-other'

const mapDispatchToProps = dispatch => ({
  CleanUpSpecial: () => dispatch({ type: actions.CLEAN_UP_SPECIAL }),
})

const SpecialScoringMatch = ({ specialValue, successCallback, CleanUpSpecial }) => {
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
        <ScoringSpecialBasket specialValue={specialValue} successCallback={successCallback} />
      ) : (
        <ScoringSpecialOther specialValue={specialValue} successCallback={successCallback} />
      )}
      <Affix offsetBottom={0}>
        <Button form="special-form" type="primary" htmlType="submit">
          Submit
        </Button>
      </Affix>
    </>
  )
}

export default connect(null, mapDispatchToProps)(SpecialScoringMatch)
