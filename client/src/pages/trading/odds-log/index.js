import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/odds-log/actions'
import { Button, Divider, Table } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { columns } from 'pages/report/odds-log'

const mapStateToProps = ({ oddsLog }) => ({
  data: oddsLog.data,
  loading: oddsLog.loading,
})
const mapDispatchToProps = dispatch => ({
  CancelEdit: () => dispatch({ type: actions.CLEAN_UP }),
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
    })
  },
})
const OddsLog = React.memo(({ editValue, data, loading, Load }) => {
  React.useEffect(() => {
    Load(editValue)
  }, [Load, editValue])
  const refetch = React.useCallback(() => Load(editValue), [Load, editValue])

  return (
    <>
      <Divider orientation="left">
        <Button size="small" loading={loading} icon={<ReloadOutlined />} onClick={refetch}>
          Refresh
        </Button>
      </Divider>
      <Table
        bordered
        rowKey="row_id"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={false}
        scroll={{ y: 500 }}
      />
    </>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(OddsLog)
