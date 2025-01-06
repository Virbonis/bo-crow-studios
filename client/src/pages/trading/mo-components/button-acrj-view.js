import React from 'react'

const ButtonAcRjView = ({ match_id, title }) => {
  return (
    <button
      size="small"
      type="button"
      className="p-0 mo_btn_link"
      onClick={() =>
        window.open(
          `/#/trading/mo-accept-reject-view-fly?match_id=${match_id}&title=${title}`,
          `AcceptRejectView-${match_id}`,
          'height=500,width=1250,scrollbars=no',
        )
      }
    >
      AcRj
    </button>
  )
}

export default ButtonAcRjView
