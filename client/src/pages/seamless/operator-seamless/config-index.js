import React, { useState } from 'react'
import { Button, Drawer, Popconfirm, Space, Table, Tooltip } from 'antd'
import { connect } from 'react-redux'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/operator-seamless/actions'
import { isEmpty } from 'lodash'
import CreateConfig from './config-create'
import EditConfig from './config-edit'

const mapStateToProps = ({ operatorSeamless }, { operator }) => ({
  loading: operatorSeamless[`loadingConfig_${operator.operator_id}`],
  dataTable: operatorSeamless[`dataConfig_${operator.operator_id}`],
})

const mapDispatchToProps = dispatch => ({
  LoadConfig: payload => {
    dispatch({
      type: actions.LOAD_CONFIG,
      payload,
      source: 'Operator Seamless',
    })
  },
  DeleteConfig: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE_CONFIG,
      payload,
      successCallback,
      source: 'Operator Seamless',
    })
  },
})

const TableConfig = ({ loading, dataTable, LoadConfig, DeleteConfig, operator, expanded }) => {
  const reloadConfig = React.useCallback(() => {
    if (operator?.operator_id && expanded) LoadConfig({ operator_id: operator.operator_id })
  }, [LoadConfig, operator, expanded])
  React.useEffect(() => {
    reloadConfig()
  }, [reloadConfig])

  const [visibleCreateConfig, setVisibleCreateConfig] = useState(false)
  const [editConfigValue, setEditConfigValue] = useState({})

  const onDelete = record =>
    DeleteConfig(
      {
        operator_id: operator.operator_id,
        ...record,
      },
      reloadConfig,
    )
  const columnExpandable = [
    {
      title: 'Config Key',
      dataIndex: 'config_key',
      width: 200,
    },
    {
      title: 'Config Value',
      dataIndex: 'config_value',
    },
    {
      title: 'Http Timeout',
      dataIndex: 'http_timeout',
      width: 100,
    },
    {
      title: 'Request Timeout',
      dataIndex: 'request_timeout',
      width: 100,
    },
    {
      title: (
        <>
          Action
          <div className="float-right">
            <Tooltip placement="top" title="Create Config">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setVisibleCreateConfig(true)}
              />
            </Tooltip>
            <Tooltip placement="top" title="Refresh list">
              <Button type="primary" icon={<ReloadOutlined />} onClick={reloadConfig} />
            </Tooltip>
          </div>
        </>
      ),
      render: (data, record) => {
        return (
          <>
            <Button type="link" onClick={() => setEditConfigValue(record)}>
              Edit
            </Button>
            <Popconfirm title="Are you sure delete this?" onConfirm={() => onDelete(record)}>
              <Button type="link">Delete</Button>
            </Popconfirm>
          </>
        )
      },
      width: 150,
    },
  ]

  return (
    <>
      <Table
        rowKey="config_key"
        columns={columnExpandable}
        loading={loading}
        dataSource={dataTable}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
      <Drawer
        title="Create Operator Config"
        width={720}
        open={visibleCreateConfig}
        onClose={() => setVisibleCreateConfig(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleCreateConfig(false)}>Cancel</Button>
            <Button form="create-config-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <CreateConfig
          operator_id={operator.operator_id}
          successCallback={() => {
            setVisibleCreateConfig(false)
            reloadConfig()
          }}
        />
      </Drawer>
      <Drawer
        title="Edit Operator Config"
        width={720}
        open={!isEmpty(editConfigValue)}
        onClose={() => setEditConfigValue()}
        footer={
          <Space>
            <Button onClick={() => setEditConfigValue()}>Cancel</Button>
            <Button form="edit-config-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <EditConfig
          editValue={editConfigValue}
          successCallback={() => {
            setEditConfigValue()
            reloadConfig()
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TableConfig)
