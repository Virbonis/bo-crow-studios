import React from 'react'
import { connect } from 'react-redux'
import { Button, Space, Table, message, Typography } from 'antd'
import CustomizeCell from 'components/blaise/custom/CustomizeCell'
import actions from 'redux/mix-parlay/actions'
import { getCellSubMatch, RenderSubMatch } from './cell-submatch'

const { Text } = Typography

const mapDispatchToProps = dispatch => ({
  UpdateTradingOnOffMatchParlay: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_ON_OFF_MATCH_PARLAY,
      payload,
      successCallback,
      source: 'Trading - Mix Parlay Fly',
    })
  },
  UpdateTradingOnOffSubMatchParlay: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_ON_OFF_SUB_MATCH_PARLAY,
      payload,
      successCallback,
      source: 'Trading - Mix Parlay Fly',
    })
  },
})

const TableMixParlay = ({
  UpdateTradingOnOffSubMatchParlay,
  UpdateTradingOnOffMatchParlay,
  data,
  refetch,
}) => {
  const [getRowSpan, getRowNumber] = React.useMemo(() => {
    const isFirstRow = (match_id, key) => {
      const index = data.findIndex(x => x.match_id === match_id && x.key === key)
      if (index === -1) return false
      if (index === 0) return true
      const prev = data[index - 1]
      return prev.match_id !== match_id
    }
    const rowCount = match_id => data.filter(x => x.match_id === match_id).length

    const uniqData = data.reduce((acc, cur) => {
      const index = !cur.league_group && acc.findIndex(x => x.match_id === cur.match_id)
      if (index === -1) acc.push(cur)
      return acc
    }, [])

    return [
      (match_id, key) => {
        if (!isFirstRow(match_id, key)) return 0
        return rowCount(match_id)
      },
      match_id => uniqData.findIndex(x => x.match_id === match_id) + 1,
    ]
  }, [data])

  const OnOffSubMatchHandler = React.useCallback(
    record => {
      const { match_id, sub_match_id, game_type, sub_match_parlay_status } = record
      UpdateTradingOnOffSubMatchParlay(
        {
          match_id,
          sub_match_id,
          game_type,
          sub_match_parlay_status: sub_match_parlay_status === 'Y' ? 'N' : 'Y',
        },
        () => refetch(),
      )
    },
    [UpdateTradingOnOffSubMatchParlay, refetch],
  )
  const OnOffMatchHandler = React.useCallback(
    (record, type) => {
      const { match_id } = record
      UpdateTradingOnOffMatchParlay(
        {
          match_id,
          sub_match_parlay_status: type,
        },
        () => refetch(),
      )
    },
    [UpdateTradingOnOffMatchParlay, refetch],
  )

  const columns = React.useMemo(
    () => [
      {
        title: 'No',
        width: 30,
        onCell: ({ match_id, key, league_group }) => {
          return {
            colSpan: league_group ? 11 : 1,
            rowSpan: league_group ? 1 : getRowSpan(match_id, key),
          }
        },
        render: ({ league_group, league_name, match_id }) => {
          if (league_group) return <span className="h5 font-weight-bold p-3">{league_name}</span>
          return <div align="center">{getRowNumber(match_id)}</div>
        },
      },
      {
        title: 'Time',
        align: 'center',
        width: 100,
        onCell: ({ match_id, key, league_group }) => ({
          rowSpan: league_group ? 0 : getRowSpan(match_id, key),
        }),
        render: record => {
          if (record.league_group) return null
          return (
            <div className="d-flex flex-column">
              <div className="icon-ball" />
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
        width: 200,
        onCell: record => ({ colSpan: record.league_group ? 0 : 1 }),
        render: record => {
          if (record.league_group) return null
          const sub_match_fav_status = record.subMatches.find(e => [0, 2].includes(e.game_type))
            ?.sub_match_fav_status
          const classNameHome = sub_match_fav_status === -1 ? 'text-danger' : ''
          const classNameAway = sub_match_fav_status === 1 ? 'text-danger' : ''

          return (
            <Space direction="vertical" size={0}>
              <Space size={2}>
                <span className={classNameHome}>{record.home_name}</span>
                {record.match_neutral_status === 'Y' ? '[N]' : '[H]'}
              </Space>
              <span className={classNameAway}>{record.away_name}</span>
              Draw
            </Space>
          )
        },
      },
      ...['1X2', 'HDP', 'OU'].map((title, i) => ({
        title,
        width: i + 1 === 1 ? 140 : 200,
        onCell: record => getCellSubMatch(record, i + 1),
        render: record => {
          if (record.league_group) return null

          return (
            <RenderSubMatch
              type={i + 1}
              subMatch={record.subMatches?.find(e => e.type === i + 1)}
              OnOffSubMatchHandler={OnOffSubMatchHandler}
            />
          )
        },
      })),
      {
        onHeaderCell: () => ({ className: 'separator-column-color' }),
        onCell: record => ({
          className: 'separator-column-color',
          colSpan: record.league_group ? 0 : 1,
        }),
        width: 2,
      },
      ...['1X2', 'HDP', 'OU'].map((title, i) => ({
        title: `FH. ${title}`,
        width: i + 4 === 4 ? 140 : 200,
        onCell: record => getCellSubMatch(record, i + 4),
        render: record => {
          if (record.league_group) return null

          return (
            <RenderSubMatch
              type={i + 4}
              subMatch={record.subMatches?.find(e => e.type === i + 4)}
              OnOffSubMatchHandler={OnOffSubMatchHandler}
            />
          )
        },
      })),
      {
        title: 'Action',
        width: 100,
        align: 'center',
        onCell: ({ match_id, key, league_group }) => ({
          rowSpan: league_group ? 0 : getRowSpan(match_id, key),
        }),
        render: record => {
          if (record.league_group) return null

          return (
            <Space direction="vertical" size={0}>
              <Space size={1}>
                <Button
                  type="text"
                  className="text-danger"
                  onClick={() => OnOffMatchHandler(record, 'N')}
                >
                  Off
                </Button>
                /
                <Button
                  type="text"
                  className="text-success"
                  onClick={() => OnOffMatchHandler(record, 'Y')}
                >
                  On
                </Button>
              </Space>
              <Button
                type="text"
                className="text-primary"
                onClick={() => {
                  message.info('Not support yet')
                }}
              >
                More
              </Button>
            </Space>
          )
        },
      },
    ],
    [getRowNumber, getRowSpan, OnOffSubMatchHandler, OnOffMatchHandler],
  )
  return (
    <Table
      id="table-mix-parlay"
      rowKey={record => `${record.match_id}-${record.key}`}
      bordered
      size="small"
      dataSource={data}
      columns={columns}
      pagination={false}
      rowClassName={x => {
        if (x.league_group) return 'separator-league-color'

        // return `open_pause_${x.match_open_status}_${x.match_pause_status}`
        if (x.match_pause_status === 1) return 'tr-match-paused'
        if (x.match_open_status === 'N') return 'tr-match-off'
        return x.rowNumber % 2 !== 0 ? 'tr-odd' : 'tr-even'
      }}
      components={{
        body: {
          cell: CustomizeCell,
        },
      }}
      scroll={{
        x: 'max-content',
      }}
    />
  )
}

export default connect(null, mapDispatchToProps)(TableMixParlay)
