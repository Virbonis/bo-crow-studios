import React from 'react'
import { Form } from 'antd'
import { getValidatorOdds } from 'helper'
import { InputDecimal } from 'components/blaise'

export const FormItemOdds = ({ name, asOddsX = false, game_type }) => {
  return (
    <Form.Item
      name={name}
      labelCol={{
        span: 0,
      }}
      wrapperCol={{
        span: 24,
      }}
      rules={[{ validator: getValidatorOdds(game_type) }]}
    >
      {/* <InputNumber
        controls={false}
        className={`input-center ${asOddsX ? 'asOddsX' : ''}`}
        maxLength={6}
        step={0.01}
        style={{ width: '60px' }}
      /> */}
      <InputDecimal className={`${asOddsX && 'asOddsX'}`} />
    </Form.Item>
  )
}

export default FormItemOdds
