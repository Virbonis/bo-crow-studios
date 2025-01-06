import React from 'react'
import { Button, DatePicker, Form, Input, Row, Select, Table, Tooltip, Col, Typography } from 'antd'
import { connect } from 'react-redux'
import { ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/cash-flow-tracker/actions'
import { Amount, useGetDateTimeDBServer, useGetLastMemberTrackerDate } from 'components/blaise'
import dayjs from 'dayjs'
import { getPresetsMinMaxDate } from 'helper'

const mapStateToProps = ({ cashFlowTracker }, { hist }) => ({
  dataTable: hist ? cashFlowTracker.data_Hist : cashFlowTracker.data_Post,
  loading: hist ? cashFlowTracker.loading_Hist : cashFlowTracker.loading_Post,
})

const mapDispatchToProps = (dispatch, { hist }) => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Report Cash Flow',
    })
  },
  CleanUp: () => dispatch({ type: hist ? actions.CLEAN_UP_HIST : actions.CLEAN_UP_POST }),
})

const { RangePicker } = DatePicker
const affairOptions = [
  { value: 0, label: 'All Affair' },
  { value: 1, label: 'Stake' },
  { value: 2, label: 'Return' },
  { value: 4, label: 'Reject Pending' },
  { value: 20, label: 'Reset Result' },
  { value: 21, label: 'Cancellation' },
  { value: 22, label: 'UnCancellation' },
  { value: 100, label: 'Deposit' },
  { value: 110, label: 'Withdrawal' },
  { value: 250, label: 'System Adjustment (+)' },
  { value: 251, label: 'System Adjustment (-)' },
]

const wrapperDate = Component => props => {
  const lastTrackerDate = useGetLastMemberTrackerDate()
  const defaultDateTimeServer = useGetDateTimeDBServer()
  const { hist } = props

  if (!lastTrackerDate || !defaultDateTimeServer) return null

  const minDate = !hist ? lastTrackerDate : dayjs('2012-01-01')
  const maxDate = !hist ? defaultDateTimeServer : lastTrackerDate

  return <Component {...props} minDate={minDate} maxDate={maxDate} hist={hist} />
}

const CashFlowTracker = wrapperDate(
  ({
    dataTable,
    loading,
    minDate,
    maxDate,
    hist,
    // lastTrackerDate, defaultDateTimeServer,
    Load,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const [form] = Form.useForm()
    const refresh = React.useCallback(() => {
      form.submit()
    }, [form])

    const columns = [
      {
        title: 'Tracker ID',
        dataIndex: 'track_id',
        width: 150,
        render: (text, record) => {
          if (!record.summary) return text
          return `Summary For: ${record.track_date.formatDate()}`
        },
        onCell: record => ({
          colSpan: record.summary ? 3 : 1,
        }),
      },
      {
        title: 'Tracker Date',
        dataIndex: 'track_date',
        width: 150,
        render: text => text.formatDateTimeSecond(),
        onCell: record => ({
          colSpan: record.summary ? 0 : 1,
        }),
      },
      {
        title: 'Username',
        dataIndex: 'username',
        width: 150,
        onCell: record => ({
          colSpan: record.summary ? 0 : 1,
        }),
      },
      {
        title: 'Ref. No',
        dataIndex: 'ref_no',
        width: 100,
        render: (text, record) => {
          if (!record.summary) return text
          return (
            <>
              Amount Change: <Amount value={record.amount_change} />
            </>
          )
        },
        onCell: record => ({
          colSpan: record.summary ? 2 : 1,
        }),
      },
      {
        title: 'Affair',
        dataIndex: 'affair_name',
        width: 100,
        onCell: record => ({
          colSpan: record.summary ? 0 : 1,
        }),
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        width: 100,
        render: (text, record) => {
          if (!record.summary) return text
          return (
            <>
              Previous Balance: <Amount value={record.previous_balance} />
            </>
          )
        },
        onCell: record => ({
          colSpan: record.summary ? 2 : 1,
        }),
      },
      {
        title: 'Amount Change',
        dataIndex: 'amount_change',
        width: 100,
        align: 'right',
        render: text => <Amount value={text} />,
        onCell: record => ({
          colSpan: record.summary ? 0 : 1,
        }),
      },
      {
        title: 'Previous Balance',
        dataIndex: 'previous_balance',
        width: 100,
        align: 'right',
        render: (text, record) => {
          if (!record.summary) return <Amount value={text} />
          return (
            <>
              Last Balance: <Amount value={record.last_balance} />
            </>
          )
        },
        onCell: record => ({
          colSpan: record.summary ? 2 : 1,
          className: record.summary ? 'text-left' : '', // fix align on summary row
        }),
      },
      {
        title: 'Current Balance',
        dataIndex: 'current_balance',
        width: 100,
        align: 'right',
        render: text => <Amount value={text} />,
        onCell: record => ({
          colSpan: record.summary ? 0 : 1,
        }),
      },
    ]

    return (
      <>
        <div className="card">
          <div className="card-header d-flex flex-row-reverse justify-content-between">
            <Tooltip>
              <Button icon={<ReloadOutlined />} onClick={refresh} />
            </Tooltip>
            <Form
              form={form}
              className="w-100"
              initialValues={{
                tracker_date: [maxDate, maxDate],
                username: '',
                affair: 0,
              }}
              // onValuesChange={changedValue => {
              //   if (
              //     !Object.keys(changedValue).includes('username') &&
              //     !Object.keys(changedValue).includes('ref_no')
              //   ) {
              //     refresh()
              //   }
              // }}
              // onKeyPress={e => {
              //   if (e.key === 'Enter') {
              //     refresh()
              //   }
              // }}
              onFinish={values => {
                Load({
                  ...values,
                  date_from: values.tracker_date?.[0].format('YYYY-MM-DD'),
                  date_to: values.tracker_date?.[1].format('YYYY-MM-DD'),
                  hist_or_post: hist ? '_Hist' : '_Post',
                })
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item
                    name="tracker_date"
                    extra={
                      <Typography.Text type="danger">
                        {`Valid from ${minDate.format('YYYY-MM-DD')} - ${maxDate.format(
                          'YYYY-MM-DD',
                        )}`}
                      </Typography.Text>
                    }
                  >
                    <RangePicker
                      allowClear={false}
                      className="w-100"
                      format="YYYY-MM-DD"
                      disabledDate={current => current < minDate || current > maxDate}
                      presets={getPresetsMinMaxDate(minDate, maxDate)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="username" extra="*Cash member only" rules={[{ required: true }]}>
                    <Input placeholder="Username" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="affair">
                    <Select options={affairOptions} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="ref_no">
                    <Input placeholder="Ref. No" />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>
          </div>
          <div className="card-body">
            <Table
              rowKey="track_id"
              columns={columns}
              loading={loading}
              dataSource={dataTable}
              pagination={false}
              onRow={record => ({
                className: record.summary ? 'font-weight-bold' : '',
                style: {
                  backgroundColor: record.summary ? 'rgb(106 103 103 / 20%)' : '',
                },
              })}
            />
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(CashFlowTracker)
