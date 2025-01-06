import { Button, Checkbox, Form, Select, Space } from 'antd'
import { getRoundOptions } from 'helper'
import { range } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/match-time/actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
  UpdateMatchTime: payload => {
    dispatch({
      type: actions.UPDATE_MATCH_TIME,
      payload,
      successCallback: () => {
        ownProps.successCallback()
      },
    })
  },
})
const OtherBasketTimer = ({ editValue, UpdateMatchTime }) => {
  const [form] = Form.useForm()
  const { match_id, sport_id } = editValue
  const isMuayThai = sport_id === 56
  const roundOptions = getRoundOptions(sport_id)

  const onChangeMatchRound = () => {
    form.setFieldsValue({
      minutes: 0,
      seconds: 0,
    })
  }
  const onChangeSTInjury = (injuryField = 'injury_ht') => e => {
    if (e.target.checked) {
      form.setFieldValue(injuryField, 0)
    }
  }

  return (
    <Form
      form={form}
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{
        ...editValue,
        minutes: editValue.match_elapsed > 99 ? 0 : editValue.match_elapsed,
        st_injury_ht: editValue.st_injury_ht === 'Y',
        injury_ht: editValue.st_injury_ht === 'Y' ? editValue.injury_ht : 0,
        st_injury_ft: editValue.st_injury_ft === 'Y',
        injury_ft: editValue.st_injury_ft === 'Y' ? editValue.injury_ft : 0,
      }}
      onFinish={values => {
        UpdateMatchTime({
          match_id,
          ...editValue,
          ...values,
          st_injury_ht: values.st_injury_ht ? 'Y' : 'N',
          st_injury_ft: values.st_injury_ft ? 'Y' : 'N',
        })
      }}
    >
      <Form.Item name="match_round" label="Round" className="mb-0">
        <Select onChange={onChangeMatchRound} options={roundOptions} />
      </Form.Item>
      {!isMuayThai && (
        <>
          <Form.Item name="minutes" label="Minutes" className="mb-0">
            <Select options={range(0, 100).map(i => ({ value: i, label: i }))} />
          </Form.Item>
          <Form.Item label="Injury Time HT" className="mb-0">
            <Space>
              <Form.Item name="st_injury_ht" valuePropName="checked" noStyle>
                <Checkbox onChange={onChangeSTInjury('injury_ht')} />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.st_injury_ht !== currentValues.st_injury_ht
                }
              >
                {({ getFieldValue }) => {
                  const enabled = getFieldValue('st_injury_ht')
                  return (
                    <Form.Item name="injury_ht" noStyle>
                      <Select
                        style={{ width: 100 }}
                        options={range(0, 21).map(i => ({ value: i, label: i }))}
                        disabled={!enabled}
                      />
                    </Form.Item>
                  )
                }}
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="Injury Time FT" className="mb-0">
            <Space>
              <Form.Item name="st_injury_ft" valuePropName="checked" noStyle>
                <Checkbox onChange={onChangeSTInjury('injury_ft')} />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.st_injury_ft !== currentValues.st_injury_ft
                }
              >
                {({ getFieldValue }) => {
                  const enabled = getFieldValue('st_injury_ft')
                  return (
                    <Form.Item name="injury_ft" noStyle>
                      <Select
                        style={{ width: 100 }}
                        options={range(0, 21).map(i => ({ value: i, label: i }))}
                        disabled={!enabled}
                      />
                    </Form.Item>
                  )
                }}
              </Form.Item>
            </Space>
          </Form.Item>
        </>
      )}
      <Form.Item wrapperCol={{ offset: 8 }}>
        <Button size="small" type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default connect(null, mapDispatchToProps)(OtherBasketTimer)
