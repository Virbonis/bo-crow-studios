import React, { useState } from 'react'
import {
  Row,
  Col,
  Table,
  Select,
  Input,
  Form,
  DatePicker,
  Drawer,
  Button,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import { connect } from 'react-redux'
import {
  CaretDownOutlined,
  EditOutlined,
  FileExcelOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { validatorNumeric } from 'helper'
import actions from 'redux/customer-list/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { Amount, useFormWithPagination } from 'components/blaise'
import authorize from 'authorize'
import Edit from './edit-customer'
import EditBetLimit from './edit-bet-limit'
import BetLimitLog from './bet-limit-log'
import VIPLog from './vip-log'
import ResetPassword from './reset-password'
import DelayBet from './delay-bet'

const { Text } = Typography

const { RangePicker } = DatePicker

const mapStateToProps = ({
  customerList,
  auth: {
    user: { user_auth_ids: authIds },
  },
}) => ({
  tableData: customerList.data.result,
  totalResult: customerList.data.total,
  loadingData: customerList.loading,
  loadingExport: customerList.loadingExport,
  allowResetPassword: !authIds.includes(authorize.DISALLOW_RESET_NON_CASH_PASSWORD),
  allowEditCustomerDetail: !authIds.includes(authorize.DISALLOW_EDIT_CUSTOMER_DETAIL),
  allowEditCustomerBetLimit: !authIds.includes(authorize.DISALLOW_EDIT_CUSTOMER_BET_LIMIT),
  allowViewBetLimitLog: authIds.includes(authorize.ALLOWED_TO_VIEW_BET_LIMIT_LOG),
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD_CUSTOMER_LIST,
      payload,
      source: 'Customer List',
    })
  },
  Export: payload => {
    dispatch({
      type: actions.EXPORT_CUSTOMER_LIST,
      payload,
      source: 'Customer List',
    })
  },
})

const customerTypeOptions = [
  { value: '', label: 'All Customer Type' },
  { value: 'H', label: 'Cash' },
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
  { value: 'Member', label: 'Member' },
  { value: '99', label: 'Adjusted' },
]

const cashBalanceOptions = [
  { value: 0, label: 'All Cash Balance' },
  { value: -1, label: 'Negative' },
  { value: -99, label: 'Zero' },
  { value: 1, label: '< 5K' },
  { value: 2, label: '5K - 10K' },
  { value: 3, label: '10K - 20K' },
  { value: 4, label: '20K - 50K' },
  { value: 5, label: '> 50K' },
]

const activeOptions = [
  { value: '', label: 'All Active Status' },
  { value: '1', label: 'Active' },
  { value: '0', label: 'Disabled' },
]

const CustomerList = ({
  tableData,
  loadingData,
  loadingExport,
  totalResult,
  LoadTable,
  allowResetPassword,
  allowViewBetLimitLog,
  allowEditCustomerBetLimit,
  allowEditCustomerDetail,
  Export,
}) => {
  const [form] = Form.useForm()
  const [customerData, setCustomerData] = useState()
  const [visibleEditCustomer, setVisibleEditCustomer] = useState(false)
  const [visibleEditBetLimit, setVisibleEditBetLimit] = useState(false)
  const [visibleLogBetLimit, setVisibleLogBetLimit] = useState(false)
  const [visibleDelayBet, setVisibleDelayBet] = useState(false)
  const [visibleVIPLog, setVisibleVIPLog] = useState(false)
  const [visibleResetPassword, setVisibleResetPassword] = useState(false)
  const [treeDownline, setTreeDownLine] = useState([{ value: '', label: 'All Downline Customer' }])

  let { currencyOptions, branchOptions } = useSelectOptions()
  branchOptions = [{ value: '', label: 'All Branch' }].concat(branchOptions)
  currencyOptions = [{ value: '', label: 'All Currency' }].concat(currencyOptions)

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
      width: 120,
      render: record => (
        <>
          {record === 'H' && 'Cash'}
          {record === 'C' && 'Credit'}
          {record === 'K' && 'Kiosk'}
        </>
      ),
    },
    {
      title: 'Customer Level',
      dataIndex: 'customer_level',
      align: 'center',
      width: 120,
    },
    {
      title: 'Branch',
      dataIndex: 'branch_name',
      align: 'center',
      width: 100,
    },
    {
      title: 'Username',
      align: 'center',
      width: 300,
      render: record => (
        <Row className="justify-content-between">
          <span>{record.username}</span>
          {record.is_has_downline === 1 && (
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
      title: 'Cash Balance',
      dataIndex: 'cash_balance',
      align: 'right',
      width: 100,
      render: text => <Amount value={text} />,
    },
    {
      title: 'Join Date',
      dataIndex: 'join_date',
      align: 'center',
      width: 120,
      render: text => text.formatDateTime(),
    },
    {
      title: 'Status',
      dataIndex: 'customer_active_status',
      align: 'center',
      width: 80,
      render: text => {
        if (text === 1) return <Text className="text-success">Active</Text>
        if (text === 0) return <Text className="text-danger">Disabled</Text>
        return text
      },
    },
    {
      title: 'Profile',
      dataIndex: 'limit_profile_id',
      align: 'center',
      width: 120,
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 130,
      render: record => (
        <>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              type="link"
              onClick={() => editCustomerHandler(record)}
            />
          </Tooltip>
          {record.is_cash_member === 'N' && allowResetPassword && (
            <Button className="px-1" onClick={() => resetPasswordHandler(record)} type="link">
              Reset Password
            </Button>
          )}
          {allowViewBetLimitLog && (
            <Button className="px-1" onClick={() => editBetLimitHandler(record)} type="link">
              Bet Limit
            </Button>
          )}
          {record.customer_type === 'H' && (
            <Button className="px-1" onClick={() => betLogLimitHandler(record)} type="link">
              Limit Log
            </Button>
          )}
          <Button className="px-1" onClick={() => vipLogHandler(record)} type="link">
            VIP Log
          </Button>
          <Button className="px-1" onClick={() => delayBetHandler(record)} type="link">
            Delay Bet
          </Button>
        </>
      ),
    },
  ]
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

  const editCustomerHandler = record => {
    setVisibleEditCustomer(true)
    setCustomerData(record)
  }
  const editBetLimitHandler = record => {
    const branch_id = branchOptions.find(data => data.label === record.branch_name)?.value
    setVisibleEditBetLimit(true)
    setCustomerData({ ...record, branch_id })
  }
  const betLogLimitHandler = record => {
    setVisibleLogBetLimit(true)
    setCustomerData(record)
  }
  const vipLogHandler = record => {
    setVisibleVIPLog(true)
    setCustomerData(record)
  }
  const resetPasswordHandler = record => {
    setVisibleResetPassword(true)
    setCustomerData(record)
  }

  const delayBetHandler = record => {
    setVisibleDelayBet(true)
    setCustomerData(record)
  }

  React.useEffect(() => reload(), [reload])
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse align-items-start" style={{ gap: 8 }}>
            <Tooltip title="Refresh List">
              <Button icon={<ReloadOutlined />} onClick={reload} />
            </Tooltip>
            <Form
              form={form}
              id="form"
              className="w-100"
              initialValues={{
                customer_type: '',
                customer_level: '',
                branch_id: '',
                currency: '',
                username: '',
                username_downline: '',
                cash_balance: 0,
                customer_active_status: '',
                customer_tree_get_downline: '',
                limit_profile_id: '',
              }}
              {...formProps}
              // onValuesChange={(changedValues, allValues) => {
              //   const key = Object.keys(changedValues)[0]
              //   if (key === 'customer_tree_get_downline') {
              //     const getTreeDownlineIndex = treeDownline.findIndex(
              //       data => data.value === changedValues[key],
              //     )
              //     const filterSelection = treeDownline.filter(
              //       (data, index) => index <= getTreeDownlineIndex,
              //     )

              //     form.setFieldsValue({ customer_level: 'Shareholder' })
              //     allValues.customer_level = 'Shareholder'
              //     setTreeDownLine(filterSelection)
              //   }

              //   formProps.onValuesChange(changedValues, allValues)
              // }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item
                    name="customer_id"
                    className="mb-0"
                    rules={[{ validator: validatorNumeric }]}
                  >
                    <Input className="w-100" controls={false} placeholder="Customer ID" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="customer_type" className="mb-0">
                    <Select showSearch optionFilterProp="label" options={customerTypeOptions} />
                  </Form.Item>
                  <Form.Item name="customer_level" className="mb-0">
                    <Select showSearch optionFilterProp="label" options={customerLevelOptions} />
                  </Form.Item>
                  <Form.Item name="customer_tree_get_downline" className="mb-0">
                    <Select
                      showSearch
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
                  <Form.Item name="branch_id" className="mb-0">
                    <Select showSearch optionFilterProp="label" options={branchOptions} />
                  </Form.Item>
                  <Form.Item name="currency" className="mb-0">
                    <Select showSearch optionFilterProp="label" options={currencyOptions} />
                  </Form.Item>
                  <Form.Item name="cash_balance" className="mb-0">
                    <Select showSearch optionFilterProp="label" options={cashBalanceOptions} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="date_range">
                    <RangePicker
                      placeholder={['Join Date From', 'Join Date To']}
                      className="w-100"
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                  <Form.Item name="customer_active_status" className="mb-0">
                    <Select showSearch optionFilterProp="label" options={activeOptions} />
                  </Form.Item>
                  <Form.Item name="limit_profile_id" className="mb-0">
                    <Input placeholder="Profile" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey={record => record.customer_id}
            size="small"
            loading={loadingData}
            dataSource={tableData}
            columns={columns}
            pagination={paginationProps}
            title={() => (
              <div align="right">
                {form.getFieldValue('branch_id') ? (
                  <Button
                    type="primary"
                    icon={<FileExcelOutlined />}
                    loading={loadingExport}
                    onClick={() => {
                      const { date_range } = form.getFieldsValue()
                      Export({
                        ...form.getFieldsValue(),
                        join_date_from: date_range?.[0].format('YYYY-MM-DD') || '1/1/1900',
                        join_date_to: date_range?.[1].format('YYYY-MM-DD') || '1/1/1900',
                        customer_tree_get_downline: treeDownline[treeDownline.length - 1].value,
                      })
                    }}
                  >
                    Export
                  </Button>
                ) : (
                  <br /> // PREVENT UI SHIFTING
                )}
              </div>
            )}
          />
        </div>
      </div>
      <Drawer
        title="Edit Customer"
        width={900}
        open={visibleEditCustomer}
        onClose={() => setVisibleEditCustomer(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleEditCustomer(false)}>Cancel</Button>

            <Button
              form="edit-customer-form"
              type="primary"
              htmlType="submit"
              disabled={!allowEditCustomerDetail}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Edit
          editValue={customerData}
          successCallback={() => {
            setVisibleEditCustomer(false)
            reload()
          }}
        />
      </Drawer>
      <Drawer
        title="Edit Bet Limit"
        width={600}
        open={visibleEditBetLimit}
        onClose={() => setVisibleEditBetLimit(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleEditBetLimit(false)}>Cancel</Button>
            {customerData?.customer_type === 'H' && (
              <Button
                form="edit-bet-limit-form"
                type="primary"
                htmlType="submit"
                disabled={!allowEditCustomerBetLimit}
              >
                Submit
              </Button>
            )}
            {customerData?.customer_type !== 'H' && (
              <Button form="edit-bet-limit-form" type="primary" htmlType="submit">
                Submit
              </Button>
            )}
          </Space>
        }
      >
        <EditBetLimit
          editValue={customerData}
          successCallback={() => {
            setVisibleEditBetLimit(false)
            reload()
          }}
        />
      </Drawer>
      <Drawer
        title="Bet Limit Log"
        width={600}
        open={visibleLogBetLimit}
        onClose={() => setVisibleLogBetLimit(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleLogBetLimit(false)}>Close</Button>
          </Space>
        }
      >
        <BetLimitLog
          editValue={customerData}
          successCallback={() => {
            reload()
          }}
        />
      </Drawer>
      <Drawer
        title="Customer VIP Log"
        width={600}
        open={visibleVIPLog}
        onClose={() => setVisibleVIPLog(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleVIPLog(false)}>Close</Button>
          </Space>
        }
      >
        <VIPLog
          editValue={customerData}
          successCallback={() => {
            reload()
          }}
        />
      </Drawer>
      <Drawer
        title="Reset Password"
        width={600}
        open={visibleResetPassword}
        onClose={() => setVisibleResetPassword(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleResetPassword(false)}>Close</Button>
            <Button form="password-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <ResetPassword
          editValue={customerData}
          successCallback={() => {
            setVisibleResetPassword(false)
            reload()
          }}
        />
      </Drawer>
      <Drawer
        title="Delay Bet"
        width={600}
        open={visibleDelayBet}
        onClose={() => setVisibleDelayBet(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleDelayBet(false)}>Close</Button>
          </Space>
        }
      >
        <DelayBet customerData={customerData} successCallback={() => setVisibleDelayBet(false)} />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerList)
