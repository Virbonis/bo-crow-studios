import { Form, InputNumber } from 'antd'
import { connect } from 'react-redux'
import React, { useEffect } from 'react'
import actions from 'redux/standings/actions'

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Standings',
    })
  },
})

const EditForm = ({ editData, successCallback, Update }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(editData)
  }, [form, editData])

  return (
    <>
      <Form
        id="edit-form"
        className="w-100"
        labelAlign="left"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        onFinish={values => {
          Update({ ...editData, ...values }, successCallback)
        }}
      >
        <Form.Item label="Category">{editData.category}</Form.Item>
        <Form.Item label="Group Name">{editData.group_name}</Form.Item>
        <Form.Item label="Sort Number" name="sort_number" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Team Name">{editData.name_team_en}</Form.Item>
        <Form.Item label="Play" name="play" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Win" name="win" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Draw" name="draw" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Lose" name="lose" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Goal" name="goal" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Conceded" name="conceded" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Points" name="points" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </>
  )
}

export default connect(null, mapDispatchToProps)(EditForm)
