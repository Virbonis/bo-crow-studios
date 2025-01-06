import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select } from 'antd'
import actions from 'redux/team/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { validatorSingleQuote, validatorTrim } from 'helper'

const mapDispatchToProps = dispatch => ({
  Create: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: 'Master Team',
    })
  },
})

const CreateTeam = ({ successCallback, Create }) => {
  const { sportOptions } = useSelectOptions()
  const [form] = Form.useForm()
  return (
    <>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        layout="horizontal"
        form={form}
        onFinish={value => {
          Create(value, successCallback)
        }}
        id="add-form"
        initialValues={{
          active: 'Y',
        }}
      >
        <Form.Item name="sport_id" label="Sport" rules={[{ required: true }]}>
          <Select placeholder="Select Sport" showSearch className="w-100" options={sportOptions} />
        </Form.Item>
        <Form.Item
          name="team_name_en"
          label="English"
          rules={[
            { required: true, message: 'Please input English Name' },
            { validator: validatorSingleQuote },
            { validator: validatorTrim },
          ]}
        >
          <Input type="text" className="w-100" placeholder="English name" />
        </Form.Item>
        <Form.Item
          name="shortname"
          label="Shortname"
          rules={[
            { required: true },
            { validator: validatorSingleQuote },
            { validator: validatorTrim },
          ]}
        >
          <Input type="text" className="w-100" placeholder="Shortname" />
        </Form.Item>
        <Form.Item name="active" label="Active" className="w-100">
          <Select
            placeholder="Select Active"
            showSearch
            className="w-100"
            options={[
              { label: 'Active', value: 'Y' },
              { label: 'Disabled', value: 'N' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="team_name_cn"
          label="Mandarin"
          rules={[{ validator: validatorSingleQuote }, { validator: validatorTrim }]}
        >
          <Input type="text" className="w-100" placeholder="Mandarin name" />
        </Form.Item>
        <Form.Item
          name="team_name_tw"
          label="Taiwan"
          rules={[{ validator: validatorSingleQuote }, { validator: validatorTrim }]}
        >
          <Input type="text" className="w-100" placeholder="Taiwan name" />
        </Form.Item>
        <Form.Item
          name="team_name_th"
          label="Thailand"
          rules={[{ validator: validatorSingleQuote }, { validator: validatorTrim }]}
        >
          <Input type="text" className="w-100" placeholder="Thailand name" />
        </Form.Item>
        <Form.Item
          name="team_name_jp"
          label="Japanese"
          rules={[{ validator: validatorSingleQuote }, { validator: validatorTrim }]}
        >
          <Input type="text" className="w-100" placeholder="Japanese name" />
        </Form.Item>
        <Form.Item
          name="team_name_kr"
          label="Korean"
          rules={[{ validator: validatorSingleQuote }, { validator: validatorTrim }]}
        >
          <Input type="text" className="w-100" placeholder="Korean name" />
        </Form.Item>
        <Form.Item
          name="team_name_vn"
          label="Vietnamese"
          rules={[{ validator: validatorSingleQuote }, { validator: validatorTrim }]}
        >
          <Input type="text" className="w-100" placeholder="Vietnamese name" />
        </Form.Item>
        <Form.Item
          name="team_name_id"
          label="Indonesia"
          rules={[{ validator: validatorSingleQuote }, { validator: validatorTrim }]}
        >
          <Input type="text" className="w-100" placeholder="Indonesia name" />
        </Form.Item>
      </Form>
    </>
  )
}

export default connect(null, mapDispatchToProps)(CreateTeam)
