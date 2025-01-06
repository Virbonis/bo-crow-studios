import React from 'react'
import { Table, Space, Typography } from 'antd'
import { Amount } from 'components/blaise'
import { getTraderClass } from 'helper'
import { isEqual } from 'lodash'
import RequestMoreGTLeagueButton from './component/button/request-more-gt-button'
import OddsMargin from '../shared-components/deadball-runningball/odds-margin'
import BetListButton from '../shared-components/trading-bet-list-button'
import OpenCloseSubMatchButton from '../shared-components/deadball-runningball/open-close-sub-match-button'
import SubMatchSettingButton from '../shared-components/deadball-runningball/sub-match-setting-button'

const { Text } = Typography

const choiceList = ['HH', 'HD', 'HA', 'DH', 'DD', 'DA', 'AH', 'AD', 'AA']
// const choiceList = ['HH', 'HD', 'HA', 'DH', 'DD', 'DA', 'AH', 'AD', 'AA']

const TableDeadballHTFT = React.memo(
  React.forwardRef(({ refetch, ...restProps }, ref) => {
    const { currSearchIndex } = restProps
    const columns = React.useMemo(
      () => [
        {
          title: 'No',
          width: 30,
          onCell: ({ league_group, rowSpan, match_id }) => ({
            colSpan: league_group ? 14 : 1,
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
                <OddsMargin record={record} />
              </Space>
            )
          },
        },
        {
          width: 20,
          onCell: record => {
            if (record.league_group) return { colSpan: 0 }

            return {
              className: `${record.sub_match_open_status}0`,
            }
          },
          render: record => {
            if (record.league_group) return null

            const { lock_shift, auto_odds, auto_pause } = record
            return (
              <Space direction="vertical" size={0}>
                {lock_shift === 1 && <div className="icon-indicator lock" />}
                {auto_odds === 0 && <div className="icon-indicator autoOdds" />}
                {auto_pause === 1 && <div className="icon-indicator pause" />}
              </Space>
            )
          },
        },
        ...choiceList.map((choice, index) => ({
          title: choice,
          width: 100,
          onCell: record => getCellSubMatch(record, 1),
          render: record => {
            if (record.league_group) return null

            return (
              <RenderSubMatch
                record={{
                  ...record,
                  odds: record[`odds${index + 1}`],
                  jml: record[`jml${index + 1}`],
                  t: record[`t${index + 1}`],
                  choice,
                }}
              />
            )
          },
        })),
        {
          title: 'Action',
          width: 100,
          onCell: ({ league_group, rowSpan }) => ({
            colSpan: league_group ? 0 : 1,
            rowSpan,
          }),
          align: 'center',
          render: record => {
            if (record.league_group) return null
            return (
              <>
                <OpenCloseSubMatchButton record={record} successCallback={refetch} />
                <br />
                <SubMatchSettingButton record={record} successCallback={refetch} />
                <br />
                {record.reason_pause && (
                  <Text
                    className={`${
                      ['MaxBet', 'LAP Short', 'LAP Long'].includes(record.reason_pause)
                        ? 'font-weight-bold text-primary'
                        : 'font-italic'
                    }`}
                  >
                    {record.reason_pause}
                  </Text>
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

const getCellSubMatch = record => {
  if (record.league_group) return { colSpan: 0 }

  const {
    sub_match_open_status,
    sub_match_pause_status,
    trader_group,
    trader_group_pause,
    price_alert_trader,
    last_change,
  } = record

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

export default TableDeadballHTFT
