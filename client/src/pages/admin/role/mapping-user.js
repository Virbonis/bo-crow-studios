import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Drawer, Flex, Space, Table } from 'antd'
import actions from 'redux/admin/role/actions'
import useColumnFilter from 'components/blaise/custom/useColumnFilter'

const mapStateToProps = ({ role }) => ({
  data: role.user,
  defaultSelectedRows: role.user.filter(x => x.status === 1).map(x => x.user_id),
})

const mapDispatchToProps = dispatch => ({
  GetUser: payload =>
    dispatch({
      type: actions.GET_USER,
      payload,
      source: '',
    }),
  UpdateUser: (payload, successCallback) =>
    dispatch({
      type: actions.UPDATE_USER,
      payload,
      successCallback,
      source: '',
    }),
  CleanUser: () =>
    dispatch({
      type: actions.SET_STATE,
      payload: { user: [] },
    }),
})

const ConfigUser = ({
  data,
  defaultSelectedRows,
  GetUser,
  UpdateUser,
  CleanUser,
  roleId,
  setRoleId,
  successCallback,
}) => {
  const [selectedRow, setSelectedRow] = useState(defaultSelectedRows)

  useEffect(() => {
    if (roleId) GetUser(roleId)
    return () => CleanUser()
  }, [roleId, GetUser, CleanUser])
  useEffect(() => {
    setSelectedRow(defaultSelectedRows)
  }, [defaultSelectedRows])

  const getColumnFilterProps = useColumnFilter()
  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      ...getColumnFilterProps('username'),
    },
  ]

  const visible = roleId !== undefined
  const closeDrawer = () => setRoleId()

  return (
    <Drawer
      title="Edit Role User"
      width={450}
      open={visible}
      onClose={closeDrawer}
      destroyOnClose
      footer={
        <Space>
          <Button onClick={closeDrawer}>Cancel</Button>
          <Button
            type="primary"
            onClick={() => {
              UpdateUser(
                {
                  id: roleId,
                  data: data.filter(x => selectedRow.includes(x.user_id)),
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
        </Space>
      }
    >
      <Flex vertical className="h-100">
        <div className="text-muted">Role Id: {roleId}</div>
        <Table
          rowKey="user_id"
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfigUser)
