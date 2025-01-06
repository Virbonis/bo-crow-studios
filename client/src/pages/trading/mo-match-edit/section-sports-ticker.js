import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Checkbox, Divider, Form } from 'antd'
import actions from 'redux/mo-match-edit/actions'

const mapStateToProps = ({ moEdit }) => ({
  match: moEdit.data.match,
})
const mapDispatchToProps = dispatch => ({
  UpdateSportsTicker: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SPORTS_TICKER,
      payload,
      successCallback,
    })
  },
})

const SectionSportsTicker = ({ match, UpdateSportsTicker, readOnly }) => {
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
        rb_status: match.st_sports_ticker === 'RB',
        bg_status: match.st_sports_ticker === 'BG',
      }}
      onFinish={values => {
        UpdateSportsTicker({
          match_id: match.match_id,
          st_sports_ticker: values.rb_status ? 'RB' : values.bg_status ? 'BG' : '', // eslint-disable-line no-nested-ternary
        })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          RBall & BG
        </Divider>
        <Form.Item label="RBall Status" className="mb-0" name="rb_status" valuePropName="checked">
          <Checkbox disabled={match.rb_status === 'N'} />
        </Form.Item>
        <Form.Item label="BG Status" className="mb-0" name="bg_status" valuePropName="checked">
          <Checkbox disabled={match.bg_status === 'N'} />
        </Form.Item>
        {!readOnly && (
          <Divider orientation="right" className="m-0">
            {match.bg_status === 'N' && match.rb_status === 'N' ? null : (
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            )}
          </Divider>
        )}
      </Card>
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionSportsTicker)
