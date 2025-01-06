import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import actions from 'redux/mo-match-edit/actions'

const mapStateToProps = ({ moEdit }) => ({
  match_id: moEdit.editValue.match_id,
  match: moEdit.data.match,
})
const mapDispatchToProps = dispatch => ({
  UpdateMatchLiveStatus: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_MATCH_LIVE_STATUS,
      payload,
      successCallback,
    })
  },
})
const ButtonLive = ({ match_id, match, UpdateMatchLiveStatus }) => {
  const onClickLiveStatus = () => {
    UpdateMatchLiveStatus({
      match_id,
      match_live_status: match.match_live_status === 'Y' ? 'N' : 'Y', // reverse
    })
  }

  if (match.match_live_status === 'Y')
    return (
      <Button className="w-100" type="primary" size="large" onClick={onClickLiveStatus}>
        Finalize
      </Button>
    )
  if (match.match_has_live_status === 'Y')
    return (
      <Button className=" w-100 bg-green text-white" size="large" onClick={onClickLiveStatus}>
        Go Live
      </Button>
    )
  return null
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonLive)
