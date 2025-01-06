import React from 'react'
import { DatePicker, Form, Select, InputNumber, Spin, Row } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/knockouts/actions'
import actionsTeam from 'redux/team/actions'
import { throttle } from 'lodash'
import dayjs from 'dayjs'
import { resultStateOptions } from 'helper'

const mapStateToProps = ({ team }, { editValue }) => ({
  loadingSearch: team.loadingSearch,
  team1Options:
    team.select_in_knockouts_team1.length > 0
      ? team.select_in_knockouts_team1?.map(e => ({
          value: e.team_id,
          label: e.team_name,
        }))
      : [
          // set defaultvalue for team1
          {
            value: editValue.team_id_1,
            label: editValue.home_name,
          },
        ],
  team2Options:
    team.select_in_knockouts_team2.length > 0
      ? team.select_in_knockouts_team2.map(e => ({
          value: e.team_id,
          label: e.team_name,
        }))
      : [
          // set defaultvalue for team2
          {
            value: editValue.team_id_2,
            label: editValue.away_name,
          },
        ],
})

const mapDispatchToProps = dispatch => ({
  UpdateKnockouts: (payload, successCallback) => [
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Knockouts',
    }),
  ],
  LoadTeam: payload => {
    dispatch({
      type: actionsTeam.LOAD_SELECT_IN_KNOCKOUTS,
      payload: {
        ...payload,
        website: 'ALL',
        sport_id: 10,
      },
      source: 'Knockouts',
    })
  },
  CleanUpTeam: () => dispatch({ type: actionsTeam.CLEAN_UP }),
})

const EditForm = ({
  editValue,
  loadingSearch,
  team1Options,
  team2Options,
  successCallback,
  UpdateKnockouts,
  LoadTeam,
  CleanUpTeam,
}) => {
  React.useEffect(() => {
    return () => CleanUpTeam()
  }, [CleanUpTeam])

  const [formEdit] = Form.useForm()

  React.useEffect(() => {
    const arrScore1 = editValue.result.split('|')[0].split('-') || []
    const arrScore2 = editValue.result?.split('|')[1]?.split('-') || []
    const score = {
      result_home_1: arrScore1[0],
      result_away_1: arrScore1[1],
      result_home_2: arrScore2[0],
      result_away_2: arrScore2[1],
    }
    formEdit.setFieldsValue({
      ...editValue,
      ...score,
      team_id_1: editValue.team_id_1 ? editValue.team_id_1 : undefined,
      team_id_2: editValue.team_id_2 ? editValue.team_id_2 : undefined,
      match_date: dayjs.utc(editValue.match_date),
    })
  }, [editValue, formEdit])

  const searchTeam1 = React.useCallback(
    throttle(value => {
      if (value.length > 0) LoadTeam({ team_name: value, key: 'team1' })
    }, 500),
    [LoadTeam],
  )
  const searchTeam2 = React.useCallback(
    throttle(value => {
      if (value.length > 0) LoadTeam({ team_name: value, key: 'team2' })
    }, 500),
    [LoadTeam],
  )

  return (
    <>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        id="edit-form"
        className="w-100"
        onFinish={value => {
          let result = ''
          if (['FT', 'ET'].includes(value.results_state))
            result = `${value.result_home_1}-${value.result_away_1}`
          if (value.results_state === 'PEN')
            result = `${value.result_home_1}-${value.result_away_1}|${value.result_home_2}-${value.result_away_2}`

          UpdateKnockouts(
            {
              ...editValue,
              ...value,
              result,
              row_id: editValue.row_id,
              match_date: value.match_date?.format('YYYY-MM-DD HH:mm'),
            },
            successCallback,
          )
        }}
        form={formEdit}
      >
        <Form.Item label="Category">{editValue.category}</Form.Item>
        <Form.Item label="Knockout ID">{editValue.knockouts_id}</Form.Item>
        <Form.Item
          label="Knockout Round"
          name="knockouts_round"
          rules={[{ required: true, message: 'Please input knockout round!' }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Team 1" name="team_id_1" extra="*Type or Copy Paste Team name to select">
          <Select
            options={team1Options}
            placeholder="Team Name"
            showSearch
            allowClear
            filterOption={false}
            suffixIcon={null}
            dropdownRender={menu => (loadingSearch ? <Spin /> : menu)}
            onSearch={searchTeam1}
          />
        </Form.Item>
        <Form.Item label="Team 2" name="team_id_2" extra="*Type or Copy Paste Team name to select">
          <Select
            options={team2Options}
            placeholder="Team Name"
            showSearch
            allowClear
            filterOption={false}
            suffixIcon={null}
            dropdownRender={menu => (loadingSearch ? <Spin /> : menu)}
            onSearch={searchTeam2}
          />
        </Form.Item>
        <Form.Item
          label="Match Date"
          name="match_date"
          rules={[{ required: true, message: 'Please input match date!' }]}
        >
          <DatePicker showTime={{ format: 'HH:mm' }} />
        </Form.Item>
        <Form.Item label="Result State" name="results_state">
          <Select options={resultStateOptions} />
        </Form.Item>

        <Form.Item
          label="Result"
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.results_state !== currentValues.results_state
          }
        >
          {({ getFieldValue }) => {
            const value = getFieldValue('results_state')

            if (['FT', 'ET'].includes(value))
              return (
                <Row>
                  <Form.Item
                    name="result_home_1"
                    rules={[{ required: true, message: 'Please input home!' }]}
                  >
                    <InputNumber min={0} placeholder="Home" />
                  </Form.Item>
                  <Form.Item
                    name="result_away_1"
                    rules={[{ required: true, message: 'Please input away!' }]}
                  >
                    <InputNumber min={0} placeholder="Away" />
                  </Form.Item>
                </Row>
              )
            if (value === 'PEN')
              return (
                <>
                  <Row>
                    <Form.Item
                      name="result_home_1"
                      rules={[{ required: true, message: 'Please input home!' }]}
                    >
                      <InputNumber min={0} placeholder="Home" />
                    </Form.Item>
                    <Form.Item
                      name="result_away_1"
                      rules={[{ required: true, message: 'Please input away!' }]}
                    >
                      <InputNumber min={0} placeholder="Away" />
                    </Form.Item>
                  </Row>
                  <Row>
                    <Form.Item
                      name="result_home_2"
                      rules={[{ required: true, message: 'Please input home pen!' }]}
                    >
                      <InputNumber min={0} placeholder="Home PEN" />
                    </Form.Item>
                    <Form.Item
                      name="result_away_2"
                      rules={[{ required: true, message: 'Please input away pen!' }]}
                    >
                      <InputNumber min={0} placeholder="Away PEN" />
                    </Form.Item>
                  </Row>
                </>
              )
            return null
          }}
        </Form.Item>
      </Form>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditForm)
