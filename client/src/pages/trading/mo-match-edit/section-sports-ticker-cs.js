import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Checkbox, Divider, Form } from 'antd'
import actions from 'redux/mo-match-edit/actions'

const mapStateToProps = ({ moEdit }) => ({
  match: moEdit.data.match,
})
const mapDispatchToProps = dispatch => ({
  UpdateSportsTickerCS: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SPORTS_TICKER_CS,
      payload,
      successCallback,
    })
  },
})

const SectionSportsTickerCs = ({ match, UpdateSportsTickerCS, readOnly }) => {
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
        ...match,
        cs_live_status: match.is_cs_live_bg === 1,
        htcs_live_status: match.is_htcs_live_bg === 1,
      }}
      onFinish={values => {
        if ((match.is_cs_live_bg === 1) !== values.cs_live_status)
          UpdateSportsTickerCS({
            match_id: match.match_id,
            game_type: 1001,
            st_sports_ticker: values.cs_live_status ? 'BG' : '',
          })
        if ((match.is_htcs_live_bg === 1) !== values.htcs_live_status)
          UpdateSportsTickerCS({
            match_id: match.match_id,
            game_type: 1002,
            st_sports_ticker: values.htcs_live_status ? 'BG' : '',
          })
      }}
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          BG
        </Divider>
        <Form.Item
          label="CS (Live) Status"
          className="mb-0"
          name="cs_live_status"
          valuePropName="checked"
        >
          <Checkbox disabled={match.is_allowed_cs_live_bg === 0} />
        </Form.Item>
        <Form.Item
          label="FH. CS (Live) Status"
          className="mb-0"
          name="htcs_live_status"
          valuePropName="checked"
        >
          <Checkbox disabled={match.is_allowed_htcs_live_bg === 0} />
        </Form.Item>
        {!readOnly && (
          <Divider orientation="right" className="m-0">
            {match.is_allowed_cs_live_bg === 0 && match.is_allowed_htcs_live_bg === 0 ? null : (
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

export default connect(mapStateToProps, mapDispatchToProps)(SectionSportsTickerCs)
