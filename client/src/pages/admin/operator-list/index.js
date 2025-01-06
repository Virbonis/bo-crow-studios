import { EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Drawer, Space, Table, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import authEnum from 'authorize'
import actions from 'redux/operator-list/actions'
import CreateForm from './create'
import EditForm from './edit'

const mapStateToProps = ({ operatorList, auth }) => ({
  loading: operatorList.loading,
  tableData: operatorList.data.result,
  totalResult: operatorList.data.total,
  allowCreate: auth.user.user_auth_ids.includes(authEnum.ALLOWED_TO_ADD_OPERATOR),
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      payload,
      type: actions.LOAD,
      source: 'Operator List',
    })
  },
})

const OperatorList = ({ loading, tableData, Load, totalResult, allowCreate }) => {
  const [visibleCreate, setVisibleCreate] = React.useState(false)
  const [visibleEdit, setVisibleEdit] = React.useState(false)
  const editValue = React.useRef()
  const [pagination, setPagination] = useState({ current_page: 1, page_size: 50 })
  useEffect(() => {
    Load(pagination)
  }, [Load, pagination])

  const columns = [
    {
      title: 'Branch ID',
      dataIndex: 'branch_id',
      width: 100,
    },
    {
      title: 'Branch Name',
      dataIndex: 'branch_name',
      width: 100,
    },
    {
      title: 'Prefix',
      dataIndex: 'prefix',
      width: 100,
    },
    {
      title: 'Operator ID',
      dataIndex: 'operator_id',
      width: 300,
    },
    {
      title: 'Validate URL',
      dataIndex: 'validate_url',
    },
    {
      title: 'App ID',
      dataIndex: 'app_id',
      width: 100,
    },
    {
      title: 'Secret Key',
      dataIndex: 'secret_key',
      width: 100,
    },
    {
      title: 'Username',
      dataIndex: 'user_name',
      width: 150,
    },
    {
      title: 'ST Seamless',
      dataIndex: 'st_seamless',
      width: 100,
    },
    {
      title: 'Action',
      width: 50,
      render: record => (
        <Button
          icon={<EditOutlined />}
          type="link"
          onClick={() => editHandler(record)}
          disabled={!allowCreate}
        />
      ),
    },
  ]

  const editHandler = record => {
    setVisibleEdit(true)
    editValue.current = record
  }

  const reload = () => Load(pagination)

  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-row-reverse justify-content-between">
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
            rowKey="operator_id"
            loading={loading}
            columns={columns}
            dataSource={tableData}
            pagination={{
              total: totalResult,
              pageSize: pagination.page_size,
              current: pagination.current_page,
              showSizeChanger: true,
              showTotal: totalData => `Total ${totalData}`,
              onChange: (current_page, page_size) => {
                setPagination({ current_page, page_size })
                reload()
              },
            }}
          />
        </div>
      </div>
      <Drawer
        title="Create Operator"
        width={720}
        open={visibleCreate}
        onClose={() => setVisibleCreate(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleCreate(false)}>Cancel</Button>
            <Button
              htmlType="submit"
              type="primary"
              form="form-create-operator"
              disabled={!allowCreate}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <CreateForm
          allowCreate={allowCreate}
          successCallback={() => {
            setVisibleCreate(false)
            reload()
          }}
        />
      </Drawer>
      <Drawer
        title="Edit Operator"
        width={720}
        open={visibleEdit}
        onClose={() => setVisibleEdit(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleEdit(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary" form="form-edit-operator">
              Submit
            </Button>
          </Space>
        }
      >
        <EditForm
          editValue={editValue.current}
          successCallback={() => {
            setVisibleEdit(false)
            reload()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(OperatorList)
