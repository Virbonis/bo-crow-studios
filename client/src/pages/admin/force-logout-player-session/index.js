import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Form, Space } from 'antd'
import actions from 'redux/force-logout-player-session/actions'
import { SelectMultipleAll } from 'components/blaise'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapDispatchToProps = dispatch => ({
  Update: payload =>
    dispatch({
      type: actions.UPDATE,
      payload,
      source: 'Force Logout Player Session',
    }),
})

const ForceLogoutPlayerSession = ({ Update }) => {
  const [form] = Form.useForm()
  const { branchOptions } = useSelectOptions()

  return (
    <div className="card">
      <div className="card-body">
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 24 }}
          onFinish={values =>
            Update({
              branch_ids: values.branch_ids.toString(),
            })
          }
        >
          <Space direction="vertical" size={3}>
            <Form.Item name="branch_ids" label="Branch ID" rules={[{ required: true }]}>
              <SelectMultipleAll
                placeholder="Select Branch"
                options={branchOptions}
                optionAll={{ value: 'ALL', label: 'All Branch' }}
                isOptionAllSelectable
                style={{ width: 400 }}
              />
            </Form.Item>
            <Col offset={4}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Col>
          </Space>
        </Form>
      </div>
    </div>
  )
}

export default connect(null, mapDispatchToProps)(ForceLogoutPlayerSession)
