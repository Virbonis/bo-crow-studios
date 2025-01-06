import React from 'react'
import { connect } from 'react-redux'
import { Button, Space, Tooltip } from 'antd'
import actions from 'redux/trading-floor/actions'

const mapDispatchToProps = (
  dispatch,
  { record: { match_id, sub_match_id, game_type }, successCallback },
) => ({
  UpdateOpenCloseSubMatch: value => {
    dispatch({
      type: actions.UPDATE_OPEN_CLOSE_SUB_MATCH,
      payload: {
        match_id,
        sub_match_id,
        game_type,
        sub_match_open_status: value, // 'Y' or 'N'
      },
      successCallback,
      source: 'Trading Floor',
    })
  },
  UpdatePauseResumeSubMatch: value => {
    dispatch({
      type: actions.UPDATE_PAUSE_RESUME_SUB_MATCH,
      payload: {
        match_id,
        sub_match_id,
        game_type,
        sub_match_pause_id: value, // 0 or 1
      },
      successCallback,
      source: 'Trading Floor',
    })
  },
})

const OpenCloseSubMatchButton = ({
  record,
  UpdateOpenCloseSubMatch,
  UpdatePauseResumeSubMatch,
}) => {
  const { sub_match_open_status, sub_match_pause_status } = record

  return (
    <Space size={1}>
      {sub_match_open_status === 'Y' ? (
        <Tooltip title="GO close this submatch">
          <Button
            type="text"
            className="p-0 btn_plain text-danger"
            onClick={() => UpdateOpenCloseSubMatch('N')}
          >
            Cls
          </Button>
        </Tooltip>
      ) : (
        <Tooltip title="GO open this submatch">
          <Button
            type="text"
            className="p-0 btn_plain text-success"
            onClick={() => UpdateOpenCloseSubMatch('Y')}
          >
            Opn
          </Button>
        </Tooltip>
      )}
      |
      {sub_match_pause_status === 0 ? (
        <Tooltip title="GO pause this submatch">
          <Button
            type="text"
            className="p-0 btn_plain text-danger"
            onClick={() => UpdatePauseResumeSubMatch(1)}
          >
            Pse
          </Button>
        </Tooltip>
      ) : (
        <Tooltip title="GO resume this submatch">
          <Button
            type="text"
            className="p-0 btn_plain text-success"
            onClick={() => UpdatePauseResumeSubMatch(0)}
          >
            Rsm
          </Button>
        </Tooltip>
      )}
    </Space>
  )
}

export default connect(null, mapDispatchToProps)(OpenCloseSubMatchButton)
