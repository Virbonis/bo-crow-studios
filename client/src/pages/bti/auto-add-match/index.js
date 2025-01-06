import React from 'react'
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { useGetDateTimeDBServer } from 'components/blaise'
import actions from 'redux/bti-auto-add-match/actions'
import { debounce } from 'lodash'
import BTIMatchInsert from './match-bti-insert'
import BTIMatchList from './match-bti-list'

const mapStateToProps = ({ BTIautoAddMatch }) => ({
  loadingLeagueUnmapped: BTIautoAddMatch.loading_league_unmapped,
  leagueOptionsUnmapped: [{ value: 0, label: 'All League' }].concat(
    BTIautoAddMatch.select_league_unmapped.map(e => ({
      value: e.league_id,
      label: e.league_name,
    })),
  ),
  loadingLeagueMapped: BTIautoAddMatch.loading_league_mapped,
  leagueOptionsMapped: [{ value: 0, label: 'All League' }].concat(
    BTIautoAddMatch.select_league_mapped.map(e => ({
      value: e.league_id,
      label: e.league_name,
    })),
  ),
})

const mapDispatchToProps = dispatch => ({
  LoadLeague: payload => {
    dispatch({
      type: actions.LOAD_SELECT_LEAGUE,
      payload,
      bti: 0,
      source: 'BTI Auto Add Match',
    })
  },
  LoadMatchUnmapped: payload => {
    dispatch({
      type: actions.LOAD_UNMAPPED,
      payload,
      source: 'BTI Auto Add Match',
    })
  },
  LoadMatchMapped: payload => {
    dispatch({
      type: actions.LOAD_MAPPED,
      payload,
      source: 'BTI Auto Add Match',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
  ClearTableUnmapped: () => dispatch({ type: actions.CLEAR_TABLE_UNMAPPED }),
  ClearTableMapped: () => dispatch({ type: actions.CLEAR_TABLE_MAPPED }),
})

const sportOptions = [
  { value: 60, label: 'M Cricket' },
  { value: 59, label: 'M Basketball' },
]
const { RangePicker } = DatePicker

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeDBServer()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}
const BTIAutoAddMatch = wrapperDate(
  ({
    defaultDateTime,
    loadingLeagueUnmapped,
    leagueOptionsUnmapped,
    loadingLeagueMapped,
    leagueOptionsMapped,

    LoadLeague,
    LoadMatchUnmapped,
    LoadMatchMapped,
    CleanUp,
    ClearTableUnmapped,
    ClearTableMapped,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const [formMain] = Form.useForm()
    const [formUnmapped] = Form.useForm()
    const [formMapped] = Form.useForm()

    const reloadLeague = React.useCallback(() => {
      formMain.submit()
    }, [formMain])
    React.useEffect(() => {
      reloadLeague()
    }, [reloadLeague])

    const reloadUnmapped = React.useCallback(() => {
      formUnmapped.submit()
    }, [formUnmapped])
    const reloadMapped = React.useCallback(() => {
      formMapped.submit()
    }, [formMapped])

    return (
      <div className="card">
        <div className="card-header">
          <Row justify="center">
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={6}>
              <Form
                form={formMain}
                className="d-flex flex-column justify-content-center"
                initialValues={{
                  m_sport_id: 60,
                  mapping_status: 0,
                  date: [
                    defaultDateTime.clone().startOf('day'),
                    defaultDateTime.clone().endOf('day'),
                  ],
                }}
                onValuesChange={() => reloadLeague()}
                onFinish={value => {
                  LoadLeague({
                    ...value,
                    from_early_date: value.date[0].format('YYYY-MM-DD 00:00'),
                    to_early_date: value.date[1].format('YYYY-MM-DD 23:59'),
                  })
                  ClearTableUnmapped()
                  formUnmapped.resetFields()
                  formUnmapped.submit()
                  ClearTableMapped()
                  formMapped.resetFields()
                  formMapped.submit()
                }}
              >
                <Form.Item name="m_sport_id">
                  <Select options={sportOptions} />
                </Form.Item>
                <Form.Item name="date">
                  <RangePicker className="w-100" format="YYYY-MM-DD" allowClear={false} />
                </Form.Item>
                <Button
                  type="link"
                  loading={loadingLeagueUnmapped || loadingLeagueMapped}
                  icon={<ReloadOutlined />}
                  onClick={() => formMain.submit()}
                >
                  Refresh League Options
                </Button>
              </Form>
            </Col>
          </Row>
          <Row gutter={10} justify="center">
            <Col xs={12} sm={12} md={8} lg={8} xl={6} xxl={4}>
              <Form
                id="formInsert"
                form={formUnmapped}
                initialValues={{ league_id: 0 }}
                onValuesChange={() => reloadUnmapped()}
                onFinish={value => {
                  const valueFormMain = formMain.getFieldsValue()
                  LoadMatchUnmapped({
                    ...value,
                    ...valueFormMain,
                    mapping_status: 0,
                    from_early_date: valueFormMain.date[0].format('YYYY-MM-DD 00:00'),
                    to_early_date: valueFormMain.date[1].format('YYYY-MM-DD 23:59'),
                  })
                }}
                onFinishFailed={({ outOfDate }) => {
                  if (outOfDate) reloadUnmapped()
                }}
              >
                <Form.Item
                  name="league_id"
                  rules={[{ required: true, message: 'Please select league' }]}
                >
                  <Select
                    showSearch
                    placeholder="Select League"
                    loading={loadingLeagueUnmapped}
                    options={leagueOptionsUnmapped}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={12} sm={12} md={8} lg={8} xl={6} xxl={4}>
              <Form
                id="formList"
                form={formMapped}
                initialValues={{ league_id: 0 }}
                onValuesChange={debounce(() => reloadMapped(), 300)}
                onFinish={value => {
                  const valueFormMain = formMain.getFieldsValue()
                  LoadMatchMapped({
                    ...value,
                    ...valueFormMain,
                    mapping_status: 1,
                    from_early_date: valueFormMain.date[0].format('YYYY-MM-DD 00:00'),
                    to_early_date: valueFormMain.date[1].format('YYYY-MM-DD 23:59'),
                  })
                }}
                onFinishFailed={({ outOfDate }) => {
                  if (outOfDate) reloadMapped()
                }}
              >
                <Form.Item
                  name="league_id"
                  rules={[{ required: true, message: 'Please select league' }]}
                >
                  <Select
                    showSearch
                    placeholder="Select League"
                    loading={loadingLeagueMapped}
                    options={leagueOptionsMapped}
                  />
                </Form.Item>
                <Form.Item name="match_id">
                  <Input placeholder="Input Match ID" />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
        <div className="card-body">
          <Row gutter={10} className="h-100">
            <Col span={12} className="h-100">
              <BTIMatchInsert successCallback={reloadUnmapped} />
            </Col>
            <Col span={12} className="h-100">
              <BTIMatchList />
            </Col>
          </Row>
        </div>
      </div>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(BTIAutoAddMatch)
