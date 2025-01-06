import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/match-statistic/actions'
import actionsLeague from 'redux/league/actions'
import {
  Row,
  Col,
  Form,
  Select,
  Table,
  DatePicker,
  Tooltip,
  Button,
  Switch,
  Checkbox,
  message,
  Input,
} from 'antd'
import { useGetDateTimeBusinessHour, useFormWithPagination } from 'components/blaise'
import { ReloadOutlined } from '@ant-design/icons'
import { isEqual } from 'lodash'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { validatorNumeric } from 'helper'

const { RangePicker } = DatePicker

const mapStateToProps = ({ matchStatistic, league }) => ({
  dataTable: matchStatistic.data.result,
  loading: matchStatistic.loading,
  totalResults: matchStatistic.data.total,
  leagueOptions: [{ value: 0, label: 'All League' }].concat(
    league.select_in_match_statistic.map(e => ({
      value: e.league_id,
      label: e.league_name,
    })),
  ),
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Match Statistic',
    })
  },
  LoadLeague: payload => {
    dispatch({
      type: actionsLeague.LOAD_SELECT_IN_MATCH_STATISTIC,
      payload,
      source: 'Match Statistic',
    })
  },
  UpdateMatchStatistic: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Match Statistic',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const MatchStatistic = wrapperDate(
  ({
    dataTable,
    loading,
    totalResults,
    defaultDateTime,
    Load,
    LoadLeague,
    leagueOptions,
    UpdateMatchStatistic,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const { sportOptions } = useSelectOptions()

    const [form] = Form.useForm()
    const [formTable] = Form.useForm()

    const fetch = React.useCallback(
      values => {
        Load({
          ...values,
          date_start: values.date_range?.[0].format('YYYY-MM-DD'),
          date_end: values.date_range?.[1].format('YYYY-MM-DD'),
          order_by: values.order_by ? 'Time' : 'Normal',
        })
      },
      [Load],
    )
    const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalResults)

    const reloadLeague = React.useCallback(() => {
      const values = form.getFieldsValue()
      LoadLeague({
        ...values,
        date_start: values.date_range?.[0].format('YYYY-MM-DD'),
        date_end: values.date_range?.[1].format('YYYY-MM-DD'),
      })
      form.resetFields(['league_id'])
    }, [form, LoadLeague])
    const reload = React.useCallback(() => {
      form.submit()
      reloadLeague()
    }, [form, reloadLeague])
    React.useEffect(() => reload(), [reload])

    const columns = [
      {
        title: 'Match ID',
        dataIndex: 'match_id',
        align: 'center',
        width: 100,
      },
      {
        title: (
          <>
            <span>Match Date</span>
            <br />
            <span>Created Date</span>
          </>
        ),
        width: 150,
        align: 'center',
        render: record => (
          <>
            <span>{record.match_date}</span>
            <br />
            <span className="text-orange">{record.match_date}</span>
          </>
        ),
      },
      {
        title: 'League',
        dataIndex: 'league_name',
        width: 400,
      },
      {
        title: 'Home Away',
        width: 250,
        render: record => (
          <>
            <span>{record.home_name}</span>
            <br />
            <span>{record.away_name}</span>
          </>
        ),
      },
      {
        title: 'Live Match Tracker (LMT)',
        align: 'center',
        render: record => (
          <Form.Item name={[record.match_id, 'lmt']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        ),
        width: 150,
      },
      {
        title: 'Match Preview (MP)',
        align: 'center',
        render: record => (
          <Form.Item name={[record.match_id, 'mp']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        ),
        width: 150,
      },
    ]

    React.useEffect(() => {
      const initialValuesTable = dataTable?.reduce((previousValue, currentValue) => {
        const { statistic_id } = currentValue
        previousValue[currentValue.match_id] = {
          lmt: statistic_id[0] === '1',
          mp: statistic_id[1] === '1',
        }
        return previousValue
      }, {})
      formTable.setFieldsValue(initialValuesTable)
    }, [formTable, dataTable])

    return (
      <>
        <div className="card">
          <div className="card-header d-flex flex-row-reverse">
            <Tooltip placement="top" title="Refresh list">
              <Button icon={<ReloadOutlined />} onClick={reload} />
            </Tooltip>
            <Form
              form={form}
              className="w-100"
              initialValues={{
                date_range: [defaultDateTime, defaultDateTime],
                sport_id: 10,
                league_id: 0,
              }}
              {...formProps}
              onValuesChange={(changedValues, allValues) => {
                formProps.onValuesChange(changedValues, allValues)

                const key = Object.keys(changedValues)[0]
                if (!['order_by', 'league_id'].includes(key)) {
                  reloadLeague()
                }
              }}
              onKeyPress={e => {
                formProps.onKeyPress(e)
                if (e.key === 'Enter') reloadLeague()
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="date_range" className="mb-0">
                    <RangePicker className="w-100" format="YYYY-MM-DD" allowClear={false} />
                  </Form.Item>
                  <Form.Item name="sport_id">
                    <Select placeholder="Select Sport" showSearch options={sportOptions} />
                  </Form.Item>
                  <Form.Item name="league_id">
                    <Select placeholder="Select League" showSearch options={leagueOptions} />
                  </Form.Item>
                  <Form.Item
                    name="match_id"
                    className="mb-0"
                    rules={[{ validator: validatorNumeric }]}
                  >
                    <Input className="w-100" controls={false} placeholder="Match ID" />
                  </Form.Item>
                  <Form.Item name="order_by" valuePropName="checked">
                    <Switch unCheckedChildren="Sort By Time" checkedChildren="Sort Normal" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <div className="card-body">
            <Form
              form={formTable}
              className="w-100"
              onFinish={values => {
                const payload = Object.entries(values)
                  .map(([key, value]) => {
                    const lmt = value.lmt ? '1' : '0'
                    const mp = value.mp ? '1' : '0'
                    return { match_id: Number(key), statistic_id: lmt + mp }
                  })
                  .filter(value =>
                    dataTable.some(
                      v =>
                        value.match_id === v.match_id &&
                        value.statistic_id !== (v.statistic_id || '00'),
                    ),
                  )
                if (payload.length === 0) {
                  message.warning('No changes detected, please try again')
                  return
                }
                UpdateMatchStatistic(payload, reload)
              }}
            >
              <Table
                size="small"
                rowKey={record => record.match_id}
                columns={columns}
                dataSource={dataTable}
                loading={loading}
                pagination={paginationProps}
                title={() => {
                  return (
                    <Form.Item
                      shouldUpdate={(prevValues, currentValues) => {
                        return !isEqual(prevValues, currentValues)
                      }}
                    >
                      {({ getFieldsValue }) => {
                        const payload = Object.entries(getFieldsValue())
                          .map(([key, value]) => {
                            const lmt = value.lmt ? '1' : '0'
                            const mp = value.mp ? '1' : '0'
                            return { match_id: Number(key), statistic_id: lmt + mp }
                          })
                          .filter(value =>
                            dataTable.some(
                              v =>
                                value.match_id === v.match_id &&
                                value.statistic_id !== (v.statistic_id || '00'),
                            ),
                          )

                        return (
                          <div className="d-flex justify-content-end">
                            <Button
                              type="primary"
                              htmlType="submit"
                              disabled={payload.length === 0}
                            >
                              Submit
                            </Button>
                          </div>
                        )
                      }}
                    </Form.Item>
                  )
                }}
              />
            </Form>
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(MatchStatistic)
