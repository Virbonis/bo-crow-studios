import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Table, Spin, Space, Typography } from 'antd'
import actions from 'redux/match-list/actions'
import { gameTypeDescription } from 'helper/index'
import { Amount } from 'components/blaise'

const { Text } = Typography
const mapStateToProps = ({ matchList }) => ({
  loading: matchList.loadingList,
  dataSpecial: matchList.dataListSubMatch.data_special || [],
  dataAHOU: matchList.dataListSubMatch.data_ahou || [],
  data1x2: matchList.dataListSubMatch.data_1x2 || [],
  dataHTFT: matchList.dataListSubMatch.data_htft || [],
  dataTG: matchList.dataListSubMatch.data_tg || [],
  dataFGLG: matchList.dataListSubMatch.data_fglg || [],
  dataCS: matchList.dataListSubMatch.data_cs || [],
  dataCSLive: matchList.dataListSubMatch.data_cs_live || [],
})

const mapDispatchToProps = dispatch => ({
  LoadList: payload => {
    dispatch({
      type: actions.LOAD_LIST_SUB_MATCH,
      payload,
      source: 'Match List',
    })
  },
  CleanUpList: () => dispatch({ type: actions.CLEAN_UP_LIST_SUB_MATCH }),
})

const MatchListMenu = ({
  listSubMenuValue,
  loading,
  dataSpecial,
  dataAHOU,
  data1x2,
  dataTG,
  dataFGLG,
  dataCS,
  dataHTFT,
  dataCSLive,
  LoadList,
  CleanUpList,
}) => {
  React.useEffect(() => CleanUpList, [CleanUpList])

  useEffect(() => {
    LoadList(listSubMenuValue)
  }, [LoadList, listSubMenuValue])

  const rowKey = 'sub_match_id'
  const getRowCountCSLive = React.useCallback(
    (sub_match_id, rowIndex) => {
      const firstIndex = dataCSLive.findIndex(x => x.sub_match_id === sub_match_id)
      if (firstIndex === rowIndex) {
        const rowCount = dataCSLive.filter(x => x.sub_match_id === sub_match_id).length
        return rowCount
      }
      return 0
    },
    [dataCSLive],
  )
  return (
    <>
      <Spin spinning={loading}>
        {dataSpecial.length > 0 && (
          <Table
            rowKey="match_id"
            columns={columnSpecial}
            dataSource={dataSpecial}
            pagination={false}
          />
        )}
        <Table rowKey={rowKey} columns={columnAHOU} dataSource={dataAHOU} pagination={false} />
        <Table rowKey={rowKey} columns={column1X2} dataSource={data1x2} pagination={false} />
        <Table rowKey={rowKey} columns={columnTG} dataSource={dataTG} pagination={false} />
        <Table rowKey={rowKey} columns={columnFGLG} dataSource={dataFGLG} pagination={false} />
        <Table rowKey={rowKey} columns={columnHTFT} dataSource={dataHTFT} pagination={false} />
        <Table rowKey={rowKey} columns={columnCS} dataSource={dataCS} pagination={false} />
        <Table
          rowKey={record => `${record.sub_match_id}-${record.score}`}
          columns={columnCSLive(getRowCountCSLive)}
          dataSource={dataCSLive}
          pagination={false}
        />
      </Spin>
    </>
  )
}

const columnSpecial = [
  {
    title: 'Match ID',
    dataIndex: 'match_id',
    width: 100,
  },
  {
    title: 'Match Date',
    dataIndex: 'match_date',
    render: text => text.formatDateTime(),
    width: 200,
  },
  {
    title: 'League Name',
    dataIndex: 'league_name',
    width: 400,
  },
  {
    title: 'Home Away',
    width: 400,
    render: ({ home_name, away_name }) => (
      <>
        {home_name}
        <br />
        {away_name}
      </>
    ),
  },
]
// columnAHOU for gametype ah,ou,oe,wnw
const columnAHOU = [
  {
    title: 'Sub Match ID',
    dataIndex: 'sub_match_id',
    width: 100,
  },
  {
    title: 'Game Type',
    dataIndex: 'game_type',
    render: text => gameTypeDescription[text]?.long,
    width: 200,
  },
  {
    title: 'HDC',
    dataIndex: 'handicap',
    width: 200,
  },
  {
    title: 'Home',
    dataIndex: 'odds1',
    width: 200,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Away',
    dataIndex: 'odds2',
    width: 200,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Open',
    dataIndex: 'sub_match_open_status',
    render: text => statusOpen(text),
    width: 75,
  },
  {
    title: 'Pause',
    dataIndex: 'sub_match_pause_status',
    render: text => statusPause(text),
    width: 75,
  },
  {
    title: 'Parlay',
    dataIndex: 'sub_match_parlay_status',
    render: text => statusParlay(text),
    width: 75,
  },
]
const column1X2 = [
  {
    title: 'Sub Match ID',
    dataIndex: 'sub_match_id',
    width: 100,
  },
  {
    title: 'Game Type',
    dataIndex: 'game_type',
    render: text => gameTypeDescription[text]?.long,
    width: 200,
  },
  {
    title: '1 (1X)',
    dataIndex: 'odds1',
    width: 200,
    render: text => <Amount value={text} />,
  },
  {
    title: 'X (12)',
    dataIndex: 'odds2',
    width: 200,
    render: text => <Amount value={text} />,
  },
  {
    title: '2 (X2)',
    dataIndex: 'odds3',
    width: 200,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Open',
    dataIndex: 'sub_match_open_status',
    render: text => statusOpen(text),
    width: 75,
  },
  {
    title: 'Pause',
    dataIndex: 'sub_match_pause_status',
    render: text => statusPause(text),
    width: 75,
  },
  {
    title: 'Parlay',
    dataIndex: 'sub_match_parlay_status',
    render: text => statusParlay(text),
    width: 75,
  },
]
const columnTG = [
  {
    title: 'Sub Match ID',
    dataIndex: 'sub_match_id',
    width: 100,
  },
  {
    title: 'Game Type',
    dataIndex: 'game_type',
    render: text => gameTypeDescription[text]?.long,
    width: 200,
  },
  {
    title: '0-1',
    dataIndex: 'odds1',
    width: 150,
    render: text => <Amount value={text} />,
  },
  {
    title: '2-3',
    dataIndex: 'odds2',
    width: 150,
    render: text => <Amount value={text} />,
  },
  {
    title: '4-6/4 & Over',
    dataIndex: 'odds3',
    width: 150,
    render: text => <Amount value={text} />,
  },
  {
    title: '7 & Over',
    dataIndex: 'odds4',
    width: 150,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Open',
    dataIndex: 'sub_match_open_status',
    render: text => statusOpen(text),
    width: 75,
  },
  {
    title: 'Pause',
    dataIndex: 'sub_match_pause_status',
    render: text => statusPause(text),
    width: 75,
  },
  {
    title: 'Parlay',
    dataIndex: 'sub_match_parlay_status',
    render: text => statusParlay(text),
    width: 75,
  },
]
const columnFGLG = [
  {
    title: 'Sub Match ID',
    dataIndex: 'sub_match_id',
    width: 100,
  },
  {
    title: 'Game Type',
    dataIndex: 'game_type',
    render: text => gameTypeDescription[text]?.long,
    width: 200,
  },
  {
    title: 'FG.H',
    dataIndex: 'odds1',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'FG.A',
    dataIndex: 'odds2',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'LG.H',
    dataIndex: 'odds3',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'LG.A',
    dataIndex: 'odds4',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'No Goal',
    dataIndex: 'odds5',
    width: 120,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Open',
    dataIndex: 'sub_match_open_status',
    render: text => statusOpen(text),
    width: 75,
  },
  {
    title: 'Pause',
    dataIndex: 'sub_match_pause_status',
    render: text => statusPause(text),
    width: 75,
  },
  {
    title: 'Parlay',
    dataIndex: 'sub_match_parlay_status',
    render: text => statusParlay(text),
    width: 75,
  },
]
const columnHTFT = [
  {
    title: 'Sub Match ID',
    dataIndex: 'sub_match_id',
    width: 100,
  },
  {
    title: 'Game Type',
    dataIndex: 'game_type',
    render: text => gameTypeDescription[text]?.long,
    width: 200,
  },
  {
    title: 'HH',
    dataIndex: 'odds1',
    width: 70,
    render: text => <Amount value={text} />,
  },
  {
    title: 'HD',
    dataIndex: 'odds2',
    width: 70,
    render: text => <Amount value={text} />,
  },
  {
    title: 'HA',
    dataIndex: 'odds3',
    width: 70,
    render: text => <Amount value={text} />,
  },
  {
    title: 'DH',
    dataIndex: 'odds4',
    width: 70,
    render: text => <Amount value={text} />,
  },
  {
    title: 'DD',
    dataIndex: 'odds5',
    width: 70,
    render: text => <Amount value={text} />,
  },
  {
    title: 'DA',
    dataIndex: 'odds6',
    width: 70,
    render: text => <Amount value={text} />,
  },
  {
    title: 'AH',
    dataIndex: 'odds7',
    width: 70,
    render: text => <Amount value={text} />,
  },
  {
    title: 'AD',
    dataIndex: 'odds8',
    width: 70,
    render: text => <Amount value={text} />,
  },
  {
    title: 'AA',
    dataIndex: 'odds9',
    width: 70,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Open',
    dataIndex: 'sub_match_open_status',
    render: text => statusOpen(text),
    width: 75,
  },
  {
    title: 'Pause',
    dataIndex: 'sub_match_pause_status',
    render: text => statusPause(text),
    width: 75,
  },
  {
    title: 'Parlay',
    dataIndex: 'sub_match_parlay_status',
    render: text => statusParlay(text),
    width: 75,
  },
]
const columnCS = [
  {
    title: 'Sub Match ID',
    dataIndex: 'sub_match_id',
    width: 100,
  },
  {
    title: 'Game Type',
    dataIndex: 'game_type',
    render: text => gameTypeDescription[text]?.long,
    width: 200,
  },
  {
    title: '1:0',
    width: 40,
    render: ({ odds1, odds12 }) => (
      <Space direction="vertical">
        <Amount value={odds1} int />
        <Amount value={odds12} int />
      </Space>
    ),
  },
  {
    title: '2:0',
    width: 40,
    render: ({ odds2, odds13 }) => (
      <Space direction="vertical">
        <Amount value={odds2} int />
        <Amount value={odds13} int />
      </Space>
    ),
  },
  {
    title: '2:1',
    width: 40,
    render: ({ odds3, odds14 }) => (
      <Space direction="vertical">
        <Amount value={odds3} int />
        <Amount value={odds14} int />
      </Space>
    ),
  },
  {
    title: '3:0',
    width: 40,
    render: ({ odds4, odds15 }) => (
      <Space direction="vertical">
        <Amount value={odds4} int />
        <Amount value={odds15} int />
      </Space>
    ),
  },
  {
    title: '3:1',
    width: 40,
    render: ({ odds5, odds16 }) => (
      <Space direction="vertical">
        <Amount value={odds5} int />
        <Amount value={odds16} int />
      </Space>
    ),
  },
  {
    title: '3:2',
    width: 40,
    render: ({ odds6, odds17 }) => (
      <Space direction="vertical">
        <Amount value={odds6} int />
        <Amount value={odds17} int />
      </Space>
    ),
  },
  {
    title: '4:0',
    width: 40,
    render: ({ odds7, odds18 }) => (
      <Space direction="vertical">
        <Amount value={odds7} int />
        <Amount value={odds18} int />
      </Space>
    ),
  },
  {
    title: '4:1',
    width: 40,
    render: ({ odds8, odds19 }) => (
      <Space direction="vertical">
        <Amount value={odds8} int />
        <Amount value={odds19} int />
      </Space>
    ),
  },
  {
    title: '4:2',
    width: 40,
    render: ({ odds9, odds20 }) => (
      <Space direction="vertical">
        <Amount value={odds9} int />
        <Amount value={odds20} int />
      </Space>
    ),
  },
  {
    title: '4:3',
    width: 40,
    render: ({ odds10, odds21 }) => (
      <Space direction="vertical">
        <Amount value={odds10} int />
        <Amount value={odds21} int />
      </Space>
    ),
  },
  {
    title: '0:0',
    dataIndex: 'odds23',
    width: 40,
    render: text => <Amount value={text} int />,
  },
  {
    title: '1:1',
    dataIndex: 'odds24',
    width: 40,
    render: text => <Amount value={text} int />,
  },
  {
    title: '2:2',
    dataIndex: 'odds25',
    width: 40,
    render: text => <Amount value={text} int />,
  },
  {
    title: '3:3',
    dataIndex: 'odds26',
    width: 40,
    render: text => <Amount value={text} int />,
  },
  {
    title: '4:4',
    dataIndex: 'odds27',
    width: 40,
    render: text => <Amount value={text} int />,
  },
  {
    title: 'AOS',
    dataIndex: 'odds11',
    width: 40,
    render: text => <Amount value={text} int />,
  },
  {
    title: 'Open',
    dataIndex: 'sub_match_open_status',
    render: text => statusOpen(text),
    width: 75,
  },
  {
    title: 'Pause',
    dataIndex: 'sub_match_pause_status',
    render: text => statusPause(text),
    width: 75,
  },
  {
    title: 'Parlay',
    dataIndex: 'sub_match_parlay_status',
    render: text => statusParlay(text),
    width: 75,
  },
]
const columnCSLive = getRowCount => [
  {
    title: 'Sub Match ID',
    dataIndex: 'sub_match_id',
    width: 100,
    onCell: (record, rowIndex) => {
      return { rowSpan: getRowCount(record.sub_match_id, rowIndex) }
    },
  },
  {
    title: 'Game Type',
    dataIndex: 'game_type',
    render: text => gameTypeDescription[text]?.long,
    width: 200,
    onCell: (record, rowIndex) => {
      return { rowSpan: getRowCount(record.sub_match_id, rowIndex) }
    },
  },
  {
    title: 'Score',
    dataIndex: 'score',
    width: 200,
  },
  {
    title: 'Odds',
    dataIndex: 'odds',
    width: 200,
    render: text => <Amount value={text} />,
  },
  {
    title: 'Open',
    dataIndex: 'sub_match_open_status',
    render: text => statusOpen(text),
    width: 75,
  },
  {
    title: 'Pause',
    dataIndex: 'sub_match_pause_status',
    render: text => statusPause(text),
    width: 75,
  },
]

const statusOpen = text => {
  if (text === 'Y') return <Text>Open</Text>
  return <Text className="text-danger">Close</Text>
}
const statusPause = text => {
  if (text === '0') return <Text className="text-success">-</Text>
  if (text === '1') return <Text className="text-danger">Home</Text>
  if (text === '2') return <Text className="text-danger">Away</Text>
  if (text === '3') return <Text className="text-danger">All</Text>
  return ''
}
const statusParlay = text => {
  if (text === '0') return <Text className="text-success">Parlay</Text>
  return '-'
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchListMenu)
