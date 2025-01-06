import { Button, Drawer, Pagination, Table } from 'antd'
import { Amount, BetGameTypeColumn, BetSlip } from 'components/blaise'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/ledger/actions'
import { isEmpty } from 'lodash'
import 'pages/report/shared-components/table-bet-detail.scss'

const mapStateToProps = ({ ledger }, { hist }) => ({
  loading: hist ? ledger.loading_data_Hist : ledger.loading_data_Post,
  data: hist ? ledger.data_ledger_detail_Hist : ledger.data_ledger_detail_Post,
  total: hist ? ledger.total_ledger_detail_Hist : ledger.total_ledger_detail_Post,
  summary: hist ? ledger.data_ledger_summary_Hist : ledger.data_ledger_summary_Post,
})

const mapDispatchToProps = dispatch => ({
  LoadDetail: payload => {
    dispatch({
      type: actions.LOAD_LEDGER_DETAIL,
      payload,
      source: 'Ledger',
    })
  },
  ExportDetail: payload => {
    dispatch({
      type: actions.EXPORT_DETAIL,
      payload,
      source: 'Ledger',
    })
  },
  CleanUpDetail: () => dispatch({ type: actions.CLEAN_UP_DETAIL }),
})

const LedgerBetDetail = ({
  detailValue,
  setDetailValue,
  loading,
  data,
  total,
  summary,
  LoadDetail,
  ExportDetail,
  CleanUpDetail,
}) => {
  useEffect(() => {
    if (isEmpty(detailValue)) CleanUpDetail()
  }, [detailValue, CleanUpDetail])

  const [pagination, setPagination] = useState({
    current_page: 1,
    page_size: 50,
  })
  const [orderBy, setOrderBy] = useState('Bet_Date')
  useEffect(() => {
    if (detailValue)
      LoadDetail({
        ...detailValue,
        ...pagination,
        order_by: orderBy,
        // bet_adj: '',
        // status7: '',
      })
  }, [LoadDetail, detailValue, pagination, orderBy])

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
  const column = [
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
      title: 'User Name',
      dataIndex: 'username',
      align: 'center',
      width: 120,
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Bet ID',
      dataIndex: 'bet_id',
      align: 'center',
      width: 100,
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Bet Date',
      dataIndex: 'bet_date',
      align: 'center',
      width: 120,
      render: text => text.formatDateTimeSecond(),
      ...getSortObject('Bet_Date'),
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Game Type',
      align: 'center',
      width: 120,
      render: record => <BetGameTypeColumn {...record} />,
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Match ID',
      dataIndex: 'match_id',
      align: 'center',
      width: 80,
    },
    {
      title: 'Bet Slip',
      align: 'right',
      width: 200,
      render: record => <BetSlip {...record} />,
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      align: 'center',
      width: 80,
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Stake (F)',
      dataIndex: 'bet_amount',
      align: 'right',
      width: 100,
      render: (text, row) => {
        const showed = row.game_type === -1 && row.ticket > 1
        return (
          <>
            <Amount value={text} />
            <br />
            {showed && (
              <b>
                @<Amount value={row.bet_amount / row.ticket} />
              </b>
            )}
          </>
        )
      },
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Stake (L)',
      dataIndex: 'bet_amount_rmb',
      align: 'right',
      width: 100,
      ...getSortObject('Bet_Amount_RMB'),
      render: text => {
        return <Amount value={text} />
      },
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Result (F)',
      dataIndex: 'winloss_amount',
      align: 'right',
      width: 100,
      render: text => {
        return <Amount value={text} />
      },
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Result (L)',
      align: 'right',
      dataIndex: 'winloss_amount_rmb',
      width: 100,
      render: text => {
        return <Amount value={text} />
      },
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'Company Stock',
      dataIndex: 'company_stock_rmb',
      align: 'right',
      width: 100,
      render: text => {
        return <Amount value={text} />
      },
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      align: 'center',
      width: 100,
      onCell: ({ bet_id, match_id, key }) => ({
        rowSpan: getRowSpan(bet_id, match_id, key),
      }),
    },
  ]

  const exportHandler = () =>
    ExportDetail({
      ...detailValue,
      current_page: 1,
      page_size: 1000000,
      order_by: orderBy,
    })

  return (
    <Drawer
      title="Bet Detail"
      width="100%"
      open={!isEmpty(detailValue)}
      onClose={() => {
        setDetailValue()
        setPagination(prev => ({ ...prev, current_page: 1, page_size: 50 }))
      }}
      footer={
        <Button type="primary" onClick={exportHandler}>
          Export
        </Button>
      }
    >
      <Table
        id="table-bet-detail"
        rowKey={record => `${record.bet_id}-${record.match_id}-${record.key}`}
        bordered
        size="small"
        loading={loading}
        columns={column}
        dataSource={data}
        pagination={false} // pagination on table footer because rowspan+pagination not working
        onChange={(p, f, sorter) => {
          setOrderBy(sorter.columnKey)
        }}
        summary={() => {
          if (!summary) return null

          return (
            <Table.Summary fixed="bottom">
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={8} align="center">
                  Total
                </Table.Summary.Cell>
                {Object.keys(summary)?.map(e => (
                  <Table.Summary.Cell key={e} index={e} align="right">
                    <b>
                      <Amount value={summary[e]} />
                    </b>
                  </Table.Summary.Cell>
                ))}
                <Table.Summary.Cell />
              </Table.Summary.Row>
            </Table.Summary>
          )
        }}
        footer={() => (
          // seperate pagination because rowspan+pagination not working
          <Pagination
            justify="end"
            size="small"
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
    </Drawer>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(LedgerBetDetail)
