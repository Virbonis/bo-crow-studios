import React, { useState } from 'react'
import { Row, Col, Table, Form, DatePicker, Input, Button, Select } from 'antd'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { connect } from 'react-redux'
import { useGetDateTimeDBServer } from 'components/blaise'
import actions from 'redux/member-login/actions'

const mapStateToProps = ({ memberLogin }) => ({
  tableData: memberLogin.data.result,
  loading: memberLogin.loadingData,
  totalResults: memberLogin.data.total,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Member Login',
    })
  },
})

const customerTypeOptions = [
  { value: '', label: 'Show All Customer Type' },
  { value: 'H', label: 'Cash' },
  { value: 'C', label: 'Credit' },
  { value: 'K', label: 'Kiosk' },
]

const { RangePicker } = DatePicker

const wrapperDate = Component => props => {
  const defaultDateTimeServer = useGetDateTimeDBServer()

  if (!defaultDateTimeServer) return null
  return <Component {...props} defaultDateTimeServer={defaultDateTimeServer} />
}

const MemberLogin = wrapperDate(
  ({ defaultDateTimeServer, tableData, loading, totalResults, Load }) => {
    const [form] = Form.useForm()

    const [pagination, setPagination] = useState({
      current_page: 1,
      page_size: 50,
    })

    let { branchOptions } = useSelectOptions()
    branchOptions = [{ value: '', label: 'Show All Branch' }].concat(branchOptions)

    const reload = () => form.submit()
    const submitHandler = () => setPagination(prev => ({ ...prev, current_page: 1 }))

    const columns = [
      {
        title: 'No',
        dataIndex: 'index_number',
        align: 'center',
        width: 30,
      },
      {
        title: 'Customer ID',
        dataIndex: 'customer_id',
        align: 'center',
        width: 120,
      },
      {
        title: 'Customer Type',
        dataIndex: 'customer_type',
        align: 'center',
        width: 120,
        render: text => (
          <>
            {text === 'H' && 'Cash'}
            {text === 'C' && 'Credit'}
            {text === 'K' && 'Kiosk'}
          </>
        ),
      },
      {
        title: 'Branch',
        dataIndex: 'branch_name',
        align: 'center',
        width: 100,
      },
      {
        title: 'Username',
        dataIndex: 'username',
        width: 350,
      },
      {
        title: 'Login Date',
        dataIndex: 'login_date',
        align: 'center',
        width: 120,
        render: text => text && text.formatDateTimeSecond(),
      },
      {
        title: 'Logout Date',
        dataIndex: 'logout_date',
        align: 'center',
        width: 120,
        render: text => text && text.formatDateTimeSecond(),
      },
      {
        title: 'IP',
        dataIndex: 'ip_address',
        align: 'center',
        width: 120,
      },
      {
        title: 'Country',
        dataIndex: 'country',
        align: 'center',
        width: 120,
      },
    ]

    return (
      <>
        <div className="card">
          <div className="card-header">
            <Form
              form={form}
              className="w-100"
              initialValues={{
                date_range: [defaultDateTimeServer, defaultDateTimeServer],
                branch_id: '',
                customer_type: '',
              }}
              onFinish={values => {
                Load({
                  ...values,
                  login_date_from: values.date_range[0].format('YYYY-MM-DD'),
                  login_date_to: values.date_range[1].format('YYYY-MM-DD'),
                  ...pagination,
                })
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="date_range" className="mb-0">
                    <RangePicker format="YYYY-MM-DD" className="w-100" allowClear={false} />
                  </Form.Item>
                  <Form.Item name="username">
                    <Input placeholder="Username" className="w-100" />
                  </Form.Item>
                  <Form.Item name="ip_address">
                    <Input placeholder="IP" className="w-100" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="branch_id">
                    <Select options={branchOptions} showSearch className="w-100" />
                  </Form.Item>
                  <Form.Item name="customer_type">
                    <Select options={customerTypeOptions} showSearch className="w-100" />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit" onClick={submitHandler}>
                Submit
              </Button>
            </Form>
          </div>
          <div className="card-body">
            <Table
              rowKey="index_number"
              bordered
              size="small"
              loading={loading}
              columns={columns}
              dataSource={tableData}
              pagination={{
                current: pagination.current_page,
                pageSize: pagination.page_size,
                showSizeChanger: true,
                total: totalResults,
                showTotal: total => `Total ${total} items`,
                onChange: (current, size) => {
                  setPagination({ ...pagination, current_page: current, page_size: size })
                  reload()
                },
              }}
            />
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(MemberLogin)
