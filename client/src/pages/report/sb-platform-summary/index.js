import React, { useState } from 'react'
import { Col, Form, Button, Table, DatePicker, Space } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/sb-platform-summary/actions'
import { Amount, useGetDateTimeBusinessHour } from 'components/blaise'
import { getPlatform } from 'helper'
import './custom.scss'
import { FileExcelOutlined } from '@ant-design/icons'

const mapStateToProps = ({ sbPlatformSummary }) => ({
  loading: sbPlatformSummary.loadingData,
  tableData: sbPlatformSummary.data,
  summary: sbPlatformSummary.summary,
  loadingExport: sbPlatformSummary.loadingExport,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'SB Platform Summary',
    })
  },
  Export: payload => {
    dispatch({
      type: actions.EXPORT,
      payload,
      source: 'SB Platform Summary',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const { RangePicker } = DatePicker

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()

  if (!defaultDateTime) return null

  return <Component {...props} maxDate={defaultDateTime} />
}

const SBPlatformSummary = wrapperDate(
  ({ maxDate, loading, loadingExport, tableData, summary, Load, Export, CleanUp }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const [form] = Form.useForm()
    const [submitValue, setSubmitValue] = useState()

    const [getRowSpan] = React.useMemo(() => {
      const isFirstRow = (bet_date, index) => {
        const firstIndex = tableData.findIndex(x => x.bet_date === bet_date)
        if (firstIndex === -1) return false
        if (index === firstIndex) return true
        const prev = tableData[index - 1]
        return prev.bet_date !== bet_date
      }
      const rowCount = bet_date => tableData.filter(x => x.bet_date === bet_date).length

      return [
        (bet_date, index) => {
          if (!isFirstRow(bet_date, index)) return 0
          return rowCount(bet_date)
        },
      ]
    }, [tableData])

    const columns = [
      {
        title: 'Transaction Date',
        dataIndex: 'bet_date',
        align: 'center',
        width: 150,
        render: (text, { isSubtotal }) => {
          if (isSubtotal) return 'Sub Total'
          return text.formatDate()
        },
        onCell: ({ isSubtotal, bet_date }, index) => ({
          colSpan: isSubtotal ? 3 : 1,
          rowSpan: isSubtotal ? 1 : getRowSpan(bet_date, index),
        }),
      },
      {
        title: 'Platform',
        dataIndex: 'txn_type',
        align: 'center',
        width: 150,
        render: text => getPlatform(text),
        onCell: ({ isSubtotal }) => ({
          colSpan: isSubtotal ? 0 : undefined,
        }),
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        align: 'center',
        width: 150,
        onCell: ({ isSubtotal }) => ({
          colSpan: isSubtotal ? 0 : undefined,
        }),
      },
      {
        title: 'Turnover (RMB)',
        dataIndex: 'bet_amount',
        width: 150,
        render: text => <Amount value={text} />,
        align: 'right',
      },
      {
        title: 'Total Bet Account',
        dataIndex: 'ticket',
        width: 150,
        render: text => <Amount value={text} int />,
        align: 'right',
      },
      {
        title: 'Total Unique User',
        dataIndex: 'users',
        width: 150,
        render: text => <Amount value={text} int />,
        align: 'right',
      },
    ]

    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse">
              <Form
                form={form}
                className="w-100"
                initialValues={{
                  date_range: [maxDate, maxDate],
                }}
                onFinish={values => {
                  const payload = {
                    trans_date_from: values.date_range[0].format('YYYY-MM-DD'),
                    trans_date_to: values.date_range[1].format('YYYY-MM-DD'),
                  }
                  setSubmitValue(payload)
                  Load(payload)
                }}
              >
                <Col xs={12} sm={12} md={5} lg={5} xl={5}>
                  <Form.Item name="date_range">
                    <RangePicker
                      className="w-100"
                      format="YYYY-MM-DD"
                      allowClear={false}
                      disabledDate={current => current >= maxDate}
                    />
                  </Form.Item>
                </Col>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <Button
                    type="primary"
                    icon={<FileExcelOutlined />}
                    loading={loadingExport}
                    onClick={() => Export({ ...submitValue })}
                  >
                    Export
                  </Button>
                </Space>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Table
              bordered
              // rowKey={x => `${x.bet_date}-${x.txn_type}-${x.currency}`}
              size="small"
              loading={loading}
              dataSource={tableData}
              columns={columns}
              pagination={false}
              rowClassName={({ isSubtotal }) => (isSubtotal ? 'sub-total-row' : 'normal-row')}
              summary={data => {
                return (
                  data.length > 0 && (
                    <Table.Summary fixed="bottom">
                      <Table.Summary.Row className="font-weight-bold bg-light-yellow">
                        <Table.Summary.Cell colSpan={3} align="center">
                          Total
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Amount value={summary.bet_amount} />
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Amount value={summary.ticket} int />
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Amount value={summary.users} int />
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )
                )
              }}
            />
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(SBPlatformSummary)
