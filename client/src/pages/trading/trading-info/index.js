import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Form, Input, Radio, Row, Table, Typography } from 'antd'
import actions from 'redux/trading-info/actions'
import authEnum from 'authorize'
import { validatorNumeric } from 'helper'

const { Text } = Typography

const mapStateToProps = ({ tradingInfo, auth }) => ({
  tableData: tradingInfo.data,
  matchData: tradingInfo.matchData,
  loading: tradingInfo.loadingData,
  allowEdit: auth.user.user_auth_ids.includes(
    authEnum.TRADER_GROUP_IS_MANAGER ||
      (auth.user.user_auth_ids.includes(authEnum.TRADER_GROUP_IS_SPV) &&
        tradingInfo.data[0]?.trader_group === 'TRADER_GROUP_IS_SPV'),
  ),
})

const mapDispatchToProps = dispatch => ({
  GetMatchTradingInfo: payload =>
    dispatch({
      type: actions.GET_MATCH_TRADING_INFO,
      payload,
      source: 'Trading Info',
    }),
  Load: payload =>
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Trading Info',
    }),
  Create: (payload, successCallback) =>
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: 'Trading Info',
    }),
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const getOrderAHOU = type => {
  switch (type) {
    case 'A':
      return 'Away'
    case 'H':
      return 'Home'
    case 'O':
      return 'Over'
    case 'U':
      return 'Under'
    case 'N':
      return <Text className="text-danger">None</Text>
    default:
      return ''
  }
}
const columns = [
  {
    title: 'No',
    width: 30,
    align: 'center',
    render: (text, record, index) => index + 1,
  },
  {
    title: 'Message',
    dataIndex: 'message',
    width: 500,
  },
  {
    title: 'AH',
    align: 'center',
    dataIndex: 'order_ah',
    width: 90,
    render: text => getOrderAHOU(text),
  },
  {
    title: 'OU',
    align: 'center',
    dataIndex: 'order_ou',
    width: 90,
    render: text => getOrderAHOU(text),
  },
  {
    title: 'Scoreline',
    align: 'center',
    width: 90,
    render: record => `${record.home_posisi} - ${record.away_posisi}`,
  },
  {
    title: 'Stamp Date',
    align: 'center',
    dataIndex: 'stamp_date',
    width: 90,
    render: text => text.formatDateTimeSecond(),
  },
  {
    title: 'Stamp User',
    align: 'center',
    dataIndex: 'stamp_user',
    width: 90,
  },
  {
    title: 'Trader Group',
    align: 'center',
    dataIndex: 'trader_group',
    width: 90,
  },
]
const TradingInfo = ({
  tableData,
  matchData,
  loading,
  Load,
  GetMatchTradingInfo,
  Create,
  allowEdit,
  CleanUp,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const [form] = Form.useForm()
  const [formCreate] = Form.useForm()
  const [submitMatchID, setSubmitMatchID] = React.useState()

  React.useEffect(() => {
    formCreate.setFieldsValue({
      order_ah: tableData[0]?.order_ah,
      order_ou: tableData[0]?.order_ou,
      message: tableData[0]?.message,
    })
  }, [formCreate, tableData])

  const reload = React.useCallback(() => {
    form.submit()
  }, [form])

  return (
    <div className="card">
      <div className="card-header">
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
            <Form
              labelCol={{ span: 6 }}
              form={form}
              id="main-form"
              className="w-100"
              onFinish={values => {
                setSubmitMatchID(values.match_id)
                if (values.match_id !== submitMatchID) {
                  formCreate.resetFields()
                  GetMatchTradingInfo({ match_id: values.match_id })
                }
                Load({ match_id: values.match_id })
              }}
            >
              <Form.Item
                name="match_id"
                label="Match ID"
                wrapperCol={{ span: 6 }}
                rules={[
                  { validatorNumeric },
                  { required: true, message: 'Please input Match ID!' },
                ]}
              >
                <Input className="w-100" />
              </Form.Item>
              <Form.Item label="League">{matchData.league_name}</Form.Item>
              <Form.Item label="Team">
                {matchData.home_name} - {matchData.away_name}
              </Form.Item>
            </Form>
          </Col>
          {allowEdit && matchData?.league_name && (
            <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
              <Form
                form={formCreate}
                className="w-100"
                initialValues={{
                  order_ah: 'N',
                  order_ou: 'N',
                }}
                onFinish={values =>
                  Create(
                    {
                      ...values,
                      match_id: Number(submitMatchID),
                    },
                    reload,
                  )
                }
              >
                <Form.Item name="message" label="Message">
                  <Input />
                </Form.Item>
                <Col offset={3}>
                  <Form.Item name="order_ah">
                    <Radio.Group
                      defaultValue="N"
                      options={[
                        { value: 'N', label: 'None' },
                        { value: 'H', label: 'Home' },
                        { value: 'A', label: 'Away' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col offset={3}>
                  <Form.Item name="order_ou">
                    <Radio.Group
                      defaultValue="N"
                      options={[
                        { value: 'N', label: 'None' },
                        { value: 'O', label: 'Over' },
                        { value: 'U', label: 'Under' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form>
            </Col>
          )}
        </Row>
      </div>
      <div className="card-body">
        <Table
          rowKey="id"
          size="small"
          bordered
          loading={loading}
          dataSource={tableData}
          pagination={false}
          columns={columns}
        />
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TradingInfo)
