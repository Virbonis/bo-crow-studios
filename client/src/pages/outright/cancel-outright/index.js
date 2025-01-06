import React from 'react'
import {
  Col,
  DatePicker,
  Form,
  Row,
  Input,
  Select,
  Table,
  Button,
  Tooltip,
  Checkbox,
  Typography,
} from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { useGetDateTimeBusinessHour, useFormWithPagination } from 'components/blaise'
import { validatorNumeric } from 'helper'
import actions from 'redux/cancel-outright/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { isEqual } from 'lodash'
import FormCancel from './form-cancel'

const { Text } = Typography
const mapStateToProps = ({ cancelOutright }) => ({
  tableData: cancelOutright.data.result,
  totalResult: cancelOutright.data.total,
  loading: cancelOutright.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_CANCEL_OUTRIGHT,
      payload,
      source: 'Outright List',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_CANCEL_OUTRIGHT,
      successCallback,
      payload,
      source: 'Outright - Add Outright',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const outrightStatusOptions = [
  { value: '', label: 'All Outright Status' },
  { value: 'Unscored', label: 'Unscored' },
  { value: 'Scored', label: 'Scored' },
  { value: 'Cancelled', label: 'Cancelled' },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const CancelOutright = wrapperDate(
  ({ loading, tableData, totalResult, defaultDateTime, Load, Update, CleanUp }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const [form] = Form.useForm()
    const [formTable] = Form.useForm()
    const { sportOptions } = useSelectOptions()

    const fetch = React.useCallback(
      values => {
        Load({
          ...values,
          outright_id: Number(values.outright_id),
          from_date: values.dateRange?.[0].format('YYYY-MM-DD'),
          to_date: values.dateRange?.[1].format('YYYY-MM-DD'),
        })
        formTable.resetFields()
      },
      [formTable, Load],
    )
    const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalResult)
    const reload = React.useCallback(() => form.submit(), [form])
    React.useEffect(() => reload(), [reload])

    const columns = [
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
        render: text => text.formatDateTime(),
        width: 150,
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
        render: text => <Text className="text-wrap">{text}</Text>,
      },
      {
        title: 'Cancel',
        width: 250,
        render: record => (
          <Row>
            <Col span={20}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues[record.outright_id]?.edited !==
                  currentValues[record.outright_id]?.edited
                }
              >
                {({ getFieldValue }) => {
                  const edited = getFieldValue([record.outright_id, 'edited'])
                  return edited && <FormCancel form={formTable} record={record} />
                }}
              </Form.Item>
            </Col>
            <Col span={3} offset={1}>
              <Form.Item name={[record.outright_id, 'edited']} valuePropName="checked">
                <Checkbox />
              </Form.Item>
            </Col>
          </Row>
        ),
      },
    ]
    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse" style={{ gap: 8 }}>
              <Tooltip placement="top" title="Refresh list">
                <Button icon={<ReloadOutlined />} onClick={reload} />
              </Tooltip>
              <Form
                form={form}
                className="w-100"
                initialValues={{
                  outright_id: '',
                  dateRange: [defaultDateTime, defaultDateTime],
                  sport_id: 10,
                  outright_score_status: '',
                }}
                {...formProps}
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="dateRange" className="mb-0">
                      <DatePicker.RangePicker
                        className="w-100"
                        allowClear={false}
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                    <Form.Item name="sport_id" className="mb-0">
                      <Select
                        placeholder="Select Sport"
                        showSearch
                        options={sportOptions}
                        optionFilterProp="label"
                      />
                    </Form.Item>
                    <Form.Item
                      name="outright_id"
                      className="mb-0"
                      rules={[{ validator: validatorNumeric }]}
                    >
                      <Input placeholder="Ouright ID" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="outright_score_status" className="mb-0">
                      <Select options={outrightStatusOptions} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Form
              form={formTable}
              className="w-100"
              onFinish={values => {
                const payload = Object.entries(values)
                  .filter(([, data]) => data.edited)
                  .map(([key, val]) => {
                    if (val.void_id === 80 || val.void_id === 81)
                      return {
                        outright_id: Number(key),
                        ...val,
                      }
                    const [void_id, no_sequence] = val.void_id.split('_')
                    return {
                      outright_id: Number(key),
                      ...val,
                      void_id: Number(void_id),
                      no_sequence: Number(no_sequence),
                      is_team: true,
                    }
                  })
                Update(payload, reload)
              }}
            >
              <Table
                rowKey="outright_id"
                size="small"
                loading={loading}
                dataSource={tableData}
                columns={columns}
                pagination={paginationProps}
                title={() => {
                  return (
                    <Form.Item
                      shouldUpdate={(prevValues, currentValues) =>
                        !isEqual(prevValues, currentValues)
                      }
                    >
                      {({ getFieldsValue }) => {
                        const anyChecked = Object.values(getFieldsValue()).some(val => val.edited)
                        return (
                          <div className="d-flex justify-content-end">
                            <Button type="primary" htmlType="submit" disabled={!anyChecked}>
                              Submit
                            </Button>
                          </div>
                        )
                      }}
                    </Form.Item>
                  )
                }}
              />
            </Form>
          </div>
          <div className="card-footer">
            <b>
              Notes:
              <br />
              1. If filter by OutrightID, other filters will ignored
              <br />
              2. Cancel Outright page list outrights that allow to cancelled on SELECTED DATE
            </b>
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(CancelOutright)
