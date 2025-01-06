import React from 'react'
import { Breadcrumb, Button, Flex, Table } from 'antd'
import { PartitionOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from 'redux/ledger/actions'
import { Amount } from 'components/blaise'
import { DownloadFromTable } from 'utils'
import { getCustomerTypeDescription, getDrillCustomerType } from './desc'

const mapStateToProps = ({ ledger }, { hist }) => ({
  loading: hist ? ledger.loading_data_Hist : ledger.loading_data_Post,
  data_ledger: hist
    ? ledger.data_ledger_Hist.map((e, index) => ({ ...e, key: index + 1 }))
    : ledger.data_ledger_Post.map((e, index) => ({ ...e, key: index + 1 })),
})

const mapDispatchToProps = (dispatch, { hist }) => ({
  LoadAverage: (payload, failedCallback) => {
    dispatch({
      type: actions.LOAD_LEDGER_AVG,
      payload,
      source: 'Ledger Average',
      failedCallback,
    })
  },
  CleanUp: () => dispatch({ type: hist ? actions.CLEAN_UP_HIST : actions.CLEAN_UP_POST }),
})

const reportTypeDescription = 'SMA Name (SSMA Name)|Shareholder Name|Member Name'.split('|')
const LedgerAverage = ({
  submitValue,
  detailHandler,

  loading,
  data_ledger,

  LoadAverage,
  CleanUp,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const firstRender = React.useRef(true)
  const [prevMode, setPrevMode] = React.useState([])

  const currentReportType =
    prevMode[prevMode.length - 1]?.payload.report_type || submitValue.report_type
  const currentCustomerType =
    prevMode[prevMode.length - 1]?.payload.customer_type || submitValue.customer_type
  const currentReportTypeDescription = reportTypeDescription[prevMode.length]
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
      title: currentReportTypeDescription,
      dataIndex: 'desc',
      width: 450,
      render: (text, record) => {
        if (text === 'Grand Total') return text
        if (record.drill_id === 'CMM') return text
        return (
          <Button
            icon={<PartitionOutlined />}
            type="link"
            className="p-0"
            onClick={() => tableHandler(record)}
          >
            {text}
          </Button>
        )
      },
      onCell: record => {
        if (record.desc === 'Grand Total') return { colSpan: 2 }
        return { colSpan: 1 }
      },
    },
    {
      title: 'Bets Count',
      align: 'center',
      dataIndex: 'bets_count',
      width: 100,
      render: (data, row) => {
        if (row.drill_id === 'CMM') return null
        return data
      },
    },
    {
      title: 'Bet Amount',
      align: 'right',
      dataIndex: 'bet_amount_rmb',
      width: 100,
      render: (data, record) => {
        if (record.drill_id === 'CMM') return null
        return <Amount value={data} />
      },
    },
    {
      title: 'Average Bet Amount',
      align: 'right',
      dataIndex: 'avg_bet_amount_rmb',
      width: 100,
      render: text => <Amount value={text} />,
    },
    {
      title: 'Company Stock',
      align: 'right',
      dataIndex: 'company_stock_rmb',
      width: 100,
      render: text => <Amount value={text} />,
    },
    {
      title: 'Average Company Stock',
      align: 'right',
      dataIndex: 'avg_company_stock_rmb',
      width: 100,
      render: text => <Amount value={text} />,
    },
    {
      title: 'MA Result',
      align: 'right',
      dataIndex: 'ma_result',
      width: 100,
      render: text => <Amount value={text} />,
    },
    {
      title: 'SMA Result',
      align: 'right',
      dataIndex: 'sma_result',
      width: 100,
      render: text => <Amount value={text} />,
    },
    {
      title: 'Company Result',
      align: 'right',
      dataIndex: 'company_result',
      width: 100,
      render: text => <Amount value={text} />,
    },
    {
      title: 'Company Incentive',
      align: 'right',
      dataIndex: 'company_incentive',
      width: 100,
      render: text => <Amount value={text} />,
    },
  ]
  const columnsMember = [
    {
      title: 'No',
      dataIndex: 'key',
      align: 'center',
      width: 30,
    },
    {
      title: 'Member Name',
      dataIndex: 'desc',
      width: 450,
    },
    {
      title: 'Bets Count',
      align: 'center',
      dataIndex: 'bets_count',
      width: 100,
    },
    {
      title: 'Bet Amount',
      align: 'right',
      dataIndex: 'bet_amount_rmb',
      width: 100,
      render: (data, record) => {
        return (
          <Button className="p-0" type="link" onClick={() => detailHandler(record)}>
            <Amount value={data} />
          </Button>
        )
      },
    },
    {
      title: 'Average Bet Anmount',
      dataIndex: 'avg_bet_amount_rmb',
      align: 'right',
      width: 100,
      render: text => <Amount value={text} />,
    },
    {
      title: 'Company Stock',
      dataIndex: 'company_stock_rmb',
      align: 'right',
      width: 100,
      render: text => <Amount value={text} />,
    },
    {
      title: 'Member (F)',
      dataIndex: 'member_f',
      align: 'right',
      width: 100,
      render: text => <Amount value={text} />,
    },
    {
      title: 'Member (L)',
      dataIndex: 'member_l',
      align: 'right',
      width: 100,
      render: text => <Amount value={text} />,
    },
    {
      title: 'Result',
      dataIndex: 'member',
      align: 'right',
      width: 100,
      render: text => <Amount value={text} />,
    },
    {
      title: '%',
      dataIndex: 'agent_result_perc',
      align: 'right',
      width: 100,
    },
    {
      title: 'Agent Result',
      dataIndex: 'agent_result',
      align: 'right',
      width: 100,
      render: text => <Amount value={text} />,
    },
  ]

  const tableHandler = ({ status7, drill_id, desc }) => {
    const additionalValue = {}
    additionalValue.customer_type = getDrillCustomerType(status7)

    if (currentCustomerType === 'COMBI') {
      additionalValue.report_type = 'AvgShareholderCash'
    } else {
      additionalValue.report_type = 'Member'
      additionalValue.shareholder_id = drill_id
      // skip other level, direct show member level
    }

    setPrevMode(prev =>
      prev.concat({
        key: drill_id,
        label: desc,
        payload: additionalValue,
      }),
    )
  }
  const breadCrumbHandler = selectedMenu => {
    const getIndexMenu = prevMode.findIndex(data => data.key === selectedMenu)
    const backMode = prevMode.filter((data, index) => index < getIndexMenu)

    setPrevMode(backMode)
  }

  React.useEffect(() => {
    setPrevMode([]) // side effect to reload
  }, [submitValue])
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return // return on first render
    }
    const prevPayload = prevMode.reduce((acc, cur) => ({ ...acc, ...cur.payload }), {})
    const payload = {
      ...submitValue,
      ...prevPayload,
    }
    LoadAverage(payload, () => setPrevMode(prev => prev.slice(0, prev.length - 1)))
  }, [prevMode, LoadAverage]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex vertical className="h-100">
      <Breadcrumb separator=">>">
        {prevMode.map(data => (
          <Breadcrumb.Item key={data.key}>
            <Button type="link" onClick={() => breadCrumbHandler(data.key)}>
              {data.label}
            </Button>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
      <TableLedgerAverage
        loading={loading}
        rowKey="key"
        pagination={false}
        bordered
        dataSource={data_ledger}
        columns={currentReportType !== 'Member' ? columnsNonMember : columnsMember}
        summary={currentReportType !== 'Member' ? summaryNonMember : summaryMember}
        currentReportType={currentReportType}
        currentCustomerType={currentCustomerType}
      />
    </Flex>
  )
}

const TableLedgerAverage = ({
  dataSource,

  currentReportType,
  currentCustomerType,
  ...restProps
}) => {
  const exportHandler = tableID => ExportData(tableID)

  if (currentCustomerType === '') {
    // skip credit-kiosk
    // only cash, mcard, buyback, buyback 2
    const dataCash = dataSource.filter(e => ['1', '199'].includes(e.status7))
    const dataMCard = dataSource.filter(e => ['2', '299'].includes(e.status7))
    const dataBuyback = dataSource.filter(e => e.status7 === '9')
    const dataBuyback2 = dataSource.filter(e => e.status7 === '96')

    const splitTable = [
      { data: dataCash, title: 'Cash' },
      { data: dataMCard, title: 'MCard' },
      { data: dataBuyback, title: 'Buyback' },
      { data: dataBuyback2, title: 'Buyback II' },
    ]

    const dataGrandTotal = [
      {
        desc: 'Grand Total',
        bets_count: countTotal('bets_count', dataSource),
        bet_amount_rmb: countTotal('bet_amount_rmb', dataSource),
        company_stock_rmb: countTotal('company_stock_rmb', dataSource),
        member: countTotal('member', dataSource),
        agent_result: countTotal('agent_result', dataSource),
        ma_result: countTotal('ma_result', dataSource),
        sma_result: countTotal('sma_result', dataSource),
        ssma_result: countTotal('ssma_result', dataSource),
        company_result: countTotal('company_result', dataSource),
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
  return data.reduce((acc, next) => {
    acc += next[column] || 0
    return acc
  }, 0)
}
const summaryNonMember = data => {
  const total = {
    bets_count: countTotal('bets_count', data),
    bet_amount: countTotal('bet_amount_rmb', data),
    avg_bet_amount_rmb: countTotal('avg_bet_amount_rmb', data),
    company_stock: countTotal('company_stock_rmb', data),
    avg_company_stock_rmb: countTotal('avg_company_stock_rmb', data),
    ma_result: countTotal('ma_result', data),
    sma_result: countTotal('sma_result', data),
    company_result: countTotal('company_result', data),
    company_incentive: countTotal('company_incentive', data),
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
          <Amount value={total.avg_bet_amount_rmb} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.company_stock} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.avg_company_stock_rmb} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.ma_result} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.sma_result} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.company_result} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.company_incentive} />
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  )
}
const summaryMember = data => {
  const total = {
    bets_count: countTotal('bets_count', data),
    bet_amount: countTotal('bet_amount_rmb', data),
    avg_bet_amount_rmb: countTotal('avg_bet_amount_rmb', data),
    company_stock: countTotal('company_stock_rmb', data),
    avg_company_stock_rmb: countTotal('avg_company_stock_rmb', data),
    member_f: countTotal('member_f', data),
    member_l: countTotal('member_l', data),
    member: countTotal('member', data),
    percentage: '',
    agent_result: countTotal('agent_result', data),
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
          <Amount value={total.member_f} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.member_l} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.member} />
        </Table.Summary.Cell>
        <Table.Summary.Cell align="right">
          <Amount value={total.percentage} />
        </Table.Summary.Cell>
        <Table.Summary.Cell />
        <Table.Summary.Cell align="right">
          <Amount value={total.agent_result} />
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  )
}

// export by clientside data
const ExportData = tableID => DownloadFromTable(tableID, 'Ledger')

export default connect(mapStateToProps, mapDispatchToProps)(LedgerAverage)
