import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Checkbox, Divider, Form } from 'antd'
import actions from 'redux/mo-match-edit/actions'

const mapStateToProps = ({ moEdit }) => ({
  match: moEdit.data.match,
})
const mapDispatchToProps = dispatch => ({
  UpdateMatchParlay: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_MATCH_PARLAY,
      payload,
      successCallback,
    })
  },
})

const SectionMatchParlay = ({ match, UpdateMatchParlay }) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [match, form])

  if (match.sport_id !== 10) return null
  return (
    <Form
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={{
        bb_status: match.bb_status === 'Y',
      }}
      onFinish={values => {
        UpdateMatchParlay({
          match_id: match.match_id,
          bb_status: values.bb_status ? 'Y' : 'N',
        })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          Match Parlay
        </Divider>
        <Form.Item label="Status" className="mb-0" name="bb_status" valuePropName="checked">
          <Checkbox disabled={match.is_enable_bb === 'N'} />
        </Form.Item>
        <Divider orientation="right" className="m-0">
          {match.is_enable_bb === 'N' ? null : (
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          )}
        </Divider>
      </Card>
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionMatchParlay)
