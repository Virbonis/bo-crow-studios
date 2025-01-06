import { ReloadOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Table,
  Tooltip,
  Input,
  Popconfirm,
  Typography,
} from 'antd'
import { useGetDateTimeBusinessHour, useFormWithPagination } from 'components/blaise'
import { isEqual } from 'lodash'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/unprocess-outright/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapStateToProps = ({ unprocessOutright }) => ({
  loadingData: unprocessOutright.loadingData,
  dataTable: unprocessOutright.data.result,
  totalResult: unprocessOutright.data.total,
})

const mapDispatchToProps = dispatch => ({
  LoadData: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Unprocess Outright',
    })
  },
  Unprocess: (payload, successCallback) => {
    dispatch({
      type: actions.UNPROCESS_OUTRIGHT,
      payload,
      successCallback,
      source: 'Unprocess Outright',
    })
  },
  CancelQueue: (payload, successCallback) => {
    dispatch({
      type: actions.CANCEL_QUEUE,
      payload,
      successCallback,
      source: 'Unprocess Outright',
    })
  },
})

const { Text } = Typography
const { RangePicker } = DatePicker
const outrightStatusOptions = [
  { value: '', label: 'All Outright Status' },
  { value: 'Scored', label: 'Scored' },
  { value: 'Cancelled', label: 'Cancelled' },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const UnprocessOutright = wrapperDate(
  ({ loadingData, dataTable, totalResult, defaultDateTime, LoadData, Unprocess, CancelQueue }) => {
    const [form] = Form.useForm()
    const [formTable] = Form.useForm()

    const { sportOptions } = useSelectOptions()

    const fetch = React.useCallback(
      values => {
        LoadData({
          ...values,
          from_date: values.outright_date[0].format('YYYY-MM-DD'),
          to_date: values.outright_date[1].format('YYYY-MM-DD'),
        })
        formTable.resetFields()
      },
      [LoadData, formTable],
    )
    const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalResult)
    const reload = React.useCallback(() => form.submit(), [form])
    useEffect(() => reload(), [reload])

    const column = [
      {
        title: 'Outright ID',
        dataIndex: 'outright_id',
        align: 'center',
        width: 100,
        fixed: 'left',
      },
      {
        title: 'Outright Date',
        dataIndex: 'outright_date',
        align: 'center',
        width: 150,
        render: text => text.formatDateTime(),
      },
      {
        title: 'League',
        dataIndex: 'league_name',
        width: 400,
      },
      {
        title: 'Outright Status',
        dataIndex: 'outright_score_status',
        align: 'center',
        width: 150,
        render: text => {
          if (text === 'Unscored') return <Text className="text-warning">{text}</Text>
          if (text === 'Cancelled') return <Text className="text-danger">{text}</Text>
          return text
        },
      },
      {
        title: 'Score',
        dataIndex: 'outright_score',
        width: 250,
        // render: text => {
        //   return <Text style={{ whiteSpace: 'break-spaces' }}>{text}</Text>
        // },
      },
      {
        title: 'Unprocess',
        width: 250,
        render: (text, record) => {
          return (
            <div>
              {record.outright_process_status === 'Y' && (
                <Row justify="space-between">
                  <Col>
                    <Form.Item
                      shouldUpdate={(prevValues, currentValues) =>
                        prevValues[record.outright_id]?.checked !==
                        currentValues[record.outright_id]?.checked
                      }
                    >
                      {({ getFieldValue }) => {
                        const showInput = getFieldValue([record.outright_id, 'checked'])
                        if (showInput)
                          return (
                            <Form.Item name={[record.outright_id, 'reason']}>
                              <Input.TextArea rows={2} placeholder="Input Reason" />
                            </Form.Item>
                          )
                        return null
                      }}
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name={[record.outright_id, 'checked']} valuePropName="checked">
                      <Checkbox />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {record.outright_process_status === '0' && (
                <Popconfirm
                  title="Cancel Queue Status?"
                  onConfirm={() =>
                    CancelQueue(
                      {
                        outright_id: record.outright_id,
                      },
                      reload,
                    )
                  }
                >
                  <Button type="link" danger>
                    Queue
                  </Button>
                </Popconfirm>
              )}
              {record.outright_process_status === '1' && (
                <Typography.Text strong type="success">
                  Running
                </Typography.Text>
              )}
            </div>
          )
        },
      },
    ]

    return (
      <div className="card">
        <div className="card-header justify-content-between d-flex flex-row-reverse">
          <Tooltip>
            <Button icon={<ReloadOutlined />} onClick={reload} />
          </Tooltip>
          <Form
            form={form}
            className="w-100"
            initialValues={{
              outright_date: [defaultDateTime, defaultDateTime],
              sport_id: 10,
              outright_status: '',
            }}
            {...formProps}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="outright_date">
                  <RangePicker allowClear={false} className="w-100" format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item name="sport_id">
                  <Select options={sportOptions} showSearch />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="outright_status">
                  <Select options={outrightStatusOptions} showSearch />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="card-body">
          <Form
            form={formTable}
            onFinish={values => {
              const payload = Object.entries(values)
                .filter(e => e[1].checked)
                .map(([outright_id, value]) => ({
                  outright_id: Number(outright_id),
                  ...value,
                }))
              Unprocess(payload, reload)
            }}
          >
            <Table
              rowKey="outright_id"
              size="small"
              columns={column}
              loading={loadingData}
              dataSource={dataTable}
              pagination={paginationProps}
              title={() => {
                return (
                  <div className="d-flex justify-content-end">
                    <Form.Item
                      shouldUpdate={(prevValues, curValues) => !isEqual(prevValues, curValues)}
                    >
                      {({ getFieldsValue }) => {
                        const anyChecked = Object.values(getFieldsValue()).some(val => val.checked)
                        return (
                          <Button type="primary" htmlType="submit" disabled={!anyChecked}>
                            Submit
                          </Button>
                        )
                      }}
                    </Form.Item>
                  </div>
                )
              }}
            />
          </Form>
        </div>
      </div>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(UnprocessOutright)
