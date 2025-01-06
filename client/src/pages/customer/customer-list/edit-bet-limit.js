import { Alert, Descriptions, Divider, Form, InputNumber, Row, Select, Spin, Table } from 'antd'
import authorize from 'authorize'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import actions from 'redux/customer-list/actions'

const mapStateToProps = ({
  customerList,
  sport,
  auth: {
    user: { user_auth_ids: authIds },
  },
}) => ({
  loadingData: customerList.loadingDrawer,
  sportList: sport.select,
  limitProfileOptions: customerList.limitProfile.map(data => ({
    value: data.profile_id,
    label: data.profile_id,
  })),
  betLimit: customerList.betLimitData,
  betLimitSport: customerList.betLimitDataBySport,
  allowEditCustomerBetLimit: !authIds.includes(authorize.DISALLOW_EDIT_CUSTOMER_BET_LIMIT),
})

const mapDispatchToProps = dispatch => ({
  LoadLimitProfile: payload => {
    dispatch({
      type: actions.LOAD_LIMIT_PROFILE,
      payload,
      source: 'Limit Profile',
    })
  },
  Load: payload => {
    dispatch({
      type: actions.LOAD_CUSTOMER_BET_LIMIT,
      payload,
      source: 'Customer List',
    })
  },
  LoadBySport: payload => {
    dispatch({
      type: actions.LOAD_CUSTOMER_BET_LIMIT_BY_SPORT,
      payload,
      source: 'Customer List',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_CUSTOMER_BET_LIMIT,
      payload,
      successCallback,
      source: 'Customer List',
    })
  },
  UpdateBySport: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_CUSTOMER_BET_LIMIT_BY_SPORT,
      payload,
      successCallback,
      source: 'Customer List',
    })
  },
})

const EditBetLimit = ({
  editValue,
  loadingData,
  sportList,
  limitProfileOptions,
  betLimit,
  betLimitSport,
  allowEditCustomerBetLimit,

  LoadLimitProfile,
  Load,
  LoadBySport,
  Update,
  UpdateBySport,
  successCallback,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    Load(editValue)
    if (editValue.customer_type === 'H') LoadLimitProfile(editValue)
    else LoadBySport(editValue)
  }, [editValue, Load, LoadLimitProfile, LoadBySport])

  useEffect(() => {
    if (editValue.customer_type === 'H')
      form.setFieldsValue({
        limit_profile_id: editValue.limit_profile_id,
      })
  }, [editValue, form])
  useEffect(() => {
    const initialValues = betLimitSport.reduce((acc, cur) => {
      acc[cur.sport_id] = cur
      return acc
    }, {})
    form.setFieldsValue(initialValues)
  }, [form, betLimitSport])

  const columns = [
    {
      title: 'Sport',
      render: record =>
        sportList.find(x => x.sport_id === Number(record.sport_id))?.name || 'Default',
    },
    {
      render: () => (
        <>
          <Row>Min Bet</Row>
          <Row>Max Bet</Row>
          <Row>Match Limit</Row>
        </>
      ),
    },
    {
      title: 'Default',
      align: 'center',
      width: '80px',
      render: ({ sport_id }) => (
        <>
          <Row align="center">
            <Form.Item name={[sport_id, 'min_ah']}>
              <InputNumber
                align="right"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
                max={999999999999}
                style={{ width: '120px' }}
              />
            </Form.Item>
          </Row>
          <Row align="center">
            <Form.Item name={[sport_id, 'max_ah']}>
              <InputNumber
                align="right"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
                max={999999999999}
                style={{ width: '120px' }}
              />
            </Form.Item>
          </Row>
          <Row align="center">
            <Form.Item name={[sport_id, 'limit_ah']}>
              <InputNumber
                align="right"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
                max={999999999999}
                style={{ width: '120px' }}
              />
            </Form.Item>
          </Row>
        </>
      ),
    },
  ]

  return (
    <>
      {editValue?.customer_type === 'H' && !allowEditCustomerBetLimit && (
        <Alert
          message="You are not allowed to edit customer bet limit !"
          type="error"
          className="mb-1"
        />
      )}
      <Descriptions size="small" column={1} bordered>
        <Descriptions.Item label="Customer ID">{editValue.customer_id}</Descriptions.Item>
        <Descriptions.Item label="Username">{editValue.username}</Descriptions.Item>
        <Descriptions.Item label="Currency">{editValue.currency}</Descriptions.Item>
      </Descriptions>

      {editValue.customer_type === 'H' && (
        <>
          <Divider className="my-2" />
          <Spin spinning={loadingData}>
            <Form
              labelAlign="left"
              form={form}
              labelCol={{ span: 11 }}
              wrapperCol={{ span: 13 }}
              id="edit-bet-limit-form"
              onFinish={value => {
                Update(
                  { ...betLimit, ...value, customer_id: editValue.customer_id },
                  successCallback,
                )
              }}
            >
              <Form.Item
                name="limit_profile_id"
                label="Limit Profile"
                extra="*Change Limit Profile will Force Logoff the member"
              >
                <Select options={limitProfileOptions} />
              </Form.Item>
            </Form>
          </Spin>
        </>
      )}
      {editValue.customer_type !== 'H' && (
        <>
          <Divider className="my-2" />
          <Form
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            id="edit-bet-limit-form"
            onFinish={values => {
              const payload = Object.entries(values).map(([sportId, value]) => ({
                ...value,
                customer_id: editValue.customer_id,
                sport_id: Number(sportId),
              }))

              UpdateBySport(payload, successCallback)
            }}
          >
            <Table
              rowKey={record => record.sport_id}
              size="small"
              loading={loadingData}
              dataSource={betLimitSport}
              columns={columns}
              pagination={false}
            />
          </Form>
        </>
      )}
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBetLimit)
