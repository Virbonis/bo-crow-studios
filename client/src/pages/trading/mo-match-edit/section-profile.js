import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Divider, Form, Select } from 'antd'
import actions from 'redux/mo-match-edit/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapStateToProps = ({ moEdit }) => ({
  match: moEdit.data.match,
})
const mapDispatchToProps = dispatch => ({
  UpdateProfile: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_PROFILE,
      payload,
      successCallback,
    })
  },
})
const SectionProfile = ({ match, UpdateProfile, readOnly }) => {
  const { profileOptions } = useSelectOptions()

  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [match, form])

  return (
    <Form
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={{
        ...match,
        profile_id: match.limit_id,
      }}
      onFinish={values => {
        if (match.limit_id !== values.profile_id)
          UpdateProfile({
            match_id: match.match_id,
            ...values,
          })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          Profile
        </Divider>

        <Form.Item label="Profile" className="mb-0" name="profile_id">
          <Select showSearch options={profileOptions} optionFilterProp="label" />
        </Form.Item>
        {!readOnly && (
          <Divider orientation="right" className="m-0">
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Divider>
        )}
      </Card>
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionProfile)
