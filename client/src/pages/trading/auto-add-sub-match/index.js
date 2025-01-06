import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Divider, Row, Space, Spin, Table, Typography } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { groupBy } from 'lodash'
import Amount from 'components/blaise/custom/Amount'
import actions from 'redux/auto-add-sub-match/actions'
import Title from 'antd/lib/typography/Title'

const { Text } = Typography
const mapStateToProps = ({ autoAddSubMatch }) => ({
  loading: autoAddSubMatch.loading,
  max_line: autoAddSubMatch.max_line,
  ibc: autoAddSubMatch.ibc,
  glive_ibc: autoAddSubMatch.glive_ibc,
  glive_sbo: autoAddSubMatch.glive_sbo,
})
const mapDispatchToProps = (dispatch, { match }) => ({
  LoadData: payload => {
    dispatch({
      type: actions.LOAD_DATA,
      payload: {
        ...payload,
        sport_id: match.sport_id,
        league_id: match.league_id,
        match_id: match.match_id,
        home_id: match.home_id,
        away_id: match.away_id,
        match_date: match.match_date,
      },
    })
  },
  UpdateSubMatch: payload => {
    dispatch({
      type: actions.UPDATE_AUTO_ADD_SUB_MATCH,
      payload,
    })
  },
  UpdateSubMatchSyncMarket: payload => {
    dispatch({
      type: actions.UPDATE_AUTO_ADD_SUB_MATCH_SYNC_MARKET,
      payload,
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const AutoAddSubMatch = ({
  match,

  loading,
  max_line,
  ibc,
  glive_ibc,
  glive_sbo,
  LoadData,
  UpdateSubMatch,
  UpdateSubMatchSyncMarket,
  CleanUp,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  React.useEffect(() => {
    LoadData()
  }, [LoadData])

  return (
    <Spin tip="Loading..." spinning={loading} className="w-100 h-100">
      <Divider className="mt-0" orientation="left">
        <Button size="small" loading={loading} icon={<ReloadOutlined />} onClick={() => LoadData()}>
          Refresh
        </Button>
      </Divider>
      <TableAddSubMatch
        match={match}
        title="IBC"
        bookmarker_name=""
        max_line={max_line}
        {...ibc}
        UpdateSubMatch={UpdateSubMatch}
        UpdateSubMatchSyncMarket={UpdateSubMatchSyncMarket}
      />
      <TableAddSubMatch
        match={match}
        title="GLive IBC"
        bookmarker_name="IBC"
        max_line={max_line}
        {...glive_ibc}
        UpdateSubMatch={UpdateSubMatch}
        UpdateSubMatchSyncMarket={UpdateSubMatchSyncMarket}
      />
      <TableAddSubMatch
        match={match}
        title="GLive SBO"
        bookmarker_name="SBO"
        max_line={max_line}
        {...glive_sbo}
        UpdateSubMatch={UpdateSubMatch}
        UpdateSubMatchSyncMarket={UpdateSubMatchSyncMarket}
      />
    </Spin>
  )
}

const TableAddSubMatch = ({
  match,
  title,
  bookmarker_name,
  max_line,
  match_date,
  list = [],
  UpdateSubMatch,
  UpdateSubMatchSyncMarket,
}) => {
  const [selections, setSelections] = React.useState([])

  const renderCell = game_type => row => {
    const [, items] = row
    const item = items.find(x => x.game_type === game_type)
    if (!item) return null

    return (
      <Row justify="space-between">
        <Col>
          {item.game_type === 12 || item.game_type === 58 ? null : <Amount value={item.handicap} />}
        </Col>
        <Col>
          <Space direction="vertical" size={0}>
            <Amount value={item.odds_home} />
            <Amount value={item.odds_away} />
          </Space>
        </Col>
      </Row>
    )
  }
  const setOnCell = game_type => row => {
    const [display_line, items] = row
    const item = items.find(x => x.game_type === game_type)
    if (!item) return {}
    if (display_line > max_line) return {}

    return {
      className: selections.find(x => x[0] === display_line)?.[1].includes(game_type)
        ? 'bg-light-pink'
        : '',
      onClick: () => {
        const newSelections = [...selections]
        const index = newSelections.findIndex(x => x[0] === display_line)
        if (index === -1) {
          newSelections.push([display_line, [game_type]])
        } else {
          const newNames = [...newSelections[index][1]]
          const indexName = newNames.findIndex(x => x === game_type)
          if (indexName === -1) {
            newNames.push(game_type)
          } else {
            newNames.splice(indexName, 1)
          }
          newSelections[index] = [display_line, newNames]
        }
        setSelections(newSelections)
      },
    }
  }

  const columns = [
    {
      title: 'No',
      width: 30,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Time',
      dataIndex: [1, 0],
      render: row => row.match_start.formatDateTimeSecond(),
    },
    {
      title: 'Home Away',
      dataIndex: [1, 0],
      render: row => `${row.home_name} - ${row.away_name}`,
    },
    {
      title: 'ML',
      render: renderCell(12),
      onCell: setOnCell(12),
      width: 100,
    },
    {
      title: 'HDP',
      render: renderCell(0),
      onCell: setOnCell(0),
      width: 100,
    },
    {
      title: 'GAH',
      render: renderCell(50),
      onCell: setOnCell(50),
      width: 100,
    },
    {
      title: 'OU',
      render: renderCell(5),
      onCell: setOnCell(5),
      width: 100,
    },
    {
      title: 'FH.HDP',
      render: renderCell(2),
      onCell: setOnCell(2),
      width: 100,
    },
    {
      title: 'FH.OU',
      render: renderCell(6),
      onCell: setOnCell(6),
      width: 100,
    },
  ]

  const isDisabledUpdateOdds = selections.every(x => x[1].length === 0)
  const onUpdateOdds = () => {
    const selectedList = selections
      .filter(x => x[1].length !== 0)
      .reduce((arr, [display_line, items]) => {
        const temp = list.filter(
          y => y.display_line.toString() === display_line && items.includes(y.game_type),
        )
        return arr.concat(temp)
      })
    UpdateSubMatch({
      ...match,
      bookmarker_name,
      arr: selectedList,
    })
  }
  const onUpdateOddsSyncMarket = () => {
    UpdateSubMatchSyncMarket({
      ...match,
      bookmarker_name,
    })
  }

  const dataSource = groupBy(list, 'display_line')

  return (
    <>
      <Table
        size="small"
        bordered
        dataSource={Object.entries(dataSource)}
        columns={columns}
        rowKey={record => record[0]}
        pagination={false}
        onRow={record => ({
          className: record[0] > max_line ? 'bg-light-blue' : '',
        })}
        title={() => (
          <Title className="m-0" level={5}>
            {title}
          </Title>
        )}
        footer={data => {
          if (data.length === 0) return null
          return (
            <Row justify="space-between">
              <Col span={12} className="bg-light-blue">
                <Button type="ghost" className="w-100" onClick={onUpdateOddsSyncMarket}>
                  Sync Market
                </Button>
              </Col>
              <Col span={12} className="bg-light-pink">
                <Button
                  type="ghost"
                  className="w-100"
                  onClick={onUpdateOdds}
                  disabled={isDisabledUpdateOdds}
                >
                  Update Odds
                </Button>
              </Col>
            </Row>
          )
        }}
      />
      <Row justify="space-between">
        <Col>
          <Text className="text-danger">
            * If there is <i>No Records</i>, please check at speedy
          </Text>
        </Col>
        <Col>
          {['IBC', 'SBO'].includes(bookmarker_name)
            ? match_date?.replace('IBC', `${title}`)
            : match_date}
        </Col>
      </Row>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoAddSubMatch)
