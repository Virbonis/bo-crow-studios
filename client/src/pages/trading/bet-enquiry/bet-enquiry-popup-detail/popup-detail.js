import { Col, Descriptions, Space, Table, Typography } from 'antd'
import { Amount, BetSlip } from 'components/blaise'
import {
  getGameTypeDescriptionShort,
  getBetChoice,
  getOddsTypeDescByOddsType,
  getWinlossStatusName,
  getWinlossStatus,
} from 'helper'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/bet-enquiry/actions'

const { Text } = Typography

const mapStateToProps = ({ betEnquiry }) => ({
  loading: betEnquiry.loadingPopUpData,
  tableDataParlay: betEnquiry.popUpDataParlay,
  summaryParlay: betEnquiry.summaryPopUp,
  tableDataLottery: betEnquiry.popUpDataLottery,
})

const mapDispatchToProps = dispatch => ({
  LoadParlayCombo: payload => {
    dispatch({
      type: actions.LOAD_TABLE_PARLAY,
      payload,
      source: 'Bet Enquiry',
    })
  },
  LoadLottery: payload => {
    dispatch({
      type: actions.LOAD_TABLE_LOTTERY,
      payload,
      source: 'Bet Enquiry',
    })
  },
  CleanUpDetail: () => dispatch({ type: actions.CLEAN_UP_DETAIL }),
})

const BetEnquiryPopUpDetail = ({
  bet_id,
  game_type,
  hist,
  loading,
  tableDataParlay,
  summaryParlay,
  tableDataLottery,
  LoadParlayCombo,
  LoadLottery,
  CleanUpDetail,
}) => {
  React.useEffect(() => CleanUpDetail, [CleanUpDetail])

  React.useEffect(() => {
    if (game_type === -1)
      LoadParlayCombo({ bet_id, game_type, hist_or_post: hist ? '_Hist' : '_Post' })
    if (game_type === 4000)
      LoadLottery({ bet_id, game_type, hist_or_post: hist ? '_Hist' : '_Post' })
  }, [LoadParlayCombo, LoadLottery, bet_id, game_type, hist])

  const [columns, getRowClass] = React.useMemo(() => {
    const isFirstRow = record => {
      const index =
        record.status_ticket !== 2
          ? tableDataParlay.findIndex(
              x => x.bet_id === record.bet_id && x.match_id === record.match_id,
            )
          : tableDataParlay.findIndex(
              x => x.pending_bet_id === record.pending_bet_id && x.match_id === record.match_id,
            )
      if (index === -1) return false
      if (index === 0) return true
      const prev = tableDataParlay[index - 1]
      if (record.status_ticket !== 2) return prev.bet_id !== record.bet_id
      return prev.pending_bet_id !== record.pending_bet_id
    }
    const rowCount = record =>
      record.status_ticket !== 2
        ? tableDataParlay.filter(x => x.bet_id === record.bet_id).length
        : tableDataParlay.filter(x => x.pending_bet_id === record.pending_bet_id).length

    const uniqData = tableDataParlay?.reduce((acc, cur) => {
      const index =
        cur.status_ticket !== 2
          ? acc.findIndex(x => x.bet_id === cur.bet_id)
          : acc.findIndex(x => x.pending_bet_id === cur.pending_bet_id)
      if (index === -1) acc.push(cur)
      return acc
    }, [])

    const getRowSpan = record => {
      if (!isFirstRow(record)) return 0
      if (record.status_ticket !== 2) return rowCount(record)
      return rowCount(record)
    }
    const getRowNumber = record => {
      return record.status_ticket !== 2
        ? uniqData.findIndex(x => x.bet_id === record.bet_id) + 1
        : uniqData.findIndex(x => x.pending_bet_id === record.pending_bet_id) + 1
    }
    return [
      getColumns(game_type, getRowNumber, getRowSpan),
      record => (getRowNumber(record) % 2 !== 0 ? 'tr-odd' : 'tr-even'),
    ]
  }, [tableDataParlay, game_type])

  const dataSource = game_type !== 4000 ? tableDataParlay : tableDataLottery
  return (
    <>
      {game_type === 4000 && (
        <Col span={8} className="mb-2">
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Jackpot ID">
              {tableDataLottery[0]?.jackpot_id}
            </Descriptions.Item>
            <Descriptions.Item label="Lottery ID">
              {tableDataLottery[0]?.lottery_id}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      )}
      <Table
        id="table-bet-detail"
        bordered
        size="small"
        rowKey={x => `${x.bet_id}-${x.match_id}`}
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{
          y: 500,
        }}
        rowClassName={record => {
          if (record.void_id && record.void_id !== '0') return 'bg-void-ticket'
          return getRowClass(record)
        }}
        summary={() => {
          if (game_type === -1 && dataSource.length > 0)
            return (
              <Table.Summary.Row align="right">
                <Table.Summary.Cell colSpan={3} align="center">
                  Total
                </Table.Summary.Cell>
                <Table.Summary.Cell />
                <Table.Summary.Cell />
                <Table.Summary.Cell>
                  <Amount value={summaryParlay} />
                </Table.Summary.Cell>
                <Table.Summary.Cell />
              </Table.Summary.Row>
            )
          return null
        }}
      >
        {bet_id}
      </Table>
    </>
  )
}

const getColumns = (game_type, getRowNumber, getRowSpan) => {
  let columns = []
  if (game_type === -1)
    columns = [
      {
        title: 'Ticket',
        align: 'center',
        width: 30,
        render: (text, record) => getRowNumber(record),
        onCell: record => ({
          rowSpan: getRowSpan(record),
        }),
      },
      {
        title: 'Match ID',
        align: 'center',
        width: 50,
        render: record => (
          <Space direction="vertical" size={0}>
            {record.match_id !== 0 && record.match_id}
            {record.game_type === -1 &&
              getWinlossStatusName(record.parlay_match_winloss_status, record.jwl)}
          </Space>
        ),
        onCell: ({ parlay_match_void_id }) => {
          if (parlay_match_void_id && parlay_match_void_id !== '0')
            return { className: 'bg-void-ticket' }
          return {}
        },
      },
      {
        title: 'Bet Slip',
        width: 300,
        align: 'right',
        render: record => <BetSlip {...record} />,
        onCell: ({ parlay_match_void_id }) => {
          if (parlay_match_void_id && parlay_match_void_id !== '0')
            return { className: 'bg-void-ticket' }
          return {}
        },
      },
      {
        title: 'Odds',
        width: 60,
        align: 'center',
        render: record => (
          <Space direction="vertical" size={0}>
            <Amount value={record.total_odds} className="text-danger" length={3} />
            <Text>{getOddsTypeDescByOddsType(record.odds_type)}</Text>
          </Space>
        ),
        onCell: record => ({
          rowSpan: getRowSpan(record),
        }),
      },
      {
        title: 'Stake (F)',
        width: 60,
        align: 'right',
        render: record => <Amount value={record.bet_amount} />,
        onCell: record => ({
          rowSpan: getRowSpan(record),
        }),
      },
      {
        title: 'Result (F)',
        width: 60,
        align: 'right',
        render: ({ void_id, winloss_status, winloss_amount }) => {
          if ((void_id && void_id !== '0') || winloss_status === '') return '-'
          return <Amount value={winloss_amount} />
        },
        onCell: record => ({
          rowSpan: getRowSpan(record),
        }),
      },
      {
        title: 'Status',
        width: 120,
        align: 'center',
        render: record => getWinlossStatus(record),
        onCell: record => ({
          rowSpan: getRowSpan(record),
        }),
      },
    ]
  if (game_type === 4000)
    columns = [
      {
        title: 'Match ID',
        dataIndex: 'match_id',
        width: 60,
      },
      {
        title: 'League',
        dataIndex: 'league_name',
        width: 130,
      },
      {
        title: 'Home',
        dataIndex: 'home_name',
        width: 130,
      },
      {
        title: 'Away',
        dataIndex: 'away_name',
        width: 130,
      },
      {
        title: 'Game Type',
        align: 'center',
        width: 80,
        dataIndex: 'game_type',
        render: text => getGameTypeDescriptionShort(text),
      },
      {
        title: 'Handicap',
        align: 'center',
        width: 80,
        dataIndex: 'handicap',
      },
      {
        title: 'Choice',
        align: 'center',
        width: 80,
        render: record => getBetChoice(record.choice, record.home, record.away),
      },
    ]
  return columns
}

export default connect(mapStateToProps, mapDispatchToProps)(BetEnquiryPopUpDetail)
