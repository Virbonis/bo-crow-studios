import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { isEqual } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/match/actions'

const mapDispatchToProps = dispatch => ({
  SwapSequence: (payload, successCallback) => {
    dispatch({
      type: actions.SWAP_MATCH_SEQUENCE,
      payload,
      successCallback,
      source: 'Match Sequence',
    })
  },
})

const SwapSequenceButton = React.memo(
  ({ SwapSequence, record, reload }) => {
    const { swapUp, swapDown } = record
    const onSwapUp = React.useCallback(
      () =>
        SwapSequence(
          {
            match_id: record.match_id,
            match_id_swap: record.match_id_swap_up,
          },
          reload,
        ),
      [SwapSequence, record, reload],
    )
    const onSwapDown = React.useCallback(
      () =>
        SwapSequence(
          {
            match_id: record.match_id,
            match_id_swap: record.match_id_swap_down,
          },
          reload,
        ),
      [SwapSequence, record, reload],
    )
    return (
      <div className="d-flex justify-content-between">
        <div>
          {swapUp && (
            <button
              style={{ ...style, color: 'green' }}
              type="button"
              onClick={() => onSwapUp(record)}
            >
              <CaretUpOutlined />
            </button>
          )}
        </div>
        <div>
          {swapDown && (
            <button
              style={{ ...style, color: 'red' }}
              type="button"
              onClick={() => onSwapDown(record)}
            >
              <CaretDownOutlined />
            </button>
          )}
        </div>
      </div>
    )
  },
  (prev, next) => isEqual(prev.record, next.record),
)

const style = {
  background: 'none',
  border: 'none',
  fontSize: '16px',
}

export default connect(null, mapDispatchToProps)(SwapSequenceButton)
