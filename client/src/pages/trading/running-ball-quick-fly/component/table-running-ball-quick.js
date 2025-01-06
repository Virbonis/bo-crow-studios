import React from 'react'
import { Space, Table, Typography } from 'antd'
import { getCellSubMatch, RenderSubMatch } from 'pages/trading/running-ball-fly/cell-submatch'
import OnlineListButton from 'pages/trading/shared-components/online-list-button'
import getMatchRound from 'helper/get-match-round'

const { Text } = Typography

const RunningBallQuickTable = ({ refetch, data, ...restProps }) => {
  const columns = React.useMemo(
    () => [
      {
        title: 'No',
        width: 30,
        onCell: ({ league_group, rowSpan }) => ({
          colSpan: league_group ? 8 : 1,
          rowSpan,
        }),
        render: ({ league_group, league_name, rowNumber }) =>
          league_group ? (
            <span className="h5 font-weight-bold p-3">{league_name}</span>
          ) : (
            <div align="center">{rowNumber}</div>
          ),
      },
      {
        title: 'Time',
        align: 'center',
        width: 100,
        onCell: ({ league_group, rowSpan }) => ({
          rowSpan: league_group ? 0 : rowSpan,
        }),
        render: record => (
          <div className="d-flex flex-column">
            <span>{record.match_date}</span>
            <span>{record.match_hour}</span>
            <>
              <Text style={{ color: '#C63' }}>{getMatchRound(record.match_round)}</Text>
              <Text style={{ color: '#C63' }}>{record.match_elapsed_time}</Text>
            </>
            <span
              style={{
                color: record.home_posisi === 0 && record.away_posisi === 0 ? '#2f2f2f' : '#993332',
              }}
              className="h4 font-weight-bold m-0"
            >
              {record.home_posisi} - {record.away_posisi}
            </span>
            <span
              style={{
                backgroundColor: record.is_profile_changed === 0 ? '#ffff99' : '#3ac4f5',
              }}
            >
              {record.profile_id}
            </span>
          </div>
        ),
      },
      {
        title: 'Home Away',
        width: 200,
        onCell: record => ({ rowSpan: record.league_group && 0 }),
        render: record => (
          <Space direction="vertical" size={0}>
            <Space size={1}>
              <Text>
                <OnlineListButton record={record} type="home" fromPage="runningball" />
                {record.match_neutral_status === 'Y' ? '[N]' : '[H]'}
              </Text>
              {record.home_rc > 0 &&
                Array.from({ length: record.home_rc }, (_, index) => (
                  <div key={index} className="icon-rc" />
                ))}
            </Space>
            <Space size={1}>
              <OnlineListButton record={record} type="away" fromPage="runningball" />
              {record.away_rc > 0 &&
                Array.from({ length: record.away_rc }, (_, index) => (
                  <div key={index} className="icon-rc" />
                ))}
            </Space>
          </Space>
        ),
      },
      ...['HDP', 'OU'].map((title, i) => ({
        title,
        width: 200,
        onCell: record => getCellSubMatch(record, i + 1),
        render: record => (
          <RenderSubMatch subMatches={record.subMatches} refetch={refetch} type={i + 1} />
        ),
      })),
      ...['HDP', 'OU'].map((title, i) => ({
        title: `FH. ${title}`,
        width: 200,
        onCell: record => getCellSubMatch(record, i + 3),
        render: record => (
          <RenderSubMatch subMatches={record.subMatches} refetch={refetch} type={i + 3} />
        ),
      })),
      {
        title: 'Action',
        align: 'center',
        width: 65,
        onCell: ({ league_group, rowSpan }) => ({
          colSpan: league_group ? 0 : 1,
          rowSpan,
        }),
        // ============= LIVE FINALIZE DI COMMENT =================
        // render: record =>
        //   record.is_match_confirmed && (
        //     <GoLiveButton editValue={record} refetch={refetch} />
        //   ),
      },
    ],
    [refetch],
  )

  return <Table columns={columns} {...restProps} />
}

export default RunningBallQuickTable
