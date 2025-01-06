import React from 'react'
import { connect } from 'react-redux'
import { Space } from 'antd'
import actions from 'redux/trading-floor/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  UpdateOpenCloseSubMatch: payload => {
    dispatch({
      type: actions.UPDATE_OPEN_CLOSE_SUB_MATCH,
      payload,
      successCallback,
      source: 'Trading Floor',
    })
  },
  UpdatePauseResumeSubMatch: payload => {
    dispatch({
      type: actions.UPDATE_PAUSE_RESUME_SUB_MATCH,
      payload,
      successCallback,
      source: 'Trading Floor',
    })
  },
})

const OpenCloseSubMatchButton = ({
  record,
  UpdatePauseResumeSubMatch,
  UpdateOpenCloseSubMatch,
}) => {
  const {
    match_id,
    sub_match_id,
    game_type,
    sub_match_open_status,
    sub_match_pause_status,
    sport_id,
  } = record

  const OpenCloseSubMatchHandler = value => {
    UpdateOpenCloseSubMatch({
      match_id,
      sub_match_id,
      game_type,
      sub_match_open_status: value,
    })
  }

  const PauseResumeSubMatchHandler = value => {
    UpdatePauseResumeSubMatch({
      match_id,
      sub_match_id,
      game_type,
      sub_match_pause_id: value,
    })
  }

  const [openClose, pauseResume] = React.useMemo(() => {
    const title1 =
      sub_match_open_status === 'Y' ? 'GO close this submatch' : 'GO open this submatch'
    const text1 = sub_match_open_status === 'Y' ? 'Cls' : 'Opn'
    const nextSt1 = sub_match_open_status === 'Y' ? 'N' : 'Y'
    const class1 = sub_match_open_status === 'Y' ? 'text-danger' : 'text-success'

    const title2 = ['0', 'N'].includes(sub_match_pause_status.toString())
      ? 'GO pause this submatch'
      : 'GO resume this submatch'
    const text2 = ['0', 'N'].includes(sub_match_pause_status.toString()) ? 'Pse' : 'Rsm'
    const nextSt2 = ['0', 'N'].includes(sub_match_pause_status.toString()) ? 1 : 0
    const class2 = ['0', 'N'].includes(sub_match_pause_status.toString())
      ? 'text-danger'
      : 'text-success'
    return [
      { title: title1, text: text1, nextSt: nextSt1, class: class1 },
      { title: title2, text: text2, nextSt: nextSt2, class: class2 },
    ]
  }, [sub_match_open_status, sub_match_pause_status])

  const disabled = sport_id === 10 && [1, 8, 0, 2, 5, 6].includes(game_type)
  // const buttons = getButtons(record)

  // if(disabled) return null
  return (
    <Space size={1}>
      <button
        disabled={disabled}
        type="button"
        title={openClose.title}
        className={`p-0 btn_plain ${openClose.class}`}
        onClick={() => OpenCloseSubMatchHandler(openClose.nextSt)}
      >
        {openClose.text}
      </button>
      |
      <button
        disabled={disabled}
        type="button"
        title={pauseResume.title}
        className={`p-0 btn_plain ${pauseResume.class}`}
        onClick={() => PauseResumeSubMatchHandler(pauseResume.nextSt)}
      >
        {pauseResume.text}
      </button>
    </Space>
  )
}

export default connect(null, mapDispatchToProps)(OpenCloseSubMatchButton)
