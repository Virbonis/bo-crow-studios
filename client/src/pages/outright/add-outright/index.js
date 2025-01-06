import React, { useEffect, useState } from 'react'
import {
  Form,
  Select,
  DatePicker,
  Checkbox,
  InputNumber,
  TimePicker,
  Button,
  Spin,
  Table,
  message,
  Tooltip,
} from 'antd'
import { connect } from 'react-redux'
import { throttle } from 'lodash'
import actionsTeam from 'redux/team/actions'
import actionsLeague from 'redux/league/actions'
import actions from 'redux/outright/actions'
import { useGetDateTimeDBServer } from 'components/blaise'
import { DeleteOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'

const mapStateToProps = ({ team, league, outright }) => ({
  teamOptions: team.select_in_outright?.map(e => ({
    value: e.team_id,
    label: e.team_name,
  })),
  leagueSearchOptions: league.select_in_outright?.map(e => ({
    value: e.league_id,
    label: e.league_name,
  })),
  loadingSearchLeague: league.loadingSearch,
  leagueSearch: league.select_in_addmatch,
  loadingSearchTeam: team.loadingSearch,
  loading: outright.loading,
})

const mapDispatchToProps = dispatch => ({
  SearchTeam: payload =>
    dispatch({
      type: actionsTeam.LOAD_SELECT_IN_OUTRIGHT,
      payload,
      source: 'Outright - Add Outright',
    }),
  LoadLeagueAddMatch: payload =>
    dispatch({
      type: actionsLeague.LOAD_SELECT_IN_OUTRIGHT,
      payload,
      source: 'Outright - Add Outright',
    }),
  CreateOutright: (payload, successCallback) =>
    dispatch({
      type: actions.CREATE_OUTRIGHT,
      payload,
      successCallback,
      source: 'Outright - Add Outright',
    }),
  CleanUpTeam: () => dispatch({ type: actionsTeam.CLEAN_UP, source: 'Outright - Add Outright' }),
  CleanUpLeague: () =>
    dispatch({ type: actionsLeague.CLEAN_UP, source: 'Outright - Add Outright' }),
})

const wrapperDate = Component => props => {
  const defaultDateTimeServer = useGetDateTimeDBServer()
    ?.hour(0)
    .minute(0)
    .second(0)
  if (!defaultDateTimeServer) return null
  return <Component {...props} defaultDateTimeServer={defaultDateTimeServer} />
}

const AddOutright = wrapperDate(
  ({
    leagueSearchOptions,
    SearchTeam,
    LoadLeagueAddMatch,
    loadingSearchLeague,
    loadingSearchTeam,
    defaultDateTimeServer,
    CleanUpTeam,
    CleanUpLeague,
    teamOptions,
    CreateOutright,
    loading,
  }) => {
    const [form] = Form.useForm()
    const [tableData, setTableData] = useState([])

    const { sportOptions } = useSelectOptions()

    useEffect(() => {
      const initialValueTable = tableData.reduce((acc, curr) => {
        const { team_id, team_odds = 0, team_seq = 0 } = curr

        acc[team_id] = { team_odds, team_seq }
        return acc
      }, {})

      form.setFieldsValue({
        teams: initialValueTable,
      })
    }, [form, tableData])

    const searchLeague = React.useCallback(
      throttle(value => {
        if (value.length > 0)
          LoadLeagueAddMatch({ ...form.getFieldsValue(), website: 'ALL', league_name: value })
        else CleanUpLeague()
      }, 500),
      [LoadLeagueAddMatch, form],
    )

    const searchTeam = React.useCallback(
      throttle(value => {
        if (value.length > 0) SearchTeam({ ...form.getFieldsValue(), team_name: value })
        else CleanUpTeam()
      }, 500),
      [SearchTeam, form],
    )

    const columns = [
      {
        title: 'Team',
        dataIndex: 'team_name',
        width: 500,
      },
      {
        title: 'Odds',
        align: 'center',
        width: 100,
        render: record => (
          <Form.Item name={['teams', record.team_id, 'team_odds']}>
            <InputNumber min={0} maxLength={5} />
          </Form.Item>
        ),
      },
      {
        title: 'Seq',
        align: 'center',
        width: 100,
        render: record => (
          <Form.Item name={['teams', record.team_id, 'team_seq']}>
            <InputNumber min={0} maxLength={5} />
          </Form.Item>
        ),
      },
      {
        title: 'Open',
        width: 80,
        align: 'center',
        render: record => (
          <Form.Item name={['teams', record.team_id, 'team_open_status']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        ),
      },
      {
        title: 'Pause',
        align: 'center',
        width: 80,
        render: record => (
          <Form.Item name={['teams', record.team_id, 'team_pause_status']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        ),
      },
      {
        title: 'Action',
        width: 80,
        align: 'center',
        render: record => (
          <Tooltip title="Delete">
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => DeleteTeamHandler(record)}
            />
          </Tooltip>
        ),
      },
    ]

    const DeleteTeamHandler = record => {
      const deleteTeam = tableData.filter(data => data.team_id !== record.team_id)
      setTableData(deleteTeam)
    }

    const reload = () => {
      form.resetFields()
      setTableData([])
      CleanUpTeam()
    }

    const onSelectTeam = value => {
      if (value !== undefined) {
        const isExist = tableData.some(x => x.team_id === value)

        const teamName = teamOptions.find(x => x.value === value)?.label
        if (!isExist)
          setTableData(prevData => prevData.concat({ team_id: value, team_name: teamName }))
        else message.warning(`Team : [${teamName}] already exist!`)
      }
    }

    return (
      <>
        <div className="card">
          <Spin spinning={loading}>
            <Form
              form={form}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              labelAlign="left"
              initialValues={{
                outright_date: defaultDateTimeServer,
                sport_id: 10,
              }}
              onFinish={values => {
                const convertValue = Object.entries(values.teams).map(([key, val]) => {
                  return {
                    team_id: Number(key),
                    ...val,
                    team_open_status: val.team_open_status ? 'Y' : 'N',
                    team_pause_status: val.team_pause_status ? 'Y' : 'N',
                  }
                })
                CreateOutright(
                  {
                    sport_id: values.sport_id,
                    league_id: Number(values.league),
                    limit_change: values.limit_change,
                    max_payout: values.max_payout,
                    price_step: values.price_step,
                    outright_open_status: values.outright_open_status ? 'Y' : 'N',
                    outright_date: values.outright_date.format('YYYY-MM-DD HH:mm'),
                    teams: convertValue,
                  },
                  reload,
                )
              }}
            >
              <div className="card-body">
                <Form.Item
                  name="sport_id"
                  label="Sport"
                  rules={[{ required: true, message: 'Please select sport' }]}
                >
                  <Select
                    placeholder="Select Sport"
                    onChange={() => {
                      form.resetFields(['league'])
                      CleanUpLeague()
                    }}
                    showSearch
                    className="w-50"
                    options={sportOptions}
                  />
                </Form.Item>
                <Form.Item
                  name="league"
                  label="League"
                  extra="*Type or Copy Paste League name to select"
                  rules={[{ required: true, message: 'Please select league' }]}
                >
                  <Select
                    className="w-100"
                    options={leagueSearchOptions}
                    placeholder="Search League"
                    dropdownRender={menu =>
                      loadingSearchLeague ? (
                        <div align="center">
                          <Spin />
                        </div>
                      ) : (
                        menu
                      )
                    }
                    notFoundContent={loadingSearchLeague ? <Spin /> : null}
                    filterOption={false}
                    showSearch
                    allowClear
                    onSearch={searchLeague}
                    onChange={() => {
                      CleanUpTeam()
                    }}
                  />
                </Form.Item>
                <Form.Item label="Outright Date">
                  <Form.Item
                    className="mb-0 d-inline-block"
                    name="outright_date"
                    rules={[{ required: true, message: 'Please input date!' }]}
                  >
                    <DatePicker allowClear format="YYYY-MM-DD" />
                  </Form.Item>
                  <Form.Item
                    className="mb-0 d-inline-block"
                    name="outright_date"
                    rules={[{ required: true, message: 'Please input time!' }]}
                  >
                    <TimePicker format="HH:mm" />
                  </Form.Item>
                </Form.Item>
                <Form.Item name="outright_open_status" label="Open" valuePropName="checked">
                  <Checkbox />
                </Form.Item>
                <Form.Item
                  name="max_payout"
                  label="Max Payout"
                  rules={[{ required: true, message: 'Please input Max Payout' }]}
                >
                  <InputNumber className="w-25" min={1} maxLength={10} />
                </Form.Item>
                <Form.Item
                  name="price_step"
                  label="Price Step"
                  rules={[{ required: true, message: 'Please input Price Step' }]}
                >
                  <InputNumber className="w-25" min={1} maxLength={5} />
                </Form.Item>
                <Form.Item
                  name="limit_change"
                  label="Limit Change"
                  rules={[{ required: true, message: 'Please input Limit Change' }]}
                >
                  <InputNumber className="w-25" min={0.01} maxLength={8} />
                </Form.Item>
                <Form.Item
                  name="search_team"
                  label="Team"
                  extra="*Type or Copy Paste Team name to select"
                >
                  <Select
                    className="w-100"
                    options={teamOptions}
                    placeholder="Search Team"
                    showSearch
                    allowClear
                    filterOption={false}
                    suffixIcon={null}
                    dropdownRender={menu =>
                      loadingSearchTeam ? (
                        <div align="center">
                          <Spin />
                        </div>
                      ) : (
                        menu
                      )
                    }
                    notFoundContent={loadingSearchTeam ? <Spin /> : null}
                    onSearch={searchTeam}
                    onClear={CleanUpTeam}
                    onSelect={onSelectTeam}
                  />
                </Form.Item>
                <Form.Item
                  name="teams"
                  wrapperCol={{ offset: 4, span: 20 }}
                  rules={[
                    {
                      validator: () => {
                        if (tableData.length === 0)
                          return Promise.reject(new Error('Team cannot be empty'))
                        return Promise.resolve()
                      },
                    },
                  ]}
                >
                  <Table
                    rowKey={record => record.team_id}
                    columns={columns}
                    size="small"
                    bordered
                    dataSource={tableData}
                    pagination={false}
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 4 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Spin>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(AddOutright)
