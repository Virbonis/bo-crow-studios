import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Tooltip, Drawer, Popconfirm, Tag } from 'antd'
import { PlusOutlined, EditOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from 'redux/admin/user/actions'
import authEnum from 'authorize'
import useColumnFilter from 'components/blaise/custom/useColumnFilter'
import CreateForm from './create'
import EditForm from './edit'
import SessionTab from './session'

const mapStateToProps = ({ user, auth }) => ({
  loading: user.loading,
  data: user.data?.result,
  totalData: user.data?.total,
  allowSeeUserSessionLog: auth.user.user_auth_ids.includes(
    authEnum.ALLOWED_TO_SEE_USER_SESSION_LOG,
  ),
  allowToDelete: auth.user.user_auth_ids.includes(authEnum.ALLOWED_TO_DELETE_CREDENTIAL),
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: '',
    })
  },
  Delete: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE,
      payload,
      successCallback,
      source: '',
    })
  },
  ResetPassword: (payload, successCallback) => {
    dispatch({
      type: actions.RESET_PASSWORD,
      payload,
      successCallback,
      source: '',
    })
  },
})

const UserList = ({
  Load,
  Delete,
  ResetPassword,
  loading,
  data,
  totalData,
  allowSeeUserSessionLog,
  allowToDelete,
}) => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editValue, setEditValue] = useState(null)
  const [visibleSession, setVisibleSession] = useState(false)
  const [sessionValue, setSessionValue] = useState(null)
  const [username, setUsername] = useState('')
  const [page, setPage] = useState(1)
  const [display, setDisplay] = useState(10)

  const reload = React.useCallback(() => Load({ username, page, display }), [
    Load,
    username,
    page,
    display,
  ])
  useEffect(() => {
    reload()
  }, [reload])

  const getColumnFilterProps = useColumnFilter()
  const columns = [
    {
      title: 'User ID',
      dataIndex: 'user_id',
      width: 100,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      ...getColumnFilterProps('username', value => setUsername(value)),
      width: 150,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: 'Trader Group',
      dataIndex: 'trader_group',
      width: 250,
      render: text => text.split(',').map(value => <Tag key={value}>{value}</Tag>),
    },
    {
      title: 'Last Login',
      dataIndex: 'last_login_date',
      width: 100,
      render: text => text.formatDateTimeSecond(),
    },
    {
      title: 'Is Active',
      dataIndex: 'is_active',
      width: 75,
      render: status => {
        if (status) return <strong className="text-success">Yes</strong>
        return <strong className="text-danger">No</strong>
      },
    },
    {
      title: 'Is Sys Admin',
      dataIndex: 'is_sys_admin',
      width: 75,
      render: status => {
        if (status) return <strong className="text-success">Yes</strong>
        return <strong className="text-danger">No</strong>
      },
    },
    {
      title: 'Is LOB',
      dataIndex: 'is_lob',
      width: 75,
      render: status => {
        if (status) return <strong className="text-success">Yes</strong>
        return <strong className="text-danger">No</strong>
      },
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      width: 250,
      render: text => text.split(',').map(value => <Tag key={value}>{value}</Tag>),
    },
    {
      title: 'Action',
      width: 110,
      render: record => (
        <>
          <Tooltip placement="top" title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => edit(record)} />
          </Tooltip>
          {allowToDelete && (
            <Tooltip placement="top" title="Delete">
              <Popconfirm
                title="Are you sure delete this user?"
                onConfirm={() => Delete(record, reload)}
              >
                <Button type="link" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          )}
          <br />
          <Popconfirm
            title="Are you sure reset password this user?"
            onConfirm={() => ResetPassword(record, reload)}
          >
            <Button type="link">Reset Password</Button>
          </Popconfirm>
          <br />
          {allowSeeUserSessionLog && (
            <Button type="link" onClick={() => session(record)}>
              Session
            </Button>
          )}
        </>
      ),
    },
  ]

  const edit = record => {
    setEditValue(record)
    setVisibleEdit(true)
  }
  const session = record => {
    setSessionValue(record)
    setVisibleSession(true)
  }

  return (
    <>
      <div className="card">
        <div className="card-header card-header-flex align-items-center justify-content-end">
          <Space>
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                setVisibleCreate(true)
              }}
            >
              Create
            </Button>
            <Tooltip placement="top" title="Refresh list">
              <Button icon={<ReloadOutlined />} onClick={reload} />
            </Tooltip>
          </Space>
        </div>
        <div className="card-body">
          <Table
            rowKey="user_id"
            size="small"
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={{
              showSizeChanger: true,
              showTotal: total => `Total ${total} items`,
              current: page,
              pageSize: display,
              total: totalData,
            }}
            onChange={pagination => {
              setPage(pagination.current)
              setDisplay(pagination.pageSize)
            }}
            // scroll={{ x: 'max-content' }}
          />
        </div>
      </div>
      <Drawer
        title="Create User"
        width={720}
        open={visibleCreate}
        onClose={() => setVisibleCreate(false)}
        footer={
          <Space>
            <Button onClick={() => setVisibleCreate(false)}>Cancel</Button>
            <Button form="create-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <CreateForm
          successCallback={() => {
            setVisibleCreate(false)
            reload()
          }}
        />
      </Drawer>
      <Drawer
        title="Edit User"
        width={720}
        open={visibleEdit}
        onClose={() => setVisibleEdit(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleEdit(false)}>Cancel</Button>
            <Button form="edit-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <EditForm
          editValue={editValue}
          successCallback={() => {
            setVisibleEdit(false)
            reload()
          }}
        />
      </Drawer>
      <Drawer
        title="Session User"
        width={500}
        open={visibleSession}
        onClose={() => setVisibleSession(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleSession(false)}>Cancel</Button>
          </Space>
        }
      >
        <SessionTab sessionValue={sessionValue} />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
