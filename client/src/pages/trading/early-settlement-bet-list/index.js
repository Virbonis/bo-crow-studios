import React from 'react'
import { connect } from 'react-redux'
import { Button, Table } from 'antd'
import { isEmpty } from 'lodash'
import DragableModal from 'components/blaise/custom/DragableModal'
import actions from 'redux/early-settlement-bet-list/actions'
import { getEarlySettlement, getOddsTypeDescByOddsType } from 'helper'
import { Amount, BetGameTypeColumn } from 'components/blaise'
import { DownloadOutlined } from '@ant-design/icons'
import BetSlip from 'components/blaise/custom/BetSlip'

const mapStateToProps = ({ earlySettlementBetList }) => ({
  editValue: earlySettlementBetList.editValue,
  visible: !isEmpty(earlySettlementBetList.editValue),
  loading: earlySettlementBetList.loading,
  data: earlySettlementBetList.data,
})
const mapDispatchToProps = dispatch => ({
  CancelEdit: () => dispatch({ type: actions.CLEAN_UP }),
  LoadData: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
    })
  },
  Download: payload => {
    dispatch({
      type: actions.DOWNLOAD,
      payload,
    })
  },
})

const DrawerEarlySettlementBetList = React.memo(
  ({ editValue, visible, data, LoadData, CancelEdit, Download }) => {
    if (!visible) return null

    React.useEffect(() => {
      if (isEmpty(editValue)) return
      LoadData(editValue)
    }, [editValue, LoadData])

    const { match_id } = editValue
    return (
      <>
        <DragableModal
          title={`Early Settlement Bet List - ${match_id}`}
          open={visible}
          onCancel={CancelEdit}
          footer={null}
          width={1000}
        >
          <Button icon={<DownloadOutlined />} type="primary" onClick={() => Download(editValue)}>
            Download
          </Button>
          <Content editValue={editValue} data={data} />
        </DragableModal>
      </>
    )
  },
)

const Content = React.memo(({ data }) => {
  const columns = [
    {
      title: 'No',
      width: 30,
      render: (text, row, index) => index + 1,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: 'Bet ID',
      width: 100,
      render: record => {
        return (
          <>
            {record.ticket_no}
            <br />
            {getEarlySettlement(record.early_settlement_id)}
          </>
        )
      },
    },
    {
      title: 'Bet Date',
      dataIndex: 'bet_date',
      render: text => text.formatDateTimeSecond(),
    },
    {
      title: 'Game Type',
      align: 'center',
      render: record => <BetGameTypeColumn {...record} />,
      width: 80,
    },
    {
      title: 'Match ID',
      dataIndex: 'match_id',
    },
    {
      title: 'Bet Slip',
      render: row => <BetSlip {...row} />,
      align: 'right',
      width: 300,
    },
    {
      title: 'Odds',
      render: row => {
        const odds = <Amount value={Number(row.odds)} length={3} />
        const oddstype = getOddsTypeDescByOddsType(row.odds_type)
        return (
          <>
            {odds}
            <br />
            {oddstype}
          </>
        )
      },
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
    },
    {
      title: 'Stake (F)',
      dataIndex: 'bet_amount',
      render: text => <Amount value={Number(text)} />,
    },
    {
      title: 'Stake (L)',
      dataIndex: 'bet_amount_rmb',
      render: text => <Amount value={Number(text)} />,
    },
    {
      title: 'Result (F)',
      dataIndex: 'winloss_amount',
      render: text => <Amount value={Number(text)} />,
    },
    {
      title: 'Result (L)',
      dataIndex: 'winloss_amount_rmb',
      render: text => <Amount value={Number(text)} />,
    },
    {
      title: 'Status',
      dataIndex: 'wl_status',
      render: text => (text === 'W' ? 'Win' : 'Loss'),
    },
  ]

  return (
    <Table
      rowKey="ticket_no"
      dataSource={data}
      columns={columns}
      size="small"
      pagination={false}
      rowClassName={row => (row.st_settle === '-1' ? 'bg-gray-5' : '')}
      scroll={{ x: 1500, y: 500 }}
    />
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(DrawerEarlySettlementBetList)
