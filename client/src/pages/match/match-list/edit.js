import React, { useEffect } from 'react'
import {
  Form,
  Select,
  DatePicker,
  Col,
  Row,
  Checkbox,
  Typography,
  InputNumber,
  Spin,
  Divider,
  TimePicker,
} from 'antd'
import { connect } from 'react-redux'
import authEnum from 'authorize'
import actions from 'redux/match-list/actions'
import { applyFilterCategories } from 'helper'
import { useGetDateTimeDBServer } from 'components/blaise'
import dayjs from 'dayjs'

const mapStateToProps = ({ matchList, auth }) => ({
  specialCodeOptions: matchList.specialCode.map(e => ({
    value: e.special_code,
    label: e.special_name,
  })),
  loading: matchList.loadingEdit,
  dataFormEdit: matchList.dataEdit,
  cantEditMatch: auth.user.user_auth_ids.includes(authEnum.DISALLOW_EDIT_MATCH),
})

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  LoadSpecialCode: payload => {
    dispatch({
      type: actions.LOAD_SPECIAL_CODE,
      payload,
      source: 'Match List',
    })
  },
  LoadMatchEdit: payload => {
    dispatch({
      type: actions.LOAD_MATCH_EDIT,
      payload,
      source: 'Match List',
    })
  },
  UpdateMatchEdit: payload => {
    dispatch({
      type: actions.UPDATE_MATCH_EDIT,
      payload,
      successCallback,
      source: 'Match List',
    })
  },
  CleanUpMatchEdit: () => dispatch({ type: actions.SET_STATE, payload: { dataEdit: {} } }),
})

const sportSpecial = [10, 11, 12, 16, 32, 38, 52, 35, 22]

const wrapperDate = Component => props => {
  const defaultDateTimeServer = useGetDateTimeDBServer()
  if (!defaultDateTimeServer) return null
  return <Component {...props} defaultDateTimeServer={defaultDateTimeServer} />
}

const EditMatchList = wrapperDate(
  ({
    editValue,
    btnSubmitEditRef,
    loading,
    dataFormEdit,
    specialCodeOptions,
    cantEditMatch,
    defaultDateTimeServer,
    LoadSpecialCode,
    LoadMatchEdit,
    UpdateMatchEdit,
    CleanUpMatchEdit,
  }) => {
    React.useEffect(() => CleanUpMatchEdit, [CleanUpMatchEdit])

    const [form] = Form.useForm()

    useEffect(() => {
      LoadMatchEdit({ match_id: editValue.match_id })
    }, [LoadMatchEdit, editValue])

    useEffect(() => {
      LoadSpecialCode({ sport_id: editValue.sport_id })
    }, [LoadSpecialCode, editValue])

    const [
      initialValues,
      defaultCategory,
      disabledSubmit,
      disabledField,
      disabledEarly,
    ] = React.useMemo(() => {
      const category = applyFilterCategories(dataFormEdit?.category, dataFormEdit?.league_category)
      return [
        {
          ...dataFormEdit,
          match_date: dayjs(dataFormEdit?.match_date),
          match_time: dayjs(dataFormEdit?.match_date),
          match_hidden_time_status: dataFormEdit.match_hidden_time_status === 1,
          match_open_status: dataFormEdit.match_open_status === 'Y',
          match_live_status: dataFormEdit.match_live_status === 'Y',
          match_has_live_status: dataFormEdit.match_has_live_status === 'Y',
          match_neutral_status: dataFormEdit.match_neutral_status === 'Y',
          match_unnormal_status: dataFormEdit.match_unnormal_status === 1,
          match_show_today_status: dataFormEdit.match_show_today_status === 'Y',
          match_early_settlement_status: dataFormEdit.match_early_settlement_status === 'Y',
          category: category.filter(x => x.checked).map(x => x.value),
        },
        category,
        dataFormEdit.is_processed === 'Y' &&
          dayjs(dataFormEdit.match_date).isBefore(
            defaultDateTimeServer.clone().subtract(3, 'days'),
          ),
        dataFormEdit.is_processed === 'Y' &&
          !dayjs(dataFormEdit.match_date).isBefore(
            defaultDateTimeServer.clone().subtract(3, 'days'),
          ),
        dataFormEdit.st_early_lock === 'Y',
      ]
    }, [dataFormEdit, defaultDateTimeServer])

    React.useEffect(() => {
      if (disabledSubmit) btnSubmitEditRef.current.disabled = true
    }, [btnSubmitEditRef, disabledSubmit])
    React.useEffect(() => {
      form.resetFields()
    }, [form, initialValues])

    return (
      <Spin spinning={loading}>
        {cantEditMatch && (
          <Typography.Title className="m-0" type="danger" level={2}>
            You dont have permission to edit match
          </Typography.Title>
        )}
        {disabledSubmit && (
          <Typography.Title className="m-0" type="danger" level={5}>
            Match has been processed, and more than 3 days ago, you can&apos;t edit it
          </Typography.Title>
        )}
        <Form
          id="edit-match-form"
          form={form}
          labelAlign="left"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={initialValues}
          onFinish={values => {
            UpdateMatchEdit({
              match_id: editValue.match_id,
              ...values,
              // match_date: values.match_date?.format('YYYY-MM-DD HH:mm:ss'),
              match_date: values.match_date
                .hour(values.match_time.hour())
                .minute(values.match_time.minute())
                .format('YYYY-MM-DD HH:mm:ss'),

              match_hidden_time_status: values.match_hidden_time_status ? 1 : 0,
              match_open_status: values.match_open_status ? 'Y' : 'N',
              match_live_status: values.match_live_status ? 'Y' : 'N',
              match_has_live_status: values.match_has_live_status ? 'Y' : 'N',
              match_neutral_status: values.match_neutral_status ? 'Y' : 'N',
              match_unnormal_status: values.match_unnormal_status ? 1 : 0,
              match_show_today_status: values.match_show_today_status ? 'Y' : 'N',
              match_early_settlement_status: values.match_early_settlement_status ? 'Y' : 'N',
              category: values.category.join('^'),
            })
          }}
        >
          <Form.Item label="Match ID">{dataFormEdit?.match_id}</Form.Item>
          <Form.Item label="Match ID Parent" name="parent_match_id" extra="*For Special Match only">
            <InputNumber className="w-100" placeholder="Match ID Parent" disabled={disabledField} />
          </Form.Item>
          <Form.Item
            label="Match ID ACRJ"
            name="parent_match_id_action"
            extra="*For Special Match only"
          >
            <InputNumber
              min={0}
              className="w-100"
              placeholder="Match ID ACRJ"
              disabled={disabledField}
            />
          </Form.Item>
          <Form.Item label="Special Code" name="special_code" extra="*For Special Match only">
            <Select
              allowClear
              options={specialCodeOptions}
              disabled={!sportSpecial.includes(editValue.sport_id)}
            />
          </Form.Item>
          <Form.Item label="Match Date">
            <Form.Item
              className="mb-0 d-inline-block"
              name="match_date"
              rules={[{ required: true, message: 'Please input date!' }]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              className="mb-0 d-inline-block"
              name="match_time"
              rules={[{ required: true, message: 'Please input time!' }]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Sport">{dataFormEdit?.sport_name}</Form.Item>
          <Form.Item label="League">{dataFormEdit?.league_name}</Form.Item>
          <Form.Item label="Home - Away">
            {dataFormEdit?.home_name} - {dataFormEdit?.away_name}
          </Form.Item>

          <Divider className="m-2" />
          <Form.Item label="Match Status">
            <Form.Item className="mb-0" name="match_hidden_time_status" valuePropName="checked">
              <Checkbox disabled={disabledField}>Hidden Time</Checkbox>
            </Form.Item>
            <Form.Item className="mb-0" name="match_open_status" valuePropName="checked">
              <Checkbox disabled={disabledField}>Open</Checkbox>
            </Form.Item>
            <Form.Item className="mb-0" name="match_live_status" valuePropName="checked">
              <Checkbox disabled>
                Live
                <Typography.Text className="ml-2 text-danger">
                  *Go to MO - Edit to make Go Live
                </Typography.Text>
              </Checkbox>
            </Form.Item>
            <Form.Item className="mb-0" name="match_has_live_status" valuePropName="checked">
              <Checkbox disabled={disabledField}>
                Has Live
                <Typography.Text className="ml-2 text-danger">
                  *Tick if match has live games
                </Typography.Text>
              </Checkbox>
            </Form.Item>
            <Form.Item className="mb-0" name="match_neutral_status" valuePropName="checked">
              <Checkbox disabled={disabledField}>Neutral Ground</Checkbox>
            </Form.Item>
            <Form.Item className="mb-0" name="match_unnormal_status" valuePropName="checked">
              <Checkbox disabled={disabledField}>2 x 40</Checkbox>
            </Form.Item>
            <Form.Item className="mb-0" name="match_show_today_status" valuePropName="checked">
              <Checkbox>Show in Today</Checkbox>
            </Form.Item>
            <Form.Item
              className="mb-0"
              name="match_early_settlement_status"
              valuePropName="checked"
            >
              <Checkbox disabled={disabledEarly}>Early Settlement</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                validator: (rule, value) => {
                  if (value.length === 0)
                    return Promise.reject(new Error('Please select at least one category'))
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Checkbox.Group>
              {defaultCategory.map(cat => (
                <Checkbox key={cat.value} value={cat.value} disabled={disabledField}>
                  {cat.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>

          <Divider className="m-2" />
          <Form.Item label="RB Acceptance Delay">
            <div>
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={6} xl={8}>
                  <Form.Item label="Home" name="auto_accept_delay_home">
                    <InputNumber disabled={disabledField} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={8}>
                  <Form.Item label="Away" name="auto_accept_delay_away">
                    <InputNumber disabled={disabledField} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={6} xl={8}>
                  <Form.Item label="Over" name="auto_accept_delay_over">
                    <InputNumber disabled={disabledField} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={8}>
                  <Form.Item label="Under" name="auto_accept_delay_under">
                    <InputNumber disabled={disabledField} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form.Item>

          <Divider className="m-2" />
          <Form.Item label="Odds Step">
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={6} xl={8}>
                <Form.Item label="AH" name="ev_odds_step">
                  <InputNumber className="w-100" min={0} disabled={disabledField} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={8}>
                <Form.Item label="OU" name="ev_odds_step_ou">
                  <InputNumber className="w-100" min={0} disabled={disabledField} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="Odds Step Timer">
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={6} xl={8}>
                <Form.Item label="HT" name="ev_odds_step_timer_ht">
                  <InputNumber className="w-100" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={8}>
                <Form.Item label="FT" name="ev_odds_step_timer_ft">
                  <InputNumber className="w-100" disabled />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Spin>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(EditMatchList)
