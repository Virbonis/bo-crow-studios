import React from 'react'
import { Space, Table, Row, Col, Typography } from 'antd'
import getTraderClass from 'helper/trader-classname'
import { Amount } from 'components/blaise'
import { isEqual } from 'lodash'
import RequestMoreGTLeagueButton from './component/button/request-more-gt-button'
import HandicapButton from '../shared-components/deadball-runningball/handicap-button'
import MoveOddsButton from '../shared-components/deadball-runningball/move-odds-button'
import BetListButton from '../shared-components/trading-bet-list-button'
import SubMatchSettingButton from '../shared-components/deadball-runningball/sub-match-setting-button'
import OpenCloseSubMatchButton from '../shared-components/deadball-runningball/open-close-sub-match-button'
import OnlineListButton from '../shared-components/online-list-button'

const { Text } = Typography

const TableDeadballOE = React.memo(
  React.forwardRef(({ refetch, ...restProps }, ref) => {
    const { currSearchIndex } = restProps
    const columns = React.useMemo(
      () => [
        {
          title: 'No',
          width: 30,
          onCell: ({ rowSpan, league_group, match_id }) => ({
            colSpan: league_group ? 7 : 1,
            rowSpan,
            className: match_id === currSearchIndex.active_match_id ? 'active_selection' : '',
          }),
          render: ({ league_group, league_name, match_ids, rowNumber }) => {
            if (league_group)
              return (
                <div>
                  <span className="h5 font-weight-bold p-3">{league_name}</span>
                  <RequestMoreGTLeagueButton match_ids={match_ids} successCallback={refetch} />
                </div>
              )
            return <div align="center">{rowNumber}</div>
          },
        },
        {
          title: 'Time',
          align: 'center',
          width: 100,
          onCell: ({ league_group, rowSpan }) => ({
            rowSpan: league_group ? 0 : rowSpan,
          }),
          render: record => {
            if (record.league_group) return null
            return (
              <div className="d-flex flex-column">
                <Text>{record.match_date}</Text>
                <Text>{record.match_hour}</Text>
                <Text
                  style={{
                    backgroundColor: `${record.is_profile_changed === 0 ? '#ffff99' : '#3ac4f5'}`,
                  }}
                >
                  {record.profile_id}
                </Text>
              </div>
            )
          },
        },
        {
          title: 'Home Away',
          onCell: record => ({ colSpan: record.league_group ? 0 : 1 }),
          render: record => {
            if (record.league_group) return null
            return (
              <Space direction="vertical" size={0}>
                <OnlineListButton record={record} type="home" noColor />
                <OnlineListButton record={record} type="away" noColor />
              </Space>
            )
          },
        },
        {
          title: 'OE',
          width: 200,
          onCell: record => getCellSubMatch(record, 1),
          render: record => {
            if (record.league_group) return null
            return <RenderSubMatch subMatches={record.subMatches} type={1} refetch={refetch} />
          },
        },
        {
          title: 'FH.OE',
          width: 200,
          onCell: record => getCellSubMatch(record, 2),
          render: record => {
            if (record.league_group) return null
            return <RenderSubMatch subMatches={record.subMatches} type={2} refetch={refetch} />
          },
        },
        {
          title: 'HWNW',
          width: 200,
          onCell: record => getCellSubMatch(record, 3),
          render: record => {
            if (record.league_group) return null
            return <RenderSubMatch subMatches={record.subMatches} type={3} refetch={refetch} />
          },
        },
        {
          title: 'AWNW',
          width: 200,
          onCell: record => getCellSubMatch(record, 4),
          render: record => {
            if (record.league_group) return null
            return <RenderSubMatch subMatches={record.subMatches} type={4} refetch={refetch} />
          },
        },
      ],
      [refetch, currSearchIndex],
    )
    return <Table columns={columns} {...restProps} ref={ref} />
  }),
  (prev, next) =>
    isEqual(prev.dataSource, next.dataSource) &&
    isEqual(prev.currSearchIndex, next.currSearchIndex),
)

const getCellSubMatch = (record, type) => {
  if (record.league_group) return { colSpan: 0 }

  const subMatch = record.subMatches.find(e => e.type === type)
  if (!subMatch) return {}
  return {
    className: `${subMatch?.sub_match_open_status}0`,
    // className: `cell-color ${subMatch?.sub_match_open_status}${subMatch?.sub_match_pause_status}`,
  }
}

const RenderSubMatch = ({ subMatches, type, refetch }) => {
  const record = subMatches?.find(e => e.type === type)
  if (!record) return null
  const {
    lock_shift,
    auto_odds,
    auto_pause,
    trader_group,
    trader_group_pause,
    price_alert_trader,
    sub_match_open_status,
    sub_match_pause_status,
    last_change,
    reason_pause,
    game_type,
    odds_home,
    odds_away,
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
    '',
    last_change,
  )}`

  const classOddsHome = sub_match_pause_status === '1' ? 'oddsPause' : ''
  const classOddsAway = sub_match_pause_status === '2' ? 'oddsPause' : ''
  const colOdds = [3, 16].includes(game_type) ? (
    <MoveOddsButton record={record} successCallback={refetch} />
  ) : (
    <>
      <Amount value={odds_home} bold noColor className={classOddsHome} />
      <br />
      <Amount value={odds_away} bold noColor className={classOddsAway} />
    </>
  )

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

  // OE, FH.OE
  return (
    // <Row className={`cell-color ${sub_match_open_status}0`}>
    <Row gutter={10}>
      {colStatus}
      <Col flex="auto" className={containerClass}>
        <Row justify="space-between">
          <Col>
            <HandicapButton record={record} refetch={refetch} />
          </Col>
          <Col align="right" flex="auto">
            {colOdds}
          </Col>
          <Col span={12} align="right">
            <BetListButton record={record} />
          </Col>
        </Row>
        {rowSetting}
      </Col>
    </Row>
  )
}

export default TableDeadballOE
