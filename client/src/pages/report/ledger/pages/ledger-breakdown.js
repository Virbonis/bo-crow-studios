import React from 'react'
import { Button, Flex, Table } from 'antd'
import { Amount } from 'components/blaise'
import { connect } from 'react-redux'
import actions from 'redux/ledger/actions'
import { DownloadFromTable } from 'utils'
import { getCustomerTypeDescription } from './desc'

const mapStateToProps = ({ ledger }, { hist }) => ({
  loading: hist ? ledger.loading_data_Hist : ledger.loading_data_Post,
  data_ledger: hist
    ? ledger.data_ledger_Hist.map((e, index) => ({ ...e, key: index + 1 }))
    : ledger.data_ledger_Post.map((e, index) => ({ ...e, key: index + 1 })),
})

const mapDispatchToProps = (dispatch, { hist }) => ({
  LoadBreakdown: payload => {
    dispatch({
      type: actions.LOAD_LEDGER_BREAKDOWN,
      payload,
      source: 'Ledger',
    })
  },
  CleanUp: () => dispatch({ type: hist ? actions.CLEAN_UP_HIST : actions.CLEAN_UP_POST }),
})

const LedgerGametype = ({
  submitValue,
  detailHandler,

  loading,
  data_ledger,
  LoadBreakdown,
  CleanUp,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  React.useEffect(() => {
    LoadBreakdown(submitValue)
  }, [submitValue, LoadBreakdown])

  const { report_type } = submitValue

  const columnsNonMember = [
    {
      title: 'No',
      dataIndex: 'key',
      align: 'center',
      width: 30,
      onCell: record => {
        if (record.desc === 'Grand Total') return { colSpan: 0 }
        return { colSpan: 1, width: 50 }
      },
    },
    {
      title: report_type === 'Branch' ? '' : report_type,
      dataIndex: 'desc',
      width: 450,
      onCell: record => {
        if (record.desc === 'Grand Total') return { colSpan: 2 }
        return { colSpan: 1 }
      },
    },
    {
      title: 'Bets Count',
      dataIndex: 'bets_count',
      align: 'center',
      width: 100,
    },
    {
      title: 'Bet Amount',
      dataIndex: 'bet_amount_rmb',
      align: 'right',
      width: 100,
      render: (data, record) => {
        if (record.desc === 'Grand Total') return <Amount value={data} />
        return (
          <Button type="link" className="p-0" onClick={() => detailHandler(record, report_type)}>
            <Amount value={data} />
          </Button>
        )
      },
    },
    {
      title: 'Company Stock',
      dataIndex: 'company_stock_rmb',
      align: 'right',
      width: 100,
      render: data => <Amount value={data} />,
    },
    {
      title: 'Member',
      dataIndex: 'member',
      align: 'right',
      width: 100,
      render: data => <Amount value={data} />,
    },
    {
      title: 'Agent Result',
      dataIndex: 'agent_result',
      align: 'right',
      width: 100,
      render: data => <Amount value={data} />,
    },
    {
      title: 'MA Result',
      dataIndex: 'ma_result',
      align: 'right',
      width: 100,
      render: data => <Amount value={data} />,
    },
    {
      title: 'SMA Result',
      dataIndex: 'sma_result',
      align: 'right',
      width: 100,
      render: data => <Amount value={data} />,
    },
    {
      title: 'SSMA Result',
      dataIndex: 'ssma_result',
      align: 'right',
      width: 100,
      render: data => <Amount value={data} />,
    },
    {
      title: 'Company Result',
      dataIndex: 'company_result',
      align: 'right',
      width: 100,
      render: data => <Amount value={data} />,
    },
  ]
  return (
    <Flex vertical className="h-100">
      <TableLedgerBreakdown
        loading={loading}
        rowKey="key"
        pagination={false}
        bordered
        dataSource={data_ledger}
        columns={columnsNonMember}
        summary={summaryNonMember}
        currentReportType={report_type}
        currentCustomerType={submitValue.customer_type}
      />
    </Flex>
  )
}

const TableLedgerBreakdown = ({
  dataSource,

  currentReportType,
  currentCustomerType,
  ...restProps
}) => {
  const exportHandler = tableID => ExportData(tableID)

  if (currentCustomerType === '' || currentCustomerType === 'H') {
    const dataCash = dataSource.filter(e => e.status7 === '1')
    const dataMCard = dataSource.filter(e => e.status7 === '2')
    const dataBuyback = dataSource.filter(e => e.status7 === '9')
    const dataBuyback2 = dataSource.filter(e => e.status7 === '96')
    let splitTable = []
    let data = []

    // all = '', split to credit-kiosk, cash-mcard-buyback
    if (currentCustomerType === '') {
      // skip credit-kiosk
      // only cash-mcard-buyback
      splitTable = [
        { data: dataCash, title: 'Cash' },
        { data: dataMCard, title: 'M-Card' },
        { data: dataBuyback, title: 'Buyback' },
        { data: dataBuyback2, title: 'Buyback II' },
      ]
      data = dataSource.filter(e => ['1', '2', '9', '96'].includes(e.status7))
    } else if (currentCustomerType === 'H') {
      splitTable = [
        { data: dataCash, title: 'Cash' },
        { data: dataMCard, title: 'M-Card' },
        { data: dataBuyback, title: 'Buyback' },
      ]
      data = dataSource.filter(e => ['1', '2', '9'].includes(e.status7))
    }

    const dataGrandTotal = [
      {
        desc: 'Grand Total',
        bets_count: countTotal('bets_count', data),
        bet_amount_rmb: countTotal('bet_amount_rmb', data),
        company_stock_rmb: countTotal('company_stock_rmb', data),
        member: countTotal('member', data),
        agent_result: countTotal('agent_result', data),
        ma_result: countTotal('ma_result', data),
        sma_result: countTotal('sma_result', data),
        ssma_result: countTotal('ssma_result', data),
        company_result: countTotal('company_result', data),
      },
    ]
    return (
      <>
        {splitTable.map(table => (
          <Table
            key={table.title}
            id={table.title}
            {...restProps}
            dataSource={table.data}
            title={() => (
              <>
                <Button className="mr-1" type="primary" onClick={() => exportHandler(table.title)}>
                  Export
                </Button>
                {table.title}
              </>
            )}
            style={{ overflow: 'unset' }}
          />
        ))}
        {/* ↓tablegrandtotal  */}
        <Table
          rowKey="desc"
          showHeader={false}
          pagination={false}
          columns={restProps.columns}
          dataSource={dataGrandTotal}
          style={{ overflow: 'unset' }}
        />
      </>
    )
  }

  // combine / credit-kiosk / cash / mcard / buyback
  return (
    <Table
      id="table-ledger"
      {...restProps}
      dataSource={dataSource}
      title={() => (
        <>
          <Button className="mr-1" type="primary" onClick={() => exportHandler('table-ledger')}>
            Export
          </Button>
          {getCustomerTypeDescription(currentCustomerType)}
        </>
      )}
    />
  )
}

const countTotal = (column, data) => {
  return data?.reduce((acc, next) => {
    acc += next[column] || 0
    return acc
  }, 0)
}
const summaryNonMember = data => {
  const total = {
    bets_count: countTotal('bets_count', data),
    bet_amount: countTotal('bet_amount_rmb', data),
    company_stock: countTotal('company_stock_rmb', data),
    member: countTotal('member', data),
    agent_result: countTotal('agent_result', data),
    ma_result: countTotal('ma_result', data),
    sma_result: countTotal('sma_result', data),
    ssma_result: countTotal('ssma_result', data),
    company_result: countTotal('company_result', data),
  }
  return (
    <Table.Summary fixed="bottom">
      <Table.Summary.Row align="right" className="font-weight-bold bg-light-yellow">
        <Table.Summary.Cell align="center" colSpan={2}>
          Total
        </Table.Summary.Cell>
        <Table.Summary.Cell align="center">
          <Amount value={total.bets_count} int />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.bet_amount} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.company_stock} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.member} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.agent_result} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.ma_result} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.sma_result} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.ssma_result} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.company_result} />
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  )
}

const ExportData = tableID => DownloadFromTable(tableID, 'Ledger')

export default connect(mapStateToProps, mapDispatchToProps)(LedgerGametype)
