import React, { useEffect, useState } from 'react'
import {
  Button,
  Select,
  Row,
  Col,
  Table,
  Form,
  Drawer,
  InputNumber,
  DatePicker,
  Checkbox,
  Tooltip,
  Space,
  message,
  Popconfirm,
  Typography,
} from 'antd'
import { connect } from 'react-redux'
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/scoring-match/actions'
import actionsLeague from 'redux/league/actions'
import { HomeAwayWithTraderIcon, useGetDateTimeBusinessHour } from 'components/blaise'
import { getScoreGameTypeFGLG, validatorNumeric } from 'helper'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { isEqual } from 'lodash'
import Edit from './edit'
import EditScoringDetail from './edit-detail'

const { Text } = Typography
const mapStateToProps = ({ scoringMatch, league }) => ({
  loadingData: scoringMatch.loadingData,
  tableData: scoringMatch.data.result,
  totalResults: scoringMatch.data.total,

  leagueOptions: [{ value: 0, label: 'All League' }].concat(
    league.select_in_scoring_match.map(data => ({
      value: data.league_id,
      label: data.league_name,
    })),
  ),
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Scoring Match',
    })
  },
  LoadLeague: payload => {
    dispatch({
      type: actionsLeague.LOAD_SELECT_IN_SCORING_MATCH,
      payload,
      source: 'Scoring Match',
    })
  },
  UpdateScoringMatch: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SCORING_MATCH,
      payload,
      successCallback,
      source: 'Scoring Match',
    })
  },
  UpdateScoringResetMatch: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SCORING_RESET_MATCH,
      payload,
      successCallback,
      source: 'Scoring Match',
    })
  },
  DeleteScoringDetail: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE_SCORING_DETAIL,
      payload,
      successCallback,
      source: 'Scoring Match',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const ScoringMatch = wrapperDate(
  ({
    tableData,
    loadingData,
    Load,
    totalResults,
    leagueOptions,
    defaultDateTime,
    LoadLeague,
    UpdateScoringMatch,
    DeleteScoringDetail,
    UpdateScoringResetMatch,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const { sportOptions } = useSelectOptions()

    const [form] = Form.useForm()
    const [pagination, setPagination] = useState({ page_size: 50, current_page: 1 })
    const [formScore] = Form.useForm()

    const [editValue, setEditValue] = useState()
    const [visibleEditHomeAway, setVisibleEditHomeAway] = useState(false)
    const [visibleEditDetail, setVisibleEditDetail] = useState(false)

    const reload = React.useCallback(() => {
      form.submit()
    }, [form])

    const reloadLeague = React.useCallback(() => {
      const values = form.getFieldsValue()
      LoadLeague({
        ...values,
        match_date: values.match_date?.format('YYYY-MM-DD'),
        include_processed: values.include_processed ? 'Y' : 'N',
      })
      form.resetFields(['league_id'])
    }, [form, LoadLeague])

    React.useEffect(() => {
      reloadLeague()
      reload()
    }, [form, reloadLeague, reload])

    const columns = [
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
        width: 120,
        render: text => text.formatDateTime(),
      },
      {
        title: 'League Name',
        dataIndex: 'league_name',
        width: 250,
      },
      {
        title: 'Home Away',
        render: record => (
          <div className="d-flex">
            <HomeAwayWithTraderIcon {...record} />
            <Button type="link" className="border-0" onClick={() => editHomeAwayHandler(record)}>
              {record.home_posisi || 0}
              <br />
              {record?.away_posisi || 0}
            </Button>
          </div>
        ),
        width: 200,
      },
      {
        title: 'Score',
        children: [
          {
            title: 'Half Time',
            width: 100,
            render: record => (
              <SCOREHALFTIME
                record={record}
                refreshScore={reload}
                UpdateScoringResetMatch={UpdateScoringResetMatch}
              />
            ),
          },
          {
            title: 'Full Time',
            width: 100,
            render: record => (
              <SCOREFULLTIME
                record={record}
                refreshScore={reload}
                UpdateScoringResetMatch={UpdateScoringResetMatch}
              />
            ),
          },
          {
            title: 'FGLG',
            width: 100,
            render: record => (
              <SCOREFGLG
                record={record}
                refreshScore={reload}
                UpdateScoringResetMatch={UpdateScoringResetMatch}
              />
            ),
          },
          {
            title: 'Detail',
            width: 120,
            render: record => {
              const enableEdit = [11, 12, 53, 34, 16, 26, 32, 18].includes(record.sport_id)
              return (
                <Row className="justify-content-between">
                  <Col>
                    <ScoreDetail record={record} />
                  </Col>
                  <Col>
                    {enableEdit && (
                      <Tooltip title="Edit" placement="top">
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          onClick={() => {
                            editScoreDetail(record)
                          }}
                        />
                      </Tooltip>
                    )}
                    {enableEdit && (
                      <Tooltip title="Delete" placement="top">
                        <Popconfirm
                          title="Sure to delete?"
                          onConfirm={() =>
                            DeleteScoringDetail({ match_id: record.match_id }, reload)
                          }
                        >
                          <Button type="link" icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Tooltip>
                    )}
                    {record.special_score_status === 'Y' && (
                      <Button type="link" onClick={() => editSpecial(record)}>
                        Special
                      </Button>
                    )}
                  </Col>
                </Row>
              )
            },
          },
        ],
      },
    ]
    const editHomeAwayHandler = record => {
      setEditValue(record)
      setVisibleEditHomeAway(true)
    }
    const editScoreDetail = record => {
      setEditValue(record)
      setVisibleEditDetail(true)
    }
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
        `/#/match/scoring-match-special-fly?${new URLSearchParams(qs).toString()}`,
        `ScoringMatchSpecial-${match_id}`,
        'height=500,width=1000,scrollbars=no',
      )
    }

    const initialValuesFormScore = React.useMemo(
      () =>
        tableData?.reduce((acc, scoreItem) => {
          const { match_id, ht_score_status, ft_score_status, fglg_score_status } = scoreItem

          if (ht_score_status === 'N') {
            scoreItem.ht_home = null
            scoreItem.ht_away = null
          }
          if (ft_score_status === 'N') {
            scoreItem.fs_home = null
            scoreItem.fs_away = null
          }
          if (fglg_score_status === 'N') {
            scoreItem.fg_team = null
            scoreItem.lg_team = null
          }

          acc[match_id] = {
            ...scoreItem,
            process_ht: false,
            process_ft: false,
            process_fglg: false,
          }
          return acc
        }, {}),
      [tableData],
    )
    useEffect(() => {
      formScore.setFieldsValue(initialValuesFormScore)
    }, [form, formScore, initialValuesFormScore])

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
                  ht_score_status: '',
                  ft_score_status: '',
                  fglg_score_status: '',
                  include_processed: false,
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
                  Load({
                    ...values,
                    include_processed: values.include_processed ? 'Y' : 'N',
                    match_date: values.match_date?.format('YYYY-MM-DD'),
                    ...pagination,
                  })
                }}
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="match_date">
                      <DatePicker allowClear={false} format="YYYY-MM-DD" className="w-100" />
                    </Form.Item>
                    <Form.Item name="sport_id">
                      <Select
                        placeholder="Select Sport"
                        showSearch
                        options={sportOptions}
                        className="w-100"
                      />
                    </Form.Item>
                    <Form.Item name="league_id">
                      <Select
                        placeholder="Select League"
                        showSearch
                        options={leagueOptions}
                        className="w-100"
                      />
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
                    <Form.Item name="include_processed" valuePropName="checked" className="w-100">
                      <Checkbox>Include Processed Match</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="ht_score_status">
                      <Select
                        placeholder="Select Half Time Status"
                        options={[
                          { value: '', label: 'All Half Time Status' },
                          { value: 'N', label: 'Unscored' },
                          { value: 'Y', label: 'Scored' },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item name="ft_score_status">
                      <Select
                        placeholder="Select Full Time Status"
                        options={[
                          { value: '', label: 'All Full Time Status' },
                          { value: 'N', label: 'Unscored' },
                          { value: 'Y', label: 'Scored' },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item name="fglg_score_status">
                      <Select
                        placeholder="Select FGLG Status"
                        options={[
                          { value: '', label: 'All FGLG Status' },
                          { value: 'N', label: 'Unscored' },
                          { value: 'Y', label: 'Scored' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Form
              form={formScore}
              id="edit-score"
              layout="vertical"
              onFinish={values => {
                // validation
                const isValidated = Object.entries(values)
                  .filter(([, val]) => val.process_ht || val.process_ft || val.process_fglg)
                  .every(([key, val]) => {
                    const ht_home = val.ht_home || initialValuesFormScore[key].ht_home
                    const ht_away = val.ht_away || initialValuesFormScore[key].ht_away
                    const fs_home = val.fs_home || initialValuesFormScore[key].fs_home
                    const fs_away = val.fs_away || initialValuesFormScore[key].fs_away

                    const { is_live } = tableData.find(e => e.match_id === Number(key))
                    if (is_live === 'N' && fs_home && fs_away) {
                      if (ht_home > fs_home) {
                        message.warning(
                          `Match ID : ${key} FT Home Score cannot be less than HT Home Score`,
                        )
                        return false
                      }
                      if (ht_away > fs_away) {
                        message.warning(
                          `Match ID : ${key} FT Away Score cannot be less than HT Away Score`,
                        )
                        return false
                      }
                    }
                    return true
                  })
                if (!isValidated) return

                const convertValue = Object.entries(values)
                  .filter(([, val]) => val.process_ht || val.process_ft || val.process_fglg)
                  .reduce((acc, [key, val]) => {
                    if (val.process_ht) {
                      acc.push({
                        match_id: Number(key),
                        ht_home: val.ht_home,
                        ht_away: val.ht_away,
                        scoring_type: 'HS',
                      })
                    }
                    if (val.process_ft) {
                      acc.push({
                        match_id: Number(key),
                        fs_home: val.fs_home,
                        fs_away: val.fs_away,
                        scoring_type: 'FS',
                      })
                    }
                    if (val.process_fglg) {
                      acc.push({
                        match_id: Number(key),
                        fg_team: val.fg_team,
                        lg_team: val.lg_team,
                        scoring_type: 'FGLG',
                      })
                    }
                    return acc
                  }, [])
                UpdateScoringMatch(convertValue, reload)
              }}
            >
              <Table
                rowKey={record => record.match_id}
                size="small"
                loading={loadingData}
                dataSource={tableData}
                columns={columns}
                pagination={{
                  showSizeChanger: true,
                  total: totalResults,
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
              1. If filter by MatchID, other filters will ignored
              <br />
              2. For input score, the Match have to closed first
              <br />
              3. In Golf, to input DNF, please type &quot;x&quot;
              <br />
              4. In Muay Thai, to input score Full Time ONLY are:
              <ul type="a">
                <li> 1-0/0-1 = KO in Round 1 (Home/Away Win)</li>
                <li> 2-0/0-2 = KO in Round 2 (Home/Away Win)</li>
                <li> 3-0/0-3 = KO in Round 3 (Home/Away Win)</li>
                <li> 4-0/0-4 = KO in Round 4 (Home/Away Win)</li>
                <li> 5-0/0-5 = KO in Round 5 (Home/Away Win)</li>
                <li> 6-0/0-6 = 5 Rounds Completed (Home/Away Win)</li>
                <li> 6-6 = 5 Rounds Completed (Draw)</li>
              </ul>
            </b>
          </div>
        </div>

        <Drawer
          title="Edit Home Away Posisi"
          width={600}
          open={visibleEditHomeAway}
          onClose={() => setVisibleEditHomeAway(false)}
          destroyOnClose
          footer={
            <Space>
              <Button onClick={() => setVisibleEditHomeAway(false)}>Cancel</Button>
              <Button form="edit-form" type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          }
        >
          <Edit
            editValue={editValue}
            successCallback={() => {
              reload()
              setVisibleEditHomeAway(false)
            }}
          />
        </Drawer>
        <Drawer
          title={`Score Detail - ${editValue?.match_id}`}
          width={600}
          open={visibleEditDetail}
          onClose={() => setVisibleEditDetail(false)}
          destroyOnClose
          footer={
            <Space>
              <Button onClick={() => setVisibleEditDetail(false)}>Cancel</Button>
              <Button form="detail-form" type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          }
        >
          <EditScoringDetail
            editValue={editValue}
            successCallback={() => {
              reload()
              setVisibleEditDetail(false)
            }}
          />
        </Drawer>
      </>
    )
  },
)

const ScoreDetail = ({ record }) => {
  if ([11, 12, 16, 34, 53].includes(record.sport_id)) {
    return (
      <Row gutter={[8, 8]} justify="center">
        <Col>
          {record.home_1}
          <br />
          {record.away_1}
        </Col>
        <Col>
          {record.home_2}
          <br />
          {record.away_2}
        </Col>
        <Col>
          {record.home_3}
          <br />
          {record.away_3}
        </Col>
        <Col>
          {record.home_4}
          <br />
          {record.away_4}
        </Col>
        <Col>
          {record.home_5}
          <br />
          {record.away_5}
        </Col>
      </Row>
    )
  }
  if ([26].includes(record.sport_id)) {
    return (
      <Row gutter={[8, 8]} justify="center">
        <Col>
          {record.home_1}
          <br />
          {record.away_1}
        </Col>
        <Col>
          {record.home_2}
          <br />
          {record.away_2}
        </Col>
        <Col>
          {record.home_3}
          <br />
          {record.away_3}
        </Col>
        <Col>
          {record.home_4}
          <br />
          {record.away_4}
        </Col>
      </Row>
    )
  }
  if ([32].includes(record.sport_id)) {
    return (
      <Row gutter={[8, 8]} justify="center">
        <Col>
          {record.home_1}
          <br />
          {record.away_1}
        </Col>
        <Col>
          {record.home_2}
          <br />
          {record.away_2}
        </Col>
        <Col>
          {record.home_3}
          <br />
          {record.away_3}
        </Col>
      </Row>
    )
  }
  if ([18].includes(record.sport_id)) {
    return (
      <Row gutter={[4, 4]}>
        <Col>
          {record.home_1}
          <br />
          {record.away_1}
        </Col>
        <Col>
          {record.home_2}
          <br />
          {record.away_2}
        </Col>
        <Col>
          {record.home_3}
          <br />
          {record.away_3}
        </Col>
        <Col>
          {record.home_4}
          <br />
          {record.away_4}
        </Col>
        <Col>
          {record.home_5}
          <br />
          {record.away_5}
        </Col>
        <Col>
          {record.home_6}
          <br />
          {record.away_6}
        </Col>
        <Col>
          {record.home_7}
          <br />
          {record.away_7}
        </Col>
        <Col>
          {record.home_8}
          <br />
          {record.away_8}
        </Col>
        <Col>
          {record.home_9}
          <br />
          {record.away_9}
        </Col>
        <Col>
          {record.home_10}
          <br />
          {record.away_10}
        </Col>
      </Row>
    )
  }
  return null
}

const SCOREHALFTIME = ({ record, refreshScore, UpdateScoringResetMatch }) => {
  const { match_id, ht_home, ht_away, ht_process_status, ht_score_status } = record
  const DisplayScoreHT = () => {
    return (
      <>
        {ht_home}
        <br />
        {ht_away}
      </>
    )
  }
  const DisplayScoreInputHT = () => {
    return (
      <>
        <Form.Item
          name={[match_id, 'ht_home']}
          rules={[{ required: true, message: 'Required HT Home' }]}
        >
          <InputNumber min={0} style={{ width: 50 }} />
        </Form.Item>
        <Form.Item
          name={[match_id, 'ht_away']}
          rules={[{ required: true, message: 'Required HT Away' }]}
        >
          <InputNumber min={0} style={{ width: 50 }} />
        </Form.Item>
      </>
    )
  }

  const DisplayScoreStatusHT = () => {
    // if (ht_process_status === 'N')
    //   if (ht_score_status === 'Y' || ht_score_status === 'N') return null
    if (ht_score_status === 'Match Cancelled' || ht_score_status === '1st Half Cancelled')
      return <Text type="danger">{ht_score_status}</Text>
    return null
  }
  const DisplayProcessStatusHT = () => {
    return ht_process_status === 'Y' && <Text type="success">Processed</Text>
  }
  const DisplayCheckboxHT = () => {
    // not processed and ((not canceled))
    if (ht_process_status === 'N' && (ht_score_status === 'N' || ht_score_status === 'Y'))
      return (
        <Form.Item name={[match_id, 'process_ht']} valuePropName="checked" noStyle>
          <Checkbox />
        </Form.Item>
      )
    return null
  }
  const resetFieldHT = () => UpdateScoringResetMatch({ match_id, scoring_type: 'HS' }, refreshScore)
  const DisplayResetButtonHT = () => {
    // not processed and scored
    if (ht_process_status === 'N' && ht_score_status === 'Y')
      return (
        <Button type="link" onClick={resetFieldHT} className="border-0">
          Reset
        </Button>
      )
    return null
  }
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
          <Row justify="space-between">
            <Col>
              {!showInput && <DisplayScoreHT />}
              {showInput && <DisplayScoreInputHT />}
            </Col>
            <Col align="right">
              <Space direction="vertical" size={0}>
                <DisplayScoreStatusHT />
                <DisplayProcessStatusHT />
                <DisplayCheckboxHT />
                {!showInput && <DisplayResetButtonHT />}
              </Space>
            </Col>
          </Row>
        )
      }}
    </Form.Item>
  )
}

const SCOREFULLTIME = ({ record, refreshScore, UpdateScoringResetMatch }) => {
  const { match_id, fs_home, fs_away, ft_process_status, ft_score_status, is_live } = record
  const DisplayScoreFT = () => {
    return (
      ft_score_status === 'Y' && (
        <>
          {fs_home}
          <br />
          {fs_away}
        </>
      )
    )
  }
  const DisplayScoreInputFT = () => {
    return (
      <>
        <Form.Item
          name={[match_id, 'fs_home']}
          rules={[{ required: true, message: 'Required FT Home' }]}
        >
          <InputNumber min={0} style={{ width: 50 }} />
        </Form.Item>
        <Form.Item
          name={[match_id, 'fs_away']}
          rules={[{ required: true, message: 'Required FT Away' }]}
        >
          <InputNumber min={0} style={{ width: 50 }} />
        </Form.Item>
      </>
    )
  }

  const DisplayScoreStatusFT = () => {
    // if (ft_process_status === 'N')
    //   if (ft_score_status === 'Y' || ft_score_status === 'N') return null
    if (ft_score_status === 'Match Cancelled' || ft_score_status === '2nd Half Cancelled')
      return <Text type="danger">{ft_score_status}</Text>
    return null
  }
  const DisplayProcessStatusFT = () => {
    return ft_process_status === 'Y' && <Text type="success">Processed</Text>
  }
  const DisplayCheckboxFT = () => {
    // not processed and ((not canceled))
    if (
      ft_process_status === 'N' &&
      ((ft_score_status === 'N' && is_live === 'N') || ft_score_status === 'Y')
    )
      return (
        <Form.Item name={[match_id, 'process_ft']} valuePropName="checked" noStyle>
          <Checkbox />
        </Form.Item>
      )
    return null
  }
  const resetFieldFT = () => UpdateScoringResetMatch({ match_id, scoring_type: 'FS' }, refreshScore)
  const DisplayResetButtonFT = () => {
    // not processed and scored
    if (ft_process_status === 'N' && ft_score_status === 'Y')
      return (
        <Button type="link" onClick={resetFieldFT} className="border-0">
          Reset
        </Button>
      )
    return null
  }
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
          <Row justify="space-between">
            <Col>
              {!showInput && <DisplayScoreFT />}
              {showInput && <DisplayScoreInputFT />}
            </Col>
            <Col align="right">
              <Space direction="vertical" size={0}>
                <DisplayScoreStatusFT />
                <DisplayProcessStatusFT />
                <DisplayCheckboxFT />
                {!showInput && <DisplayResetButtonFT />}
              </Space>
            </Col>
          </Row>
        )
      }}
    </Form.Item>
  )
}

const SCOREFGLG = ({ record, refreshScore, UpdateScoringResetMatch }) => {
  if (record.match_has_fglg_status !== 'Y') return <Text type="danger">NA</Text>
  const {
    match_id,
    fg_team,
    lg_team,
    fglg_process_status,
    fglg_score_status,
    ht_home,
    ht_away,
    fs_home,
    fs_away,
    is_live,
  } = record
  const DisplayScoreFGLG = () => {
    if (fglg_score_status !== 'Y') return null
    return getScoreGameTypeFGLG(fg_team, lg_team)
  }
  const DisplayScoreInputFGLG = ({ getFieldValue, setFieldsValue }) => {
    const fglgOptions = [
      { label: 'Home', value: -1 },
      { label: 'Away', value: 1 },
      // { label: 'No Goal', value: 0 },
      { label: 'Cancelled', value: 2 },
    ]
    if (ht_home === 0 && ht_away === 0 && fs_home === 0 && fs_away === 0)
      fglgOptions.splice(2, 0, { label: 'No Goal', value: 0 })

    const onChangeFGLG = key => value => {
      if (value === 0)
        setFieldsValue({
          [match_id]: {
            fg_team: 0,
            lg_team: 0,
          },
        })
      else {
        if (key === 'fg_team') {
          const val_lg = getFieldValue([match_id, 'lg_team'])
          if (val_lg === 0)
            setFieldsValue({
              [match_id]: { lg_team: null },
            })
        }
        if (key === 'lg_team') {
          const val_fg = getFieldValue([match_id, 'fg_team'])
          if (val_fg === 0)
            setFieldsValue({
              [match_id]: { fg_team: null },
            })
        }
      }
    }

    return (
      <>
        <Form.Item
          name={[match_id, 'fg_team']}
          rules={[{ required: true, message: 'Required FG Team' }]}
        >
          <Select options={fglgOptions} style={{ width: 75 }} onChange={onChangeFGLG('fg_team')} />
        </Form.Item>
        <Form.Item
          name={[match_id, 'lg_team']}
          rules={[{ required: true, message: 'Required LG Team' }]}
        >
          <Select options={fglgOptions} style={{ width: 75 }} onChange={onChangeFGLG('lg_team')} />
        </Form.Item>
      </>
    )
  }
  const DisplayProcessFGLG = () => {
    return fglg_process_status === 'Y' && <Text className="text-success">Processed</Text>
  }
  const DisplayCheckboxFGLG = () => {
    // not processed and ( ( not scored and not live ) or ( scored ))
    if (
      fglg_process_status === 'N' &&
      ((fglg_score_status === 'N' && is_live === 'N') || fglg_score_status === 'Y')
    )
      return (
        <Form.Item name={[match_id, 'process_fglg']} valuePropName="checked" noStyle>
          <Checkbox />
        </Form.Item>
      )
    return null
  }
  const resetFieldFGLG = () =>
    UpdateScoringResetMatch({ match_id, scoring_type: 'FGLG' }, refreshScore)
  const DisplayResetButtonFGLG = () => {
    if (fglg_process_status !== 'N') return null
    if (fglg_score_status === 'Y')
      return (
        <Button type="link" onClick={resetFieldFGLG} className="border-0">
          Reset
        </Button>
      )
    return null
  }

  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) =>
        prevValues[match_id]?.process_fglg !== currentValues[match_id]?.process_fglg
      }
    >
      {({ getFieldValue, setFieldsValue }) => {
        const showInput = getFieldValue([match_id, 'process_fglg'])

        return (
          <Row justify="space-between">
            <Col>
              {!showInput && <DisplayScoreFGLG />}
              {showInput && (
                <DisplayScoreInputFGLG
                  getFieldValue={getFieldValue}
                  setFieldsValue={setFieldsValue}
                />
              )}
            </Col>
            <Col align="right">
              <Space direction="vertical" size={0}>
                <DisplayProcessFGLG />
                <DisplayCheckboxFGLG />
                {!showInput && <DisplayResetButtonFGLG />}
              </Space>
            </Col>
          </Row>
        )
      }}
    </Form.Item>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoringMatch)
