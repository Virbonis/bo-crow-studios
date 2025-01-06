import React from 'react'
import { connect } from 'react-redux'
import { Row, Spin, Typography } from 'antd'
import actionsSubMatchSetting from 'redux/edit-sub-match-setting/actions'
import actionsSubMatchProfile from 'redux/edit-sub-match-profile/actions'
import { countOddsMargin, gameTypeDescription, getOddsXKey } from 'helper'
import { omit, pickBy, reduce } from 'lodash'
import ButtonAddAutoSubMatchMore from 'pages/trading/shared-components/add-auto-sub-match-more-button'
import SubSettingAHOUOEML from './AHOUOEML'
import SubSetting1X2DC from './1X2DC'
import SubSettingTG from './TG'
import SubSettingCS from './CS'
import SubSettingFGLG from './FGLG'
import SubSettingHTFT from './HTFT'
import SubMatchProfile from './sub-match-profile'

const { Text } = Typography

const mapStateToProps = ({ editSubMatchProfile, editSubMatchSetting, oddsSpread }) => ({
  loadingProfile: editSubMatchProfile.loading,
  loadingSetting: editSubMatchSetting.loading,
  subMatchDataProfile: editSubMatchProfile.data[0] || {},
  subMatchDataSetting: editSubMatchSetting.data[0] || {},
  oddsSpreadOptions: oddsSpread.select.map(e => ({ value: e.odds_spread, label: e.odds_spread })),
})

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  LoadSubMatch: payload => {
    dispatch({
      type: actionsSubMatchProfile.LOAD,
      payload,
      source: 'Edit Sub Match Profile',
    })
    dispatch({
      type: actionsSubMatchSetting.LOAD,
      payload,
      source: 'Edit Sub Match Setting',
    })
  },
  UpdateSubMatchProfile: payload => {
    dispatch({
      type: actionsSubMatchProfile.UPDATE,
      payload,
      successCallback,
      source: 'Edit Sub Match Profile',
    })
  },
  UpdateSubMatchSetting: payload => {
    dispatch({
      type: actionsSubMatchSetting.UPDATE,
      payload,
      successCallback,
      source: 'Edit Sub Match Setting',
    })
  },
  CleanUp: () => {
    dispatch({ type: actionsSubMatchProfile.CLEAN_UP })
    dispatch({ type: actionsSubMatchSetting.CLEAN_UP })
  },
})
const Content = ({
  record,
  match,
  loadingProfile,
  loadingSetting,
  subMatchDataProfile,
  subMatchDataSetting,

  LoadSubMatch,
  UpdateSubMatchProfile,
  UpdateSubMatchSetting,
  CleanUp,
  ...restProps
}) => {
  React.useEffect(() => CleanUp, [CleanUp])
  const { match_id, sport_id, sub_match_id, game_type, match_time_slot } = record

  React.useEffect(() => {
    LoadSubMatch({
      match_id,
      sub_match_id,
      game_type,
      match_time_slot,
    })
  }, [LoadSubMatch, match_id, sub_match_id, game_type, match_time_slot])

  const initialValuesProfile = subMatchDataProfile || {}
  const initialValuesSetting = React.useMemo(() => {
    const is1X2 = game_type === 1 || game_type === 8
    return {
      key: '1row',
      ...subMatchDataSetting,
      auto_pause: subMatchDataSetting.auto_pause === 1,
      lock_leeching: subMatchDataSetting.lock_leeching === 1,
      st_odds_margin: subMatchDataSetting.st_odds_margin === 'Y',
      sub_match_parlay_status: subMatchDataSetting.sub_match_parlay_status === 0,

      odds2: is1X2 ? subMatchDataSetting.odds3 : subMatchDataSetting.odds2,
      odds3: is1X2 ? subMatchDataSetting.odds2 : subMatchDataSetting.odds3,
    }
  }, [subMatchDataSetting, game_type])

  const onFinishProfile = React.useCallback(
    values => {
      let auto_pause_limit = 0
      // TM
      if (match_time_slot === 'Today') auto_pause_limit = values.lap1
      // EM
      else if (match_time_slot === 'Early') auto_pause_limit = values.lap2
      // RB
      else if (match_time_slot === 'Started') auto_pause_limit = values.lap3
      UpdateSubMatchProfile({
        ...values,
        match_id,
        sub_match_id,
        game_type,
        auto_pause_limit,
      })
    },
    [match_id, sub_match_id, game_type, match_time_slot, UpdateSubMatchProfile],
  )
  const onFinishSetting = React.useCallback(
    values => {
      const is1X2 = game_type === 1 || game_type === 8
      UpdateSubMatchSetting({
        ...values,
        match_id,
        sub_match_id,
        game_type,
        lock_leeching: values.lock_leeching ? 1 : 0,
        auto_pause: values.auto_pause ? 1 : 0,
        sub_match_parlay_status: values.sub_match_parlay_status ? 0 : 1,
        st_odds_margin: values.st_odds_margin ? 'Y' : 'N',

        odds2: is1X2 ? values.odds3 : values.odds2,
        odds3: is1X2 ? values.odds2 : values.odds3,
      })
    },
    [match_id, sub_match_id, game_type, UpdateSubMatchSetting],
  )

  const SubMatchSetting = getRenderSubMatchSetting(game_type)
  return (
    <>
      <Row justify="space-between" align="middle">
        <Text className="h4 font-weight-bold">
          {gameTypeDescription[game_type.toString()]?.long.toUpperCase()}
        </Text>
        {sport_id === 10 && <ButtonAddAutoSubMatchMore match={match} frompage="deadball" />}
      </Row>

      <Spin spinning={loadingSetting || loadingProfile}>
        <SubMatchSetting
          initialValuesProfile={initialValuesProfile}
          initialValuesSetting={initialValuesSetting}
          onFinishProfile={onFinishProfile}
          onFinishSetting={onFinishSetting}
          onFormSettingValuesChange={getFormSettingValuesChange(game_type)}
          {...record}
          {...restProps}
        />
      </Spin>
    </>
  )
}

const getRenderSubMatchSetting = game_type => {
  if ([0, 2, 3, 5, 6, 16, 12, 63, 64].includes(game_type)) return SubSettingAHOUOEML
  if ([1, 8, 15].includes(game_type)) return SubSetting1X2DC
  if ([7, 36].includes(game_type)) return SubSettingTG
  if ([10, 13].includes(game_type)) return SubSettingCS
  if (game_type === 14) return SubSettingFGLG
  if (game_type === 9) return SubSettingHTFT
  return SubMatchProfile
}

const getFormSettingValuesChange = game_type => formSetting => (changedValues, allValues) => {
  const fieldName = Object.keys(changedValues)[0]
  if (!fieldName.startsWith('odds')) return // only calc odds

  const { st_odds_margin, st_odds_margin2 } = allValues
  if (game_type !== 40) {
    // only 1 margin
    const { odds_margin, ...oddsFields } = pickBy(allValues, (v, key) => key.startsWith('odds'))
    if (st_odds_margin) {
      const oddsXKey = getOddsXKey(game_type)
      const restOddsFields = omit(oddsFields, oddsXKey)
      formSetting.setFieldsValue({ [oddsXKey]: calcOddsXMargin(restOddsFields, odds_margin) })
    } else formSetting.setFieldsValue({ odds_margin: countOddsMargin(oddsFields) })
  } else {
    // CSH, have 2 margin
    const { odds1, odds2, odds3, odds4, odds_margin, odds_margin2 } = allValues
    // margin1
    if (['odds1', 'odds2', 'odds_margin'].includes(fieldName)) {
      if (st_odds_margin)
        formSetting.setFieldsValue({ odds1: calcOddsXMargin([odds2], odds_margin) })
      else formSetting.setFieldsValue({ odds_margin: countOddsMargin([odds1, odds2]) })
    }
    // margin 2
    else if (['odds3', 'odds4', 'odds_margin2'].includes(fieldName)) {
      if (st_odds_margin2)
        formSetting.setFieldsValue({ odds3: calcOddsXMargin([odds4], odds_margin2) })
      else formSetting.setFieldsValue({ odds_margin2: countOddsMargin([odds3, odds4]) })
    }
  }
}
const calcOddsXMargin = (oddsFields, odds_margin) => {
  const totalMargin = reduce(oddsFields, (acc, value) => (value === 0 ? acc : acc + 1 / value), 0)
  let result = odds_margin - totalMargin
  if (result !== 0) result = 1 / result
  if (result < 1) result = 0
  else result = Math.round(result * 100) / 100
  return result
}

export default connect(mapStateToProps, mapDispatchToProps)(Content)
