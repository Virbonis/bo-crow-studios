import React from 'react'
import { Table, Space, Row, Col, Typography } from 'antd'
import { Amount } from 'components/blaise'
import { getTraderClass } from 'helper'
import { isEqual } from 'lodash'
import RequestMoreGTLeagueButton from './component/button/request-more-gt-button'
import OddsMargin from '../shared-components/deadball-runningball/odds-margin'
import BetListButton from '../shared-components/trading-bet-list-button'
import OpenCloseSubMatchButton from '../shared-components/deadball-runningball/open-close-sub-match-button'
import SubMatchSettingButton from '../shared-components/deadball-runningball/sub-match-setting-button'

const { Text } = Typography

const scoreList1 = ['0-1', '2-3', '4-6', 'Up7']
const choiceList1 = ['TG01', 'TG23', 'TG46', 'TG7']

const scoreList2 = ['0-1', '2-3', 'Up4']
const choiceList2 = ['1T01', '1T23', '1T4']

const TableDeadballTG = React.memo(
  React.forwardRef(({ refetch, ...restProps }, ref) => {
    const { currSearchIndex } = restProps
    const columns = React.useMemo(
      () => [
        {
          title: 'No',
          width: 30,
          onCell: ({ league_group, rowSpan, match_id }) => ({
            colSpan: league_group ? 17 : 1,
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
                {record.home_name}
                {record.away_name}
              </Space>
            )
          },
        },
        {
          width: 20,
          onCell: record => {
            if (record.league_group) return { colSpan: 0 }

            const subMatch = record.subMatches.find(e => e.type === 1)
            if (!subMatch) return {}
            return {
              className: `${subMatch.sub_match_open_status}0`,
            }
          },
          render: ({ league_group, subMatches }) => {
            if (league_group) return null
            const subMatch = subMatches.find(e => e.type === 1)
            if (!subMatch) return null

            const { lock_shift, auto_odds, auto_pause } = subMatch
            return (
              <Space direction="vertical" size={0}>
                {lock_shift === 1 && <div className="icon-indicator lock" />}
                {auto_odds === 0 && <div className="icon-indicator autoOdds" />}
                {auto_pause === 1 && <div className="icon-indicator pause" />}
              </Space>
            )
          },
        },
        ...scoreList1.map((score, index) => ({
          title: score,
          width: 75,
          onCell: record => getCellSubMatch(record, 1),
          render: ({ league_group, subMatches }) => {
            if (league_group) return null
            const subMatch = subMatches.find(e => e.type === 1)
            if (!subMatch) return null

            const startingKey = 1
            return (
              <RenderSubMatch
                record={{
                  ...subMatch,
                  odds: subMatch[`odds${index + startingKey}`],
                  jml: subMatch[`jml${index + startingKey}`],
                  t: subMatch[`t${index + startingKey}`],
                  choice: choiceList1[index],
                }}
              />
            )
          },
        })),
        {
          title: '%',
          width: 75,
          onCell: record => getCellSubMatch(record, 1),
          render: ({ league_group, subMatches }) => {
            if (league_group) return null
            const subMatch = subMatches.find(e => e.type === 1)
            if (!subMatch) return null

            return <OddsMargin record={subMatch} />
          },
        },
        {
          title: 'Action',
          width: 100,
          onCell: ({ league_group, rowSpan }) => ({
            colSpan: league_group ? 0 : 1,
            rowSpan,
          }),
          align: 'center',
          render: ({ league_group, subMatches }) => {
            if (league_group) return null
            const subMatch = subMatches.find(e => e.type === 1)
            if (!subMatch) return null

            const { reason_pause } = subMatch
            return (
              <>
                <Row justify="space-between">
                  <Col>
                    <OpenCloseSubMatchButton record={subMatch} successCallback={refetch} />
                  </Col>
                  <Col>
                    <SubMatchSettingButton record={subMatch} successCallback={refetch} />
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
          },
        },
        {
          onHeaderCell: () => ({ className: 'separator-column-color' }),
          onCell: ({ league_group }) => ({
            className: league_group ? '' : 'separator-column-color',
            colSpan: league_group ? 0 : 1,
          }),
          width: 10,
        },
        {
          width: 20,
          onCell: record => {
            if (record.league_group) return { colSpan: 0 }

            const subMatch = record.subMatches.find(e => e.type === 2)
            if (!subMatch) return {}
            return {
              className: `${subMatch.sub_match_open_status}0`,
            }
          },
          render: ({ league_group, subMatches }) => {
            if (league_group) return null
            const subMatch = subMatches.find(e => e.type === 2)
            if (!subMatch) return null

            const { lock_shift, auto_odds, auto_pause } = subMatch
            return (
              <Space direction="vertical" size={0}>
                {lock_shift === 1 && <div className="icon-indicator lock" />}
                {auto_odds === 0 && <div className="icon-indicator autoOdds" />}
                {auto_pause === 1 && <div className="icon-indicator pause" />}
              </Space>
            )
          },
        },
        ...scoreList2.map((score, index) => ({
          title: score,
          width: 75,
          onCell: record => getCellSubMatch(record, 2),
          render: ({ league_group, subMatches }) => {
            if (league_group) return null
            const subMatch = subMatches.find(e => e.type === 2)
            if (!subMatch) return null

            const startingKey = 1
            return (
              <RenderSubMatch
                record={{
                  ...subMatch,
                  odds: subMatch[`odds${index + startingKey}`],
                  jml: subMatch[`jml${index + startingKey}`],
                  t: subMatch[`t${index + startingKey}`],
                  choice: choiceList2[index],
                }}
              />
            )
          },
        })),
        {
          title: '%',
          width: 75,
          onCell: record => getCellSubMatch(record, 2),
          render: ({ league_group, subMatches }) => {
            if (league_group) return null
            const subMatch = subMatches.find(e => e.type === 2)
            if (!subMatch) return null

            return <OddsMargin record={subMatch} />
          },
        },
        {
          title: 'Action',
          width: 100,
          onCell: ({ league_group, rowSpan }) => ({
            colSpan: league_group ? 0 : 1,
            rowSpan,
          }),
          align: 'center',
          render: ({ league_group, subMatches }) => {
            if (league_group) return null
            const subMatch = subMatches.find(e => e.type === 2)
            if (!subMatch) return null

            const { reason_pause } = subMatch
            return (
              <>
                <Row justify="space-between">
                  <Col>
                    <OpenCloseSubMatchButton record={subMatch} successCallback={refetch} />
                  </Col>
                  <Col>
                    <SubMatchSettingButton record={subMatch} successCallback={refetch} />
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
  const {
    sub_match_open_status,
    sub_match_pause_status,
    trader_group,
    trader_group_pause,
    price_alert_trader,
    last_change,
  } = subMatch

  const containerClass = `cell-color ${sub_match_open_status}${sub_match_pause_status} 
  ${getTraderClass(
    trader_group,
    trader_group_pause,
    price_alert_trader,
    sub_match_pause_status,
    '',
    last_change,
  )}`

  return {
    className: containerClass,
  }
}

const RenderSubMatch = ({ record }) => {
  return (
    <div className="d-flex justify-content-between">
      <Amount bold value={record.odds} />
      <BetListButton record={record} />
    </div>
  )
}

export default TableDeadballTG
