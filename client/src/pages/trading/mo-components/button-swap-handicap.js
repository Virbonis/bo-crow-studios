import React from 'react'
import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons'
import actionsMO from 'redux/mo5/actions'
import { connect } from 'react-redux'

const mapDispatchToProps = dispatch => ({
  SwapHandicap: (payload, successCallback) => {
    dispatch({
      type: actionsMO.SWAP_HANDICAP,
      payload,
      successCallback,
    })
  },
})

const ButtonSwapHandicap = ({
  match_id,
  display_admin,
  sub_match_id,
  game_type,
  sameSubMatch,
  successCallback,
  SwapHandicap,
}) => {
  const [isFirst, isLast] = React.useMemo(() => {
    const index = sameSubMatch.findIndex(x => x.ArrMatch.row_id === `${match_id}-${display_admin}`)
    return [index === 0, index === sameSubMatch.length - 1]
  }, [sameSubMatch, match_id, display_admin])

  return (
    <>
      {isFirst ? null : (
        <button
          type="button"
          className="mo_btn_move_hdp green2 p-0"
          onClick={() =>
            SwapHandicap(
              {
                match_id,
                sub_match_id,
                game_type,
                direction: 'U',
              },
              successCallback,
            )
          }
        >
          <VerticalAlignTopOutlined />
        </button>
      )}
      {isLast ? null : (
        <button
          type="button"
          className="mo_btn_move_hdp red2 p-0"
          onClick={() =>
            SwapHandicap({
              match_id,
              sub_match_id,
              game_type,
              direction: 'D',
            })
          }
        >
          <VerticalAlignBottomOutlined />
        </button>
      )}
    </>
  )
}
export default connect(null, mapDispatchToProps)(ButtonSwapHandicap)
