import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Tooltip, Drawer, Tag, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from 'redux/admin/role/actions'
import authEnum from 'authorize'
import useColumnFilter from 'components/blaise/custom/useColumnFilter'
import CreateForm from './create'
import EditForm from './edit'
import DrawerMappingUser from './mapping-user'
import DrawerMappingMenu from './mapping-menu'
import DrawerMappingPermission from './mapping-permission'

const mapStateToProps = ({ role, auth }) => ({
  loading: role.loading,
  data: role.data,
  allowedViewPermission:
    auth.user.trader_group_ori === 'TRADER_GROUP_IS_MANAGER' ||
    auth.user.user_auth_ids.includes(authEnum.ALLOWED_TO_VIEW_ROLE_PERMISSION),
  allowToDelete: auth.user.user_auth_ids.includes(authEnum.ALLOWED_TO_DELETE_CREDENTIAL),
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD,
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
})

const RoleList = ({ Load, Delete, loading, data, allowedViewPermission, allowToDelete }) => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editValue, setEditValue] = useState(null)
  const [roleIdUser, setRoleIdUser] = useState()
  const [roleIdMenu, setRoleIdMenu] = useState()
  const [roleIdPermission, setRoleIdPermission] = useState()

  const reload = React.useCallback(() => Load(), [Load])
  useEffect(() => {
    reload()
  }, [reload])

  const getColumnFilterProps = useColumnFilter()
  const columns = [
    {
      title: 'Role ID',
      dataIndex: 'role_id',
      align: 'center',
      width: 60,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      ...getColumnFilterProps('name'),
      width: 120,
    },
    {
      title: 'Users',
      dataIndex: 'users',
      width: 300,
      ...getColumnFilterProps('users'),
      render: text => {
        return (
          <div style={{ overflow: 'auto', maxHeight: 200 }}>
            {text.split(',').map(value => (
              <Tag key={value}>{value}</Tag>
            ))}
          </div>
        )
      },
    },
    {
      title: 'Menus',
      dataIndex: 'menus',
      width: 300,
      ...getColumnFilterProps('menus'),
      render: text => {
        return (
          <div style={{ overflow: 'auto', maxHeight: 200 }}>
            {text.split(',').map(value => (
              <Tag key={value}>{value}</Tag>
            ))}
          </div>
        )
      },
    },
    {
      title: 'Trader Group',
      dataIndex: 'trader_group',
      width: 200,
      render: text => {
        return (
          <div style={{ overflow: 'auto', maxHeight: 200 }}>
            {text.split(',').map(value => (
              <Tag key={value}>{value}</Tag>
            ))}
          </div>
        )
      },
    },
    {
      title: 'Action',
      width: 100,
      render: record => (
        <>
          <Tooltip placement="top" title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => edit(record)} />
          </Tooltip>
          {allowToDelete && (
            <Tooltip placement="top" title="Delete">
              <Popconfirm
                title="Are you sure delete this role?"
                onConfirm={() => Delete(record, reload)}
              >
                <Button type="link" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          )}
          <br />
          <Button type="link" onClick={() => setRoleIdUser(record.role_id)}>
            User
          </Button>
          <br />
          <Button type="link" onClick={() => setRoleIdMenu(record.role_id)}>
            Menu
          </Button>
          <br />
          {allowedViewPermission && (
            <Button type="link" onClick={() => setRoleIdPermission(record.role_id)}>
              Permission
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
              <Button icon={<ReloadOutlined />} onClick={() => Load()} />
            </Tooltip>
          </Space>
        </div>
        <div className="card-body">
          <Table
            rowKey="role_id"
            size="small"
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Create Role"
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
            Load()
          }}
        />
      </Drawer>
      <Drawer
        title="Edit Role"
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
            Load()
          }}
        />
      </Drawer>
      <DrawerMappingUser
        roleId={roleIdUser}
        setRoleId={setRoleIdUser}
        successCallback={() => Load()}
      />
      <DrawerMappingMenu
        roleId={roleIdMenu}
        setRoleId={setRoleIdMenu}
        successCallback={() => Load()}
      />
      <DrawerMappingPermission
        roleId={roleIdPermission}
        setRoleId={setRoleIdPermission}
        successCallback={() => Load()}
      />
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleList)
