import React from 'react'
import { Table, Typography } from 'antd'
import { Amount } from 'components/blaise'
import { countOddsMargin } from 'helper'
import getTraderClass from 'helper/trader-classname'
import OpenCloseSubMatchOutrightButton from './component/button/open-close-sub-match-outright-button'
import SubMatchSettingOutrightButton from './component/button/sub-match-setting-outright-button'
import BetListButton from '../shared-components/trading-bet-list-button'
import SettingOutrightButton from './component/button/setting-outright-button'
import OpenCloseOutrightButton from './component/button/open-close-outright-button'
import ConfirmOutrightButton from './component/button/confirm-outright-button'

const { Text } = Typography

const TableDeadballOUT = React.memo(({ dataSource, refetch, ...restProps }) => {
  const columns = React.useMemo(
    () => [
      {
        title: 'No',
        width: 30,
        onCell: ({ league_group, rowSpan }) => ({
          colSpan: league_group ? 5 : 1,
          rowSpan,
        }),
        render: ({ league_group, league_name, rowNumber }) => {
          if (league_group) return <span className="h5 font-weight-bold p-3">{league_name}</span>
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
              <Text>{record.match_date.formatDate()}</Text>
              <Text>{record.match_date.formatTime()}</Text>
            </div>
          )
        },
      },
      {
        title: 'Team',
        width: 250,
        onCell: record => getCellSubMatch(record, 1),
        render: record => {
          if (record.league_group) return null
          return <RenderSubMatch record={record} refetch={refetch} />
        },
      },
      {
        title: '%',
        width: 75,
        align: 'center',
        onCell: record => ({
          colSpan: record.league_group ? 0 : 1,
          rowSpan: record.league_group ? 0 : record.rowSpan,
        }),
        render: record => {
          if (record.league_group) return null

          const totalOdds = countOddsMargin(
            dataSource.filter(x => x.outright_id === record.outright_id).map(e => e.odds),
          )
          return <Amount value={totalOdds} keepRed={totalOdds < 1} />
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
        render: record => {
          if (record.league_group) return null
          return (
            <>
              <SettingOutrightButton record={record} successCallback={refetch} />
              <OpenCloseOutrightButton record={record} successCallback={refetch} />
              <ConfirmOutrightButton record={record} successCallback={refetch} />
            </>
          )
        },
      },
    ],
    [dataSource, refetch],
  )
  return <Table dataSource={dataSource} columns={columns} {...restProps} virtual={false} />
})

const getCellSubMatch = record => {
  if (record.league_group) return { colSpan: 0 }

  const { sub_match_open_status } = record

  return {
    className: `${sub_match_open_status}0`,
  }
}
const RenderSubMatch = ({ record, refetch }) => {
  const {
    lock_shift,
    auto_odds,
    auto_pause,
    team_name,
    trader_group,
    trader_group_pause,
    last_change,
    price_alert_trader,
    sub_match_open_status,
    sub_match_pause_status,
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

  const containerClass = `cell-color ${sub_match_open_status}${sub_match_pause_status} ${getTraderClass(
    trader_group,
    trader_group_pause,
    price_alert_trader,
    sub_match_pause_status,
    '',
    last_change,
  )}`

  // return (
  //   <Row gutter={10}>
  //     {colStatus}
  //     <Col flex="auto" className={containerClass}>
  //       <Row justify="space-between">
  //         <Col span={6}>{team_name}</Col>
  //         <Col span={6} align="right">
  //           <OpenCloseSubMatchOutrightButton record={record} successCallback={refetch} />
  //         </Col>
  //         <Col span={6} align="right">
  //           <SubMatchSettingOutrightButton record={record} successCallback={refetch} />
  //         </Col>
  //         <Col span={6} align="right">
  //           <BetListButton
  //             record={{
  //               ...record,
  //               sub_match_id: record.sub_match_seq,
  //               game_type: 11,
  //             }}
  //           />
  //         </Col>
  //       </Row>
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
          <div style={{ flex: '0 0 25%' }}>{team_name}</div>
          <div style={{ flex: '0 0 25%' }} align="right">
            <OpenCloseSubMatchOutrightButton record={record} successCallback={refetch} />
          </div>
          <div style={{ flex: '0 0 25%' }} align="right">
            <SubMatchSettingOutrightButton record={record} successCallback={refetch} />
          </div>
          <div style={{ flex: '0 0 25%' }} align="right">
            <BetListButton
              record={{
                ...record,
                sub_match_id: record.sub_match_seq,
                game_type: 11,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableDeadballOUT
