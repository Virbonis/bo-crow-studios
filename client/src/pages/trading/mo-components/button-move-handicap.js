import React from 'react'
import { message } from 'antd'
import { CaretUpFilled, CaretDownFilled } from '@ant-design/icons'
import actionsMO from 'redux/mo5/actions'
import { connect } from 'react-redux'

const mapDispatchToProps = dispatch => ({
  MoveHandicap: (payload, successCallback) => {
    dispatch({
      type: actionsMO.MOVE_HANDICAP,
      payload,
      successCallback,
    })
  },
})

const ButtonMoveHandicap = ({
  match_id,
  sub_match_id,
  total_score,
  handicap,
  gt,
  tableRef,
  successCallback,
  MoveHandicap,
}) => {
  const onClickMoveHandicap = direction => {
    let point = 0
    if (gt === 'HDP') point = tableRef.current.moveHandicapHDPRef.current.value
    else if (gt === 'OU') point = tableRef.current.moveHandicapOURef.current.value
    else if (gt === 'GAH') point = tableRef.current.moveHandicapGAHRef.current.value

    if (point > 0) {
      let minHDPOU = 0
      let isValidHDP = true
      // Validasi hanya utk hdp OU
      if (gt === 'OU') {
        let nextHandicap
        if (direction === 'U') nextHandicap = parseFloat(handicap) + point
        else nextHandicap = parseFloat(handicap) - point

        minHDPOU = total_score + 0.5
        isValidHDP = nextHandicap >= minHDPOU
      }

      if (isValidHDP) {
        const { popup_id } = tableRef.current.viewParameter
        MoveHandicap(
          {
            match_id,
            sub_match_id,
            direction,
            point,
            popup_id,
          },
          successCallback,
        )
      } else message.warning(`Handicap can't be less than ${minHDPOU}`)
    }
  }

  return (
    <div className="w-100 h-100 d-flex flex-row justify-content-between align-items-center">
      <button
        size="small"
        type="button"
        className="btn-move-hdp green p-0 w-100 h-100"
        onClick={() => onClickMoveHandicap('U')}
      >
        <CaretUpFilled style={{ fontSize: 18 }} />
      </button>
      <button
        size="small"
        type="button"
        className="btn-move-hdp red p-0 w-100 h-100"
        onClick={() => onClickMoveHandicap('D')}
      >
        <CaretDownFilled style={{ fontSize: 18 }} />
      </button>
    </div>
  )
}

export default connect(null, mapDispatchToProps)(ButtonMoveHandicap)
