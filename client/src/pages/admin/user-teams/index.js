import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Form, Popconfirm, Select, Space, Table, Tooltip } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import authorize from 'authorize'
import actions from 'redux/user-team/actions'
import { CustomizeCell } from 'components/blaise'
import ButtonTeamSub from './button-team-sub'
import ButtonEditUserTeam from './button-edit-user-team'
import ButtonUser from './button-user'
import ButtonAddUserTeam from './button-add-user-team'

const mapStateToProps = ({ userTeam, auth }) => ({
  loading: userTeam.loading,
  data: userTeam.data,
  allowDelete: auth.user.user_auth_ids.includes(authorize.ALLOWED_TO_DELETE_USER_TEAM),
  allowAdd: auth.user.user_auth_ids.includes(authorize.ALLOWED_TO_ADD_USER_TEAM),
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_USER_TEAM,
      payload,
      source: 'User Team',
    })
  },
  DeleteUserTeam: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE_USER_TEAM,
      payload,
      source: 'User Team',
      successCallback,
    })
  },
})

const UserTeams = React.memo(({ loading, data, Load, allowDelete, allowAdd, DeleteUserTeam }) => {
  let { userTeamOptions } = useSelectOptions()
  userTeamOptions = [{ value: 0, label: 'Show All User Team' }].concat(userTeamOptions)

  const [form] = Form.useForm()

  const reload = React.useCallback(() => {
    Load({ team_id: form.getFieldValue('team_id') })
  }, [Load, form])
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
      width: 300,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: 300,
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
      width: 350,
      render: (text, rowData) => {
        if (rowData.team_id === 8) return 'All Leagues other than Soccer and E-Soccer'
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
      title: 'Is Active',
      dataIndex: 'is_active',
      width: 80,
      render: status => {
        if (status) {
          return <strong className="text-success">Yes</strong>
        }
        return <strong className="text-danger">No</strong>
      },
    },
    {
      title: 'Action',
      width: 100,
      render: record => {
        const { team_id, username, is_active, has_user_team_sub } = record
        const showDelete =
          allowDelete &&
          ![7, 8].includes(team_id) &&
          has_user_team_sub === 'N' &&
          is_active === 'N' &&
          username.length === 0

        const showMappingUser = team_id !== 7
        return (
          <>
            <ButtonEditUserTeam data={record} successCallback={reload} />
            {showDelete && (
              <Tooltip placement="top" title="Delete">
                <Popconfirm
                  title="Are you sure delete this user team?"
                  onConfirm={() => DeleteUserTeam({ team_id }, reload)}
                >
                  <Button className="text-danger" type="link" icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            )}
            <br />
            {showMappingUser && <ButtonUser data={record} successCallback={reload} />}
            <ButtonTeamSub data={record} />
          </>
        )
      },
    },
  ]
  if (userTeamOptions.length === 1) return null
  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex flex-row justify-content-between">
          <Form
            form={form}
            onValuesChange={() => {
              reload()
            }}
            initialValues={{ team_id: userTeamOptions[1]?.value }}
          >
            <Form.Item name="team_id" style={{ width: '200px' }}>
              <Select options={userTeamOptions} />
            </Form.Item>
          </Form>
          <Space direction="horizontal">
            {allowAdd && <ButtonAddUserTeam successCallback={reload} />}
            <Button icon={<ReloadOutlined />} onClick={reload} />
          </Space>
        </div>
        <span className="text-danger">
          *Delete, if the User Team don&apos;t have any User and Team Sub
        </span>
      </div>
      <div className="card-body ">
        <Table
          rowKey="team_name"
          columns={columns}
          loading={loading}
          dataSource={data}
          pagination={false}
          components={{
            body: {
              cell: CustomizeCell,
            },
          }}
        />
      </div>
    </div>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(UserTeams)
