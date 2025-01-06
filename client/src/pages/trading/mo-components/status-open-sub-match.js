import React from 'react'
import { connect } from 'react-redux'
import actionsMO from 'redux/mo5/actions'

const mapDispatchToProps = dispatch => ({
  OpenCloseSubMatch: (payload, successCallback) => {
    dispatch({
      type: actionsMO.OPEN_CLOSE_SUB_MATCH,
      payload,
      successCallback,
    })
  },
})

const StatusOpenSubMatch = ({
  match_id,
  sub_match_id,
  st_open,
  game_type,
  textOnly,
  successCallback,
  OpenCloseSubMatch,
}) => {
  if (textOnly) return <input type="checkbox" checked={st_open === 'N'} disabled={textOnly} />

  return (
    <input
      type="checkbox"
      checked={st_open === 'N'}
      onChange={e =>
        OpenCloseSubMatch(
          {
            match_id,
            sub_match_id,
            game_type,
            sub_match_open_status: e.target.checked ? 'N' : 'Y',
          },
          successCallback,
        )
      }
      disabled={textOnly}
    />
  )
}
export default connect(null, mapDispatchToProps)(StatusOpenSubMatch)
