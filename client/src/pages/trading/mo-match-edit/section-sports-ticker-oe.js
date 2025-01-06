import React from 'react'
import { connect } from 'react-redux'
import { Button, Card, Checkbox, Divider, Form } from 'antd'
import actions from 'redux/mo-match-edit/actions'

const mapStateToProps = ({ moEdit }) => ({
  display_admin: moEdit.editValue.display_admin,
  game_type: moEdit.editValue.game_type,
  match: moEdit.data.match,
})
const mapDispatchToProps = dispatch => ({
  UpdateSportsTickerOE: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SPORTS_TICKER_OE,
      payload,
      successCallback,
    })
  },
})

const SectionSportsTickerOE = ({ display_admin, game_type, match, UpdateSportsTickerOE }) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    form.resetFields()
  }, [match, form])

  const display_time = display_admin > 30 ? 'HT' : 'FT'

  return (
    <Form
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={{
        ...match,
        oebg_status: match.is_oebg_live_bg === 1,
      }}
      onFinish={values =>
        UpdateSportsTickerOE({
          match_id: match.match_id,
          game_type,
          st_sports_ticker: values.oebg_status ? 'BG' : '',
        })
      }
    >
      <Card size="small">
        <Divider orientation="left" className="m-0">
          BG
        </Divider>
        <Form.Item
          label={`${display_time} OE (Live) Status`}
          className="mb-0"
          name="oebg_status"
          valuePropName="checked"
        >
          <Checkbox disabled={match.is_enable_oe_bg !== 1} />
        </Form.Item>
        <Divider orientation="right" className="m-0">
          {match.is_enable_oe_bg === 1 && (
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          )}
        </Divider>
      </Card>
    </Form>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(SectionSportsTickerOE)
