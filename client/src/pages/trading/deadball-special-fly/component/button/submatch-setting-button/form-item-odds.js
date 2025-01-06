import React from 'react'
import { Form } from 'antd'
import { getValidatorOdds } from 'helper'
import { InputDecimal } from 'components/blaise'

const FormItemOdds = ({ name, asOddsX = false, game_type }) => {
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
      <InputDecimal className={`${asOddsX && 'asOddsX'}`} />
    </Form.Item>
  )
}

export default FormItemOdds
