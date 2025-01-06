import React, { useState } from 'react'
import { Button, Divider, Form, InputNumber, Select, message, Typography } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/trading-floor/actions'
import { isOddsValid } from 'helper'
import { usePopupID } from 'components/blaise'

const { Text } = Typography

const mapDispatchToProps = dispatch => ({
  UpdateHandicap: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_ODDS_HDC,
      payload,
      successCallback,
      source: 'Trading Floor',
    })
  },
})

const EditHandicap = ({ editValue, UpdateHandicap, successCallback }) => {
  const {
    match_id,
    sub_match_id,
    sub_match_fav_status,
    sub_match_odds_step,
    handicap,
    game_type,
  } = editValue
  const popup_id = usePopupID()
  const [subMatchFavStatus, setSubMatchFavStatus] = useState(sub_match_fav_status)

  const swapTeamHandler = () => {
    if (subMatchFavStatus === 1) {
      setSubMatchFavStatus(-1)
    } else {
      setSubMatchFavStatus(1)
    }
  }

  const disableHandicap = [3, 12, 16, 18].includes(game_type)
  const disableOddsStep = [12, 18].includes(game_type)
  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      labelAlign="left"
      id="edit-handicap-form"
      initialValues={{
        handicap: handicap ? Math.abs(handicap) : 0,
        odds: getOddsByFavStatus(editValue).toFixed(2),
        match_odd_step: sub_match_odds_step,
      }}
      onFinish={values => {
        if (validateOdds(values.odds, values.handicap, game_type)) {
          UpdateHandicap(
            {
              ...values,
              match_id,
              sub_match_id,
              st_fav: subMatchFavStatus,
              popup_id,
            },
            successCallback,
          )
        }
      }}
    >
      <DisplayHomeAwayNameByFavStatus editValue={editValue} subMatchFavStatus={subMatchFavStatus} />
      {![3, 5, 6, 12, 16, 18, 63, 64].includes(game_type) && (
        <>
          <br />
          <Button
            type="text"
            className="text-primary p-0"
            onClick={() => swapTeamHandler(editValue)}
          >
            Swap Favourite Team
          </Button>
        </>
      )}
      <Divider />
      <Form.Item name="handicap" label="Handicap">
        <Select
          options={comboHandicapOptions()}
          style={{ width: '80px' }}
          disabled={disableHandicap}
        />
      </Form.Item>
      <Form.Item name="odds" label="Odds">
        <InputNumber step={0.01} style={{ width: '80px' }} />
      </Form.Item>
      <Form.Item name="match_odd_step" label="Odds Step">
        <InputNumber step={1} min={0} style={{ width: '80px' }} disabled={disableOddsStep} />
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(EditHandicap)

const getOddsByFavStatus = editValue => {
  const { game_type, odds_home, odds_away, sub_match_fav_status } = editValue
  if ([3, 12, 16, 18].includes(game_type)) return odds_home
  if ([5, 6].includes(game_type)) return odds_away
  if (sub_match_fav_status <= 0) return odds_away
  return odds_home
}

const DisplayHomeAwayNameByFavStatus = ({ editValue, subMatchFavStatus }) => {
  const { game_type, home_name, away_name } = editValue
  if ([3, 5, 6, 16].includes(game_type)) {
    return (
      <Text>
        {home_name} - {away_name}
      </Text>
    )
  }
  if (subMatchFavStatus === -1)
    return (
      <Text>
        <Text className="text-danger">{home_name}</Text>-{away_name}
      </Text>
    )

  return (
    <Text>
      {home_name}-<Text className="text-danger">{away_name}</Text>
    </Text>
  )
}

const comboHandicapOptions = sport_id => {
  let range
  let breakdown

  switch (sport_id) {
    case '10':
      range = 240
      breakdown = 0.25
      break
    case '40':
      range = 600
      breakdown = 0.5
      break
    default:
      range = 1200
      breakdown = 0.25
      break
  }

  const options = Array.from({ length: range }, (_, e) => ({
    value: e * breakdown,
    label: e * breakdown,
  }))
  return options
}

const validateOdds = (odds, handicap, gameType) => {
  if ([5, 6].includes(gameType)) {
    if (handicap === 0) return message.warning('Handicap must bigger than 0')
  }
  const [isValid, errMsg] = isOddsValid(odds, gameType)
  if (!isValid) message.warning(errMsg)
  return isValid
}
