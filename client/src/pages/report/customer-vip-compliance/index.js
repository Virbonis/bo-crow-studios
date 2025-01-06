import { FileExcelOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, Row, Select, Space, Table } from 'antd'
import { Amount, useGetDateTimeBusinessHour } from 'components/blaise'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/customer-vip/actions'

const mapStateToProps = ({ customerVIP }) => ({
  loading: customerVIP.loading,
  dataTable: customerVIP.data,
  totalResult: customerVIP.total,
  loadingExport: customerVIP.loadingExport,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_COMPLIANCE,
      payload,
      source: 'Customer VIP Compliance',
    })
  },
  Export: payload => {
    dispatch({
      type: actions.EXPORT_COMPLIANCE,
      payload,
      source: 'Customer VIP Compliance',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const { RangePicker } = DatePicker
const columns = [
  {
    title: 'Customer ID',
    dataIndex: 'customer_id',
    align: 'center',
    width: 120,
  },
  {
    title: 'User Name',
    dataIndex: 'user_name',
    sorter: true,
    sortDirections: ['descend', 'descend'],
    width: 120,
  },
  {
    title: 'Customer Level',
    dataIndex: 'customer_level',
    width: 120,
  },
  {
    title: 'Branch Name',
    dataIndex: 'branch_name',
    width: 120,
  },
  {
    title: 'VIP Code',
    dataIndex: 'vip_code',
    align: 'center',
    sorter: true,
    sortDirections: ['descend', 'descend'],
    width: 120,
  },
  {
    title: 'VIP Value',
    dataIndex: 'vip_value',
    align: 'right',
    sorter: true,
    sortDirections: ['descend', 'descend'],
    width: 120,
    render: (text, record) => record.is_show_value1 === 'Y' && <Amount value={text} />,
  },
  {
    title: 'VIP Value 2',
    dataIndex: 'vip_value2',
    align: 'right',
    sorter: true,
    sortDirections: ['descend', 'descend'],
    width: 120,
    render: (text, record) => record.is_show_value2 === 'Y' && <Amount value={text} />,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'center',
    width: 120,
    render: text => {
      if (text === -1) return <div className="text-danger">Remove</div>
      if (text === 1) return <div className="text-blue">Add</div>
      if (text === 2) return 'Update'
      return '-'
    },
  },
  {
    title: 'Stamp Date',
    dataIndex: 'stamp_date',
    align: 'center',
    sorter: true,
    sortDirections: ['descend', 'descend'],
    defaultSortOrder: 'descend',
    width: 120,
    render: text => text.formatDateTimeSecond(),
  },
  {
    title: 'Stamp User',
    align: 'center',
    dataIndex: 'stamp_user',
    width: 120,
  },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const CustomerVIPCompliance = wrapperDate(
  ({ defaultDateTime, loading, loadingExport, dataTable, totalResult, Load, Export, CleanUp }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    let { branchOptions, vipCodeOptions } = useSelectOptions()
    branchOptions = [{ value: '', label: 'All Branch' }].concat(branchOptions)
    vipCodeOptions = [{ value: '', label: 'All VIP Code' }].concat(vipCodeOptions)

    const [form] = Form.useForm()

    const [orderBy, setOrderBy] = useState('Stamp_Date')
    const [pagination, setPagination] = useState({ page_size: 50, current_page: 1 })
    const reload = () => form.submit()

    const exportHandler = () => {
      const values = form.getFieldsValue()
      const payload = {
        ...values,
        from_date: values.date_range?.[0].format('YYYY-MM-DD'),
        to_date: values.date_range?.[1].format('YYYY-MM-DD'),
        order_by: 'Stamp_Date',
        current_page: 0,
        page_size: 0,
      }
      Export(payload)
    }

    return (
      <>
        <div className="card">
          <div className="card-header">
            <Form
              form={form}
              className="w-100"
              initialValues={{
                branch: '',
                vip_code: '',
                date_range: [defaultDateTime, defaultDateTime],
              }}
              onFinish={values => {
                Load({
                  ...values,
                  from_date: values.date_range?.[0].format('YYYY-MM-DD'),
                  to_date: values.date_range?.[1].format('YYYY-MM-DD'),
                  order_by: orderBy,
                  current_page: pagination.current_page,
                  page_size: pagination.page_size,
                })
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="date_range">
                    <RangePicker allowClear={false} className="w-100" format="YYYY-MM-DD" />
                  </Form.Item>
                  <Form.Item name="vip_code">
                    <Select options={vipCodeOptions} />
                  </Form.Item>
                  <Form.Item name="branch">
                    <Select options={branchOptions} />
                  </Form.Item>
                </Col>
              </Row>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button
                  loading={loadingExport}
                  icon={<FileExcelOutlined />}
                  onClick={exportHandler}
                >
                  XLS
                </Button>
              </Space>
            </Form>
          </div>
          <div className="card-body">
            <Table
              rowKey="index_number"
              bordered
              loading={loading}
              dataSource={dataTable}
              columns={columns}
              onChange={(p, f, sorter) => {
                setOrderBy(sorter.field)
                reload()
              }}
              pagination={{
                total: totalResult,
                pageSize: pagination.page_size,
                current: pagination.current_page,
                showSizeChanger: true,
                showTotal: totalData => `Total ${totalData}`,
                onChange: (current_page, page_size) => {
                  setPagination({ current_page, page_size })
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
export default connect(mapStateToProps, mapDispatchToProps)(CustomerVIPCompliance)
