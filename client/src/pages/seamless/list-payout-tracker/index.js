import React from 'react'
import {
  Table,
  Form,
  Row,
  Col,
  Input,
  Checkbox,
  DatePicker,
  Popover,
  Button,
  Tooltip,
  Typography,
  Space,
} from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/list-payout-tracker/actions'
import { Amount, useGetDateTimeDBServer, useGetLastGLDate } from 'components/blaise'
import AutoSizer from 'react-virtualized-auto-sizer'
import { InfoCircleFilled, ReloadOutlined } from '@ant-design/icons'
import { getPresetsMinMaxDate } from 'helper'

const { RangePicker } = DatePicker

const mapStateToProps = ({ listPayoutTracker }) => ({
  tableData: listPayoutTracker.data,
  loadingData: listPayoutTracker.loading,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_PAYOUT_TRACKER,
      payload,
      source: 'List Payout Tracker',
    })
  },
})

const wrapperDate = Component => props => {
  const lastGLDate = useGetLastGLDate()
  const defaultDateTime = useGetDateTimeDBServer()

  if (!lastGLDate || !defaultDateTime) return null

  return (
    <Component
      {...props}
      defaultDateTime={defaultDateTime}
      minDate={lastGLDate}
      maxDate={defaultDateTime.clone().add(2, 'years')}
    />
  )
}

const PayoutTracker = wrapperDate(
  ({ defaultDateTime, minDate, maxDate, tableData, Load, loadingData }) => {
    const [form] = Form.useForm()

    const reload = React.useCallback(() => {
      form.submit()
    }, [form])

    const columns = [
      {
        title: 'Bet ID',
        align: 'center',
        dataIndex: 'no_txn',
        width: 80,
      },
      {
        title: 'Member ID',
        dataIndex: 'member_id',
        align: 'center',
        width: 100,
      },
      {
        title: 'Payout Date',
        dataIndex: 'payout_date',
        align: 'center',
        width: 120,
        render: text => text && text.formatDateTimeSecond(),
      },
      {
        title: 'Payout Amount',
        dataIndex: 'payout_amount',
        width: 120,
        align: 'right',
        render: text => <Amount value={text} />,
      },
      {
        title: 'Taken Date',
        dataIndex: 'taken_date',
        align: 'center',
        width: 120,
        render: text => text && text.formatDateTimeSecond(),
      },
      {
        title: 'Confirm Date',
        dataIndex: 'confirm_date',
        align: 'center',
        width: 120,
        render: text => text && text.formatDateTimeSecond(),
      },
      {
        title: 'Process ID',
        dataIndex: 'process_id',
        width: 220,
      },
      {
        title: 'Last Error',
        dataIndex: 'last_error',
        width: 100,
      },
      {
        title: 'Last Error Date',
        dataIndex: 'last_error_date',
        width: 120,
        render: text => text && text.formatDateTimeSecond(),
      },
      {
        title: 'Payout Type',
        dataIndex: 'payout_type',
        align: 'center',
        width: 100,
        render: text => (text === '1' ? 'Payout' : 'Unpayout'),
      },
    ]

    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse">
              <Tooltip>
                <Button icon={<ReloadOutlined />} onClick={reload} />
              </Tooltip>
              <Form
                form={form}
                className="w-100"
                layout="vertical"
                initialValues={{
                  date_range: [defaultDateTime.clone().startOf('day'), defaultDateTime.clone()],
                }}
                onFinish={values => {
                  Load({
                    ...values,
                    date_from: values.date_range[0].format('YYYY-MM-DD'),
                    date_to: values.date_range[1].format('YYYY-MM-DD'),
                  })
                }}
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item
                      extra={
                        <Typography.Text type="danger">
                          {`Valid from ${minDate.format('YYYY-MM-DD')} - ${maxDate.format(
                            'YYYY-MM-DD',
                          )}`}
                        </Typography.Text>
                      }
                    >
                      <Space.Compact className="w-100">
                        <Tooltip title="Is Settlement Date">
                          <Form.Item name="is_settlement_date" valuePropName="checked">
                            <Checkbox />
                          </Form.Item>
                        </Tooltip>
                        <Form.Item name="date_range" noStyle>
                          <RangePicker
                            allowClear={false}
                            className="ml-1 w-100"
                            format="YYYY-MM-DD"
                            disabledDate={current => current < minDate || current > maxDate}
                            presets={getPresetsMinMaxDate(minDate, maxDate)}
                          />
                        </Form.Item>
                      </Space.Compact>
                    </Form.Item>

                    <Form.Item hidden>
                      <Popover
                        content="FromDate start at 12:00 noon, ToDate end at 11:59 noon next day"
                        placement="bottomRight"
                      >
                        <Button shape="circle" icon={<InfoCircleFilled />} type="link" />
                      </Popover>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item
                      name="bet_id"
                      className="mb-0"
                      rules={[
                        {
                          validator(_, value) {
                            if (value && /[A-Z`!#$%^&*()@+\-=\[\]{};':"\\|.,<>\/?~]/i.test(value))
                              return Promise.reject(new Error('Numeric only'))
                            return Promise.resolve()
                          },
                        },
                      ]}
                    >
                      <Input placeholder="Bet ID" maxLength={18} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="member_id" className="mb-0">
                      <Input placeholder="Member ID" />
                    </Form.Item>
                  </Col>
                </Row>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <AutoSizer className="h-100 w-100">
              {({ height }) => {
                return (
                  <Table
                    rowKey={record => `${record.no_txn}-${record.payout_date}`}
                    size="small"
                    bordered
                    loading={loadingData}
                    dataSource={tableData}
                    columns={columns}
                    pagination={false}
                    virtual
                    scroll={{ y: height - 37 }}
                  />
                )
              }}
            </AutoSizer>
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(PayoutTracker)
