import React, { useEffect } from 'react'
import { Button, Table } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/bbz/actions'
import { ReloadOutlined } from '@ant-design/icons'

const mapStateToProps = ({ bbz }) => ({
  loading: bbz.loading,
  dataTable: bbz.data_channel_monitor,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: () => {
    dispatch({
      type: actions.LOAD_CHANNEL_MONITORING,
      source: 'BBZ Channel Monitoring',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP_CHANNEL_MONITOR }),
})

const columns = [
  {
    title: 'Channel',
    dataIndex: 'channel',
    width: 120,
  },
  {
    title: 'Last Update',
    dataIndex: 'stamp_date',
    width: 120,
    render: data => data?.formatDateTimeSecond(),
  },
  {
    title: 'Last Connection',
    dataIndex: 'last_connection',
    width: 120,
    render: data => data?.formatDateTimeSecond(),
  },
  {
    title: 'Channel Status',
    dataIndex: 'channel_status',
    width: 120,
    render: data => {
      if (data === 0) return 'Off'
      if (data === 1) return 'On'
      if (data === 2) return 'Restarting'
      return null
    },
  },
]
const BBZChannelMonitoring = ({ loading, dataTable, LoadTable, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  useEffect(() => {
    LoadTable()
  }, [LoadTable])

  return (
    <>
      <div className="card">
        <div className="card-body d-flex flex-row">
          <Table
            rowKey="channel"
            className="w-100"
            loading={loading}
            columns={columns}
            dataSource={dataTable}
            pagination={false}
          />
          <Button onClick={LoadTable} icon={<ReloadOutlined />} />
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BBZChannelMonitoring)
