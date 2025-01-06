import React from 'react'
import { Pagination, Table, Typography } from 'antd'
import { Amount, BetGameTypeColumn } from 'components/blaise'
import BetSlip from 'components/blaise/custom/BetSlip'
import { getPlatform } from 'helper'
import './table-bet-detail.scss'

const { Text } = Typography
const TableBetDetail = ({ loading, data, total, summary, onChange }) => {
  const [pagination, setPagination] = React.useState({
    current_page: 1,
    page_size: 50,
  })
  const [orderBy, setOrderBy] = React.useState('Bet_Date')

  React.useEffect(() => {
    onChange({ ...pagination, order_by: orderBy })
  }, [pagination, orderBy, onChange])

  const [getRowSpan, getRowNumber] = React.useMemo(() => {
    const isFirstRow = (bet_id, match_id, key) => {
      const index = data.findIndex(
        x => x.bet_id === bet_id && x.match_id === match_id && x.key === key,
      )
      if (index === -1) return false
      if (index === 0) return true
      const prev = data[index - 1]
      return prev.bet_id !== bet_id
    }
    const rowCount = bet_id => data.filter(x => x.bet_id === bet_id).length

    const uniqData = data.reduce((acc, cur) => {
      const index = acc.findIndex(x => x.bet_id === cur.bet_id)
      if (index === -1) acc.push(cur)
      return acc
    }, [])

    return [
      (bet_id, match_id, key) => {
        if (!isFirstRow(bet_id, match_id, key)) return 0
        return rowCount(bet_id)
      },
      bet_id => uniqData.findIndex(x => x.bet_id === bet_id) + 1,
    ]
  }, [data])

  const getSortObject = key => ({
    key,
    sorter: true,
    sortDirections: ['descend', 'descend'],
    sortOrder: orderBy === key ? 'descend' : null,
  })
  const columns = [
    {
      title: 'No',
      align: 'center',
      width: 30,
      render: (text, record) => getRowNumber(record.bet_id),
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: 150,
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Bet ID',
      align: 'center',
      width: 120,
      render: ({ bet_id, bet_type }) => (
        <>
          {bet_id}
          <br />
          <Text className="text-danger">({getPlatform(bet_type)})</Text>
        </>
      ),
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Bet Date',
      dataIndex: 'bet_date',
      align: 'center',
      width: 150,
      ...getSortObject('Bet_Date'),
      render: text => text.formatDateTimeSecond(),
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Game Type',
      align: 'center',
      width: 60,
      render: record => <BetGameTypeColumn {...record} />,
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Match ID',
      align: 'center',
      dataIndex: 'match_id',
      width: 100,
      render: text => text !== 0 && text,
    },
    {
      title: 'Bet Slip',
      align: 'right',
      width: 200,
      render: record => <BetSlip {...record} />,
    },
    {
      title: 'Currency',
      align: 'center',
      dataIndex: 'currency',
      width: 80,
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Bet Amount RMB',
      align: 'right',
      dataIndex: 'bet_amount_rmb',
      width: 100,
      ...getSortObject('Bet_Amount_RMB'),
      render: text => <Amount value={text} />,
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Company Stock RMB',
      dataIndex: 'company_stock_rmb',
      align: 'right',
      width: 100,
      render: text => <Amount value={text} />,
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Member Winloss RMB',
      dataIndex: 'member_result_rmb',
      align: 'right',
      width: 100,
      render: text => <Amount value={text} />,
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Company Winloss RMB',
      dataIndex: 'company_result_rmb',
      align: 'right',
      width: 100,
      render: text => <Amount value={text} />,
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Margin 1',
      align: 'right',
      width: 100,
      render: record => {
        if (record.bet_amount_rmb === 0) return 0
        const margin1 = (record.member_result_rmb / record.bet_amount_rmb) * -100
        return <Amount value={margin1} />
      },
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Margin 2',
      align: 'right',
      width: 100,
      render: record => {
        if (record.company_stock_rmb === 0) return 0
        const margin2 = (record.company_result_rmb / record.company_stock_rmb) * 100
        return <Amount value={margin2} />
      },
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
  ]

  return (
    <Table
      id="table-bet-detail"
      rowKey={record => `${record.bet_id}-${record.match_id}-${record.key}`}
      bordered
      size="small"
      loading={loading}
      dataSource={data}
      columns={columns}
      pagination={false} // pagination on table footer because rowspan+pagination not working
      onChange={(p, f, sorter) => {
        setOrderBy(sorter.columnKey)
      }}
      scroll={{ x: 'max-content', y: true }}
      summary={() => {
        if (!summary) return null

        const margin1Total = (summary.member_result_rmb / summary.bet_amount_rmb) * -100
        const margin2Total = (summary.company_result_rmb / summary.company_stock_rmb) * 100
        return (
          <Table.Summary fixed="bottom">
            <Table.Summary.Row align="right" className="font-weight-bold bg-light-yellow">
              <Table.Summary.Cell colSpan={8} align="center">
                Total
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Amount value={summary.bet_amount_rmb} />
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Amount value={summary.company_stock_rmb} />
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Amount value={summary.member_result_rmb} />
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Amount value={summary.company_result_rmb} />
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Amount value={margin1Total} />
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Amount value={margin2Total} />
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )
      }}
      footer={() => (
        // seperate pagination because rowspan+pagination not working
        <Pagination
          className="justify-content-end"
          current={pagination.current_page}
          pageSize={pagination.page_size}
          showSizeChanger
          total={total}
          showTotal={() => `Total ${total} items`}
          onChange={(current_page, page_size) => {
            setPagination(prev => ({ ...prev, current_page, page_size }))
          }}
        />
      )}
    />
  )
}

export default TableBetDetail
