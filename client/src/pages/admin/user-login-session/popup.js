import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'
import actions from 'redux/user-login-session/actions'

const mapStateToProps = ({ userLoginSession }) => ({
  tableData: userLoginSession.popUpData,
  loading: userLoginSession.loadingPopUp,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_POP_UP,
      payload,
      source: 'User Login Session',
    })
  },
})

const PopUp = ({ username, Load, loading, tableData }) => {
  React.useEffect(() => Load({ trader: username }), [Load, username])
  const columns = [
    {
      title: 'Login',
      dataIndex: 'date_sign_on',
      width: 150,
      align: 'center',
      render: text => (text === '01 Jan 2001 00:00:00' ? '-' : text),
    },
    {
      title: 'Logout',
      dataIndex: 'dt_sign_off',
      align: 'center',
      width: 150,
      render: text => (text === '01 Jan 2001 00:00:00' ? '-' : text),
    },
    {
      title: 'IP',
      dataIndex: 'ip_login',
      align: 'center',
      width: 150,
    },
  ]
  const rowKey = rowData => `${rowData.ip_login}-${rowData.dt_sign_on}`
  return (
    <Table
      rowKey={rowKey}
      size="small"
      bordered
      loading={loading}
      dataSource={tableData}
      columns={columns}
      pagination={false}
      scroll={{ y: 500 }}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(PopUp)
