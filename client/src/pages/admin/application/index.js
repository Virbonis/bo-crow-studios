import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Tooltip, Drawer, Tag } from 'antd'
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from 'redux/admin/application/actions'
import useColumnFilter from 'components/blaise/custom/useColumnFilter'
import CreateForm from './create'
import EditForm from './edit'
import DrawerMappingMenu from './mapping-menu'

const mapStateToProps = ({ application }) => ({
  loading: application.loading,
  data: application.data,
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD,
      source: '',
    })
  },
})

const ApplicationList = ({ Load, loading, data }) => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editValue, setEditValue] = useState(null)
  const [applicationIdMenu, setApplicationIdMenu] = useState()

  useEffect(() => {
    Load()
  }, [Load])

  const getColumnFilterProps = useColumnFilter()
  const columns = [
    {
      title: 'ID',
      dataIndex: 'application_id',
      width: 30,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      ...getColumnFilterProps('name'),
      width: 200,
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      ...getColumnFilterProps('roles'),
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
      title: 'Is Active',
      dataIndex: 'is_active',
      width: 65,
      render: status => {
        if (status) {
          return <strong className="text-success">Yes</strong>
        }
        return <strong className="text-danger">No</strong>
      },
    },
    {
      title: 'Action',
      width: '100px',
      render: row => (
        <>
          <Tooltip placement="top" title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => edit(row)} />
          </Tooltip>
          <Button
            type="link"
            onClick={() => {
              setApplicationIdMenu(row.application_id)
            }}
          >
            Mapping Menu
          </Button>
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
            rowKey="application_id"
            size="small"
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Drawer
        title="Create Application"
        width={720}
        open={visibleCreate}
        destroyOnClose
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
        title="Edit Application"
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
      <DrawerMappingMenu
        applicationId={applicationIdMenu}
        setApplicationId={setApplicationIdMenu}
      />
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationList)
