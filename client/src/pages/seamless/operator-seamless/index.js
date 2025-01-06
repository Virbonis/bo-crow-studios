import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Drawer, Space, Table, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import authEnum from 'authorize'
import actions from 'redux/operator-seamless/actions'
import TableConfig from './config-index'
import CreateForm from './create'

const mapStateToProps = ({ operatorSeamless, auth }) => ({
  loading: operatorSeamless.loading,
  dataTable: operatorSeamless.data,
  allowToCreateOperator: auth.user.user_auth_ids.includes(
    authEnum.ALLOWED_TO_ADD_OPERATOR_SEAMLESS,
  ),
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD,
      source: 'Operator Seamless',
    })
  },
})

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
    title: 'Operator Name',
    dataIndex: 'operator_name',
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
    title: 'Is Actice',
    dataIndex: 'st_active',
    width: 100,
  },
]
const OperatorSeamless = ({ loading, dataTable, Load, allowToCreateOperator }) => {
  useEffect(() => {
    Load()
  }, [Load])

  const [visibleCreateOperator, setVisibleCreateOperator] = useState(false)
  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-row-reverse justify-content-between">
          <Space>
            <Button icon={<PlusOutlined />} onClick={() => setVisibleCreateOperator(true)}>
              Create
            </Button>
            <Tooltip placement="top" title="Refresh list">
              <Button icon={<ReloadOutlined />} onClick={() => Load()} />
            </Tooltip>
          </Space>
        </div>
        <div className="card-body">
          <Table
            rowKey="operator_id"
            loading={loading}
            columns={columns}
            dataSource={dataTable}
            pagination={false}
            expandable={{
              expandedRowRender: (record, index, indent, expanded) => (
                <TableConfig operator={record} expanded={expanded} />
              ),
            }}
          />
        </div>
      </div>
      <Drawer
        title="Create Operator"
        width={720}
        open={visibleCreateOperator}
        onClose={() => setVisibleCreateOperator(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleCreateOperator(false)}>Cancel</Button>
            <Button
              htmlType="submit"
              type="primary"
              form="form-create-operator"
              disabled={!allowToCreateOperator}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <CreateForm
          allowToCreateOperator={allowToCreateOperator}
          successCallback={() => {
            setVisibleCreateOperator(false)
            Load()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(OperatorSeamless)
