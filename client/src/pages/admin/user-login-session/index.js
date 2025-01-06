import { ReloadOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Select, Table, Tooltip } from 'antd'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import React from 'react'
import { connect } from 'react-redux'
import authEnum from 'authorize'
import actions from 'redux/user-login-session/actions'
import './custom.scss'
import PopUpButton from './popup-button'

const mapStateToProps = ({ userLoginSession, auth }) => ({
  tableData: userLoginSession.data,
  loading: userLoginSession.loadingData,
  havePermission: auth.user.user_auth_ids.includes(authEnum.ALLOWED_TO_SEE_USER_SESSION_LOG),
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'User Login Session',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'User Login Session',
    })
  },
})

const UserLoginSession = ({ Load, Update, tableData, loading, havePermission }) => {
  const [form] = Form.useForm()
  const [selectedRow, setSelectedRow] = React.useState([])
  React.useEffect(() => Load({ userteam: 0 }), [Load])

  let { userTeamOptions } = useSelectOptions()
  userTeamOptions = [{ value: 0, label: 'Show All User Team' }].concat(userTeamOptions)

  const columns = [
    {
      title: 'No',
      align: 'center',
      render: (text, record, index) => index + 1,
      width: 60,
    },
    {
      title: 'Login Date',
      align: 'center',
      dataIndex: 'date_sign_on',
      width: 200,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: 600,
      render: text => <PopUpButton username={text} />,
    },
    {
      title: 'IP',
      dataIndex: 'ip_login',
      width: 200,
    },
    {
      title: 'Session ID',
      dataIndex: 'session_id',
      width: 200,
    },
    Table.SELECTION_COLUMN,
  ]

  const reload = React.useCallback(() => {
    form.submit()
  }, [form])
  if (!havePermission)
    return (
      <div className="card">
        <div className="card-header">
          <Alert
            message="You are not allowed to view this page !"
            type="error"
            className="mb-1 w-50"
          />
        </div>
      </div>
    )

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row justify-content-between" style={{ gap: 8 }}>
            <Form
              form={form}
              initialValues={{ userteam: 0 }}
              onValuesChange={reload}
              onFinish={value => Load(value)}
            >
              <Form.Item name="userteam">
                <Select options={userTeamOptions} style={{ width: 200 }} />
              </Form.Item>
            </Form>
            <Tooltip placement="top" title="Refresh list">
              <Button icon={<ReloadOutlined />} onClick={reload} loading={loading} />
            </Tooltip>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey="user_login_id"
            size="small"
            bordered
            loading={loading}
            dataSource={tableData}
            columns={columns}
            pagination={false}
            rowSelection={{
              selectedRowKeys: selectedRow,
              onChange: selectedRowKeys => {
                setSelectedRow(selectedRowKeys)
              },
            }}
            footer={() => (
              <div align="right">
                <Button
                  type="primary"
                  disabled={selectedRow.length === 0}
                  onClick={() =>
                    Update({ user_login_ids: selectedRow.toString() }, () => {
                      setSelectedRow([])
                      reload()
                    })
                  }
                >
                  Force LogOff
                </Button>
              </div>
            )}
          />
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLoginSession)
