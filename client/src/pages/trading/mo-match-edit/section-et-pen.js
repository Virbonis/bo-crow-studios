import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Checkbox, Divider, Form, Space } from 'antd'
import actions from 'redux/mo-match-edit/actions'

const mapStateToProps = ({ moEdit }) => ({
  match: moEdit.data.match,
})
const mapDispatchToProps = dispatch => ({
  UpdateETPEN: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_ET_PEN,
      payload,
      successCallback,
    })
  },
})

const SectionETPEN = ({ match, UpdateETPEN }) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [match, form])

  if (match.st_etpen === 'Y' || match.special_code !== '' || match.match_live_status !== 'Y')
    return null
  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={match}
      onFinish={values => {
        UpdateETPEN({
          match_id: match.match_id,
          ...values,
        })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          + Add ET & PEN
        </Divider>
        <Space direction="vertical" size={0}>
          <Form.Item className="mb-0" name="st_et" valuePropName="checked">
            <Checkbox>ET</Checkbox>
          </Form.Item>
          <Form.Item className="mb-0" name="st_pen" valuePropName="checked">
            <Checkbox>PEN</Checkbox>
          </Form.Item>
        </Space>
        <Divider orientation="right" className="m-0">
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Divider>
      </Card>
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionETPEN)
