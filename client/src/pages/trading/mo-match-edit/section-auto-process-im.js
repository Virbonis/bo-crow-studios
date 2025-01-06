import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Checkbox, Divider, Form } from 'antd'
import actions from 'redux/mo-match-edit/actions'

const mapStateToProps = ({ moEdit }) => ({
  match: moEdit.data.match,
})
const mapDispatchToProps = dispatch => ({
  UpdateAutoProcessIM: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_AUTO_PROCESS_IM,
      payload,
      successCallback,
    })
  },
})

const AutoProcessIM = ({ match, UpdateAutoProcessIM }) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [match, form])

  if (!match.is_autoprocess_im) return null
  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{
        is_autoprocess_im: match.is_autoprocess_im === 'Y',
      }}
      onFinish={() => {
        UpdateAutoProcessIM({
          match_id: match.match_id,
          is_autoprocess_im: match.is_autoprocess_im === 'Y' ? 'N' : 'Y', // reverse
        })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          Auto Process IM
        </Divider>
        <Form.Item label="Status" className="mb-0" name="is_autoprocess_im" valuePropName="checked">
          <Checkbox disabled />
        </Form.Item>
        <Divider orientation="right" className="m-0">
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Divider>
      </Card>
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoProcessIM)
