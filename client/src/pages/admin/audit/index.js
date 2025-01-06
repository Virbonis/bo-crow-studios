import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Table, Button, Form, Row, Col, DatePicker, Select, Input, Space } from 'antd'
import dayjs from 'dayjs'
import actions from 'redux/admin/audit/actions'
import getTime from 'components/blaise/custom/getTime'
import ExecutionLog from './execution-log'
import './custom.scss'

const { RangePicker } = DatePicker

const mapStateToProps = ({ audit }, { hist }) => ({
  loading: hist ? audit.loading_Hist : audit.loading,
  data: hist ? audit.data_Hist : audit.data,
  taskOptions: [{ value: '', label: 'All Task' }].concat(
    audit.select_task.map(e => ({
      value: e.task_name,
      label: e.task_description,
    })),
  ),
})

const mapDispatchToProps = (dispatch, { hist }) => ({
  LoadTask: payload =>
    dispatch({
      type: actions.LOAD_TASK,
      payload,
    }),
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
    })
  },
  CleanUp: () => dispatch({ type: hist ? actions.CLEAN_UP_HIST : actions.CLEAN_UP_POST }),
})

const sourceOptions = [
  { value: '', label: 'All Source' },
  { value: 'sbadmin', label: 'SBADMIN' },
  { value: 'sbop', label: 'SBOP' },
  { value: 'tsubasa-admin', label: 'TSUBASAADMIN' },
  { value: 'tsubasa-admin-mc', label: 'TSUBASAADMINMC' },
]
const columns = [
  {
    title: 'Severity',
    dataIndex: 'severity_id',
    align: 'center',
    width: 80,
    render: text => {
      switch (text) {
        case 0:
          return 'Info'
        case 1:
          return 'Warning'
        case 2:
          return 'Error'
        default:
          return ''
      }
    },
  },
  {
    title: 'Date',
    width: 200,
    render: ({ start_date, finish_date }) => (
      <Space direction="vertical">
        <div>{start_date.formatDate()}</div>
        <span>
          {dayjs.utc(start_date).format('HH:mm:ss:SSS')} -{' '}
          {dayjs.utc(finish_date).format('HH:mm:ss:SSS')}
        </span>
      </Space>
    ),
  },
  {
    title: 'Source Name',
    dataIndex: 'source_name',
    align: 'center',
    width: 100,
  },
  {
    title: 'Execution Log',
    render: ({ task_name, start_date, execution_log }) => (
      <ExecutionLog task_name={task_name} start_date={start_date} {...execution_log} />
    ),
    width: 600,
  },
  {
    title: 'Match ID/Customer Username',
    dataIndex: 'match_id',
    align: 'center',
    width: 100,
  },
  {
    title: 'Username',
    dataIndex: 'username',
    align: 'center',
    width: 100,
  },
]
const AuditList = ({ loading, data, taskOptions, LoadTask, Load, hist, CleanUp }) => {
  const [form] = Form.useForm()
  const { startDate, endDate } = getTime(false)
  const [pagination, setPagination] = useState({
    page: 1,
    display: 10,
  })

  React.useEffect(() => CleanUp, [CleanUp])

  return (
    <div className="card">
      <div className="card-header">
        <Form
          form={form}
          initialValues={{
            dateRange: [startDate, endDate],
            severity_id: -1,
            source_name: '',
            task_name: '',
          }}
          onFinish={values => {
            Load({
              ...values,
              date_start: values.dateRange[0].format('YYYY-MM-DD'),
              date_end: values.dateRange[1].format('YYYY-MM-DD'),
              page: pagination.page,
              display: pagination.display,
              hist,
            })
          }}
        >
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
              <Form.Item
                name="dateRange"
                className="mb-0"
                rules={[{ required: true, message: 'Please input date range' }]}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  // showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
              <Form.Item name="severity_id" className="mb-0">
                <Select
                  placeholder="Select Severity"
                  options={[
                    { value: -1, label: 'All Severity' },
                    { value: 0, label: 'Info' },
                    { value: 1, label: 'Warning' },
                    { value: 2, label: 'Error' },
                  ]}
                  optionFilterProp="label"
                />
              </Form.Item>
              <Form.Item name="source_name" className="mb-0">
                <Select
                  placeholder="Select Source"
                  options={sourceOptions}
                  optionFilterProp="label"
                  onChange={value => {
                    LoadTask({ source_name: value })
                    form.setFieldsValue({ task_name: '' })
                  }}
                />
              </Form.Item>
              <Form.Item name="task_name" className="mb-0">
                <Select
                  placeholder="Select Task"
                  showSearch
                  allowClear={false}
                  options={taskOptions}
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
              <Form.Item name="match_id" className="mb-0">
                <Input placeholder="Match ID/Customer Username" />
              </Form.Item>
              <Form.Item name="username" className="mb-0">
                <Input placeholder="Enter Username" />
              </Form.Item>
            </Col>
          </Row>
          <Button
            htmlType="submit"
            type="primary"
            onClick={() => setPagination(p => ({ ...p, page: 1 }))}
          >
            Search
          </Button>
        </Form>
      </div>
      <div className="card-body">
        <Table
          rowKey="row_number"
          size="small"
          loading={loading}
          dataSource={data.result}
          columns={columns}
          scroll={{ x: true, y: true }}
          width="500px"
          pagination={{
            showTotal: total => `Total ${total} items`,
            total: data.total,
            current: pagination.page,
            pageSize: pagination.display,
            showSizeChanger: true,
          }}
          onChange={page => {
            setPagination({
              page: page.current,
              display: page.pageSize,
            })
            form.submit()
          }}
        />
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AuditList)
