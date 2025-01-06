import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Checkbox, Divider, Form } from 'antd'
import actions from 'redux/mo-match-edit/actions'

const mapStateToProps = ({ moEdit }) => ({
  match: moEdit.data.match,
})
const mapDispatchToProps = dispatch => ({
  UpdateAutoProcessBetBazar: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_AUTO_PROCESS_BETBAZAR,
      payload,
      successCallback,
    })
  },
})

const SectionAutoProcessBetbazar = ({ match, UpdateAutoProcessBetBazar }) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [match, form])

  if (!match.is_autoprocess_betbazar) return null
  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{
        is_autoprocess_betbazar: match.is_autoprocess_betbazar === 'Y',
      }}
      onFinish={() => {
        UpdateAutoProcessBetBazar({
          match_id: match.match_id,
          is_autoprocess_betbazar: match.is_autoprocess_betbazar === 'Y' ? 'N' : 'Y', // reverse
        })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          Auto Process BetBazar
        </Divider>
        <Form.Item
          label="Status"
          className="mb-0"
          name="is_autoprocess_betbazar"
          valuePropName="checked"
        >
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

export default connect(mapStateToProps, mapDispatchToProps)(SectionAutoProcessBetbazar)
