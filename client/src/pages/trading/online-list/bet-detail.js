import { Space, Table } from 'antd'
import { Amount, BetGameTypeColumn, BetSlip } from 'components/blaise'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/online-list/actions'

const mapStateToProps = ({ onlineList }) => ({
  dataTable: onlineList.dataBetDetail,
  loading: onlineList.loading_bet_detail,
})

const mapDispatchToProps = dispatch => ({
  LoadBetDetail: payload => {
    dispatch({
      type: actions.LOAD_BET_DETAIL,
      payload,
      source: 'Online Bet List',
    })
  },
})

const getReason = void_id => {
  switch (void_id) {
    case '90':
      return <span className="text-red"> (Danger - Red Card)</span>
    case '91':
      return <span className="text-red"> (Danger - Goal)</span>
    case '80':
    case '82':
      return <span className="text-red">(Match Canceled)</span>
    default:
      return <span className="text-red">(Bet Canceled)</span>
  }
}

const BetDetail = ({ dataBetDetail, dataTable, loading, LoadBetDetail }) => {
  React.useEffect(() => {
    LoadBetDetail(dataBetDetail)
  }, [dataBetDetail, LoadBetDetail])

  const columns = [
    {
      title: 'No',
      align: 'center',
      width: 30,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: 100,
    },
    {
      title: 'Bet ID',
      dataIndex: 'bet_id',
      align: 'center',
      width: 100,
    },
    {
      title: 'Bet Date',
      dataIndex: 'bet_date',
      align: 'center',
      width: 100,
    },
    {
      title: 'Game Type',
      align: 'center',
      width: 80,
      render: record => <BetGameTypeColumn {...record} />,
    },
    {
      title: 'Bet Slip',
      align: 'right',
      width: 200,
      render: (text, record) => {
        let reason = ''
        if (record.void_id && record.void_id !== '0') reason = getReason(record.void_id)
        return (
          <Space direction="vertical" size={0}>
            <BetSlip {...record} />
            {reason}
          </Space>
        )
      },
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      align: 'center',
      width: 80,
    },
    {
      title: 'Stake (F/L)',
      dataIndex: 'bet_amount',
      align: 'right',
      width: 100,
      render: (text, record) => {
        return (
          <>
            <Amount value={text} />
            <br />
            <Amount className="text-blue" value={record.bet_amount_rmb} length={2} />
          </>
        )
      },
    },
    {
      title: 'Result (F/L)',
      dataIndex: 'win_loss_amount',
      align: 'right',
      width: 100,
      render: (
        text,
        { void_id, void_desc, void_user, win_loss_status, win_loss_amount, win_loss_amount_rmb },
      ) => {
        if (void_id && void_id !== '0')
          return (
            <>
              <span className="text-red">{void_desc}</span>
              by {void_user}
            </>
          )
        if (win_loss_status === '') {
          return (
            <>
              <div> - </div>
              <div className="text-blue"> - </div>
            </>
          )
        }
        return (
          <>
            <div>{win_loss_amount}</div>
            <div className="text-blue">{win_loss_amount_rmb}</div>
          </>
        )
      },
    },
    {
      title: 'Company Stock',
      dataIndex: 'bet_amount_comp',
      align: 'right',
      width: 100,
      render: (text, record) => {
        if (record.void_id && record.void_id !== '0') return 0
        return <Amount value={text} />
      },
    },
    {
      title: 'IP',
      align: 'center',
      dataIndex: 'ip',
      width: 100,
    },
  ]

  return (
    <>
      <Table
        bordered
        rowKey={record => `${record.bet_id}-${record.match_id}`}
        columns={columns}
        dataSource={dataTable}
        pagination={false}
        loading={loading}
        rowClassName={record => {
          if (record.void_id && record.void_id !== '0') return 'bg-void-ticket'
          return 'bg-void-ticket'
        }}
        onRow={({ void_id }) => ({
          className: void_id && void_id !== '0' ? 'bg-lightgray' : '',
        })}
        summary={() => {
          const dataSummary = {
            stake: countTotal('bet_amount_rmb', dataTable),
            result: countTotal('win_loss_amount_rmb', dataTable),
            company_stock: countTotal('bet_amount_comp', dataTable),
          }
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={7} align="center">
                Total
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right">
                <Amount className="text-blue" value={dataSummary.stake} />
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right">
                <Amount className="text-blue" value={dataSummary.result} />
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right">
                <Amount className="text-blue" value={dataSummary.company_stock} />
              </Table.Summary.Cell>
              <Table.Summary.Cell />
            </Table.Summary.Row>
          )
        }}
      />
    </>
  )
}

const countTotal = (params, data) => {
  const uniqData = data.reduce((acc, cur) => {
    const index = acc.findIndex(x => x.bet_id === cur.bet_id)
    if (index === -1) acc.push(cur)
    return acc
  }, [])

  return uniqData.reduce((acc, curr) => {
    if (curr.void_id || curr.bet_id === 0) return acc
    if (params === 'win_loss_amount_rmb' && curr.win_loss_status === '') acc += 0
    else acc += curr[params]
    return acc
  }, 0)
}

export default connect(mapStateToProps, mapDispatchToProps)(BetDetail)
