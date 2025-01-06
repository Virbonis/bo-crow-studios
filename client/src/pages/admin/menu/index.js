import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Tooltip, Drawer, Tag, Popconfirm, Switch } from 'antd'
import { PlusOutlined, EditOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from 'redux/admin/menu/actions'
import authEnum from 'authorize'
import { createMenuTree } from 'services/menu'
import CreateForm from './create'
import EditForm from './edit'

const mapStateToProps = ({ menu, auth }) => ({
  loading: menu.loading,
  data: menu.data,
  allowToDelete: auth.user.user_auth_ids.includes(authEnum.ALLOWED_TO_DELETE_CREDENTIAL),
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      payload,
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

const MenuList = ({ Load, Delete, loading, data, allowToDelete }) => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editValue, setEditValue] = useState(null)
  const [isMulticomp, setIsMulticomp] = React.useState(false)

  const reload = React.useCallback(() => {
    Load({ is_multicomp: isMulticomp })
  }, [Load, isMulticomp])
  useEffect(() => {
    reload()
  }, [reload])

  const columns = [
    {
      title: 'Menu ID',
      dataIndex: 'menu_id',
      width: 95,
    },
    {
      title: '#',
      dataIndex: 'menu_number',
      align: 'right',
      width: 50,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 200,
    },
    {
      title: 'Url',
      dataIndex: 'url',
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      width: 150,
      render: text => {
        return (
          <div className="d-flex align-items-center">
            <span className={`mr-2 ${text}`} />
            <span>{text}</span>
          </div>
        )
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      width: 100,
      render: category => {
        if (category) {
          return <strong className="text-success">Yes</strong>
        }
        return <strong className="text-danger">No</strong>
      },
    },
    ...(isMulticomp
      ? []
      : [
          {
            title: 'Is For Trader',
            dataIndex: 'is_for_trader',
            width: 100,
            render: text => {
              if (text) return <strong className="text-success">Yes</strong>
              return <strong className="text-danger">No</strong>
            },
          },
          {
            title: 'Roles',
            dataIndex: 'roles',
            width: 250,
            render: text => text.split(',').map(value => <Tag key={value}>{value}</Tag>),
          },
        ]),
    {
      title: 'Action',
      width: 100,
      render: record => (
        <>
          <Tooltip placement="top" title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => edit(record)} />{' '}
          </Tooltip>
          {allowToDelete && (
            <Popconfirm
              title="Are you sure delete this menu?"
              onConfirm={() => Delete(record, reload)}
            >
              <Button type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </>
      ),
    },
  ]

  const edit = record => {
    setEditValue(record)
    setVisibleEdit(true)
  }

  const newList = React.useMemo(() => createMenuTree(data), [data])
  return (
    <>
      <div className="card">
        <div className="card-header card-header-flex align-items-center justify-content-between">
          <Switch
            unCheckedChildren="Is For Admin"
            checkedChildren="Is For Operator"
            checked={isMulticomp}
            onClick={setIsMulticomp}
          />
          <Space>
            <Button icon={<PlusOutlined />} onClick={() => setVisibleCreate(true)}>
              Create
            </Button>
            <Tooltip placement="top" title="Refresh list">
              <Button icon={<ReloadOutlined />} onClick={reload} />
            </Tooltip>
          </Space>
        </div>
        <div className="card-body">
          <Table
            rowKey="menu_id"
            size="small"
            loading={loading}
            dataSource={newList}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Create Menu"
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
          isMulticomp={isMulticomp}
          successCallback={() => {
            setVisibleCreate(false)
            reload()
          }}
        />
      </Drawer>
      <Drawer
        title="Edit Menu"
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
          isMulticomp={isMulticomp}
          editValue={editValue}
          successCallback={() => {
            setVisibleEdit(false)
            reload()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuList)
