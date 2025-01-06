import React from 'react'
import { connect } from 'react-redux'
import { Button, Popconfirm, Space } from 'antd'
import actions from 'redux/mo-scoring-detail/actions'

const mapStateToProps = ({ moScoringDetail }) => ({
  match_id: moScoringDetail.editValue.match_id,
  sport_id: moScoringDetail.editValue.sport_id,
})

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  UpdateScoreDetail: payload => {
    dispatch({
      type: actions.UPDATE_SCORE_DETAIL,
      payload,
      successCallback,
    })
  },
})

const MovePoint = ({
  match_id,
  sport_id,
  UpdateScoreDetail,
  home99,
  away99,
  st_general,
  home_away,
}) => {
  const onAdjPoin = (ha, movePoint = 1) => {
    const nSet = 99
    const cPoint = movePoint
    const tempPH = Number(home99)
    const tempPA = Number(away99)
    const cPointHome = Number.isNaN(tempPH) ? 0 : tempPH
    const cPointAway = Number.isNaN(tempPA) ? 0 : tempPA
    let nPoint = 0

    if (st_general === 'Tie') {
      if (ha === 'H') {
        nPoint = cPointHome + cPoint
        return TennCheckPointTie(cPointAway, nPoint, nSet, ha)
      }
      // else if (ha === 'A') {
      nPoint = cPointAway + cPoint
      return TennCheckPointTie(cPointHome, nPoint, nSet, ha)
      // }
    }
    // else {
    const mode = Number.isNaN(cPointHome) === false && Number.isNaN(cPointAway) === false ? 1 : 2
    if (ha === 'H') {
      nPoint = cPointHome + cPoint
      return TennCheckPoint(mode, cPointHome, cPointAway, cPoint, nPoint, nSet, ha, tempPH, tempPA)
    }
    // else if (ha === 'A') {
    nPoint = cPointAway + cPoint
    return TennCheckPoint(mode, cPointAway, cPointHome, cPoint, nPoint, nSet, ha, tempPA, tempPH)
    // }
    // }
  }
  function TennCheckPointTie(vsPoint, nPoint, nSet, ha) {
    if (nPoint > 6 && Math.abs(nPoint - vsPoint) === 2) {
      // confirmBox('Sure Match is GAME ?')
      //   .then(() => callHandler_ScoreDetail(nSet, ha, '0', 'ConfPoint'))
      //   .catch(() => callHandler_ScoreDetail(nSet, ha, nPoint, 'Point'))
      return [
        true,
        () => callHandler_ScoreDetail(nSet, ha, '0', 'ConfPoint'),
        () => callHandler_ScoreDetail(nSet, ha, nPoint, 'Point'),
      ]
    }
    // else {
    // callHandler_ScoreDetail(nSet, ha, nPoint, 'Point')
    return [false, () => callHandler_ScoreDetail(nSet, ha, nPoint, 'Point')]
    // }
  }
  function TennCheckPoint(mode, haPoint, vsPoint, cPoint, nPoint, nSet, ha, haTemp, vsTemp) {
    if (mode === 1) {
      if (nPoint === 41 && vsPoint < 40) {
        // confirmBox('Sure Match is GAME ?').then(() =>
        //   callHandler_ScoreDetail(nSet, ha, '0', 'ConfPoint'),
        // )
        return [true, () => callHandler_ScoreDetail(nSet, ha, '0', 'ConfPoint')]
      }
      if (nPoint === 41 && vsPoint === 40) {
        // callHandler_ScoreDetail(nSet, ha, TennPoint(cPoint, nPoint), 'Point')
        return [false, () => callHandler_ScoreDetail(nSet, ha, TennPoint(cPoint, nPoint), 'Point')]
      }
      // else {
      // callHandler_ScoreDetail(nSet, ha, TennPoint(cPoint, haPoint), 'Point')
      return [false, () => callHandler_ScoreDetail(nSet, ha, TennPoint(cPoint, haPoint), 'Point')]
      // }
    }
    // else if (mode === 2) {
    if (Number.isNaN(haPoint) === true && (haTemp !== '' || haTemp !== '-')) {
      if (haTemp === 'A' && cPoint === 1) {
        // confirmBox('Sure Match is GAME ?').then(() =>
        //   callHandler_ScoreDetail(nSet, ha, '0', 'ConfPoint'),
        // )
        return [true, () => callHandler_ScoreDetail(nSet, ha, '0', 'ConfPoint')]
      }
      if (haTemp === 'A' && cPoint === -1) {
        // callHandler_ScoreDetail(nSet, ha, TennPoint(cPoint, haTemp), 'Point')
        return [false, () => callHandler_ScoreDetail(nSet, ha, TennPoint(cPoint, haTemp), 'Point')]
      }
    } else if (nPoint > 40 && vsTemp === 'A') {
      return [false]
    } else {
      // callHandler_ScoreDetail(nSet, ha, TennPoint(cPoint, haPoint), 'Point')
      return [false, () => callHandler_ScoreDetail(nSet, ha, TennPoint(cPoint, haPoint), 'Point')]
    }
    // }
  }
  function TennPoint(val, point) {
    let newPoint = '0'
    if (val <= -1) {
      if (Number.isNaN(point) && point === 'A') {
        newPoint = '40'
      } else {
        switch (point) {
          case 0:
            newPoint = '0'
            break
          case 15:
            newPoint = '0'
            break
          case 30:
            newPoint = '15'
            break
          case 40:
            newPoint = '30'
            break
          default:
            break
        }
      }
    } else {
      switch (point) {
        case 0:
          newPoint = '15'
          break
        case 15:
          newPoint = '30'
          break
        case 30:
          newPoint = '40'
          break
        case 40:
          newPoint = 'A'
          break
        case 41:
          newPoint = 'A'
          break
        default:
          break
      }
    }

    return newPoint
  }
  function callHandler_ScoreDetail(set, ha, point, group) {
    // const { match_id, sport_id, refetch } = useContext(MOScoringDetailContext)
    // const { mutate: UpdateScoreDetail } = MutateUpdateScoreDetail(refetch)
    UpdateScoreDetail({
      match_id,
      sport_id,
      set,
      point,
      group,
      home_away: ha,
    })
  }

  const [isPrompt, callOk, callCancel] = onAdjPoin(home_away, 1)
  const [isPrompt2, callOk2, callCancel2] = onAdjPoin(home_away, -1)
  return (
    <Space direction="vertical" size={0}>
      <Popconfirm
        title="Sure Match is GAME?"
        disabled={!isPrompt}
        onConfirm={callOk}
        onCancel={callCancel}
      >
        <Button
          className="w-100 bg-green text-white"
          type="text"
          size="small"
          onClick={!isPrompt ? callOk : null}
        >
          +1
        </Button>
      </Popconfirm>
      <Popconfirm
        title="Sure Match is GAME?"
        disabled={!isPrompt2}
        onConfirm={callOk2}
        onCancel={callCancel2}
      >
        <Button
          className="w-100 bg-red text-white"
          type="text"
          size="small"
          onClick={!isPrompt2 ? callOk2 : null}
        >
          -1
        </Button>
      </Popconfirm>
    </Space>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(MovePoint)
