import React, { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Form,
  InputNumber,
  Select,
  DatePicker,
  Table,
  Checkbox,
  Button,
  Tooltip,
  Popconfirm,
  Typography,
  Input,
} from 'antd'
import { connect } from 'react-redux'
import actionLeague from 'redux/league/actions'
import actions from 'redux/unprocess-match/actions'
import { ReloadOutlined } from '@ant-design/icons'
import { useGetDateTimeBusinessHour } from 'components/blaise'
import { getScoreGameTypeFGLG, validatorNumeric } from 'helper'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { isEqual } from 'lodash'

const { Text } = Typography
const mapStateToProps = ({ league, unprocessMatch }) => ({
  leagueOptions: [{ value: 0, label: 'All League' }].concat(
    league.select_in_unprocess_match?.map(e => ({
      value: e.league_id,
      label: e.league_name,
    })),
  ),
  loadingData: unprocessMatch.loadingData,
  dataTable: unprocessMatch.data.result,
  totalData: unprocessMatch.data.total,
})

const mapDispatchToProps = dispatch => ({
  LoadLeague: payload => {
    dispatch({
      type: actionLeague.LOAD_SELECT_IN_UNPROCESS_MATCH,
      payload,
      source: 'Unprocess Match',
    })
  },
  LoadTable: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Unprocess Match',
    })
  },
  DeleteQueue: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE_QUEUE,
      payload,
      successCallback,
      source: 'Unprocess Match',
    })
  },
  Unprocess: (payload, successCallback) => {
    dispatch({
      type: actions.UNPROCESS_MATCH,
      payload,
      successCallback,
      source: 'Unprocess Match',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const matchStatusOptions = [
  { value: '', label: 'All Match Status' },
  { value: 'Unscored', label: 'Unscored' },
  { value: 'Half Time Scored', label: 'Half Time Scored' },
  { value: 'Full Time Scored', label: 'Full Time Scored' },
  { value: 'Match Cancelled', label: 'Match Cancelled' },
  { value: '1st Half Cancelled', label: '1st Half Cancelled' },
  { value: '2nd Half Cancelled', label: '2nd Half Cancelled' },
]
const htStatusOptions = [
  { value: '', label: 'All Half Time Status' },
  { value: 'Y', label: 'Processed' },
  { value: 'N', label: 'Unprocessed' },
  { value: '0', label: 'Queue' },
  { value: '1', label: 'Running' },
]
const ftStatusOptions = [
  { value: '', label: 'All Full Time Status' },
  { value: 'Y', label: 'Processed' },
  { value: 'N', label: 'Unprocessed' },
  { value: '0', label: 'Queue' },
  { value: '1', label: 'Running' },
]
const fglgStatusOptions = [
  { value: '', label: 'All FGLG Status' },
  { value: 'Y', label: 'Processed' },
  { value: 'N', label: 'Unprocessed' },
  { value: '0', label: 'Queue' },
  { value: '1', label: 'Running' },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const UnprocessMatch = wrapperDate(
  ({
    defaultDateTime,
    loadingData,
    dataTable,
    totalData,
    leagueOptions,
    LoadLeague,
    LoadTable,
    DeleteQueue,
    Unprocess,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const { sportOptions } = useSelectOptions()

    const [form] = Form.useForm()
    const [pagination, setPagination] = useState({ page_size: 50, current_page: 1 })
    const [unprocessForm] = Form.useForm()

    const reload = React.useCallback(() => {
      form.submit()
    }, [form])
    const reloadLeague = React.useCallback(() => {
      const values = form.getFieldsValue()
      LoadLeague({
        ...values,
        match_date: values.match_date?.format('YYYY-MM-DD'),
      })
      form.resetFields(['league_id'])
    }, [form, LoadLeague])
    React.useEffect(() => {
      reloadLeague()
      reload()
    }, [form, reloadLeague, reload])

    const column = [
      {
        title: 'Match ID',
        dataIndex: 'match_id',
        align: 'center',
        width: 100,
      },
      {
        title: 'Match Date',
        dataIndex: 'match_date',
        align: 'center',
        width: 150,
        render: text => text.formatDateTime(),
      },
      {
        title: 'League',
        dataIndex: 'league_name',
        width: 200,
      },
      {
        title: 'Home Away',
        width: 150,
        render: (text, record) => {
          return (
            <>
              {record.home_name}
              <br />
              {record.away_name}
            </>
          )
        },
      },
      {
        title: 'Match Status',
        dataIndex: 'match_status',
        align: 'center',
        width: 120,
        render: text => {
          if (
            text === 'Match Cancelled' ||
            text === '1st Half Cancelled' ||
            text === '2nd Half Cancelled'
          )
            return <Text type="danger">{text}</Text>
          if (text === 'Unscored') return <Text type="warning">{text}</Text>
          return text
        },
      },
      {
        title: 'Unprocess',
        children: [
          {
            title: 'Half Time',
            width: 100,
            render: ({
              match_status,
              ht_score_status,
              ht_process_status,
              ft_process_status,
              ht_home,
              ht_away,
              match_id,
            }) => {
              const DisplayScoreHT = () => {
                if (ht_score_status !== 'Y') return null
                if (match_status === 'Match Cancelled' || match_status === '1st Half Cancelled')
                  return null
                return `${ht_home} - ${ht_away}`
              }
              const DisplayCheckboxHT = () => {
                if (
                  ht_process_status === 'Y' &&
                  (ht_score_status === 'Y' ||
                    match_status === 'Match Cancelled' ||
                    match_status === '2nd Half Cancelled')
                )
                  return (
                    <Form.Item name={[match_id, 'process_ht']} valuePropName="checked">
                      <Checkbox
                        onChange={e => {
                          if (e.target.checked && ft_process_status === 'Y')
                            unprocessForm.setFieldsValue({
                              [match_id]: { process_ft: true },
                            })
                        }}
                      />
                    </Form.Item>
                  )
                return null
              }
              const DisplayQueueRunningStatusHT = () => {
                if (ht_process_status === '0')
                  return (
                    <Popconfirm
                      title="Cancel Queue Status?"
                      onConfirm={() => onDeleteQueue(match_id, -1)}
                    >
                      <Button type="link" danger>
                        <b>Queue</b>
                      </Button>
                    </Popconfirm>
                  )

                if (ht_process_status === '1')
                  return (
                    <Typography.Text strong type="success">
                      Running
                    </Typography.Text>
                  )
                return null
              }
              const DisplayInputHT = () => {
                return (
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues[match_id]?.process_ht !== currentValues[match_id]?.process_ht
                    }
                  >
                    {({ getFieldValue }) => {
                      const showInput = getFieldValue([match_id, 'process_ht'])
                      return (
                        showInput && (
                          <Form.Item name={[match_id, 'reason_ht']}>
                            <Input.TextArea rows={2} placeholder="Input Reason" />
                          </Form.Item>
                        )
                      )
                    }}
                  </Form.Item>
                )
              }
              return (
                <Row justify="space-between">
                  <Col>
                    <DisplayScoreHT />
                  </Col>
                  <Col>
                    <DisplayCheckboxHT />
                    <DisplayQueueRunningStatusHT />
                  </Col>
                  <DisplayInputHT />
                </Row>
              )
            },
          },
          {
            title: 'Full Time',
            width: 100,
            render: ({
              match_status,
              ft_score_status,
              ft_process_status,
              ht_process_status, // for delete queue
              fs_home,
              fs_away,
              match_id,
            }) => {
              const DisplayScoreFT = () => {
                if (ft_score_status !== 'Y') return null
                if (match_status === 'Match Cancelled' || match_status === '2st Half Cancelled')
                  return null
                return `${fs_home} - ${fs_away}`
              }
              const DisplayCheckboxFT = () => {
                if (
                  ft_process_status === 'Y' &&
                  (ft_score_status === 'Y' ||
                    match_status === 'Match Cancelled' ||
                    match_status === '2nd Half Cancelled')
                )
                  return (
                    <Form.Item name={[match_id, 'process_ft']} valuePropName="checked">
                      <Checkbox
                        onChange={e => {
                          if (!e.target.checked)
                            unprocessForm.setFieldsValue({
                              [match_id]: { process_ht: false },
                            })
                        }}
                      />
                    </Form.Item>
                  )
                return null
              }
              const DisplayQueueRunningStatusFT = () => {
                if (ft_process_status === '0')
                  return (
                    <Popconfirm
                      title="Cancel Queue Status?"
                      onConfirm={() => {
                        onDeleteQueue(match_id, -2)
                        if (ht_process_status === '0') onDeleteQueue(match_id, -1)
                      }}
                    >
                      <Button type="link" danger>
                        <b>Queue</b>
                      </Button>
                    </Popconfirm>
                  )

                if (ft_process_status === '1')
                  return (
                    <Typography.Text strong type="success">
                      Running
                    </Typography.Text>
                  )
                return null
              }
              const DisplayInputFT = () => {
                return (
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues[match_id]?.process_ft !== currentValues[match_id]?.process_ft
                    }
                  >
                    {({ getFieldValue }) => {
                      const showInput = getFieldValue([match_id, 'process_ft'])
                      return (
                        showInput && (
                          <Form.Item name={[match_id, 'reason_ft']}>
                            <Input.TextArea rows={2} placeholder="Input Reason" />
                          </Form.Item>
                        )
                      )
                    }}
                  </Form.Item>
                )
              }
              return (
                <Row justify="space-between">
                  <Col>
                    <DisplayScoreFT />
                  </Col>
                  <Col>
                    <DisplayCheckboxFT />
                    <DisplayQueueRunningStatusFT />
                  </Col>
                  <DisplayInputFT />
                </Row>
              )
            },
          },
          {
            title: 'FGLG',
            width: 100,
            render: ({
              match_has_fglg_status,
              fglg_score_status,
              fglg_process_status,
              fg_team,
              lg_team,
              match_id,
            }) => {
              const DisplayScoreFGLG = () => {
                if (match_has_fglg_status !== 'Y') return <Text type="danger">NA</Text>
                if (fglg_score_status !== 'Y') return null
                return getScoreGameTypeFGLG(fg_team, lg_team)
              }
              const DisplayCheckboxFGLG = () => {
                if (match_has_fglg_status !== 'Y') return null
                if (fglg_process_status === 'Y' && fglg_score_status === 'Y')
                  return (
                    <Form.Item name={[match_id, 'process_fglg']} valuePropName="checked">
                      <Checkbox />
                    </Form.Item>
                  )
                return null
              }
              const DisplayQueueRunningStatusFGLG = () => {
                if (fglg_process_status === '0')
                  return (
                    <Popconfirm
                      title="Cancel Queue Status?"
                      onConfirm={onDeleteQueue(match_id, -14)}
                    >
                      <Button type="link" danger>
                        <b>Queue</b>
                      </Button>
                    </Popconfirm>
                  )
                if (fglg_process_status === '1')
                  return (
                    <Typography.Text strong type="success">
                      Running
                    </Typography.Text>
                  )
                return null
              }
              const DisplayInputFGLG = () => {
                return (
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues[match_id]?.process_fglg !== currentValues[match_id]?.process_fglg
                    }
                  >
                    {({ getFieldValue }) => {
                      const showInput = getFieldValue([match_id, 'process_fglg'])
                      return (
                        showInput && (
                          <Form.Item name={[match_id, 'reason_fglg']}>
                            <Input.TextArea rows={2} placeholder="Input Reason" />
                          </Form.Item>
                        )
                      )
                    }}
                  </Form.Item>
                )
              }
              return (
                <Row justify="space-between">
                  <Col>
                    <DisplayScoreFGLG />
                  </Col>
                  <Col>
                    <DisplayCheckboxFGLG />
                    <DisplayQueueRunningStatusFGLG />
                  </Col>
                  <DisplayInputFGLG />
                </Row>
              )
            },
          },
          {
            title: 'Detail',
            align: 'center',
            width: 100,
            render: (text, record) =>
              record.special_score_status === 'Y' && (
                <Button type="link" onClick={() => editSpecial(record)}>
                  Special
                </Button>
              ),
          },
        ],
      },
    ]
    const editSpecial = ({ match_id, league_name, home_name, away_name, sport_id }) => {
      const title = `${match_id} - ${home_name} - ${away_name}`
      const qs = {
        match_id,
        league_name,
        home_name,
        away_name,
        sport_id,
        title,
      }
      window.open(
        `/#/match/unprocess-match-special-fly?${new URLSearchParams(qs).toString()}`,
        `UnProcessMatchSpecial-${match_id}`,
        'height=500,width=1000,scrollbars=no',
      )
    }

    const onDeleteQueue = React.useCallback(
      (match_id, process_type) => () => {
        DeleteQueue({ match_id, process_type }, reload)
      },
      [DeleteQueue, reload],
    )
    useEffect(() => {
      unprocessForm.resetFields()
    }, [unprocessForm, dataTable])

    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse" style={{ gap: 8 }}>
              <Tooltip placement="top" title="Refresh list">
                <Button icon={<ReloadOutlined />} onClick={reload} />
              </Tooltip>
              <Form
                form={form}
                className="w-100"
                initialValues={{
                  match_date: defaultDateTime,
                  sport_id: 10,
                  league_id: 0,
                  match_status: '',
                  ht_status: '',
                  ft_status: '',
                  fglg_status: '',
                }}
                onValuesChange={changedValues => {
                  if (!Object.keys(changedValues).includes('match_id')) {
                    setPagination(prev => ({ ...prev, current_page: 1 }))
                    reload()

                    if (!Object.keys(changedValues).includes('league_id')) reloadLeague()
                  }
                }}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    reload()
                    reloadLeague()
                  }
                }}
                onFinish={values => {
                  LoadTable({
                    ...values,
                    match_date: values.match_date.format('YYYY-MM-DD'),
                    ...pagination,
                  })
                }}
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="match_date">
                      <DatePicker className="w-100" allowClear={false} format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item name="sport_id">
                      <Select options={sportOptions} showSearch />
                    </Form.Item>
                    <Form.Item name="league_id">
                      <Select options={leagueOptions} showSearch />
                    </Form.Item>
                    <Form.Item
                      name="match_id"
                      extra="*If filter by MatchID, other filters will ignored"
                      rules={[{ validator: validatorNumeric }]}
                    >
                      <InputNumber className="w-100" controls={false} placeholder="Match ID" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="match_status">
                      <Select options={matchStatusOptions} />
                    </Form.Item>
                    <Form.Item name="ht_status">
                      <Select options={htStatusOptions} />
                    </Form.Item>
                    <Form.Item name="ft_status">
                      <Select options={ftStatusOptions} />
                    </Form.Item>
                    <Form.Item name="fglg_status">
                      <Select options={fglgStatusOptions} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Form
              form={unprocessForm}
              id="unprocess-form"
              onFinish={values => {
                const payload = Object.entries(values)
                  .map(([match_id, value]) => ({
                    match_id: Number(match_id),
                    ...value,
                  }))
                  .filter(item => item.process_ht || item.process_ft || item.process_fglg)
                Unprocess(payload, reload)
              }}
            >
              <Table
                rowKey="match_id"
                size="small"
                columns={column}
                loading={loadingData}
                dataSource={dataTable}
                pagination={{
                  showSizeChanger: true,
                  total: totalData,
                  showTotal: total => `Total ${total} items`,
                  current: pagination.current_page,
                  pageSize: pagination.page_size,
                  onChange: (current_page, page_size) => {
                    setPagination({ current_page, page_size })
                    reload()
                  },
                }}
                title={() => {
                  return (
                    <Form.Item
                      shouldUpdate={(prevValues, currentValues) =>
                        !isEqual(prevValues, currentValues)
                      }
                    >
                      {({ getFieldsValue }) => {
                        const anyChecked = Object.values(getFieldsValue()).some(
                          val => val.process_ht || val.process_ft || val.process_fglg,
                        )
                        return (
                          <div className="d-flex justify-content-end">
                            <Button type="primary" htmlType="submit" disabled={!anyChecked}>
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
          <div className="card-footer">
            <b>
              Notes:
              <br />
              1. If filter by MatchID, other filters will be ignored
              <br />
              2. Unprocess Match page list matches that allow to unprocessed on SELECTED DATE
            </b>
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(UnprocessMatch)
