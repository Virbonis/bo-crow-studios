import React from 'react'

const ButtonAcRj = ({ match_id, title }) => {
  const qs = {
    match_id,
    title,
  }
  return (
    <button
      size="small"
      type="button"
      className="p-0 mo_btn_link"
      onClick={() =>
        window.open(
          `/#/trading/mo-accept-reject-fly?${new URLSearchParams(qs).toString()}`,
          `AcceptReject-${match_id}`,
          'height=500,width=1000,scrollbars=no',
        )
      }
    >
      AcRj
    </button>
  )
}

export default ButtonAcRj
