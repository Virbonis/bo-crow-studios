import React, { useState } from 'react'
import {
  Row,
  Col,
  Table,
  Select,
  Input,
  Form,
  Button,
  Tooltip,
  InputNumber,
  Checkbox,
  Drawer,
  Space,
} from 'antd'
import { connect } from 'react-redux'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { CaretDownOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/customer-buyback/actions'
import { Amount, useFormWithPagination } from 'components/blaise'
import { isEqual } from 'lodash'
import AddUser from './add-user'

const mapStateToProps = ({ customerBuyback }) => ({
  tableData: customerBuyback.data.result,
  totalResult: customerBuyback.data.total,
  loading: customerBuyback.loadingData,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_CUSTOMER_BUYBACK,
      payload,
      source: 'Customer Buyback',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_CUSTOMER_BUYBACK,
      payload,
      successCallback,
      source: 'Customer Buyback',
    })
  },
})

const customerLevelOptions = [
  { value: '', label: 'All Customer Level' },
  { value: 'Shareholder', label: 'Agent' },
  { value: 'Member', label: 'Member' },
]

const CustomerBuyback = ({ tableData, loading, totalResult, LoadTable, Update }) => {
  const [form] = Form.useForm()
  const [formEdit] = Form.useForm()
  const [treeDownline, setTreeDownLine] = useState([{ value: '', label: 'All Downline Customer' }])
  const [visibleAddUser, setVisibleAddUser] = useState(false)

  let { currencyOptions, companyOptions } = useSelectOptions()
  currencyOptions = [{ value: '', label: 'All Currency' }].concat(currencyOptions)
  companyOptions = [{ value: '', label: 'All Company' }].concat(companyOptions)

  React.useEffect(() => {
    const initialValues = tableData?.reduce((acc, curr) => {
      acc[curr.customer_id] = {
        ...curr,
        isEdit: false,
      }
      return acc
    }, {})

    formEdit.setFieldsValue(initialValues)
  }, [tableData, formEdit])

  const columns = [
    {
      title: 'Customer ID',
      align: 'center',
      dataIndex: 'customer_id',
      width: 100,
    },
    {
      title: 'Customer Level',
      align: 'center',
      dataIndex: 'customer_level',
      width: 100,
    },
    {
      title: 'Company',
      align: 'center',
      dataIndex: 'company_name',
      width: 100,
    },
    {
      title: 'Username',
      width: 300,
      render: record => (
        <Row className="justify-content-between">
          <span>{record.username}</span>
          {record.is_has_downline === '1' && (
            <Button
              icon={<CaretDownOutlined />}
              type="link"
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
      width: 100,
    },
    {
      title: 'Comm Pct(%)',
      align: 'right',
      width: 140,
      render: record => (
        <>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues[record.customer_id]?.isEdit !== currentValues[record.customer_id]?.isEdit
            }
          >
            {({ getFieldValue }) => {
              const getEdit = getFieldValue([record.customer_id, 'isEdit'])
              return getEdit ? (
                <Form.Item name={[record.customer_id, 'comm_pct']}>
                  <InputNumber maxLength={6} max={100} step={0.01} />
                </Form.Item>
              ) : (
                <Amount value={record.comm_pct} />
              )
            }}
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Comm Pct Others(%)',
      align: 'right',
      width: 140,
      render: record => (
        <>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues[record.customer_id]?.isEdit !== currentValues[record.customer_id]?.isEdit
            }
          >
            {({ getFieldValue }) => {
              const getEdit = getFieldValue([record.customer_id, 'isEdit'])
              return getEdit ? (
                <Form.Item name={[record.customer_id, 'comm_pct_others']}>
                  <InputNumber maxLength={6} max={100} step={0.01} />
                </Form.Item>
              ) : (
                <Amount value={record.comm_pct_others} />
              )
            }}
          </Form.Item>
        </>
      ),
    },
    {
      title: 'PT Share(%)',
      align: 'right',
      width: 140,
      render: record => (
        <>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues[record.customer_id]?.isEdit !== currentValues[record.customer_id]?.isEdit
            }
          >
            {({ getFieldValue }) => {
              const getEdit = getFieldValue([record.customer_id, 'isEdit'])
              return getEdit ? (
                <Form.Item name={[record.customer_id, 'pt_share']}>
                  <InputNumber maxLength={6} max={100} step={0.01} />
                </Form.Item>
              ) : (
                <Amount value={record.pt_share} />
              )
            }}
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Action',
      align: 'center',
      width: 80,
      render: record => (
        <Form.Item name={[record.customer_id, 'isEdit']} valuePropName="checked">
          <Checkbox />
        </Form.Item>
      ),
    },
  ]

  const fetch = React.useCallback(
    values => {
      LoadTable({
        ...values,
        join_date_from: values.date_range?.[0].format('YYYY-MM-DD'),
        join_date_to: values.date_range?.[1].format('YYYY-MM-DD'),
      })
    },
    [LoadTable],
  )
  const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalResult)
  const reload = React.useCallback(() => form.submit(), [form])
  React.useEffect(() => reload(), [reload])

  const onClickDownline = React.useCallback(
    ({ customer_tree_get_downline, username }) => {
      if (treeDownline.findIndex(e => e.value === customer_tree_get_downline) === -1)
        setTreeDownLine(old => [...old, { value: customer_tree_get_downline, label: username }])

      form.setFieldsValue({
        customer_level: '',
        customer_tree_get_downline,
      })
      reload() // form.submit()
    },
    [form, reload, treeDownline],
  )

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse align-items-start" style={{ gap: 8 }}>
            <Tooltip title="Refresh List">
              <Button icon={<ReloadOutlined />} onClick={reload} />
            </Tooltip>
            <Button icon={<PlusOutlined />} onClick={() => setVisibleAddUser(true)}>
              Create
            </Button>
            <Form
              form={form}
              id="form"
              className="w-100"
              initialValues={{
                customer_type: '',
                customer_level: '',
                company_id: '',
                currency: '',
                username: '',
                username_downline: '',
                customer_tree_get_downline: '',
              }}
              {...formProps}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="customer_id" className="mb-0">
                    <InputNumber className="w-100" controls={false} placeholder="Customer ID" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="customer_level" className="mb-0">
                    <Select showSearch optionFilterProp="label" options={customerLevelOptions} />
                  </Form.Item>
                  <Form.Item name="customer_tree_get_downline" className="mb-0">
                    <Select
                      options={treeDownline}
                      onChange={v =>
                        setTreeDownLine(old =>
                          old.splice(0, treeDownline.findIndex(e => e.value === v) + 1),
                        )
                      }
                    />
                  </Form.Item>
                  <Form.Item name="username" className="mb-0">
                    <Input placeholder="Username" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="company_id" className="mb-0">
                    <Select showSearch optionFilterProp="label" options={companyOptions} />
                  </Form.Item>
                  <Form.Item name="currency" className="mb-0">
                    <Select showSearch optionFilterProp="label" options={currencyOptions} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Form
            form={formEdit}
            id="form-edit"
            className="w-100"
            onFinish={value => {
              const convertValue = Object.entries(value).map(([key, val]) => {
                return {
                  customer_id: Number(key),
                  ...val,
                }
              })
              const finalValue = convertValue.filter(data => data.isEdit)
              Update(finalValue, reload)
            }}
          >
            <Table
              rowKey={record => record.customer_id}
              size="small"
              bordered
              loading={loading}
              dataSource={tableData}
              columns={columns}
              pagination={paginationProps}
              className="h-100"
              title={() => <SubmitHandler />}
            />
          </Form>
        </div>
      </div>
      <Drawer
        title="Add User"
        width={600}
        open={visibleAddUser}
        onClose={() => setVisibleAddUser(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleAddUser(false)}>Cancel</Button>
            <Button form="add-user-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <AddUser
          successCallback={() => {
            reload()
            setVisibleAddUser(false)
          }}
        />
      </Drawer>
    </>
  )
}

const SubmitHandler = () => {
  return (
    <Form.Item shouldUpdate={(prevValues, currentValues) => !isEqual(prevValues, currentValues)}>
      {({ getFieldsValue }) => {
        const anyChecked = Object.values(getFieldsValue()).some(val => val?.isEdit)
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
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerBuyback)
