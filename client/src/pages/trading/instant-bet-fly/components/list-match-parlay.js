import React from 'react'
import { connect } from 'react-redux'
import { Space, Spin } from 'antd'
import actions from 'redux/instant-bet/actions'

const mapStateToProps = ({ instantBet }) => ({
  loading: instantBet.loading,
  data: instantBet.listMatchParlay,
})
const mapDispatchToProps = (dispatch, { successCallback }) => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_LIST_MATCH_PARLAY,
      payload,
      successCallback,
    })
  },
})
const ListMatchParlay = ({ bet_id, loading, data, Load }) => {
  React.useEffect(() => {
    if (bet_id) Load({ bet_id })
  }, [Load, bet_id])

  return (
    <Spin spinning={loading}>
      <Space direction="vertical">{data}</Space>
    </Spin>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(ListMatchParlay)
