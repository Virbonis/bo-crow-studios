import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Tooltip, Drawer, Popconfirm, Tag } from 'antd'
import { PlusOutlined, EditOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { useColumnFilter } from 'components/blaise'
import actions from 'redux/admin/permission/actions'
import CreateForm from './create'
import EditForm from './edit'

const mapStateToProps = ({ permission }) => ({
  loading: permission.loading,
  data: permission.data,
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
})

const PermissionList = ({ loading, data, Load, Delete }) => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editValue, setEditValue] = useState(null)

  const reload = React.useCallback(() => Load(), [Load])
  useEffect(() => {
    reload()
  }, [reload])

  const getColumnFilterProps = useColumnFilter()
  const columns = [
    {
      title: 'Permission ID',
      dataIndex: 'permission_id',
      align: 'center',
      width: 100,
    },
    {
      title: 'Group',
      dataIndex: 'group',
      width: 100,
      ...getColumnFilterProps('group'),
    },
    {
      title: 'Seq No',
      dataIndex: 'seq_no',
      align: 'center',
      width: 70,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: 250,
      filterSearch: true,
      ...getColumnFilterProps('code'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 250,
    },
    {
      title: 'Is For Admin',
      dataIndex: 'is_for_admin',
      width: 100,
      render: status => {
        if (status) return <strong className="text-success">Yes</strong>
        return <strong className="text-danger">No</strong>
      },
      filters: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      onFilter: (value, record) => record.is_for_admin === value,
    },
    {
      title: 'Is For Operator',
      dataIndex: 'is_for_operator',
      width: 100,
      render: status => {
        if (status) return <strong className="text-success">Yes</strong>
        return <strong className="text-danger">No</strong>
      },
      filters: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      onFilter: (value, record) => record.is_for_operator === value,
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      width: 250,
      ...getColumnFilterProps('roles'),
      render: text => text.split(',').map(value => <Tag key={value}>{value}</Tag>),
    },
    {
      title: 'Action',
      width: 100,
      render: record => (
        <>
          <Tooltip placement="top" title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => edit(record)} />
          </Tooltip>
          <Tooltip placement="top" title="Delete">
            <Popconfirm
              title="Are you sure delete this permission?"
              onConfirm={() => Delete(record, reload)}
            >
              <Button type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
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
              <Button icon={<ReloadOutlined />} onClick={reload} />
            </Tooltip>
          </Space>
        </div>
        <div className="card-body">
          <Table
            rowKey="permission_id"
            size="small"
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Create Permission"
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
        title="Edit Permission"
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
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(PermissionList)
