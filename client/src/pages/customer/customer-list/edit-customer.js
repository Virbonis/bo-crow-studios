import { InfoCircleOutlined } from '@ant-design/icons'
import {
  Checkbox,
  Col,
  Form,
  InputNumber,
  Row,
  Select,
  Table,
  Spin,
  Divider,
  Tooltip,
  Alert,
  Typography,
} from 'antd'
import authorize from 'authorize'
import { Amount } from 'components/blaise'
import { isEmpty } from 'lodash'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/customer-list/actions'
import './custom.scss'

const { Text } = Typography

const mapStateToProps = ({
  customerList,
  auth: {
    user: { user_auth_ids: authIds },
  },
}) => ({
  editCustomerData: customerList.editCustomerData,
  loadingData: customerList.loadingDrawer,
  allowChangeVIPCustomer: authIds.includes(authorize.ALLOWED_TO_CHANGE_VIP_CUSTOMER),
  allowEditCustomerDetail: !authIds.includes(authorize.DISALLOW_EDIT_CUSTOMER_DETAIL),
  authId: authIds,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_EDIT_CUSTOMER,
      payload,
      source: 'Customer List',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_EDIT_CUSTOMER,
      payload,
      successCallback,
      source: 'Customer List',
    })
  },
})

const cashCategoryOptions = [
  { value: 'CASH Member 10%', label: 'CASH Member 10%' },
  { value: 'CASH Member 20%', label: 'CASH Member 20%' },
  { value: 'CASH Member 30%', label: 'CASH Member 30%' },
  { value: 'CASH Member 40%', label: 'CASH Member 40%' },
  { value: 'CASH Member 50%', label: 'CASH Member 50%' },
  { value: 'CASH Member 60%', label: 'CASH Member 60%' },
  { value: 'CASH Member 70%', label: 'CASH Member 70%' },
  { value: 'CASH Member 80%', label: 'CASH Member 80%' },
  { value: 'CASH Member 90%', label: 'CASH Member 90%' },
  { value: 'DEFAULT', label: 'DEFAULT' },
  { value: 'usd10000', label: 'usd10000' },
]
const oddsGroupOptions = [
  { value: 1, label: 'A' },
  { value: 2, label: 'B' },
  { value: 3, label: 'C' },
  { value: 4, label: '-A' },
  { value: 5, label: '-B' },
  { value: 6, label: '-C' },
]
const EditCustomer = ({
  editValue,
  loadingData,
  editCustomerData,
  Load,
  Update,
  successCallback,
  allowChangeVIPCustomer,
  allowEditCustomerDetail,
  authId,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    Load(editValue)
  }, [editValue, Load])

  const initialValues = React.useMemo(() => {
    if (isEmpty(editCustomerData)) return {}

    const { result_main, result_upline, result_vip } = editCustomerData
    const initialValuesMain = {
      ...result_main,
      customer_active_status: result_main?.customer_active_status === 1,
      customer_suspend_status: result_main?.customer_suspend_status === 1,
    }

    const initialValuesUpline = result_upline.reduce((prev, curr) => {
      const { customer_id, vip_code, value1 } = curr

      if (prev[customer_id]) {
        const old = prev[customer_id]
        prev[customer_id] = {
          ...old,
          vip_string: old.vip_string.concat(`, ${vip_code} (${value1})`).toString(),
        }
      } else {
        prev[customer_id] = {
          ...curr,
          vip_string: [`${vip_code} (${value1})`].toString(),
        }
      }
      return prev
    }, {})

    const initialValuesVIP = result_vip?.reduce((acc, curr) => {
      acc[curr.vip_code] = {
        ...curr,
        on_vip: curr.on_vip === '1',
      }
      return acc
    }, {})

    return {
      ...initialValuesMain,
      upline: initialValuesUpline,
      vip: initialValuesVIP,
    }
  }, [editCustomerData])
  React.useEffect(() => {
    form.setFieldsValue(initialValues)
  }, [initialValues, form])

  const columns = [
    {
      width: '50px',
      align: 'center',
      render: record => (
        <Form.Item
          name={['vip', record.vip_code, 'on_vip']}
          valuePropName="checked"
          hidden={
            !(
              authId.includes(authorize[`ALLOWED_TO_CHANGE_VIP_CUSTOMER_${record.vip_code}`]) ||
              allowChangeVIPCustomer
            )
          }
        >
          <Checkbox />
        </Form.Item>
      ),
    },
    {
      title: 'VIP Code',
      dataIndex: 'vip_code',
      width: '60px',
    },
    {
      title: 'Rule',
      dataIndex: 'vip_description',
    },
    {
      title: 'Value 1',
      width: 100,
      render: record => (
        <>
          {record.is_show_value === 'Y' && (
            <Form.Item name={['vip', record.vip_code, 'value1']}>
              <InputNumber />
            </Form.Item>
          )}
        </>
      ),
    },
    {
      title: 'Value 2',
      width: 100,
      render: record => (
        <>
          {record.is_show_value2 === 'Y' && (
            <Form.Item name={['vip', record.vip_code, 'value2']}>
              <InputNumber />
            </Form.Item>
          )}
        </>
      ),
    },
  ]

  return (
    <>
      <Spin spinning={loadingData}>
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          id="edit-customer-form"
          className="w-100"
          onFinish={values => {
            const filteredVIPData = Object.entries(values.vip)
              .map(([key, val]) => ({
                vip_code: Number(key),
                ...val,
              }))
              .filter(item => item.on_vip)
              .map(data => `${data.vip_code}^${data.value1 || 0}^${data.value2 || 0}`) // default 0, if not inputtext

            const payload = {
              ...editCustomerData.result_main,
              ...values,
              customer_active_status: values.customer_active_status ? '1' : '0',
              customer_suspend_status: values.customer_suspend_status ? '1' : '0',
              vip: filteredVIPData.join('~'),
            }
            Update(payload, successCallback)
          }}
        >
          {!allowEditCustomerDetail && (
            <Alert message="You are not allowed to edit customer !" type="error" className="mb-1" />
          )}
          <Form.Item label="Customer ID">{editValue.customer_id}</Form.Item>
          <Form.Item label="Username">{editValue.username}</Form.Item>
          <Form.Item label="Alias Name">{editValue.alias_name}</Form.Item>
          <Divider className="my-2" />
          <Row>
            <Col span={1}>
              <Tooltip title="See Master - Cash Category">
                <InfoCircleOutlined />
              </Tooltip>
            </Col>
            <Col span={18}>
              <Form.Item name="cash_category_id" label="Category">
                <Select options={cashCategoryOptions} style={{ width: '150px' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="currency" label="Currency">
            <Select showSearch disabled style={{ width: '150px' }} />
          </Form.Item>
          {editValue.customer_level === 'Member' && editValue.customer_type === 'H' && (
            <Form.Item name="odds_group" label="Odds Group">
              <Select options={oddsGroupOptions} style={{ width: '150px' }} />
            </Form.Item>
          )}
          <Divider className="my-2" />
          <Form.Item name="customer_active_status" label="Is Active" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item name="customer_suspend_status" label="Is Suspend" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Divider className="my-2" />
          <Row>
            <Col span={1}>
              <Tooltip title="Maximum bet multiplied with this figure">
                <InfoCircleOutlined />
              </Tooltip>
            </Col>
            <Col span={18}>
              <Form.Item name="customer_bet_limit_factor" label="Bet Limit Factor">
                <InputNumber min={0.1} max={100} />
              </Form.Item>
            </Col>
          </Row>
          {editValue.customer_level !== 'Shareholder' && (
            <>
              <Form.Item label="Upline VIP Code">
                {initialValues.upline &&
                  Object.entries(initialValues.upline).map(([customer_id, object]) => {
                    return (
                      <div key={customer_id}>
                        <Text>{`${object.username} (${object.customer_level}). VIP Code: ${object.vip_string}`}</Text>
                      </div>
                    )
                  })}
              </Form.Item>
              <Form.Item label="VIP Customer Code">
                <Table
                  rowKey={record => record.vip_code}
                  size="small"
                  dataSource={editCustomerData.result_vip}
                  columns={columns}
                  pagination={false}
                  onRow={record => ({
                    className: record.on_vip === '1' ? 'custom_bg_color_vip' : '',
                  })}
                />
              </Form.Item>
            </>
          )}
          {editValue.customer_level === 'Shareholder' && editValue.customer_type !== 'H' && (
            <>
              <Form.Item name="credit_limit" label="Credit Limit">
                <InputNumber min={0} max={9999999999} />
              </Form.Item>
              <Form.Item label="Used Credit Limit">
                <Amount value={editCustomerData.used_credit_limit} />
              </Form.Item>
            </>
          )}
        </Form>
      </Spin>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCustomer)
