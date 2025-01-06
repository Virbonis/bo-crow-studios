import {
  Form,
  Input,
  Col,
  Select,
  Table,
  DatePicker,
  Button,
  Drawer,
  Tooltip,
  Row,
  Space,
  Typography,
} from 'antd'

import React, { useState } from 'react'
import { CaretDownOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import actions from 'redux/country-restriction/actions'
import { useFormWithPagination } from 'components/blaise'
import Edit from './edit'

const { Text } = Typography

const mapStateToProps = ({ countryRestriction }) => ({
  dataTable: countryRestriction.data.result,
  totalResult: countryRestriction.data.total,
  loadingData: countryRestriction.loading,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Country Restriction',
    })
  },
})

const customerTypeOptions = [
  { value: '', label: 'All Customer Type' },
  { value: 'C', label: 'Credit' },
  // { value: 'K', label: 'Kiosk' }, // removed
]
const customerLevelOptions = [
  { value: '', label: 'All Customer Level' },
  { value: 'Shareholder', label: 'Shareholder' },
  { value: 'SSMA', label: 'SSMA' },
  { value: 'SMA', label: 'SMA' },
  { value: 'MA', label: 'MA' },
  { value: 'Agent', label: 'Agent' },
]
const activeStatusOptions = [
  { value: '', label: 'All Active Status' },
  { value: '1', label: 'Active' },
  { value: '0', label: 'Disabled' },
]
const accessStatusOptions = [
  { value: '', label: 'All Access Status' },
  { value: '1', label: 'Authorized' },
  { value: '0', label: 'Blocked' },
]
const { RangePicker } = DatePicker
const CountryRestriction = ({ loadingData, dataTable, totalResult, Load }) => {
  const [form] = Form.useForm()

  let { currencyOptions, branchOptions } = useSelectOptions()
  branchOptions = [{ value: '', label: 'All Branch' }].concat(branchOptions)
  currencyOptions = [{ value: '', label: 'All Currency' }].concat(currencyOptions)

  const [treeDownline, setTreeDownLine] = useState([{ value: '', label: 'All Downline Customer' }])
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editData, setEditData] = useState([])

  const fetch = React.useCallback(
    values => {
      Load({
        ...values,
        date_from: values?.join_date?.[0].format('YYYY-MM-DD'),
        date_to: values?.join_date?.[1].format('YYYY-MM-DD'),
      })
    },
    [Load],
  )
  const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalResult)
  const reload = React.useCallback(() => form.submit(), [form])

  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'customer_id',
      align: 'center',
      width: 100,
    },
    {
      title: 'Customer Type',
      dataIndex: 'customer_type',
      align: 'center',
      width: 100,
      render: text => {
        return <>{text === 'C' ? 'Credit' : 'Kiosk'}</>
      },
    },
    {
      title: 'Customer Level',
      dataIndex: 'customer_level',
      align: 'center',
      width: 100,
    },
    {
      title: 'Branch',
      dataIndex: 'branch_name',
      align: 'center',
      width: 80,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: 150,
      render: (text, record) => (
        <Row className="justify-content-between">
          {text}
          {record.has_downline === 1 && (
            <Button
              type="link"
              icon={<CaretDownOutlined />}
              onClick={() => onClickDownline(record)}
            />
          )}
        </Row>
      ),
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      align: 'center',
      width: 70,
    },
    {
      title: 'Join Date',
      dataIndex: 'join_date',
      align: 'center',
      width: 100,
      render: text => text.formatDateTime(),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      align: 'center',
      width: 80,
      render: text => {
        return <>{text === 1 ? 'Active' : <Text className="text-danger">Disabled</Text>}</>
      },
    },
    {
      title: 'Access',
      dataIndex: 'access',
      align: 'center',
      width: 100,
      render: text => {
        return <>{text === 1 ? 'Authorized' : 'Blocked'}</>
      },
    },
    {
      title: 'Country Name',
      dataIndex: 'country_name',
      width: 100,
      render: text => text || 'All Country',
    },
    {
      title: 'Action',
      align: 'center',
      width: 60,
      render: (text, rowData) => {
        return (
          <>
            <Tooltip title="Edit">
              <Button
                icon={<EditOutlined />}
                type="link"
                onClick={() => {
                  setVisibleEdit(true)
                  setEditData(rowData)
                }}
              />
            </Tooltip>
          </>
        )
      },
    },
  ]
  const onClickDownline = React.useCallback(
    record => {
      if (treeDownline.findIndex(e => e.value === record.customer_tree_get_downline) === -1)
        setTreeDownLine(old => [
          ...old,
          { value: record.customer_tree_get_downline, label: record.username },
        ])

      form.setFieldsValue({
        customer_level: '',
        customer_tree_get_downline: record.customer_tree_get_downline,
      })
      reload() // form.submit()
    },
    [form, reload, treeDownline],
  )

  React.useEffect(() => reload(), [reload])
  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-row-reverse" style={{ gap: 8 }}>
          <Tooltip placement="top" title="Refresh list">
            <Button icon={<ReloadOutlined />} onClick={reload} />
          </Tooltip>
          <Form
            form={form}
            className="w-100"
            initialValues={{
              customer_type: '',
              customer_level: '',
              customer_tree_get_downline: '',
              branch_id: '',
              currency: '',
              active: '',
              access: '',
            }}
            {...formProps}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="customer_id">
                  <Input placeholder="Customer ID" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="customer_type" placeholder="Select Customer Type">
                  <Select options={customerTypeOptions} />
                </Form.Item>
                <Form.Item name="customer_level">
                  <Select options={customerLevelOptions} />
                </Form.Item>
                <Form.Item name="customer_tree_get_downline">
                  <Select
                    options={treeDownline}
                    onChange={v =>
                      setTreeDownLine(old =>
                        old.splice(0, treeDownline.findIndex(e => e.value === v) + 1),
                      )
                    }
                  />
                </Form.Item>
                <Form.Item name="username">
                  <Input placeholder="Username" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="branch_id">
                  <Select options={branchOptions} />
                </Form.Item>
                <Form.Item name="currency">
                  <Select options={currencyOptions} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="join_date">
                  <RangePicker
                    placeholder={['Join Date From', 'Join Date To']}
                    className="w-100"
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
                <Form.Item name="active">
                  <Select options={activeStatusOptions} />
                </Form.Item>
                <Form.Item name="access">
                  <Select options={accessStatusOptions} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="card-body">
          <Table
            size="small"
            rowKey={record => `${record?.customer_id}-${record?.username}`}
            columns={columns}
            loading={loadingData}
            dataSource={dataTable}
            pagination={paginationProps}
          />
        </div>
      </div>
      <div>
        <Drawer
          title={`Country Restriction - ${editData.username}`}
          width="80%"
          open={visibleEdit}
          onClose={() => setVisibleEdit(false)}
          destroyOnClose
          footer={
            <Space>
              <Button onClick={() => setVisibleEdit(false)}>Cancel</Button>
              <Button form="edit-form" type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          }
        >
          <Edit
            editData={editData}
            successCallback={React.useCallback(() => {
              setVisibleEdit(false)
              reload()
            }, [reload])}
          />
        </Drawer>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CountryRestriction)
