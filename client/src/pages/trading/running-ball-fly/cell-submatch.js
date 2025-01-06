import React from 'react'
import { Col, Row, Space, Typography } from 'antd'
import getTraderClass from 'helper/trader-classname'
import BetListButton from '../shared-components/trading-bet-list-button'
import OpenCloseSubMatchButton from '../shared-components/deadball-runningball/open-close-sub-match-button'
import SubMatchSettingButton from '../shared-components/deadball-runningball/sub-match-setting-button'
import HandicapButton from '../shared-components/deadball-runningball/handicap-button'
import MoveOddsButton from '../shared-components/deadball-runningball/move-odds-button'

const { Text } = Typography

export const getCellSubMatch = (record, type) => {
  if (record.league_group) return { colSpan: 0 }

  const subMatch = record.subMatches.find(e => e.type === type)
  if (subMatch?.sub_match_open_status === 'N') {
    return { className: 'td-sub-match-off' }
  }
  if (!subMatch) return {}
  return {
    className: `${subMatch?.sub_match_open_status}0`,
  }
}

export const DisplayPendingHomeAway = ({ subMatches, type }) => {
  const record = subMatches.find(e => e.type === type)
  if (!record) return null
  const { jml_pend_home, t_pend_home, jml_pend_away, t_pend_away } = record

  return (
    <Space direction="vertical" size={0} align="right">
      {jml_pend_home > 0 && (
        <Text className="font-weight-bold pending">
          {jml_pend_home}/{t_pend_home}
        </Text>
      )}
      {jml_pend_away > 0 && (
        <>
          <br />
          <Text className="font-weight-bold pending">
            {jml_pend_away}/{t_pend_away}
          </Text>
        </>
      )}
    </Space>
  )
}

export const RenderSubMatch = React.memo(({ subMatches, type, refetch }) => {
  const record = subMatches.find(e => e.type === type)
  if (!record) return null
  const {
    lock_shift,
    auto_odds,
    auto_pause,
    trader_group,
    trader_group_pause,
    price_alert_trader,
    last_change,
    sub_match_pause_status,
    sub_match_open_status,
    reason_pause,
  } = record

  const colStatus = (
    <Col>
      <Space direction="vertical" size={0}>
        {lock_shift === 1 && <div className="icon-indicator lock" />}
        {auto_odds === 0 && <div className="icon-indicator autoOdds" />}
        {auto_pause === 1 && <div className="icon-indicator pause" />}
      </Space>
    </Col>
  )

  const containerClass = `cell-color ${sub_match_open_status}${sub_match_pause_status} 
  ${getTraderClass(
    trader_group,
    trader_group_pause,
    price_alert_trader,
    sub_match_pause_status,
    'span',
    last_change,
  )}`

  const rowSetting = (
    <>
      <Row justify="space-between">
        <Col>
          <OpenCloseSubMatchButton record={record} successCallback={refetch} />
        </Col>
        <Col>
          <SubMatchSettingButton record={record} successCallback={refetch} />
        </Col>
      </Row>
      {reason_pause && (
        <div align="center">
          <Text
            className={`${
              ['MaxBet', 'LAP Short', 'LAP Long'].includes(reason_pause)
                ? 'font-weight-bold text-primary'
                : 'font-italic'
            }`}
          >
            {reason_pause}
          </Text>
        </div>
      )}
    </>
  )

  return (
    <Row gutter={8}>
      {colStatus}
      <Col flex="auto" className={containerClass}>
        <Row>
          <Col>
            <HandicapButton record={record} successCallback={refetch} />
          </Col>
          <Col align="right" flex="auto">
            <MoveOddsButton record={record} successCallback={refetch} />
          </Col>
          <Col span={12} align="right">
            <BetListButton record={record} />
          </Col>
        </Row>
        {rowSetting}
      </Col>
    </Row>
  )
})
