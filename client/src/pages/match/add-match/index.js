import React, { useCallback, useEffect, useState } from 'react'
import {
  Form,
  Select,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Button,
  InputNumber,
  Modal,
  Spin,
  Space,
} from 'antd'
import { connect } from 'react-redux'
import actionsTeam from 'redux/team/actions'
import actionsSpecialCode from 'redux/special-code/actions'
import actionsLeague from 'redux/league/actions'
import actionsMatch from 'redux/match/actions'
import { CheckboxList, useGetDateTimeDBServer } from 'components/blaise'
import { throttle } from 'lodash'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapStateToProps = ({ team, specialCode, league }) => ({
  specialCodeOptions: specialCode.select_by_sport.map(e => ({
    value: e.special_code,
    label: e.special_name,
  })),
  loadingSearchLeague: league.loadingSearch,
  leagueSearch: league.select_in_addmatch,
  leagueOptions: league.select_in_addmatch?.map(e => ({
    value: e.league_id,
    label: e.league_name,
  })),
  loadingSearchTeam: team.loadingSearch,
  teamHomeOptions: team.select_in_addmatch_home?.map(e => ({
    value: e.team_id,
    label: e.team_name,
  })),
  teamAwayOptions: team.select_in_addmatch_away?.map(e => ({
    value: e.team_id,
    label: e.team_name,
  })),
})

const mapDispatchToProps = dispatch => ({
  LoadSpecialCode: payload =>
    dispatch({ type: actionsSpecialCode.LOAD_BY_SPORT, payload, source: 'Match - Add Match' }),
  SearchLeague: payload =>
    dispatch({ type: actionsLeague.LOAD_SELECT_IN_ADDMATCH, payload, source: 'Match - Add Match' }),
  SearchTeam: payload =>
    dispatch({ type: actionsTeam.LOAD_SELECT_IN_ADDMATCH, payload, source: 'Match - Add Match' }),
  CreateMatch: (payload, successCallback) =>
    dispatch({ type: actionsMatch.CREATE, payload, successCallback, source: 'Match - Add Match' }),

  CleanUpSpecialCode: () => dispatch({ type: actionsSpecialCode.CLEAN_UP_BY_SPORT }),
  CleanUpTeam: () => dispatch({ type: actionsTeam.CLEAN_UP }),
  CleanUpLeague: () => dispatch({ type: actionsLeague.CLEAN_UP }),
})

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeDBServer()
    ?.hour(0)
    .minute(0)
    .second(0)
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const AddMatch = wrapperDate(
  ({
    specialCodeOptions,
    loadingSearchLeague,
    leagueSearch,
    leagueOptions,
    loadingSearchTeam,
    teamHomeOptions,
    teamAwayOptions,
    defaultDateTime,
    LoadSpecialCode,
    SearchLeague,
    SearchTeam,
    CreateMatch,
    CleanUpSpecialCode,
    CleanUpTeam,
    CleanUpLeague,
  }) => {
    const { sportOptions } = useSelectOptions()
    React.useEffect(() => {
      return () => {
        CleanUpTeam()
        CleanUpLeague()
        CleanUpSpecialCode()
      }
    }, [CleanUpTeam, CleanUpLeague, CleanUpSpecialCode])

    const [form] = Form.useForm()
    const [tempCategory, setTempCategory] = useState([])

    useEffect(() => {
      LoadSpecialCode({ sport_id: 10 })
    }, [LoadSpecialCode])

    const searchTeamHome = React.useCallback(
      throttle(value => {
        if (value.length > 0)
          SearchTeam({ ...form.getFieldsValue(), team_name: value, key: 'home' })
      }, 500),
      [SearchTeam, form],
    )
    const searchTeamAway = React.useCallback(
      throttle(value => {
        if (value.length > 0)
          SearchTeam({ ...form.getFieldsValue(), team_name: value, key: 'away' })
      }, 500),
      [SearchTeam, form],
    )
    const searchLeague = React.useCallback(
      throttle(value => {
        if (value.length > 0) SearchLeague({ ...form.getFieldsValue(), league_name: value })
      }, 500),
      [SearchLeague, form],
    )

    const setCategoryLeague = value => {
      const category = leagueSearch.find(e => e.league_id === value)?.category.split('^')
      form.setFieldsValue({ category })
      setTempCategory(category)
    }

    const getCategoryDisabled = useCallback(
      value => {
        if (!tempCategory || tempCategory.length === 0) return false
        return (
          tempCategory.length > 0 &&
          !tempCategory.includes(value) &&
          form.getFieldValue('league_id')
        )
      },
      [tempCategory, form],
    )

    return (
      <>
        <div className="card">
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            labelAlign="left"
            initialValues={{
              sport_id: 10,
              website: 'ALL',
              rb_delay_home: 9999,
              rb_delay_away: 9999,
              rb_delay_over: 9999,
              rb_delay_under: 9999,
              category: [],
              match_date: defaultDateTime,
              match_time: defaultDateTime,
            }}
            onFinish={values => {
              const match_status = {
                hidden_time: 0,
                open: 'N',
                live: 'N',
                has_live: 'N',
                neutral_ground: 'N',
              }
              if (values.match_status) {
                values.match_status.forEach(key => {
                  let v = 'Y'
                  if (key === 'hidden_time') v = 1
                  match_status[key] = v
                })
              }

              const payload = {
                ...values,
                ...match_status,
                category: values.category.join('^'),
                match_date: values.match_date
                  .hour(values.match_time.hour())
                  .minute(values.match_time.minute())
                  .format('YYYY-MM-DD HH:mm:ss'),
              }
              CreateMatch(payload, response => {
                if (response.status === -1) {
                  Modal.confirm({
                    title: `Match already exist ! Are you sure want to create?`,
                    okText: 'Yes',
                    cancelText: 'No',
                    onOk: () => {
                      CreateMatch(
                        {
                          ...payload,
                          force_create_match: 'Y',
                        },
                        () => form.resetFields(),
                      )
                    },
                  })
                } else form.resetFields()
              })
            }}
          >
            <div className="card-body">
              <Form.Item name="website" label="Website">
                <Select
                  placeholder="Select Website"
                  showSearch
                  options={[
                    { value: 'ALL', label: 'ALL' },
                    { value: 'SBO', label: 'SBO' },
                    { value: 'IBC', label: 'IBC' },
                  ]}
                  onChange={() => {
                    form.resetFields(['league_id', 'team_home', 'team_away', 'category'])
                    setTempCategory([])
                    CleanUpTeam()
                    CleanUpLeague()
                  }}
                  className="w-50"
                />
              </Form.Item>
              <Form.Item
                name="sport_id"
                label="Sport"
                rules={[{ required: true, message: 'Please select sport' }]}
              >
                <Select
                  className="w-50"
                  placeholder="Select Sport"
                  showSearch
                  options={sportOptions}
                  optionFilterProp="label"
                  onChange={value => {
                    LoadSpecialCode({ sport_id: value })
                    form.resetFields([
                      'league_id',
                      'match_status',
                      'team_home',
                      'team_away',
                      'special_code',
                      'category',
                    ])
                    setTempCategory([])
                    CleanUpLeague()
                    CleanUpTeam()
                    CleanUpSpecialCode()
                  }}
                />
              </Form.Item>
              <Form.Item
                name="league_id"
                label="League"
                extra="*Type or Copy Paste League name to select"
                rules={[{ required: true, message: 'Please select league' }]}
              >
                <Select
                  options={leagueOptions}
                  placeholder="League"
                  showSearch
                  allowClear
                  filterOption={false}
                  suffixIcon={null}
                  dropdownRender={menu => (loadingSearchLeague ? <Spin /> : menu)}
                  onSearch={searchLeague}
                  onChange={value => {
                    form.resetFields(['team_home', 'team_away'])
                    CleanUpTeam()
                    setCategoryLeague(value)
                  }}
                />
              </Form.Item>
              <Form.Item label="Team" extra="*Type or Copy Paste Team name to select">
                <Space.Compact className="w-100">
                  <Form.Item
                    name="team_home"
                    className="w-50 mb-0"
                    rules={[{ required: true, message: 'Please select home' }]}
                  >
                    <Select
                      className="w-100"
                      options={teamHomeOptions}
                      placeholder="Team Home"
                      showSearch
                      allowClear
                      filterOption={false}
                      suffixIcon={null}
                      dropdownRender={menu => (loadingSearchTeam ? <Spin /> : menu)}
                      onSearch={searchTeamHome}
                    />
                  </Form.Item>
                  <Form.Item
                    name="team_away"
                    className="w-50 mb-0"
                    rules={[{ required: true, message: 'Please select away' }]}
                  >
                    <Select
                      className="w-100"
                      options={teamAwayOptions}
                      placeholder="Team Away"
                      showSearch
                      allowClear
                      filterOption={false}
                      suffixIcon={null}
                      dropdownRender={menu => (loadingSearchTeam ? <Spin /> : menu)}
                      onSearch={searchTeamAway}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
              <Form.Item
                name="match_parent_id"
                label="Match Parent ID"
                extra="*for Special Match only"
              >
                <InputNumber className="w-100" />
              </Form.Item>
              <Form.Item name="special_code" label="Special Code" extra="*for Special Match only">
                <Select allowClear showSearch options={specialCodeOptions} className="w-100" />
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
              <Form.Item name="match_status" label="Match Status">
                <CheckboxList
                  columns={1}
                  options={[
                    { value: 'hidden_time', label: 'Hidden Time' },
                    { value: 'open', label: 'Open' },
                    {
                      value: 'live',
                      label: (
                        <>
                          <span>Live </span>
                          <span style={{ color: 'red' }}>*Go to MO - Edit to make Go Live</span>
                        </>
                      ),
                      disabled: true,
                    },
                    {
                      value: 'has_live',
                      label: (
                        <>
                          <span>Has Live </span>
                          <span style={{ color: 'red' }}>*Tick if match has live games</span>
                        </>
                      ),
                    },
                    { value: 'neutral_ground', label: 'Neutral Ground' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="category" label="Category">
                <CheckboxList
                  columns={5}
                  options={[
                    { value: '0', label: 'Normal', disabled: getCategoryDisabled('0') },
                    { value: '3', label: 'World Cup', disabled: getCategoryDisabled('3') },
                    { value: '2', label: 'Olympic', disabled: getCategoryDisabled('2') },
                    { value: '4', label: 'Euro', disabled: getCategoryDisabled('4') },
                    { value: '5', label: 'Copa', disabled: getCategoryDisabled('5') },
                    { value: '1', label: 'Special - Normal', disabled: getCategoryDisabled('1') },
                    {
                      value: '31',
                      label: 'Special - World Cup',
                      disabled: getCategoryDisabled('31'),
                    },
                    {
                      value: '21',
                      label: 'Special - Olympic',
                      disabled: getCategoryDisabled('21'),
                    },
                    { value: '41', label: 'Special - Euro', disabled: getCategoryDisabled('41') },
                    { value: '51', label: 'Special - Copa', disabled: getCategoryDisabled('51') },
                  ]}
                />
              </Form.Item>
              <Form.Item label="RB Delay">
                <Row>
                  <Col span={6}>
                    <Form.Item name="rb_delay_home" label="Home">
                      <InputNumber min={0} max={9999} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="rb_delay_away" label="Away">
                      <InputNumber min={0} max={9999} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <Form.Item name="rb_delay_over" label="Over">
                      <InputNumber min={0} max={9999} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="rb_delay_under" label="Under">
                      <InputNumber min={0} max={9999} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 4 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(AddMatch)
