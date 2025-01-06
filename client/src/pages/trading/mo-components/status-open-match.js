import React from 'react'
import { connect } from 'react-redux'
import actionsMO from 'redux/mo5/actions'

// frompage = MOAHOU/MOTENNIS

const mapDispatchToProps = dispatch => ({
  OpenCloseMatch: (payload, successCallback) => {
    dispatch({
      type: actionsMO.OPEN_CLOSE_MATCH,
      payload,
      successCallback,
    })
  },
})

const StatusOpenMatch = ({
  match_id,
  st_open,
  textOnly,
  frompage = 'MOAHOU',
  OpenCloseMatch,
  successCallback,
}) => {
  if (textOnly) return <input type="checkbox" checked={st_open === 'N'} disabled={textOnly} />

  return (
    <input
      type="checkbox"
      checked={st_open === 'N'}
      onChange={e =>
        OpenCloseMatch(
          {
            match_id,
            match_open_status: e.target.checked ? 'N' : 'Y',
            mo_page: frompage,
          },
          successCallback,
        )
      }
      disabled={textOnly}
    />
  )
}

export default connect(null, mapDispatchToProps)(StatusOpenMatch)
