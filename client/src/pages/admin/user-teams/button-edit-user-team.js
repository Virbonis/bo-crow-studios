import React from 'react'
import { Button, Switch, Drawer, Form, Input, Space, Tooltip } from 'antd'
import actions from 'redux/user-team/actions'
import { connect } from 'react-redux'
import { EditOutlined } from '@ant-design/icons'

const mapDispatchToProps = dispatch => ({
  UpdateUserTeam: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_USER_TEAM,
      payload,
      successCallback,
      source: 'User Team',
    })
  },
})

const ButtonEditUserTeam = ({ data, UpdateUserTeam, successCallback }) => {
  const [visibleEdit, setVisibleEdit] = React.useState(false)

  return (
    <>
      <Tooltip placement="top" title="Edit">
        <Button
          icon={<EditOutlined />}
          type="link"
          onClick={() => {
            setVisibleEdit(true)
          }}
        />
      </Tooltip>
      <Drawer
        title="Edit Team"
        width="30%"
        onClose={() => setVisibleEdit(false)}
        open={visibleEdit}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleEdit(false)}>Cancel</Button>
            <Button form="edit-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          id="edit-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          labelAlign="left"
          onFinish={values => {
            UpdateUserTeam(
              {
                team_name: values.team_name.toUpperCase(),
                is_active: values.is_active ? 'Y' : 'N',
                team_id: data.team_id,
              },
              () => {
                successCallback()
                setVisibleEdit(false)
              },
            )
          }}
          initialValues={{
            ...data,
            is_active: data.is_active === 'Y',
          }}
        >
          <Form.Item
            label="Team Name"
            labelAlign="left"
            labelCol={{ span: 8 }}
            name="team_name"
            rules={[
              {
                required: true,
                min: 5,
                message: 'Min 5 character',
              },
              {
                max: 50,
                message: 'Max 50 character',
              },
              {
                pattern: /^[a-zA-Z0-9_.\s]+$/,
                message: 'Only alphanumeric, space, dot and underscore',
              },
            ]}
          >
            <Input style={{ textTransform: 'uppercase' }} />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 8 }}
            labelAlign="left"
            label="Is Active"
            valuePropName="checked"
            name="is_active"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default connect(null, mapDispatchToProps)(ButtonEditUserTeam)
