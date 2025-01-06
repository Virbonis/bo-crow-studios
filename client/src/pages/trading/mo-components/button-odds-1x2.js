import React from 'react'
import { Button, Modal, Form, Select, Row, Col, Space, Checkbox } from 'antd'
import InputDecimal from 'components/blaise/custom/InputDecimal'
import { countOdds1X2, countOddsMargin } from 'helper'
import { Amount } from 'components/blaise'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import actionsMO from 'redux/mo5/actions'
import { connect } from 'react-redux'

const mapDispatchToProps = dispatch => ({
  ChangeLock: (payload, successCallback) => {
    dispatch({
      type: actionsMO.CHANGE_LOCK_1X2,
      payload,
      successCallback,
    })
  },
  ChangeOdds1X2: (payload, successCallback) => {
    dispatch({
      type: actionsMO.CHANGE_ODDS_1X2,
      payload,
      successCallback,
    })
  },
})

const ButtonOdds1X2 = ({
  match_id,
  sub_match_id,
  odds_home,
  odds_away,
  odds_draw,
  last_change_odds_home,
  last_change_odds_away,
  last_change_odds_draw,
  alert_trader_odds_home,
  alert_trader_odds_away,
  alert_trader_odds_draw,
  spread,
  profile,
  st_auto_calc_odds,
  lock_shift,
  successCallback,
  ChangeLock,
  ChangeOdds1X2,
  textOnly = false,
}) => {
  const alertHClass =
    last_change_odds_home === 1 && alert_trader_odds_home === 1 ? 'bg-light-red' : ''
  const alertAClass =
    last_change_odds_away === 1 && alert_trader_odds_away === 1 ? 'bg-light-green' : ''
  const alertDClass =
    last_change_odds_draw === 1 && alert_trader_odds_draw === 1 ? 'bg-light-yellow' : ''

  const [open, setVisible] = React.useState(false)
  const focusInputRef = React.useRef()

  const onClickOdds1X2 = focusInput => {
    setVisible(true)
    focusInputRef.current = focusInput
  }
  const closeDrawer = () => setVisible(false)
  const data = {
    match_id,
    sub_match_id,
    st_auto_calc_odds,

    odds_home,
    odds_draw,
    odds_away,
    spread,
    profile,
    lock_shift,
  }

  return (
    <div className="w-100 d-flex justify-content-between align-items-center">
      <button
        size="small"
        type="button"
        className={`${alertHClass} p-0 w-100 mo_btn font-weight-bold`}
        onClick={() => onClickOdds1X2('home')}
      >
        {odds_home}
      </button>
      <button
        size="small"
        type="button"
        className={`${alertAClass} p-0 w-100 mo_btn font-weight-bold`}
        onClick={() => onClickOdds1X2('away')}
      >
        {odds_away}
      </button>
      <button
        size="small"
        type="button"
        className={`${alertDClass} p-0 w-100 mo_btn font-weight-bold`}
        onClick={() => onClickOdds1X2('draw')}
      >
        {odds_draw}
      </button>
      {open && (
        <Modal title="1X2" open={open} onCancel={closeDrawer} footer={null} destroyOnClose>
          <FormOdds1X2
            focusInput={focusInputRef.current}
            data={data}
            textOnly={textOnly}
            successCallback={() => {
              successCallback()
              closeDrawer()
            }}
            closeDrawer={closeDrawer}
            ChangeLock={ChangeLock}
            ChangeOdds1X2={ChangeOdds1X2}
          />
        </Modal>
      )}
    </div>
  )
}
export default connect(null, mapDispatchToProps)(ButtonOdds1X2)

const FormOdds1X2 = ({
  focusInput,
  data,
  textOnly = false,
  successCallback,
  ChangeLock,
  ChangeOdds1X2,
}) => {
  const [form] = Form.useForm()
  const refHome = React.useRef()
  const refAway = React.useRef()
  const refDraw = React.useRef()

  setTimeout(() => {
    if (focusInput === 'home') refHome.current.select()
    else if (focusInput === 'away') refAway.current.select()
    else if (focusInput === 'draw') refDraw.current.select()
    // else refHome.current.select()
  }, 50)

  React.useEffect(() => {
    form.resetFields()
  }, [form])

  const isAutoOdds = data.st_auto_calc_odds === 'Y'
  const { profile1x2Options } = useSelectOptions()

  const onValuesChange = (changedValues, allValues) => {
    const fieldName = Object.keys(changedValues)[0]
    if (['odds_home', 'odds_draw', 'odds_away', 'spread'].includes(fieldName)) {
      // home=odds1, draw=odds2, away=odds3
      const { odds_home, odds_draw, odds_away, spread } = allValues
      form.setFieldsValue({
        odds_margin: countOddsMargin([odds_home, odds_away, odds_draw]),
        previewOdds: countOdds1X2(odds_home, odds_draw, odds_away, spread),
      })
    }
  }

  const setZeroOdds = () =>
    form.setFieldsValue({
      odds_home: 0,
      odds_away: 0,
      odds_draw: 0,
    })
  return (
    <Form
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={{
        ...data,
        odds_margin: countOddsMargin([data.odds_home, data.odds_draw, data.odds_away]),
        previewOdds: countOdds1X2(data.odds_home, data.odds_draw, data.odds_away, data.spread),
      }}
      onFinish={values => {
        if (values.lock_shift !== data.lock_shift) {
          ChangeLock(
            {
              match_id: data.match_id,
              sub_match_id: data.sub_match_id,
              link_odds_diff_lock: values.lock_shift ? 1 : 0,
            },
            successCallback,
          )
        } else {
          ChangeOdds1X2(
            {
              match_id: data.match_id,
              sub_match_id: data.sub_match_id,
              odds1: values.odds_home,
              odds2: values.odds_draw,
              odds3: values.odds_away,
              profile: values.profile,
              spread: values.spread,
            },
            successCallback,
          )
        }
      }}
      onValuesChange={onValuesChange}
    >
      <Row>
        <Col span={12}>
          <Form.Item label="Home" className="mb-0">
            <Space>
              <Form.Item name="odds_home" noStyle>
                <InputDecimal ref={refHome} disabled={isAutoOdds || textOnly} />
              </Form.Item>
              <Form.Item name={['previewOdds', 0]} noStyle>
                <Amount />
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item label="Away" className="mb-0">
            <Space>
              <Form.Item name="odds_away" noStyle>
                <InputDecimal ref={refAway} disabled={isAutoOdds || textOnly} />
              </Form.Item>
              <Form.Item name={['previewOdds', 2]} noStyle>
                <Amount />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="Draw" className="mb-0">
            <Space>
              <Form.Item name="odds_draw" noStyle>
                <InputDecimal ref={refDraw} disabled={isAutoOdds || textOnly} />
              </Form.Item>
              <Form.Item name={['previewOdds', 1]} noStyle>
                <Amount />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="Margin" name="odds_margin" className="mb-0">
            <Amount />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Spread" name="spread">
            <InputDecimal disabled={textOnly} />
          </Form.Item>
          <Form.Item label="Lock" name="lock_shift" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item label="Profile 1X2" name="profile">
            <Select
              placeholder="Select Profile"
              options={profile1x2Options}
              optionFilterProp="label"
              disabled={!isAutoOdds || textOnly}
            />
          </Form.Item>
        </Col>
      </Row>
      {!textOnly && (
        <Row justify="end">
          <Button type="link" className="text-danger" onClick={setZeroOdds}>
            Zero Odds
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Row>
      )}
    </Form>
  )
}
