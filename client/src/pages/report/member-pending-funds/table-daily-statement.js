import { Button, Table } from 'antd'
import { Amount } from 'components/blaise'
import dayjs from 'dayjs'
import React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ memberPendingFunds }) => ({
  loading: memberPendingFunds.loadingDetail,
  tableData: memberPendingFunds.dailyStatementData,
})

const TableDailyStatement = ({ loading, tableData, formDetail }) => {
  const onClickReportDate = (report_type, report_date) => () => {
    formDetail.setFieldsValue({
      report_type,
      date_range: [dayjs.utc(report_date).startOf('day'), dayjs.utc(report_date).endOf('day')],
    })
    formDetail.submit()
  }
  const columns = [
    {
      title: 'No',
      align: 'center',
      width: 30,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Date',
      width: 150,
      render: ({ report_type, report_date, posted }) => {
        if (report_type !== 3) return report_date.formatDateTimeSecond()

        // betlistrunning
        if (posted === 0) report_type = 3
        // betlist
        else report_type = 2
        return (
          <Button type="link" className="p-0" onClick={onClickReportDate(report_type, report_date)}>
            {report_date.formatDateTimeSecond()}
          </Button>
        )
      },
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      width: 120,
    },
    {
      title: 'Turn Over',
      align: 'right',
      dataIndex: 'turn_over',
      width: 120,
      render: text => <Amount length={4} value={text} />,
    },
    {
      title: 'Credit Debit',
      align: 'right',
      dataIndex: 'debet_credit',
      width: 120,
      render: text => <Amount length={4} value={text} />,
    },
    {
      title: 'Balance',
      align: 'right',
      dataIndex: 'balance',
      width: 120,
      render: (text, record, index) => {
        if (index === 0) {
          return '0.00'
        }
        return <Amount length={2} value={record.balance + record.debet_credit} />
      },
    },
  ]

  return (
    <Table
      rowKey={record => `${record.report_date}-${record.report_type}-${record.posted}}`}
      bordered
      size="small"
      loading={loading}
      dataSource={tableData}
      columns={columns}
      pagination={false}
    />
  )
}

export default connect(mapStateToProps)(TableDailyStatement)
