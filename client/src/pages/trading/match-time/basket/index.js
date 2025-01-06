import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/basket-timer/actions'
import { Button, Form, Select, Space, InputNumber } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { range } from 'lodash'
import QueryBasketTimer from './query'

const mapDispatchToProps = (dispatch, ownProps) => ({
  UpdateBasketTimer: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_BASKET_TIMER,
      payload,
      successCallback,
    })
  },
  UpdateAdjustBasketTimer: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_ADJUST_BASKET_TIMER,
      payload,
      successCallback: () => {
        ownProps.successCallback()
        successCallback()
      },
    })
  },
})

const BasketTimer = ({ editValue, UpdateBasketTimer, UpdateAdjustBasketTimer }) => {
  const { match_id } = editValue
  const [interval, setInterval] = React.useState(0)
  const { data = {}, isFetching, refetch } = QueryBasketTimer({
    match_id,
    interval,
  })

  const [form] = Form.useForm()
  React.useEffect(() => form.resetFields(), [data, form])

  const onClickBasketTimer = React.useCallback(
    timerCode => () =>
      UpdateBasketTimer(
        {
          match_id,
          timer_code: timerCode,
        },
        () => {
          if (timerCode === 'N') setInterval(3000)
          else setInterval(0)
          refetch()
        },
      ),
    [match_id, UpdateBasketTimer, setInterval, refetch],
  )

  const onChangeMatchRound = () => {
    form.setFieldsValue({
      minutes: 0,
      seconds: 0,
    })
  }

  return (
    <Form
      form={form}
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={data}
      onFinish={values => {
        UpdateAdjustBasketTimer(
          {
            match_id,
            ...values,
          },
          refetch,
        )
      }}
    >
      <Form.Item wrapperCol={{ offset: 8 }} className="mb-0">
        <Space>
          <Button size="small" loading={isFetching} icon={<ReloadOutlined />} onClick={refetch}>
            Refresh
          </Button>
          <Select
            style={{ width: 75 }}
            size="small"
            options={[
              { value: 0, label: 'None' },
              { value: 3, label: '3' },
              { value: 5, label: '5' },
              { value: 10, label: '10' },
              { value: 15, label: '15' },
              { value: 30, label: '30' },
              { value: 60, label: '60' },
            ]}
            value={interval}
            onChange={value => setInterval(value)}
          />
        </Space>
      </Form.Item>
      <Form.Item label="Timer">
        <Space>
          <Button
            size="small"
            className={data.st_stop_timer === 'N' ? 'bg-green text-white' : ''}
            onClick={onClickBasketTimer('N')}
          >
            Start
          </Button>
          <Button
            size="small"
            className={data.st_stop_timer === 'Y' ? 'bg-red text-white' : ''}
            onClick={onClickBasketTimer('Y')}
          >
            Pause
          </Button>
          <Button
            size="small"
            className={data.st_stop_timer === 'T' ? 'bg-blue text-white' : ''}
            onClick={onClickBasketTimer('T')}
          >
            Timeout
          </Button>
        </Space>
      </Form.Item>
      <Form.Item name="match_round" label="Round" className="mb-0">
        <Select
          onChange={onChangeMatchRound}
          options={[
            { value: 0, label: 'Not Played' },
            { value: 2, label: 'HT' },
            { value: 11, label: 'Q1' },
            { value: 12, label: 'Q2' },
            { value: 13, label: 'Q3' },
            { value: 14, label: 'Q4' },
            { value: 15, label: '1H' },
            { value: 16, label: '2H' },
            { value: 19, label: 'OT' },
          ]}
        />
      </Form.Item>
      <Form.Item name="minutes" label="Minutes" className="mb-0">
        <Select options={range(0, 21).map(i => ({ value: i, label: i }))} />
      </Form.Item>
      <Form.Item name="seconds" label="Seconds" className="mb-0">
        <InputNumber />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8 }}>
        <Button size="small" type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
export default connect(null, mapDispatchToProps)(BasketTimer)
