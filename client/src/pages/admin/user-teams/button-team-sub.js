import React from 'react'
import { Button, Drawer, Form, Popconfirm, Space, Table, Tooltip } from 'antd'
import { connect } from 'react-redux'
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { CustomizeCell } from 'components/blaise'
import actions from 'redux/user-team/actions'
import ButtonAddUserTeamSub from './button-add-user-team-sub'
import ButtonEditUserTeamSub from './button-edit-user-team-sub'
import ButtonUserSub from './button-user-sub'
import ButtonLeague from './button-league'

const mapStateToProps = ({ userTeam }) => ({
  loading: userTeam.loadingSub,
  dataTable: userTeam.team,
})

const mapDispatchToProps = dispatch => ({
  LoadUserTeamSub: payload => {
    dispatch({
      type: actions.LOAD_USER_TEAM_SUB,
      payload,
      source: 'User Team',
    })
  },
  DeleteUserTeamSub: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE_USER_TEAM_SUB,
      payload,
      source: 'User Team',
      successCallback,
    })
  },
})

const ButtonTeamSub = ({ data, loading, dataTable, LoadUserTeamSub, DeleteUserTeamSub }) => {
  const [visibleTeamSub, setVisibleTeamSub] = React.useState(false)

  return (
    <>
      <Button
        type="link"
        onClick={() => {
          setVisibleTeamSub(true)
        }}
      >
        Team Sub
      </Button>
      <Drawer
        title={`${data.team_id} - ${data.team_name} `}
        width="80%"
        onClose={() => {
          setVisibleTeamSub(false)
        }}
        open={visibleTeamSub}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleTeamSub(false)}>Cancel</Button>
            <Button form="user-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <TeamSub
          data={data}
          loading={loading}
          dataTable={dataTable}
          LoadUserTeamSub={LoadUserTeamSub}
          DeleteUserTeamSub={DeleteUserTeamSub}
        />
      </Drawer>
    </>
  )
}

const TeamSub = ({ data, loading, dataTable, LoadUserTeamSub, DeleteUserTeamSub }) => {
  const reload = React.useCallback(() => {
    LoadUserTeamSub({ team_id: data.team_id })
  }, [LoadUserTeamSub, data.team_id])
  React.useEffect(() => {
    reload()
  }, [reload])

  const columns = [
    {
      title: 'No',
      render: (text, record, index) => index + 1,
      align: 'center',
      width: 30,
    },
    {
      title: 'Team Name',
      dataIndex: 'team_name',
      width: 250,
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      width: 250,
      render: text => {
        return (
          <Space
            direction="vertical"
            size={0}
            className="w-100"
            style={{ overflow: 'auto', maxHeight: 200 }}
          >
            {text.split('<br>').map(value => (
              <span key={value}>{value}</span>
            ))}
          </Space>
        )
      },
    },
    {
      title: 'League Name',
      dataIndex: 'league',
      width: 250,
      render: text => {
        return (
          <Space
            direction="vertical"
            size={0}
            className="w-100"
            style={{ overflow: 'auto', maxHeight: 200 }}
          >
            {text.split('<br>').map((value, i) => (
              <span key={`${i}_${value}`}>{value}</span> // eslint-disable-line
            ))}
          </Space>
        )
      },
    },
    {
      title: 'Action',
      width: 100,
      render: record => {
        const { username, league, user_team_sub_id } = record
        const canDelete = username.length === 0 && league.length === 0
        return (
          <Space direction="horizontal" size={1}>
            <ButtonEditUserTeamSub data={record} successCallback={reload} />
            {canDelete && (
              <Tooltip placement="top" title="Delete">
                <Popconfirm
                  title="Are you sure delete this user team?"
                  onConfirm={() => DeleteUserTeamSub({ user_team_sub_id }, reload)}
                >
                  <Button className="text-danger" type="link" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            )}
            <ButtonUserSub data={record} successCallback={reload} />
            <ButtonLeague
              data={{ ...record, user_team_id: data.team_id }}
              successCallback={reload}
            />
          </Space>
        )
      },
    },
  ]
  return (
    <>
      <Form>
        <div className="d-flex flex-row justify-content-between">
          <Space direction="vertical" size={0}>
            <Form.Item label="Team ID">{data.team_id}</Form.Item>
            <Form.Item label="Team Name">{data.team_name}</Form.Item>
          </Space>
          <Space direction="horizontal">
            <ButtonAddUserTeamSub team_id={data.team_id} successCallback={reload} />
            <Button icon={<ReloadOutlined />} onClick={reload} />
          </Space>
        </div>
      </Form>
      <Table
        rowKey="team_name"
        columns={columns}
        loading={loading}
        dataSource={dataTable}
        pagination={false}
        components={{
          body: {
            cell: CustomizeCell,
          },
        }}
      />
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonTeamSub)
