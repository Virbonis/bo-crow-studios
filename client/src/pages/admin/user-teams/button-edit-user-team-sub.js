import React from 'react'
import { Button, Drawer, Form, Input, Space, Tooltip } from 'antd'
import actions from 'redux/user-team/actions'
import { connect } from 'react-redux'
import { EditOutlined } from '@ant-design/icons'

const mapDispatchToProps = dispatch => ({
  UpdateUserTeamSub: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_USER_TEAM_SUB,
      payload,
      successCallback,
      source: 'User Team',
    })
  },
})

const ButtonEditUserTeamSub = ({ data, UpdateUserTeamSub, successCallback }) => {
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
        title="Edit Team Sub"
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
          onFinish={values => {
            UpdateUserTeamSub(
              {
                ...values,
                team_id: data.user_team_sub_id,
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
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default connect(null, mapDispatchToProps)(ButtonEditUserTeamSub)
