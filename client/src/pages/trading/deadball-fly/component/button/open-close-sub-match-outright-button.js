import React from 'react'
import { connect } from 'react-redux'
import { Button, Space, Tooltip } from 'antd'
import actions from 'redux/trading-floor/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  UpdateOpenCloseSubMatchOutright: payload => {
    dispatch({
      type: actions.UPDATE_OPEN_CLOSE_SUB_MATCH_OUTRIGHT,
      payload,
      successCallback,
      source: 'Trading Floor',
    })
  },
  UpdatePauseResumeSubMatchOutright: payload => {
    dispatch({
      type: actions.UPDATE_PAUSE_RESUME_SUB_MATCH_OUTRIGHT,
      payload,
      successCallback,
      source: 'Trading Floor',
    })
  },
})

const OpenCloseSubMatchOutrightButton = ({
  record,
  UpdateOpenCloseSubMatchOutright,
  UpdatePauseResumeSubMatchOutright,
}) => {
  const { outright_id, sub_match_seq, sub_match_open_status, sub_match_pause_status } = record

  const OpenCloseSubMatchHandler = value => {
    UpdateOpenCloseSubMatchOutright({
      outright_id,
      sub_match_seq,
      sub_match_open_status: value,
    })
  }
  const PauseResumeSubMatchHandler = value => {
    UpdatePauseResumeSubMatchOutright({
      outright_id,
      sub_match_seq,
      sub_match_pause_status: value,
    })
  }

  const [openClose, pauseResume] = React.useMemo(() => {
    const title1 =
      sub_match_open_status === 'Y' ? 'GO close this submatch' : 'GO open this submatch'
    const text1 = sub_match_open_status === 'Y' ? 'Cls' : 'Opn'
    const nextSt1 = sub_match_open_status === 'Y' ? 'N' : 'Y'
    const class1 = sub_match_open_status === 'Y' ? 'text-danger' : 'text-success'

    const title2 =
      sub_match_pause_status === 0 ? 'GO pause this submatch' : 'GO resume this submatch'
    const text2 = sub_match_pause_status === 0 ? 'Pse' : 'Rsm'
    const nextSt2 = sub_match_pause_status === 0 ? 1 : 0
    const class2 = sub_match_pause_status === 0 ? 'text-danger' : 'text-success'
    return [
      { title: title1, text: text1, nextSt: nextSt1, class: class1 },
      { title: title2, text: text2, nextSt: nextSt2, class: class2 },
    ]
  }, [sub_match_open_status, sub_match_pause_status])

  return (
    <Space size={1}>
      <Button
        type="link"
        className={`p-0 btn_plain ${openClose.class}`}
        onClick={() => OpenCloseSubMatchHandler(openClose.nextSt)}
      >
        <Tooltip title={openClose.title}>{openClose.text}</Tooltip>
      </Button>
      |
      <Button
        type="link"
        className={`p-0 btn_plain ${pauseResume.class}`}
        onClick={() => PauseResumeSubMatchHandler(pauseResume.nextSt)}
      >
        <Tooltip title={pauseResume.title}>{pauseResume.text}</Tooltip>
      </Button>
    </Space>
  )
}

export default connect(null, mapDispatchToProps)(OpenCloseSubMatchOutrightButton)
