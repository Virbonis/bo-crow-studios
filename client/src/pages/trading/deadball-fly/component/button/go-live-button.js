import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Typography } from 'antd'
import actions from 'redux/trading-floor/actions'

const { Text } = Typography
const mapDispatchToProps = (dispatch, { successCallback }) => ({
  UpdateLiveFinalize: payload => {
    dispatch({
      type: actions.UPDATE_LIVE_FINALIZE,
      payload,
      successCallback,
      source: 'Trading Floor',
    })
  },
})
const GoLiveButton = ({ record, UpdateLiveFinalize }) => {
  const { match_id, home_name, away_name } = record
  const GoLiveHandler = () => {
    return Modal.confirm({
      title: (
        <Text className="h5">
          {home_name} - {away_name}
        </Text>
      ),
      okText: 'Yes',
      cancelText: 'No',
      maskClosable: true,
      content: <Text className="h6">Confirm to GO LIVE?</Text>,
      onOk: () => {
        UpdateLiveFinalize({ match_id, match_live_status: 'Y' })
      },
    })
  }

  return (
    <Button type="text" className="text-primary p-0" onClick={() => GoLiveHandler()}>
      GO LIVE!
    </Button>
  )
}

export default connect(null, mapDispatchToProps)(GoLiveButton)
