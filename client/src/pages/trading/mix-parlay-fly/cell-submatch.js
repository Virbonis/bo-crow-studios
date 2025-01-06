import React from 'react'
import { Button, Col, Row, Space, Typography } from 'antd'
import getTraderClass from 'helper/trader-classname'
import { Amount } from 'components/blaise'
import BetListButton from '../shared-components/trading-bet-list-button'

const { Text } = Typography

export const getCellSubMatch = (record, type) => {
  if (record.league_group) return { colSpan: 0 }

  const subMatch = record.subMatches.find(e => e.type === type)
  if (subMatch?.sub_match_parlay_status === 'N') {
    return { className: 'td-sub-match-off' }
  }
  return {}
  // return {
  //   className: `sub_open_${subMatch?.sub_match_parlay_status}`,
  // }
}
export const RenderSubMatch = React.memo(({ type, subMatch, OnOffSubMatchHandler }) => {
  if (!subMatch) return null
  const {
    lock_shift,
    auto_odds,
    auto_pause,
    trader_group,
    trader_group_pause,
    price_alert_trader,
    last_change,
    odds_home,
    odds_away,
    odds_draw,
    handicap,
    sub_match_pause_status,
    sub_match_parlay_status,
    sub_match_fav_status,
  } = subMatch

  const colStatus = (
    <Col>
      <Space direction="vertical" size={0}>
        {lock_shift === 1 && <div className="icon-indicator lock" />}
        {auto_odds === 0 && <div className="icon-indicator autoOdds" />}
        {auto_pause === 1 && <div className="icon-indicator pause" />}
      </Space>
    </Col>
  )
  const containerClass = getTraderClass(
    trader_group,
    trader_group_pause,
    price_alert_trader,
    sub_match_pause_status,
    '',
    last_change,
  )

  const parlayStatusClassName = sub_match_parlay_status === 'Y' ? 'text-danger' : 'text-success'
  const parlayStatusText = sub_match_parlay_status === 'Y' ? 'Off' : 'On'
  const parlayStatusButton = (
    <Button
      type="text"
      className={`${parlayStatusClassName} p-0`}
      onClick={() => OnOffSubMatchHandler(subMatch)}
    >
      {parlayStatusText}
    </Button>
  )

  // 1X2 & FH.1x2
  if ([1, 4].includes(type)) {
    const colOdds = (
      <Col>
        <Amount bold value={odds_home} />
        <br />
        <Amount bold value={odds_away} />
        <br />
        <Amount bold value={odds_draw} />
      </Col>
    )
    const colBetList = (
      <Col align="right">
        <BetListButton record={subMatch} isMixParlay />
      </Col>
    )

    return (
      <Row gutter={10}>
        {colStatus}
        <Col flex="auto" className={containerClass}>
          <Row justify="space-between">
            {colOdds}
            {colBetList}
          </Row>
          {parlayStatusButton}
        </Col>
      </Row>
    )
  }
  // HDP, OU, FH.HDP, FH.OU
  if ([2, 3, 5, 6].includes(type)) {
    const handicapText = <Text className="font-weight-bold">{Math.abs(handicap)}</Text>
    const colHandicap = (
      <Col>
        {sub_match_fav_status === 1 && <br />}
        {handicapText}
      </Col>
    )
    const colOdds = (
      <Col align="right" flex="auto">
        <Amount
          bold
          value={odds_home}
          className={sub_match_pause_status === 1 ? 'oddsPause' : ''}
        />
        <br />
        <Amount
          bold
          value={odds_away}
          className={sub_match_pause_status === 2 ? 'oddsPause' : ''}
        />
        <br />
        <br />
      </Col>
    )
    const colBetList = (
      <Col span={12} align="right">
        <BetListButton record={subMatch} isMixParlay />
      </Col>
    )

    return (
      <Row gutter={10}>
        {colStatus}
        <Col flex="auto" className={containerClass}>
          <Row>
            {colHandicap}
            {colOdds}
            {colBetList}
          </Row>
          {parlayStatusButton}
        </Col>
      </Row>
    )
  }

  return null
})
// , (prevProps , nextProps ) => isEqual(prevProps,nextProps)
export default RenderSubMatch
