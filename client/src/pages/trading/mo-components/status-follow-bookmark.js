import React from 'react'
import { connect } from 'react-redux'
import { Checkbox } from 'antd'
import actions from 'redux/mo5/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  FollowLeechSubMatch: payload => {
    dispatch({
      type: actions.FOLLOW_LEECH_SUB_MATCH,
      payload,
      successCallback,
    })
  },
})

const StatusFollowBookmark = React.memo(
  ({ FollowLeechSubMatch, match_id, sub_match_id, game_type, st_auto_odds, show_auto_odds }) => {
    const onChangeStatus = e => {
      FollowLeechSubMatch({
        match_id,
        sub_match_id,
        game_type,
        sub_match_follow_leech_status: e.target.checked ? 1 : 0,
      })
    }

    return (
      <Checkbox
        checked={st_auto_odds > 0}
        onChange={onChangeStatus}
        disabled={show_auto_odds !== 'Y'}
      />
    )
  },
)
export default connect(null, mapDispatchToProps)(StatusFollowBookmark)
