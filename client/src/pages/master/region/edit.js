import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, InputNumber, Select } from 'antd'
import actions from 'redux/region/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapDispatchToProps = dispatch => ({
  Edit: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Master Region',
    })
  },
})

const CreateRegion = ({ editValue, successCallback, Edit }) => {
  const [form] = Form.useForm()
  const { flagOptions } = useSelectOptions()
  return (
    <>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        layout="horizontal"
        form={form}
        initialValues={editValue}
        onFinish={value => {
          Edit({ ...value, region_id: editValue.region_id }, successCallback)
        }}
        id="add-form"
      >
        <Form.Item name="sort_number" label="Sort Number">
          <InputNumber className="w-100" />
        </Form.Item>
        <Form.Item name="english" label="English">
          <Input type="text" className="w-100" placeholder="English name" />
        </Form.Item>
        <Form.Item name="mandarin" label="Mandarin">
          <Input type="text" className="w-100" placeholder="Mandarin name" />
        </Form.Item>
        <Form.Item name="taiwan" label="Taiwan">
          <Input type="text" className="w-100" placeholder="Taiwan name" />
        </Form.Item>
        <Form.Item name="thailand" label="Thailand">
          <Input type="text" className="w-100" placeholder="Thailand name" />
        </Form.Item>
        <Form.Item name="japanese" label="Japanese">
          <Input type="text" className="w-100" placeholder="Japanese name" />
        </Form.Item>
        <Form.Item name="korean" label="Korean">
          <Input type="text" className="w-100" placeholder="Korean name" />
        </Form.Item>
        <Form.Item name="vietnamese" label="Vietnamese">
          <Input type="text" className="w-100" placeholder="Vietnamese name" />
        </Form.Item>
        <Form.Item name="indonesia" label="Indonesia">
          <Input type="text" className="w-100" placeholder="Indonesia name" />
        </Form.Item>
        <Form.Item name="flag_id" label="Flag Image">
          <Select
            showSearch
            allowClear
            placeholder="Select a flag"
            options={flagOptions}
            optionRender={option => option.data.render}
          />
        </Form.Item>
      </Form>
    </>
  )
}

export default connect(null, mapDispatchToProps)(CreateRegion)
