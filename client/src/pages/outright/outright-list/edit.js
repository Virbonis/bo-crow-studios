import React, { useEffect, useState } from 'react'
import {
  Form,
  Select,
  DatePicker,
  Checkbox,
  InputNumber,
  TimePicker,
  Spin,
  Table,
  message,
  Typography,
} from 'antd'
import { connect } from 'react-redux'
import { throttle } from 'lodash'
import actionsTeam from 'redux/team/actions'
import actions from 'redux/outright/actions'
import authEnum from 'authorize'
import dayjs from 'dayjs'

const mapStateToProps = ({ team, outright, auth }) => ({
  teamOptions: team.select_in_outright?.map(e => ({
    value: e.team_id,
    label: e.team_name,
  })),
  outright: outright.dataEdit.outright || {},
  outrightTeam: outright.dataEdit.team || [],
  loading: outright.loadingData,
  loadingSearchTeam: team.loadingSearch,
  cantEditOutright: auth.user.user_auth_ids.includes(authEnum.DISALLOW_EDIT_OUTRIGHT),
})

const mapDispatchToProps = dispatch => ({
  LoadEditOutright: payload => {
    dispatch({
      type: actions.LOAD_EDIT_OUTRIGHT,
      payload,
      source: 'Outright - Edit Outright',
    })
  },
  UpdateEditOutright: (payload, successCallback) =>
    dispatch({
      type: actions.UPDATE_EDIT_OUTRIGHT,
      payload,
      successCallback,
      source: 'Outright - Edit Outright',
    }),
  SearchTeam: payload =>
    dispatch({
      type: actionsTeam.LOAD_SELECT_IN_OUTRIGHT,
      payload,
      source: 'Outright - Edit Outright',
    }),
  CleanUpTeam: () => dispatch({ type: actionsTeam.CLEAN_UP }),
})

const EditOutright = ({
  editValue,

  loadingSearchTeam,
  teamOptions,
  loading,
  outright,
  outrightTeam,

  SearchTeam,
  CleanUpTeam,
  LoadEditOutright,
  UpdateEditOutright,
  successCallback,
  cantEditOutright,
}) => {
  useEffect(() => {
    LoadEditOutright({ outright_id: editValue.outright_id })
    return () => CleanUpTeam()
  }, [editValue, LoadEditOutright, CleanUpTeam])

  const [form] = Form.useForm()
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    form.setFieldsValue({
      ...outright,
      outright_date: dayjs(outright?.outright_date),
      outright_open_status: outright?.outright_open_status === 'Y',
      outright_dead_heat_status: outright?.outright_dead_heat_status === 'Y',
    })

    setTableData(outrightTeam)
    const initialValueTable = outrightTeam?.reduce((acc, curr, index) => {
      const { team_open_status, team_pause_status } = curr
      acc[index] = {
        ...curr,
        team_open_status: team_open_status === 'Y',
        team_pause_status: team_pause_status === 'Y',
      }
      return acc
    }, {})
    form.setFieldsValue({ teams: initialValueTable })
  }, [form, outright, outrightTeam])

  const searchTeam = React.useCallback(
    throttle(value => {
      if (value.length > 0) SearchTeam({ sport_id: editValue.sport_id, team_name: value })
      else CleanUpTeam()
    }, 500),
    [SearchTeam, form, editValue],
  )

  const columns = [
    {
      title: 'Team',
      dataIndex: 'team_name',
      width: 400,
    },
    {
      title: 'Odds',
      align: 'center',
      width: 100,
      render: (text, record, index) => (
        <Form.Item name={['teams', index, 'team_odds']}>
          <InputNumber min={0} maxLength={5} />
        </Form.Item>
      ),
    },
    {
      title: 'Seq',
      align: 'center',
      width: 100,
      render: (text, record, index) => (
        <Form.Item name={['teams', index, 'team_seq']}>
          <InputNumber min={0} maxLength={5} />
        </Form.Item>
      ),
    },
    {
      title: 'Open',
      width: 80,
      align: 'center',
      render: (text, record, index) => (
        <Form.Item name={['teams', index, 'team_open_status']} valuePropName="checked">
          <Checkbox />
        </Form.Item>
      ),
    },
    {
      title: 'Pause',
      align: 'center',
      width: 80,
      render: (text, record, index) => (
        <Form.Item name={['teams', index, 'team_pause_status']} valuePropName="checked">
          <Checkbox />
        </Form.Item>
      ),
    },
  ]

  if (cantEditOutright)
    return (
      <Typography.Title type="danger">You dont have permission to edit outright</Typography.Title>
    )

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
    <Spin spinning={loading}>
      <Form
        form={form}
        id="edit-form"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        labelAlign="left"
        onFinish={values => {
          const teamsValue = Object.values(values.teams).map((data, index) => {
            const is_exist = !!data.team_id
            return {
              ...data,
              is_exist,
              team_id: is_exist ? outrightTeam[index].sequence : tableData[index].team_id,
              team_open_status: data.team_open_status ? 'Y' : 'N',
              team_pause_status: data.team_pause_status ? 'Y' : 'N',
            }
          })

          UpdateEditOutright(
            {
              ...values,
              teams: teamsValue,
              outright_id: editValue.outright_id,
              outright_date: values.outright_date.format('YYYY-MM-DD HH:mm'),
              outright_open_status: values.outright_open_status ? 'Y' : 'N',
              outright_dead_heat_status: values.outright_dead_heat_status ? 'Y' : 'N',
            },
            successCallback,
          )
        }}
      >
        <>
          <Form.Item label="Outright ID">{editValue.outright_id}</Form.Item>
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
          <Form.Item label="Sport">{outright?.sport_name}</Form.Item>
          <Form.Item name="outright_open_status" label="Open" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item name="outright_dead_heat_status" label="Dead Heat" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item
            name="max_payout"
            label="Max Payout"
            rules={[{ required: true, message: 'Please input Max Payout' }]}
          >
            <InputNumber
              className="w-25"
              min={1}
              max={999999999}
              maxLength={10}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
          <Form.Item
            name="price_step"
            label="Price Step"
            rules={[{ required: true, message: 'Please input Price Step' }]}
          >
            <InputNumber
              className="w-25"
              min={1}
              max={99999}
              maxLength={5}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
          <Form.Item
            name="limit_change"
            label="Limit Change"
            rules={[{ required: true, message: 'Please input Limit Change' }]}
          >
            <InputNumber
              className="w-25"
              min={0.01}
              max={9999999999}
              maxLength={8}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
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
        </>
      </Form>
    </Spin>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOutright)
