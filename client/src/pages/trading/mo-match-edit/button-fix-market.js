import React from 'react'
import { connect } from 'react-redux'
import { Button, Popconfirm } from 'antd'
import actions from 'redux/mo-match-edit/actions'
import authEnum from 'authorize'

const mapStateToProps = ({ moEdit, auth }) => ({
  match_id: moEdit.editValue.match_id,
  havePermissionFixMarket: auth.user.user_auth_ids.includes(authEnum.WHO_CAN_FIX_MARKET),
})

const mapDispatchToProps = dispatch => ({
  UpdateFixMarket: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_FIX_MARKET,
      payload,
      successCallback,
    })
  },
})
const ButtonFixMarket = ({ match_id, havePermissionFixMarket, UpdateFixMarket }) => {
  if (!havePermissionFixMarket) return null

  const onClickFixMarket = () => {
    UpdateFixMarket({
      match_id,
    })
  }

  return (
    <Popconfirm
      title="This only for fixing corrupted market and might affecting close the current market"
      onConfirm={onClickFixMarket}
    >
      <Button className="w-100 bg-green text-white" size="large">
        Fix Market
      </Button>
    </Popconfirm>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonFixMarket)
