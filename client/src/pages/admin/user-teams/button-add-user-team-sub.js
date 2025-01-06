import { Button, Drawer, Input, Form, Space } from 'antd'
import React from 'react'
import actions from 'redux/user-team/actions'
import { connect } from 'react-redux'
import { PlusOutlined } from '@ant-design/icons'

const mapDispatchToProps = dispatch => ({
  AddUserTeamSub: (payload, successCallback) => {
    dispatch({
      type: actions.ADD_USER_TEAM_SUB,
      payload,
      source: 'User Team',
      successCallback,
    })
  },
})

const ButtonAddUserTeamSub = ({ team_id, AddUserTeamSub, successCallback }) => {
  const [visibleAddUser, setVisibleAddUser] = React.useState(false)

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={() => setVisibleAddUser(true)}>
        Create
      </Button>
      <Drawer
        title="Add User Team Sub"
        destroyOnClose
        onClose={() => setVisibleAddUser(false)}
        open={visibleAddUser}
        width="30%"
        footer={
          <Space>
            <Button onClick={() => setVisibleAddUser(false)}>Cancel</Button>
            <Button form="form-add-user" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          id="form-add-user"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          labelAlign="left"
          onFinish={values => {
            AddUserTeamSub({ ...values, team_id }, () => {
              successCallback()
              setVisibleAddUser(false)
            })
          }}
        >
          <Form.Item
            name="team_sub_name"
            label="Team Name"
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

export default connect(null, mapDispatchToProps)(ButtonAddUserTeamSub)
