import React from 'react'
import { Row, Space, Table, Typography } from 'antd'
import TimerFormat from 'helper/timer-format'
import getMatchRound from 'helper/get-match-round'
import { isEqual } from 'lodash'
import EditMatchButton from '../shared-components/deadball-runningball/edit-match-button'
import OnlineListButton from '../shared-components/online-list-button'
import PopUpButton from './component/pop-up-button'
import { DisplayPendingHomeAway, RenderSubMatch, getCellSubMatch } from './cell-submatch'

const { Text } = Typography

const TableRunningBall = React.memo(
  React.forwardRef(({ refetch, currSearchIndex, ...restProps }, ref) => {
    const columns = React.useMemo(
      () => [
        {
          title: 'No',
          width: 30,
          onCell: ({ league_group, rowSpan }) => ({
            colSpan: league_group ? 13 : 1,
            rowSpan,
          }),
          render: ({ rowNumber, league_group, league_name }) =>
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
          render: record => {
            if (record.league_group) return null
            return (
              <div className="d-flex flex-column">
                <span>{record.match_date}</span>
                <span>{record.match_hour}</span>
                {record.match_round !== 0 && (
                  <>
                    <Text style={{ color: '#C63' }}>{getMatchRound(record.match_round)}</Text>
                    <Text style={{ color: '#C63' }}>{record.match_elapsed_time}</Text>
                  </>
                )}
                <h3
                  style={{
                    color:
                      record.home_posisi === 0 && record.away_posisi === 0 ? '#2f2f2f' : '#993332',
                  }}
                  className="h4 font-weight-bold m-0"
                >
                  {record.home_posisi} - {record.away_posisi}
                </h3>
                <span
                  style={{
                    backgroundColor: record.is_profile_changed === 0 ? '#ffff99' : '#3ac4f5',
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
          width: 200,
          onCell: record => ({ rowSpan: record.league_group && 0 }),
          render: record => {
            return (
              <>
                <Space direction="vertical" size={0}>
                  <Space size={1}>
                    <OnlineListButton record={record} type="home" fromPage="runningball" />
                    {record.match_neutral_status === 'Y' ? '[N]' : '[H]'}
                    {record.home_rc > 0 &&
                      Array.from({ length: record.home_rc }, (_, i) => (
                        <div key={i} className="icon-rc" />
                      ))}
                  </Space>
                  <Space size={1}>
                    <OnlineListButton record={record} type="away" fromPage="runningball" />
                    {record.away_rc > 0 &&
                      Array.from({ length: record.away_rc }, (_, i) => (
                        <div key={i} className="icon-rc" />
                      ))}
                  </Space>
                </Space>
                <Row justify="space-between">
                  <EditMatchButton record={record} />
                  <PopUpButton record={record} />
                </Row>
              </>
            )
          },
          // shouldCellUpdate: (next, prev) => {
          //   const { ellapse_time: x, match_round: x2, ...resetNext } = next
          //   const { ellapse_time: x1, match_round: x3, ...resetPrev } = prev
          //   return !isEqual(resetNext, resetPrev)
          //   // semua selain ellapse_time + match_round,
          // },
        },
        ...['HDP', 'OU'].flatMap((title, i) => [
          {
            title,
            width: 200,
            onCell: record => getCellSubMatch(record, i + 1),
            render: record => (
              <RenderSubMatch subMatches={record.subMatches} refetch={refetch} type={i + 1} />
            ),
          },
          {
            title: 'P',
            align: 'right',
            width: 50,
            onCell: record => ({ rowSpan: record.league_group && 0 }),
            render: record => (
              <DisplayPendingHomeAway subMatches={record.subMatches} type={i + 1} />
            ),
          },
        ]),
        ...['HDP', 'OU'].flatMap((title, i) => [
          {
            title: `FH. ${title}`,
            width: 200,
            onCell: record => getCellSubMatch(record, i + 3),
            render: record => (
              <RenderSubMatch subMatches={record.subMatches} refetch={refetch} type={i + 3} />
            ),
          },
          {
            title: 'P',
            align: 'right',
            width: 50,
            onCell: record => ({ rowSpan: record.league_group && 0 }),
            render: record => (
              <DisplayPendingHomeAway subMatches={record.subMatches} type={i + 3} />
            ),
          },
        ]),
        {
          title: 'Action',
          align: 'center',
          children: [
            {
              align: 'center',
              width: 70,
              onCell: ({ league_group, rowSpan }) => ({
                colSpan: league_group ? 0 : 1,
                rowSpan,
              }),
              onHeaderCell: () => ({ style: { display: 'none' } }),
            },
            {
              align: 'center',
              width: 70,
              render: record =>
                TimerFormat(record.last_accept_pending_tickets) !== '' && (
                  <Text style={{ color: '#C63' }}>
                    Last Accept: <br />
                    {record.last_accept_pending_tickets}
                  </Text>
                ),
              onCell: ({ league_group, rowSpan }) => ({
                colSpan: league_group ? 0 : 1,
                rowSpan,
              }),
              onHeaderCell: () => ({ style: { display: 'none' } }),
            },
          ],
        },
      ],
      [refetch],
    )

    return <Table columns={columns} {...restProps} ref={ref} />
  }),
  (prev, next) =>
    isEqual(prev.dataSource, next.dataSource) &&
    isEqual(prev.currSearchIndex, next.currSearchIndex),
)

export default TableRunningBall
