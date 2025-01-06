import { Table, Typography } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/leech-assign/actions'

const { Text } = Typography
const mapStateToProps = ({ leechAssign }) => ({
  loading: leechAssign.loadingPopUpData,
  tableData: leechAssign.popUpData,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_POPUP_TABLE,
      payload,
      source: 'Leech Assign',
    })
  },
})

const PopUp = ({ loading, tableData, Load, matchID }) => {
  React.useEffect(() => {
    Load({ match_id: matchID })
  }, [Load, matchID])

  const columns = [
    {
      title: 'Stamp User',
      dataIndex: 'username',
      align: 'center',
      width: 120,
    },
    {
      title: 'Match Date',
      dataIndex: 'start_date',
      align: 'center',
      width: 120,
      render: text => text.formatDateTime(),
    },
    {
      title: 'Leech',
      dataIndex: 'leech_assign',
      width: 120,
    },
  ]

  return (
    <Table
      rowKey="start_date"
      size="small"
      className="w-100"
      bordered
      loading={loading}
      dataSource={tableData}
      columns={columns}
      pagination={false}
      rowClassName={record => record.severity_id !== 0 && 'popup-on-cell-error'}
      footer={() => (
        <Text className="text-danger font-weight-bold">Note : Red background means error</Text>
      )}
    >
      {matchID}
    </Table>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(PopUp)
