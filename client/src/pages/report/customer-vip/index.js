import React, { useState } from 'react'
import { FileExcelOutlined } from '@ant-design/icons'
import { Button, Col, Form, Row, Select, Space, Table } from 'antd'
import { Amount } from 'components/blaise'
import { connect } from 'react-redux'
import actions from 'redux/customer-vip/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import dayjs from 'dayjs'

const mapStateToProps = ({ customerVIP }) => ({
  loading: customerVIP.loading,
  dataTable: customerVIP.data,
  totalResult: customerVIP.total,
  dataSummary: customerVIP.dataSummary,
  loadingExport: customerVIP.loadingExport,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Customer VIP',
    })
  },
  Export: payload => {
    dispatch({
      type: actions.EXPORT,
      payload,
      source: 'Customer VIP',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

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
    title: 'VIP Value 1',
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
    dataIndex: 'stamp_user',
    align: 'center',
    width: 120,
  },
]
const columnsSummary = [
  {
    title: 'VIP Code',
    align: 'center',
    dataIndex: 'vip_code',
    width: 100,
  },
  {
    title: 'Count',
    align: 'center',
    dataIndex: 'total_cust',
    width: 100,
  },
]
const CustomerVIP = ({
  loading,
  loadingExport,
  dataTable,
  totalResult,
  dataSummary,
  Load,
  Export,
  CleanUp,
}) => {
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
      order_by: 'Stamp_Date',
      current_page: 0,
      page_size: 0,
      log_date: dayjs()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
    }
    Export(payload)
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <Form
            form={form}
            className="w-100 h-100"
            initialValues={{
              branch_id: '',
              vip_code: '',
            }}
            onFinish={values => {
              Load({
                ...values,
                order_by: orderBy,
                current_page: pagination.current_page,
                page_size: pagination.page_size,
                log_date: dayjs()
                  .add(1, 'days')
                  .format('YYYY-MM-DD'),
              })
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="vip_code">
                  <Select showSearch optionFilterProp="label" options={vipCodeOptions} />
                </Form.Item>
                <Form.Item name="branch_id">
                  <Select showSearch optionFilterProp="label" options={branchOptions} />
                </Form.Item>
              </Col>
            </Row>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button loading={loadingExport} icon={<FileExcelOutlined />} onClick={exportHandler}>
                XLS
              </Button>
            </Space>
          </Form>
        </div>
        <div className="card-body">
          <Row gutter={[8, 8]} className="h-100">
            <Col xs={24} sm={18} md={18} lg={18} xl={20} className="h-100">
              <Table
                rowKey="index_number"
                bordered
                className="h-100"
                loading={loading}
                dataSource={dataTable}
                columns={columns}
                onChange={(p, f, sorter) => {
                  setOrderBy(sorter.field)
                  reload()
                }}
                pagination={{
                  pageSize: pagination.page_size,
                  current: pagination.current_page,
                  showSizeChanger: true,
                  total: totalResult,
                  showTotal: totalData => `Total ${totalData}`,
                  onChange: (current_page, page_size) => {
                    setPagination({ current_page, page_size })
                    reload()
                  },
                }}
              />
            </Col>
            <Col xs={24} sm={6} md={6} lg={6} xl={4} className="h-100">
              <Table
                rowKey="vip_code"
                bordered
                loading={loading}
                dataSource={dataSummary}
                columns={columnsSummary}
                pagination={false}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerVIP)
