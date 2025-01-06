import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Drawer, Flex, Space, Table } from 'antd'
import actions from 'redux/admin/role/actions'
import useColumnFilter from 'components/blaise/custom/useColumnFilter'

const mapStateToProps = ({ role }) => ({
  data: role.menu,
  defaultSelectedRows: role.menu.filter(x => x.status === 1).map(x => x.menu_id),
})

const mapDispatchToProps = dispatch => ({
  GetMenu: payload =>
    dispatch({
      type: actions.GET_MENU,
      payload,
      source: '',
    }),
  UpdateMenu: (payload, successCallback) =>
    dispatch({
      type: actions.UPDATE_MENU,
      payload,
      successCallback,
      source: '',
    }),
  CleanMenu: () =>
    dispatch({
      type: actions.SET_STATE,
      payload: { menu: [] },
    }),
})

const ConfigMenu = ({
  data,
  defaultSelectedRows,
  GetMenu,
  UpdateMenu,
  CleanMenu,
  roleId,
  setRoleId,
  successCallback,
}) => {
  const [selectedRow, setSelectedRow] = useState(defaultSelectedRows)

  useEffect(() => {
    if (roleId) GetMenu(roleId)
    return () => CleanMenu()
  }, [roleId, GetMenu, CleanMenu])
  useEffect(() => {
    setSelectedRow(defaultSelectedRows)
  }, [defaultSelectedRows])

  const getColumnFilterProps = useColumnFilter()
  const columns = [
    {
      title: 'Parent Title',
      dataIndex: 'parent_title',
      ...getColumnFilterProps('parent_title'),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      ...getColumnFilterProps('title'),
    },
  ]

  const visible = roleId !== undefined
  const closeDrawer = () => setRoleId()

  return (
    <Drawer
      title="Edit Role Menu"
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
              UpdateMenu(
                {
                  id: roleId,
                  data: data.filter(x => selectedRow.includes(x.menu_id)),
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
          rowKey="menu_id"
          size="small"
          dataSource={data}
          columns={columns}
          pagination={false}
          rowSelection={{
            selectedRowKeys: selectedRow,
            onChange: values => setSelectedRow(values),
            getCheckboxProps: record => ({
              disabled: record.is_disabled === 'Y',
            }),
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfigMenu)
