import React from 'react'
import { Table, Typography } from 'antd'
import { Amount } from 'components/blaise'
import TimerFormat from 'helper/timer-format'

const { Text } = Typography

const PendingSummary = ({ data, detailData }) => {
  const getNewData = () => {
    if (data?.length > 0) {
      const middleIndex = Math.ceil(data.length / 2)
      const fullTimeData = data.slice(0, middleIndex).reduce((acc, curr) => {
        const { order_id, bets_count, stake_rmb } = curr
        if (order_id % 2 !== 0) {
          acc.push({
            hdp_type: order_id !== 3 ? 'H' : 'A',
            hdp_bets_count: bets_count,
            hdp_stake_rmb: stake_rmb,
          })
        } else {
          acc[acc.length - 1] = {
            ...acc[acc.length - 1],
            ou_type: order_id % 4 !== 0 ? 'O' : 'U',
            ou_bets_count: bets_count,
            ou_stake_rmb: stake_rmb,
          }
        }
        return acc
      }, [])
      const halfTimeData = data.slice(-middleIndex).reduce((acc, curr) => {
        const { order_id, bets_count, stake_rmb } = curr
        if (order_id % 2 !== 0) {
          acc.push({
            hdp_type: order_id !== 7 ? 'H' : 'A',
            hdp_bets_count: bets_count,
            hdp_stake_rmb: stake_rmb,
          })
        } else {
          acc[acc.length - 1] = {
            ...acc[acc.length - 1],
            ou_type: order_id % 4 !== 0 ? 'O' : 'U',
            ou_bets_count: bets_count,
            ou_stake_rmb: stake_rmb,
          }
        }
        return acc
      }, [])
      return { fullTimeData, halfTimeData }
    }
    return null
  }

  const getColumns = type => {
    const columns = [
      {
        title: type === 'FT' ? 'FULLTIME' : 'HALFTIME',
        children: [
          {
            title: 'HDP',
            children: [
              {
                align: 'center',
                dataIndex: 'hdp_type',
                width: 20,
                onHeaderCell: () => ({ className: 'd-none' }),
              },
              {
                align: 'center',
                dataIndex: 'hdp_bets_count',
                width: 20,
                onHeaderCell: () => ({ className: 'd-none' }),
              },
              {
                align: 'center',
                dataIndex: 'hdp_stake_rmb',
                width: 20,
                onHeaderCell: () => ({ className: 'd-none' }),
              },
            ],
          },
          {
            title: 'OU',
            children: [
              {
                align: 'center',
                dataIndex: 'ou_type',
                width: 20,
                onHeaderCell: () => ({ className: 'd-none' }),
              },
              {
                align: 'center',
                dataIndex: 'ou_bets_count',
                width: 20,
                onHeaderCell: () => ({ className: 'd-none' }),
              },
              {
                align: 'center',
                dataIndex: 'ou_stake_rmb',
                width: 20,
                onHeaderCell: () => ({ className: 'd-none' }),
              },
            ],
          },
        ],
      },
    ]
    return columns
  }

  const newData = getNewData()

  return (
    <div>
      {/* FULL TIME */}
      <Text style={{ color: '#C69' }}>
        Last Accept : {TimerFormat(null, detailData?.last_accept_pending_tickets)}
      </Text>
      <Table
        className="w-20"
        rowKey={record => `${record.hdp_type}-${record.ou_type}`}
        bordered
        size="small"
        dataSource={newData?.fullTimeData}
        columns={getColumns('FT')}
        pagination={false}
        summary={record => <Summary record={record} />}
      />
      {/* HALF TIME */}
      <Table
        className="w-20"
        rowKey={record => `${record.hdp_type}-${record.ou_type}`}
        bordered
        size="small"
        dataSource={newData?.halfTimeData}
        columns={getColumns('HT')}
        pagination={false}
        summary={record => <Summary record={record} />}
      />
    </div>
  )
}

const Summary = ({ record }) => {
  let totalHDPBetsCount = 0
  let totalHDPStakeRMB = 0
  let totalOUBetsCount = 0
  let totalOUStakeRMB = 0

  record.forEach(
    ({ hdp_bets_count, hdp_stake_rmb, ou_bets_count, ou_stake_rmb, hdp_type, ou_type }) => {
      if (hdp_type === 'H') {
        hdp_stake_rmb *= -1
      }
      if (ou_type === 'O') {
        ou_stake_rmb *= -1
      }
      totalHDPBetsCount += hdp_bets_count
      totalHDPStakeRMB += hdp_stake_rmb
      totalOUBetsCount += ou_bets_count
      totalOUStakeRMB += ou_stake_rmb
    },
  )
  return (
    <Table.Summary.Row align="center" style={{ backgroundColor: '#ffff99' }}>
      <Table.Summary.Cell>H</Table.Summary.Cell>
      <Table.Summary.Cell>
        <Amount value={totalHDPBetsCount} noColor int />
      </Table.Summary.Cell>
      <Table.Summary.Cell>
        <Amount value={totalHDPStakeRMB} noColor int />
      </Table.Summary.Cell>
      <Table.Summary.Cell>O</Table.Summary.Cell>
      <Table.Summary.Cell>
        <Amount value={totalOUBetsCount} noColor int />
      </Table.Summary.Cell>
      <Table.Summary.Cell>
        <Amount value={totalOUStakeRMB} noColor int />
      </Table.Summary.Cell>
    </Table.Summary.Row>
  )
}

export default PendingSummary
