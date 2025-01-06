import React from 'react'
import { Spin, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import actions from 'redux/mo5/actions'
import { connect } from 'react-redux'

const mapStateToProps = ({ mo5 }, ownProps) => ({
  ogtPauseStatus: mo5.list_ogt_pause_status.find(x => x.match_id === ownProps.match.match_id),
})

const mapDispatchToProps = dispatch => ({
  GetOGTPauseStatus: payload => {
    dispatch({
      type: actions.GET_OGT_PAUSE_STATUS,
      payload,
    })
  },
})

const ButtonOtherGameType = ({ match, ogtPauseStatus, GetOGTPauseStatus }) => {
  React.useEffect(() => {
    if (ogtPauseStatus === undefined) GetOGTPauseStatus({ match_id: match.match_id })
  }, [GetOGTPauseStatus, ogtPauseStatus, match.match_id])
  const strokeWidth = ogtPauseStatus?.ogt_pause_status === 1 ? '100' : ''

  if (ogtPauseStatus === undefined) return null
  return (
    <>
      {ogtPauseStatus?.loading ? (
        <Spin />
      ) : (
        <button
          size="small"
          type="button"
          className="w-100 p-0 mo_btn_link"
          onClick={() => {
            window.open(
              `/#/trading/mo-other-game-type-fly?${new URLSearchParams(match).toString()}`,
              `OtherGameType`,
              'height=450,width=1500,scrollbars=no',
            )
          }}
        >
          <Tooltip title="Other Game Type">
            <PlusOutlined
              style={{
                // stroke: 'blue',
                strokeWidth,
              }}
            />
          </Tooltip>
        </button>
      )}
    </>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(ButtonOtherGameType)
