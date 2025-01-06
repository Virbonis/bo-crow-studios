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
    ? ledger.data_ledger_Hist?.map((data, index) => ({ ...data, key: index + 1 }))
    : ledger.data_ledger_Post?.map((data, index) => ({ ...data, key: index + 1 })),
})

const mapDispatchToProps = (dispatch, { hist }) => ({
  LoadMain: (payload, failedCallback) => {
    dispatch({
      type: actions.LOAD_LEDGER_MAIN,
      payload,
      source: 'Ledger Main',
      failedCallback,
    })
  },
  CleanUp: () => dispatch({ type: hist ? actions.CLEAN_UP_HIST : actions.CLEAN_UP_POST }),
})

// const reportType = 'SSMA|ShareholderCash|SMA|MA|Agent|Member|Bet Detail'.split('|')
// const customerType = 'COMBI||C|H|MC|B'.split('|')
const reportTypeDescription = 'SMA Name (SSMA Name)|Shareholder Name|Member Name'.split('|')
const LedgerMain = ({
  submitValue,
  detailHandler,
  loading,
  data_ledger,

  LoadMain,
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
      dataIndex: 'bets_count',
      align: 'center',
      width: 100,
    },
    {
      title: 'Bet Amount',
      dataIndex: 'bet_amount_rmb',
      align: 'right',
      width: 100,
      render: data => <Amount value={data} />,
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
      width: 350,
    },
    {
      title: 'Bets Count',
      dataIndex: 'bets_count',
      align: 'center',
      width: 100,
    },
    {
      title: 'Bet Amount',
      align: 'right',
      dataIndex: 'bet_amount_rmb',
      width: 100,
      render: (text, record) => {
        return (
          <Button type="link" className="p-0" onClick={() => detailHandler(record)}>
            <Amount value={text} />
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
      title: 'Member (F)',
      dataIndex: 'member_f',
      align: 'right',
      width: 100,
      render: data => <Amount value={data} />,
    },
    {
      title: 'Member (L)',
      dataIndex: 'member_l',
      align: 'right',
      width: 100,
      render: data => <Amount value={data} />,
    },
    {
      title: 'Result',
      dataIndex: 'member',
      align: 'right',
      width: 100,
      render: data => <Amount value={data} />,
    },
    {
      title: '%',
      dataIndex: 'agent_result',
      align: 'right',
      width: 100,
    },
    {
      title: 'Agent Result',
      dataIndex: 'agent_result_perc',
      align: 'right',
      width: 100,
      render: data => <Amount value={data} />,
    },
  ]

  const tableHandler = ({ status7, drill_id, desc }) => {
    const additionalValue = {}
    additionalValue.customer_type = getDrillCustomerType(status7)

    if (currentCustomerType === 'COMBI') {
      additionalValue.report_type = 'ShareholderCash'
    } else {
      additionalValue.report_type = 'Member'
      additionalValue.shareholder_id = drill_id
      // skip other level, direct show member level
      // if (currentReportType === 'ShareholderCash') {
      //   additionalValue.report_type = 'Member'
      //   additionalValue.shareholder_id = drill_id
      // } else if (currentReportType === 'SMA') {
      //   additionalValue.report_type = 'MA'
      //   additionalValue.sma_id = drill_id
      // } else if (currentReportType === 'MA') {
      //   additionalValue.report_type = 'Agent'
      //   additionalValue.ma_id = drill_id
      // } else if (currentReportType === 'Agent') {
      //   additionalValue.report_type = 'Member'
      //   additionalValue.agent_id = drill_id
      // } else if (currentReportType === 'Member') {
      //   additionalValue.report_type = 'Member'
      //   additionalValue.username = drill_id
      // }
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
    setPrevMode([])
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
    LoadMain(payload, () => setPrevMode(prev => prev.slice(0, prev.length - 1)))
  }, [prevMode, LoadMain]) // eslint-disable-line react-hooks/exhaustive-deps

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

      <TableLedgerMain
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

const TableLedgerMain = ({ dataSource, currentReportType, currentCustomerType, ...restProps }) => {
  const exportHandler = tableID => ExportData(tableID)

  // all = '', split to credit-kiosk, cash-mcard-buyback
  if (currentCustomerType === '') {
    // skip credit-kiosk
    // only cash-mcard-buyback
    const dataCashMCardBuyback = dataSource.filter(e =>
      ['1', '2', '9', '96', '98', '99'].includes(e.status7),
    )

    return (
      <Table
        id="table-cash"
        {...restProps}
        dataSource={dataCashMCardBuyback}
        title={() => (
          <>
            <Button className="mr-1" type="primary" onClick={() => exportHandler('table-cash')}>
              Export
            </Button>
            Cash, M-Card, Buyback
          </>
        )}
      />
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
const summaryMember = data => {
  const total = {
    bets_count: countTotal('bets_count', data),
    bet_amount: countTotal('bet_amount_rmb', data),
    company_stock: countTotal('company_stock_rmb', data),
    member_f: countTotal('member_f', data),
    member_l: countTotal('member_l', data),
    member: countTotal('member', data),
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

export default connect(mapStateToProps, mapDispatchToProps)(LedgerMain)
