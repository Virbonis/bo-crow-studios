import React from 'react'
import { Col, Divider, Row, Space, Table, Typography } from 'antd'
import { getTraderClass } from 'helper'
import { Amount } from 'components/blaise'
import { isEqual } from 'lodash'
import RequestMoreGTLeagueButton from './component/button/request-more-gt-button'
import HandicapButton from '../shared-components/deadball-runningball/handicap-button'
import BetListButton from '../shared-components/trading-bet-list-button'
import OddsMargin from '../shared-components/deadball-runningball/odds-margin'
import OpenCloseSubMatchButton from '../shared-components/deadball-runningball/open-close-sub-match-button'
import SubMatchSettingButton from '../shared-components/deadball-runningball/sub-match-setting-button'
import OnlineListButton from '../shared-components/online-list-button'

const { Text } = Typography

const TableDeadballDCML = React.memo(
  React.forwardRef(({ refetch, ...restProps }, ref) => {
    const { currSearchIndex } = restProps
    const columns = React.useMemo(
      () => [
        {
          title: 'No',
          width: 30,
          onCell: ({ league_group, rowSpan, match_id }) => ({
            colSpan: league_group ? 6 : 1,
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
                <OnlineListButton record={record} type="home" />
                <OnlineListButton record={record} type="away" />
              </Space>
            )
          },
        },
        {
          title: 'DC',
          width: 200,
          onCell: record => getCellSubMatch(record, 1),
          render: record => {
            if (record.league_group) return null
            return <RenderSubMatch subMatches={record.subMatches} type={1} refetch={refetch} />
          },
        },
        {
          title: 'ML',
          width: 200,
          onCell: record => getCellSubMatch(record, 2),
          render: record => {
            if (record.league_group) return null
            return <RenderSubMatch subMatches={record.subMatches} type={2} refetch={refetch} />
          },
        },
        {
          title: '1H.ML',
          width: 200,
          onCell: record => getCellSubMatch(record, 3),
          render: record => {
            if (record.league_group) return null
            return <RenderSubMatch subMatches={record.subMatches} type={3} refetch={refetch} />
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
  }
}

const RenderSubMatch = ({ subMatches, type, refetch }) => {
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
    odds_home,
    odds_away,
    odds_draw,

    sub_match_open_status,
    sub_match_pause_status,
    reason_pause,
    game_type,
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

  const colChoice =
    game_type === 15 ? (
      <>
        <span>1X</span> <br />
        <span>12</span> <br />
        <span>2X</span>
      </>
    ) : (
      <>
        <span>H</span> <br />
        <span>A</span>
      </>
    )
  const colOdds =
    game_type === 15 ? (
      <>
        <Amount bold value={odds_home} /> <br />
        <Amount bold value={odds_draw} /> <br />
        <Amount bold value={odds_away} />
      </>
    ) : (
      <>
        <Amount bold value={odds_home} /> <br />
        <Amount bold value={odds_away} />
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

  return (
    <Row gutter={10}>
      {colStatus}
      <Col flex="auto" className={containerClass}>
        <Row>
          <Col>{colChoice}</Col>
          <Col align="right" flex="auto">
            <HandicapButton record={record} successCallback={refetch}>
              {colOdds}
            </HandicapButton>
          </Col>
          <Col span={12} align="right">
            <BetListButton
              record={{
                ...record,
                jml_home: record.jml1,
                jml_away: record.jml2,
                jml_draw: record.jml3,
                t_home: record.t1,
                t_away: record.t2,
                t_draw: record.t3,
              }}
            />
          </Col>
        </Row>
        <Divider className="m-0" />
        <OddsMargin record={record} />
        {rowSetting}
      </Col>
    </Row>
  )
}

export default TableDeadballDCML
