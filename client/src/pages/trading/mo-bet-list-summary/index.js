import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Descriptions, Drawer, Row, Select, Space, Table } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { Amount, useInterval } from 'components/blaise'
import actions from 'redux/mo-bet-list-summary/actions'
import authEnum from 'authorize'

const mapStateToProps = ({ moBetListSummary, auth }) => ({
  loading: moBetListSummary.loading,
  data: moBetListSummary.data,
  allowToReset: auth.user.user_auth_ids.includes(authEnum.ALLOWED_TO_RECALCULATE_FORECAST),
})
const mapDispatchToProps = dispatch => ({
  GetBetListSummary: payload => {
    dispatch({
      type: actions.GET_BET_LIST_SUMMARY,
      payload,
      source: 'MO Bet List Summary',
    })
  },
  ResetFTHTScore: (payload, successCallback) => {
    dispatch({
      type: actions.RESET_FTHT_SCORE,
      payload,
      successCallback,
      source: 'MO Bet List Summary',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const intervalOptions = [
  { label: 'None', value: 0 },
  { label: '5s', value: 5 },
  { label: '10s', value: 10 },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
]
const MOBetListSummary = ({ children, match_id, home_name, away_name, ...restProps }) => {
  const [visibleMOBetListSummary, setVisibleMOBetListSummary] = React.useState(false)

  return (
    <>
      <Button type="link" onClick={() => setVisibleMOBetListSummary(true)}>
        {children}
      </Button>
      <Drawer
        title="MO Bet List Summary"
        open={visibleMOBetListSummary}
        width="100%"
        onClose={() => setVisibleMOBetListSummary(false)}
        destroyOnClose
        footer={<Button onClick={() => setVisibleMOBetListSummary(false)}>Close</Button>}
      >
        <Descriptions column={1} className="font-weight-bold">
          <Descriptions.Item label="Match ID">{match_id}</Descriptions.Item>
          <Descriptions.Item label="Home - Away">{`${home_name} - ${away_name}`}</Descriptions.Item>
        </Descriptions>
        <TableBetListSummary match_id={match_id} {...restProps} />
      </Drawer>
    </>
  )
}

const TableBetListSummary = ({
  match_id,
  enableReset,

  loading,
  data,
  allowToReset,
  GetBetListSummary,
  ResetFTHTScore,
  CleanUp,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const [interval, setInterval] = React.useState(3)
  const onFetch = React.useCallback(() => {
    GetBetListSummary({ match_id })
  }, [GetBetListSummary, match_id])
  const [, reload] = useInterval(interval, onFetch)

  const columnsFT = [
    {
      title: 'Score',
      dataIndex: 'score',
      align: 'center',
      width: 120,
    },
    {
      title: 'Total Bet AH FT',
      align: 'center',
      children: [
        {
          title: 'HDP',
          align: 'center',
          width: 110,
          render: record =>
            displayScore(record, 'AH') && (
              <Amount value={record.hdp_ah} int={record.hdp_ah % 1 === 0} noColor />
            ),
          onCell: record => colorizeCell(data, record, 'FT', 'AH'),
        },
        {
          title: 'Home',
          align: 'right',
          width: 110,
          render: record => displayScore(record, 'AH') && <Amount value={record.home} int />,
          onCell: record => colorizeCell(data, record, 'FT', 'AH'),
        },
        {
          title: 'Away',
          align: 'right',
          width: 110,
          render: record => displayScore(record, 'AH') && <Amount value={record.away} int />,
          onCell: record => colorizeCell(data, record, 'FT', 'AH'),
        },
        {
          title: 'Total',
          align: 'right',
          width: 110,
          render: record => {
            let keepRed
            const brackets = record.total_ah < 0
            const total_ah = Math.abs(record.total_ah)
            if (record.hdp_ah < 0) {
              if (record.total_ah < 0) {
                keepRed = true
              }
            } else if (record.hdp_ah > 0) {
              if (record.total_ah > 0) {
                keepRed = true
              }
            }
            if (displayScore(record, 'AH')) {
              return (
                <Amount
                  value={total_ah}
                  int
                  keepMinus={false}
                  keepRed={keepRed}
                  brackets={brackets}
                />
              )
            }
            return null
          },
          onCell: record => colorizeCell(data, record, 'FT', 'AH'),
        },
      ],
    },
    {
      title: 'Total Bet OU FT',
      align: 'center',
      children: [
        {
          title: 'HDP',
          align: 'center',
          width: 110,
          render: record =>
            displayScore(record, 'OU') && (
              <Amount value={record.hdp_ou} int={record.hdp_ou % 1 === 0} noColor />
            ),
          onCell: record => colorizeCell(data, record, 'FT', 'OU'),
        },
        {
          title: 'Over',
          align: 'right',
          width: 110,
          render: record => displayScore(record, 'OU') && <Amount value={record.over} int />,
          onCell: record => colorizeCell(data, record, 'FT', 'OU'),
        },
        {
          title: 'Under',
          align: 'right',
          width: 110,
          render: record => displayScore(record, 'OU') && <Amount value={record.under} int />,
          onCell: record => colorizeCell(data, record, 'FT', 'OU'),
        },
        {
          title: 'Total',
          align: 'right',
          width: 110,
          render: record => {
            if (displayScore(record, 'OU')) {
              if (record.total_ou < 0)
                return <Amount value={record.total_ou} int keepMinus={false} brackets />
              return <Amount value={record.total_ou} int />
            }
            return null
          },
          onCell: record => colorizeCell(data, record, 'FT', 'OU'),
        },
      ],
    },
  ]
  const columnsHT = [
    {
      title: 'Score',
      dataIndex: 'score',
      align: 'center',
      width: 120,
    },
    {
      title:
        data.result_ht > 0 && data.result_ht[0].sport_id === 11
          ? 'Total Bet G.AH'
          : 'Total Bet AH HT',
      align: 'center',
      children: [
        {
          title: 'HDP',
          align: 'center',
          width: 110,
          render: record =>
            displayScore(record, 'AH') && (
              <Amount value={record.hdp_ah} int={record.hdp_ah % 1 === 0} noColor />
            ),
          onCell: record => colorizeCell(data, record, 'HT', 'AH'),
        },
        {
          title: 'Home',
          align: 'right',
          width: 110,
          render: record => displayScore(record, 'AH') && <Amount value={record.home} int />,
          onCell: record => colorizeCell(data, record, 'HT', 'AH'),
        },
        {
          title: 'Away',
          align: 'right',
          width: 110,
          render: record => displayScore(record, 'AH') && <Amount value={record.away} int />,
          onCell: record => colorizeCell(data, record, 'HT', 'AH'),
        },
        {
          title: 'Total',
          align: 'right',
          width: 110,
          render: record => {
            let keepRed
            const brackets = record.total_ah < 0
            const total_ah = Math.abs(record.total_ah)
            if (record.hdp_ah < 0) {
              if (record.total_ah < 0) {
                keepRed = true
              }
            } else if (record.hdp_ah > 0) {
              if (record.total_ah > 0) {
                keepRed = true
              }
            }
            if (displayScore(record, 'AH')) {
              return (
                <Amount
                  value={total_ah}
                  int
                  keepMinus={false}
                  keepRed={keepRed}
                  brackets={brackets}
                />
              )
            }
            return null
          },
          onCell: record => colorizeCell(data, record, 'HT', 'AH'),
        },
      ],
    },
    {
      title:
        data.result_ht > 0 && data.result_ht[0].sport_id === 11
          ? 'Total Bet G.OU'
          : 'Total Bet OU HT',
      align: 'center',
      children: [
        {
          title: 'HDP',
          align: 'center',
          width: 110,
          render: record =>
            displayScore(record, 'OU') && (
              <Amount value={record.hdp_ou} int={record.hdp_ou % 1 === 0} noColor />
            ),
          onCell: record => colorizeCell(data, record, 'HT', 'OU'),
        },
        {
          title: 'Over',
          align: 'right',
          width: 110,
          render: record => displayScore(record, 'OU') && <Amount value={record.over} int />,
          onCell: record => colorizeCell(data, record, 'HT', 'OU'),
        },
        {
          title: 'Under',
          align: 'right',
          width: 110,
          render: record => displayScore(record, 'OU') && <Amount value={record.under} int />,
          onCell: record => colorizeCell(data, record, 'HT', 'OU'),
        },
        {
          title: 'Total',
          align: 'right',
          width: 110,
          render: record => {
            if (displayScore(record, 'OU')) {
              if (record.total_ou < 0)
                return <Amount value={record.total_ou} int keepMinus={false} brackets />
              return <Amount value={record.total_ou} int />
            }
            return null
          },
          onCell: record => colorizeCell(data, record, 'HT', 'OU'),
        },
      ],
    },
  ]

  return (
    <div style={{ height: '100vh' }}>
      <Space className="w-100" direction="vertical">
        <Space>
          <Button loading={loading} icon={<ReloadOutlined />} onClick={reload}>
            Refresh
          </Button>
          <Select
            style={{ width: 75 }}
            options={intervalOptions}
            value={interval}
            onChange={values => setInterval(values)}
          />
        </Space>
        <Table
          rowKey={record => {
            return `${record.score}-${record.hdp_ah}-${record.hdp_ou}`
          }}
          dataSource={data.result_ft}
          columns={columnsFT}
          bordered
          pagination={false}
          summary={record => renderSummary(record)}
        />
        <Table
          rowKey={record => {
            return `${record.score}-${record.hdp_ah}-${record.hdp_ou}`
          }}
          dataSource={data.result_ht}
          columns={columnsHT}
          bordered
          pagination={false}
          summary={record => renderSummary(record)}
        />
        <Row justify="space-between">
          <Col>
            HDP: <span className="text-danger">Minus (-)</span> it&apos;s mean{' '}
            <span className="text-danger">Home Favorite</span> (Home give ball)
            <br />
            HDP: <span className="text-danger">Plus (+)</span> it&apos;s mean{' '}
            <span className="text-danger">Away Favorite</span> (Away give ball)
            <br />
            Total Bet HDP, OU column: It&apos;s <strong>Black colour</strong> when have stock on{' '}
            <span className="text-danger">Favorite, Over</span>
            <br />
            Total Bet HDP, OU column: It&apos;s <span className="text-danger">Red colour </span>
            when have stock on <span className="text-danger">Underdog, Under</span>
          </Col>
          {enableReset && allowToReset && (
            <Col>
              <Space direction="vertical">
                <Button
                  type="primary"
                  onClick={() => ResetFTHTScore({ match_id, process_type: 2 }, reload)}
                >
                  Reset FT Forecast
                </Button>
                <Button
                  type="primary"
                  onClick={() => ResetFTHTScore({ match_id, process_type: 1 }, reload)}
                >
                  Reset HT Forecast
                </Button>
              </Space>
            </Col>
          )}
        </Row>
      </Space>
    </div>
  )
}

const displayScore = (record, typeScore) => {
  const { hdp_ah, home, away, total_ah, hdp_ou, over, under, total_ou } = record
  if (typeScore === 'AH') {
    if (hdp_ah === 0 && home === 0 && away === 0 && Math.abs(total_ah) === 0) return false
  }
  if (typeScore === 'OU') {
    if (hdp_ou === 0 && over === 0 && under === 0 && Math.abs(total_ou) === 0) return false
  }
  return true
}
const colorizeCell = (data, record, typeTable, typeScore) => {
  const { hdp_ah, hdp_ou, score } = record
  if (typeTable === 'FT' && typeScore === 'AH') {
    const matrix = data.result_matrix.filter(e => e.game_type === 0)
    const isExist = matrix.some(e => e.score === score && e.handicap === hdp_ah)
    return { style: { backgroundColor: isExist && '#90EE90' } }
  }
  if (typeTable === 'FT' && typeScore === 'OU') {
    const matrix = data.result_matrix.filter(e => e.game_type === 5)
    const isExist = matrix.some(e => e.score === score && e.handicap === hdp_ou)
    return { style: { backgroundColor: isExist && '#90EE90' } }
  }
  if (typeTable === 'HT' && typeScore === 'AH') {
    const matrix = data.result_matrix.filter(e => e.game_type === 2)
    const isExist = matrix.some(e => e.score === score && e.handicap === hdp_ah)
    return { style: { backgroundColor: isExist && '#90EE90' } }
  }
  if (typeTable === 'HT' && typeScore === 'OU') {
    const matrix = data.result_matrix.filter(e => e.game_type === 6)
    const isExist = matrix.some(e => e.score === score && e.handicap === hdp_ou)
    return { style: { backgroundColor: isExist && '#90EE90' } }
  }
  return null
}
const renderSummary = record => {
  let totalHome = 0
  let totalAway = 0
  let totalHDPAH = 0
  let totalOver = 0
  let totalUnder = 0
  let totalHDPOU = 0

  record.forEach(({ home, away, total_ah, over, under, total_ou }) => {
    totalHome += home
    totalAway += away
    totalHDPAH += total_ah
    totalOver += over
    totalUnder += under
    totalHDPOU += total_ou
  })
  return (
    <Table.Summary.Row align="right">
      <Table.Summary.Cell align="center">Total</Table.Summary.Cell>
      <Table.Summary.Cell />
      <Table.Summary.Cell>
        <Amount value={totalHome} noColor bold int />
      </Table.Summary.Cell>
      <Table.Summary.Cell>
        <Amount value={totalAway} noColor bold int />
      </Table.Summary.Cell>
      <Table.Summary.Cell>
        <Amount value={totalHDPAH} noColor bold int brackets={totalHDPAH < 0} keepMinus={false} />
      </Table.Summary.Cell>
      <Table.Summary.Cell />
      <Table.Summary.Cell>
        <Amount value={totalOver} noColor bold int />
      </Table.Summary.Cell>
      <Table.Summary.Cell>
        <Amount value={totalUnder} noColor bold int />
      </Table.Summary.Cell>
      <Table.Summary.Cell>
        <Amount value={totalHDPOU} noColor bold int brackets={totalHDPOU < 0} keepMinus={false} />
      </Table.Summary.Cell>
    </Table.Summary.Row>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MOBetListSummary)
