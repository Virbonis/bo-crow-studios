import React, { useEffect } from 'react'
import { Table, Button, Space, Tooltip, Tag } from 'antd'
import {
  CheckCircleOutlined,
  ClearOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import actions from 'redux/admin/clear-redis/actions'

const mapStateToProps = ({ clearRedis }) => ({
  loading: clearRedis.loading,
  data: clearRedis.data,
})

const mapDispatchToProps = dispatch => ({
  LoadRedisKey: () => {
    dispatch({
      type: actions.LOAD,
      source: '',
    })
  },
  ClearRedisKey: (payload, successCallback) => {
    dispatch({
      type: actions.CLEAR_REDIS,
      payload,
      successCallback,
      source: '',
    })
  },
})

const columns = [
  {
    title: 'Redis Key',
    dataIndex: 'redis_key',
    width: 100,
  },
  {
    title: 'Status',
    render: record => {
      if (record.status === 'loading')
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
            processing
          </Tag>
        )
      if (record.status === 'error')
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            error
          </Tag>
        )
      if (record.status)
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {record.status}
          </Tag>
        )
      return null
    },
  },
]

const ClearRedis = ({ loading, data, LoadRedisKey, ClearRedisKey }) => {
  useEffect(() => LoadRedisKey(), [LoadRedisKey])

  const [selectedRowKeys, setSelectedRowKeys] = React.useState([])
  const reload = React.useCallback(() => {
    LoadRedisKey()
    setSelectedRowKeys([])
  }, [LoadRedisKey])

  const onClickClearRedis = React.useCallback(() => {
    selectedRowKeys.forEach(redis_key => {
      ClearRedisKey({
        redis_key,
      })
    })
  }, [selectedRowKeys, ClearRedisKey])

  return (
    <div className="card">
      <div className="card-body d-flex flex-row-reverse align-items-start">
        <Space>
          <Tooltip placement="top" title="Refresh list">
            <Button icon={<ReloadOutlined />} onClick={reload} />
          </Tooltip>
        </Space>
        <Table
          rowKey="redis_key"
          dataSource={data}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={columns}
          title={() => (
            <Button
              type="primary"
              icon={<ClearOutlined />}
              onClick={onClickClearRedis}
              loading={loading}
              disabled={selectedRowKeys.length === 0}
            >
              Clear Redis
            </Button>
          )}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ClearRedis)
