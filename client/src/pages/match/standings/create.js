import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select, InputNumber } from 'antd'
import actions from 'redux/standings/actions'
import actionsTeam from 'redux/team/actions'

const mapSateToProps = ({ standings, team }) => ({
  categoryOptions: standings.dataCategory.map(e => ({
    value: e.standings_category,
    label: e.standings_category,
  })),
  loadingSearch: team.loadingSearch,
  teamOptions: team.select_in_standings.map(e => ({
    value: e.team_id,
    label: e.team_name,
  })),
})

const mapDispatchToProps = dispatch => ({
  Create: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: 'Standings',
    })
  },
  LoadTeam: payload => {
    dispatch({
      type: actionsTeam.LOAD_SELECT_IN_STANDINGS,
      payload,
      source: 'Standings',
    })
  },
  CleanUpTeam: () => dispatch({ type: actionsTeam.CLEAN_UP }),
})

const CreateForm = ({
  categoryOptions,
  successCallback,
  loadingSearch,
  teamOptions,
  Create,
  LoadTeam,
  CleanUpTeam,
}) => {
  React.useEffect(() => {
    CleanUpTeam()
  }, [CleanUpTeam])

  const [form] = Form.useForm()

  const searchTeamName = value => {
    if (value.length > 1) LoadTeam({ website: 'ALL', sport_id: 10, team_name: value })
  }

  return (
    <>
      <Form
        id="add-form"
        labelAlign="left"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        initialValues={{
          category: categoryOptions[0].value,
          play: 0,
          win: 0,
          draw: 0,
          lose: 0,
          goal: 0,
          conceded: 0,
          points: 0,
          sort_number: 0,
        }}
        onFinish={values => {
          Create(values, successCallback)
        }}
      >
        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select options={categoryOptions} />
        </Form.Item>
        <Form.Item label="Group Name" name="group_name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Sort Number" name="sort_number" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          label="Team Name"
          name="team_id"
          rules={[{ required: true }]}
          extra="*Type or Copy Paste Team name to select"
        >
          <Select
            showSearch
            allowClear
            filterOption={false}
            notFoundContent={null}
            suffixIcon={null}
            loading={loadingSearch}
            options={teamOptions}
            placeholder="Team Name"
            onSearch={searchTeamName}
          />
        </Form.Item>
        <Form.Item label="Play" name="play" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Win" name="win" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Draw" name="draw" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Lose" name="lose" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Goal" name="goal" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Conceded" name="conceded" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Points" name="points" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </>
  )
}

export default connect(mapSateToProps, mapDispatchToProps)(CreateForm)
