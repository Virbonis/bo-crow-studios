import React from 'react'
import { Table } from 'antd'
import { Amount } from 'components/blaise'
import { isEqual } from 'lodash'
import getTraderClass from 'helper/trader-classname'
import RequestMoreGTLeagueButton from './component/button/request-more-gt-button'
import EditMatchButton from '../shared-components/deadball-runningball/edit-match-button'
import HandicapButton from '../shared-components/deadball-runningball/handicap-button'
import MoveOddsButton from '../shared-components/deadball-runningball/move-odds-button'
import GoLiveButton from './component/button/go-live-button'
import BetListButton from '../shared-components/trading-bet-list-button'
import OpenCloseSubMatchButton from '../shared-components/deadball-runningball/open-close-sub-match-button'
import SubMatchSettingButton from '../shared-components/deadball-runningball/sub-match-setting-button'
import OpenCloseMatchButton from './component/button/open-close-match-button'
import OnlineListButton from '../shared-components/online-list-button'

const TableDeadball1X2AHOU = React.memo(
  React.forwardRef(({ refetch, currSearchIndex, ...restProps }, ref) => {
    const columns = React.useMemo(
      () => [
        {
          title: 'No',
          width: 30,
          onCell: ({ league_group, rowSpan, match_id }) => ({
            colSpan: league_group ? 15 : 1,
            rowSpan,
            className: match_id === currSearchIndex.active_match_id ? 'active_selection' : '',
            align: league_group ? '' : 'center',
          }),
          render: ({ league_group, league_name, match_ids, rowNumber }) => {
            if (league_group)
              return (
                <div>
                  <span className="h5 font-weight-bold p-3">{league_name}</span>
                  <RequestMoreGTLeagueButton match_ids={match_ids} successCallback={refetch} />
                </div>
              )
            return rowNumber
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
                <div className="icon-ball" />
                <span>{record.match_date}</span>
                <span>{record.match_hour}</span>
                <span
                  style={{
                    backgroundColor: `${record.is_profile_changed === 0 ? '#ffff99' : '#3ac4f5'}`,
                  }}
                >
                  {record.profile_id}
                </span>
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
              <div className="d-flex flex-column">
                <span>
                  <OnlineListButton record={record} type="home" />
                  {record.match_neutral_status === 'Y' ? ' [N]' : ' [H]'}
                </span>
                <OnlineListButton record={record} type="away" />
                <span>Draw</span>
                <EditMatchButton record={record} />
              </div>
            )
          },
        },
        {
          title: '1X2',
          width: 140,
          onCell: record => getCellSubMatch(record, 1),
          render: record => {
            if (record.league_group) return null
            return <RenderSubMatch subMatches={record.subMatches} type={1} refetch={refetch} />
          },
        },
        {
          title: 'HDP',
          width: 200,
          onCell: record => getCellSubMatch(record, 2),
          render: record => {
            if (record.league_group) return null
            return <RenderSubMatch subMatches={record.subMatches} type={2} refetch={refetch} />
          },
        },
        {
          align: 'right',
          width: 20,
          onCell: record => ({ colSpan: record.league_group ? 0 : 1 }),
          render: record => {
            if (record.league_group) return null
            return <DisplayTotalStake subMatches={record.subMatches} type={2} />
          },
        },
        {
          title: 'OU',
          width: 200,
          onCell: record => getCellSubMatch(record, 3),
          render: record => {
            if (record.league_group) return null
            return <RenderSubMatch subMatches={record.subMatches} type={3} refetch={refetch} />
          },
        },
        {
          align: 'right',
          width: 20,
          onCell: record => ({ colSpan: record.league_group ? 0 : 1 }),
          render: record => {
            if (record.league_group) return null
            return <DisplayTotalStake subMatches={record.subMatches} type={3} />
          },
        },
        {
          onHeaderCell: () => ({ className: 'separator-column-color' }),
          onCell: ({ league_group, rowSpan }) => ({
            className: 'separator-column-color',
            colSpan: league_group ? 0 : 1,
            rowSpan,
          }),
          width: 10,
        },
        {
          title: 'FH. 1X2',
          width: 140,
          onCell: record => getCellSubMatch(record, 4),
          render: record => {
            if (record.league_group) return null
            return <RenderSubMatch subMatches={record.subMatches} type={4} refetch={refetch} />
          },
        },
        {
          title: 'FH. HDP',
          width: 200,
          onCell: record => getCellSubMatch(record, 5),
          render: record => {
            if (record.league_group) return null
            return <RenderSubMatch subMatches={record.subMatches} type={5} refetch={refetch} />
          },
        },
        {
          align: 'right',
          width: 20,
          onCell: record => ({ colSpan: record.league_group ? 0 : 1 }),
          render: record => {
            if (record.league_group) return null
            return <DisplayTotalStake subMatches={record.subMatches} type={5} />
          },
        },
        {
          title: 'FH. OU',
          width: 200,
          onCell: record => getCellSubMatch(record, 6),
          render: record => {
            if (record.league_group) return null
            return <RenderSubMatch subMatches={record.subMatches} type={6} refetch={refetch} />
          },
        },
        {
          align: 'right',
          width: 20,
          onCell: record => ({ colSpan: record.league_group ? 0 : 1 }),
          render: record => {
            if (record.league_group) return null
            return <DisplayTotalStake subMatches={record.subMatches} type={6} />
          },
        },
        {
          title: 'Action',
          width: 100,
          align: 'center',
          onCell: ({ league_group, rowSpan }) => ({
            colSpan: league_group ? 0 : 1,
            rowSpan,
          }),
          render: record => {
            if (record.league_group) return null
            return (
              <div>
                <OpenCloseMatchButton record={record} successCallback={refetch} />
                <GoLiveButton record={record} successCallback={refetch} />
              </div>
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
  } = record

  // const colStatus = (
  //   <Col>
  //     <Space direction="vertical" size={0}>
  //       {lock_shift === 1 && <div className="icon-indicator lock" />}
  //       {auto_odds === 0 && <div className="icon-indicator autoOdds" />}
  //       {auto_pause === 1 && <div className="icon-indicator pause" />}
  //     </Space>
  //   </Col>
  // )

  const containerClass = `cell-color ${sub_match_open_status}${sub_match_pause_status} 
  ${getTraderClass(
    trader_group,
    trader_group_pause,
    price_alert_trader,
    sub_match_pause_status,
    '',
    last_change,
  )}`

  // const rowSetting = (
  //   <>
  //     <Row justify="space-between">
  //       <Col>
  //         <OpenCloseSubMatchButton record={record} successCallback={refetch} />
  //       </Col>
  //       <Col>
  //         <SubMatchSettingButton record={record} successCallback={refetch} />
  //       </Col>
  //     </Row>
  //     {reason_pause && (
  //       <div align="center">
  //         <span
  //           className={`${
  //             ['MaxBet', 'LAP Short', 'LAP Long'].includes(reason_pause)
  //               ? 'font-weight-bold text-primary'
  //               : 'font-italic'
  //           }`}
  //         >
  //           {reason_pause}
  //         </span>
  //       </div>
  //     )}
  //   </>
  // )

  // 1X2, FH.1X2
  if ([1, 4].includes(type)) {
    const colOdds = (
      <>
        <Amount bold value={odds_home} /> <br />
        <Amount bold value={odds_away} /> <br />
        <Amount bold value={odds_draw} />
      </>
    )
    // return (
    //   <Row gutter={10}>
    //     {colStatus}
    //     <Col flex="auto" className={containerClass}>
    //       <Row justify="space-between">
    //         <Col>{colOdds}</Col>
    //         <Col align="right">
    //           <BetListButton record={record} />
    //         </Col>
    //       </Row>
    //       {rowSetting}
    //     </Col>
    //   </Row>
    // )
    return (
      <div className="d-flex" style={{ gap: 5 }}>
        <div className="d-flex flex-column">
          {lock_shift === 1 && <div className="icon-indicator lock" />}
          {auto_odds === 0 && <div className="icon-indicator autoOdds" />}
          {auto_pause === 1 && <div className="icon-indicator pause" />}
        </div>
        <div style={{ flex: '1 1 auto' }} className={containerClass}>
          <div className="d-flex justify-content-between">
            <div>{colOdds}</div>
            <div>
              <BetListButton record={record} />
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column">
              <OpenCloseSubMatchButton record={record} successCallback={refetch} />
            </div>
            <div className="d-flex flex-column">
              <SubMatchSettingButton record={record} successCallback={refetch} />
            </div>
          </div>
          {reason_pause && (
            <div align="center">
              <span
                className={`${
                  ['MaxBet', 'LAP Short', 'LAP Long'].includes(reason_pause)
                    ? 'font-weight-bold text-primary'
                    : 'font-italic'
                }`}
              >
                {reason_pause}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // HDP, OU, FH.HDP, FH.OU
  if ([2, 3, 5, 6].includes(type)) {
    // return (
    //   <Row gutter={10}>
    //     {colStatus}
    //     <Col flex="auto" className={containerClass}>
    //       <Row>
    //         <Col>
    //           <HandicapButton record={record} successCallback={refetch} />
    //         </Col>
    //         <Col align="right" flex="auto">
    //           <MoveOddsButton record={record} successCallback={refetch} />
    //         </Col>
    //         <Col span={12} align="right">
    //           <BetListButton record={record} />
    //         </Col>
    //       </Row>
    //       <br />
    //       {rowSetting}
    //     </Col>
    //   </Row>
    // )
    return (
      <div className="d-flex" style={{ gap: 5 }}>
        <div className="d-flex flex-column">
          {lock_shift === 1 && <div className="icon-indicator lock" />}
          {auto_odds === 0 && <div className="icon-indicator autoOdds" />}
          {auto_pause === 1 && <div className="icon-indicator pause" />}
        </div>
        <div style={{ flex: '1 1 auto' }} className={containerClass}>
          <div className="d-flex">
            <div>
              <HandicapButton record={record} successCallback={refetch} />
            </div>
            <div style={{ flex: '1 1 auto' }} align="right">
              <MoveOddsButton record={record} successCallback={refetch} />
            </div>
            <div style={{ flex: '0 0 50%' }} align="right">
              <BetListButton record={record} />
            </div>
          </div>
          <br />
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column">
              <OpenCloseSubMatchButton record={record} successCallback={refetch} />
            </div>
            <div className="d-flex flex-column">
              <SubMatchSettingButton record={record} successCallback={refetch} />
            </div>
          </div>
          {reason_pause && (
            <div align="center">
              <span
                className={`${
                  ['MaxBet', 'LAP Short', 'LAP Long'].includes(reason_pause)
                    ? 'font-weight-bold text-primary'
                    : 'font-italic'
                }`}
              >
                {reason_pause}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

const DisplayTotalStake = ({ subMatches, type }) => {
  const record = subMatches.find(e => e.type === type)
  if (!record) return null

  const { game_type, sub_match_fav_status, t_away, t_home } = record

  let stakeTotal = 0
  // HDP
  if ([0, 2].includes(game_type)) {
    if (sub_match_fav_status >= 1) stakeTotal = t_away - t_home
    else stakeTotal = t_home - t_away
  }
  // OU
  else if ([5, 6].includes(game_type)) stakeTotal = t_home - t_away

  if (stakeTotal !== 0) stakeTotal /= 1000
  return <Amount value={stakeTotal} int noColor />
}

export default TableDeadball1X2AHOU
