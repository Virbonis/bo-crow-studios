import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Drawer, Flex, Space, Table } from 'antd'
import actions from 'redux/admin/role/actions'
import useColumnFilter from 'components/blaise/custom/useColumnFilter'
import authEnum from 'authorize'

const mapStateToProps = ({ role, auth }) => ({
  data: role.permission,
  defaultSelectedRows: role.permission.filter(x => x.status === 1).map(x => x.permission_id),
  havePermission: auth.user.user_auth_ids.includes(authEnum.ALLOWED_TO_UPDATE_ROLE_PERMISSION),
})

const mapDispatchToProps = dispatch => ({
  GetPermission: payload =>
    dispatch({
      type: actions.GET_PERMISSION,
      payload,
      source: '',
    }),
  UpdatePermission: (payload, successCallback) =>
    dispatch({
      type: actions.UPDATE_PERMISSION,
      payload,
      successCallback,
      source: '',
    }),
  CleanPermission: () =>
    dispatch({
      type: actions.SET_STATE,
      payload: { permission: [] },
    }),
})

const ConfigPermission = ({
  data,
  defaultSelectedRows,
  havePermission,
  GetPermission,
  UpdatePermission,
  CleanPermission,
  roleId,
  setRoleId,
  successCallback,
}) => {
  const [selectedRow, setSelectedRow] = useState(defaultSelectedRows)

  useEffect(() => {
    if (roleId) GetPermission(roleId)
    return () => CleanPermission()
  }, [roleId, GetPermission, CleanPermission])
  useEffect(() => {
    setSelectedRow(defaultSelectedRows)
  }, [defaultSelectedRows])

  const getColumnFilterProps = useColumnFilter()
  const columns = [
    {
      title: 'Group',
      dataIndex: 'group',
      width: 100,
      ...getColumnFilterProps('group'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      ...getColumnFilterProps('description'),
    },
  ]

  const visible = roleId !== undefined
  const closeDrawer = () => setRoleId()

  return (
    <Drawer
      title="Edit Role Permission"
      width={450}
      open={visible}
      onClose={closeDrawer}
      destroyOnClose
      footer={
        <Space>
          <Button onClick={closeDrawer}>Cancel</Button>
          {havePermission ? (
            <Button
              type="primary"
              onClick={() => {
                UpdatePermission(
                  {
                    id: roleId,
                    data: data.filter(x => selectedRow.includes(x.permission_id)),
                  },
                  () => {
                    closeDrawer()
                    successCallback()
                  },
                )
              }}
            >
              Submit
            </Button>
          ) : null}
        </Space>
      }
    >
      <Flex vertical className="h-100">
        <div className="text-muted">Role Id: {roleId}</div>
        <Table
          rowKey="permission_id"
          size="small"
          dataSource={data}
          columns={columns}
          pagination={false}
          rowSelection={{
            selectedRowKeys: selectedRow,
            onChange: values => setSelectedRow(values),
            selections: [
              Table.SELECTION_ALL,
              {
                text: 'Unselect All Data',
                onSelect: () => setSelectedRow([]),
              },
            ],
          }}
        />
      </Flex>
    </Drawer>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigPermission)
