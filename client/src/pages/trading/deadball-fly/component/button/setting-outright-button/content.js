import React from 'react'
import { Button, Form, InputNumber } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/trading-floor/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  UpdateOutrightSetting: payload => {
    dispatch({
      type: actions.UPDATE_TRADING_OUTRIGHT_SETTING,
      payload,
      successCallback,
      source: 'Trading Floor',
    })
  },
})
const Content = ({ record, UpdateOutrightSetting }) => {
  const [form] = Form.useForm()
  const { outright_id, max_bet, price_step, limit_change } = record

  React.useEffect(() => {
    form.resetFields()
  }, [form, record])

  return (
    <>
      <Form
        labelCol={{ span: 12 }}
        labelAlign="right"
        form={form}
        initialValues={{
          max_payout: max_bet,
          price_step,
          limit_change,
        }}
        onFinish={values =>
          UpdateOutrightSetting({
            ...values,
            outright_id,
          })
        }
      >
        <Form.Item name="max_payout" label="Max Payout">
          <InputNumber step={0.01} min={0} controls={false} />
        </Form.Item>
        <Form.Item name="price_step" label="Price Step">
          <InputNumber step={1} min={0} controls={false} />
        </Form.Item>
        <Form.Item name="limit_change" label="Price Step">
          <InputNumber step={0.01} min={0} controls={false} />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </>
  )
}

export default connect(null, mapDispatchToProps)(Content)
