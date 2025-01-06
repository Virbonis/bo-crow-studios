import { useDispatch } from 'react-redux'
import { useEvent } from 'rc-util'
import actionsMO from 'redux/mo5/actions'
import actionsMOMatchEdit from 'redux/mo-match-edit/actions'
import actionsMatchRecord from 'redux/match-record/actions'
import actionsBetList from 'redux/bet-list/actions'
import actionsAcceptReject from 'redux/accept-reject/actions'
import actionsOddsLog from 'redux/odds-log/actions'

const useDispatchMO = () => {
  const dispatch = useDispatch()

  const EditMatch = useEvent(match => {
    dispatch({
      type: actionsMOMatchEdit.OPEN_EDIT,
      payload: match,
    })
  })
  const EditMatchRecord = useEvent(match => {
    dispatch({
      type: actionsMatchRecord.EDIT,
      payload: match,
    })
  })
  const EditBetList = useEvent(match => {
    dispatch({
      type: actionsBetList.EDIT,
      payload: match,
    })
  })
  const EditAcceptReject = useEvent(match => {
    dispatch({
      type: actionsAcceptReject.EDIT,
      payload: match,
    })
  })
  const EditOddsLog = useEvent(match => {
    dispatch({
      type: actionsOddsLog.EDIT,
      payload: match,
    })
  })

  const SwapFavorite = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.SWAP_FAVOURITE,
      payload,
      successCallback,
    })
  })
  const UpdateZeroOdds = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.UPDATE_ZERO_ODDS,
      payload,
      successCallback,
    })
  })
  const MoveHandicap = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.MOVE_HANDICAP,
      payload,
      successCallback,
    })
  })
  const ChangeHandicap = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.CHANGE_HANDICAP,
      payload,
      successCallback,
    })
  })
  const ChangeOdds = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.CHANGE_ODDS,
      payload,
      successCallback,
    })
  })
  const SwapOdds = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.SWAP_ODDS,
      payload,
      successCallback,
    })
  })
  const MoveOdds = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.MOVE_ODDS,
      payload,
      successCallback,
    })
  })
  const PauseResumeSubMatch = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.PAUSE_RESUME_SUB_MATCH,
      payload,
      successCallback,
    })
  })
  const SwapHandicap = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.SWAP_HANDICAP,
      payload,
      successCallback,
    })
  })
  const ChangeLOD = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.CHANGE_LOD,
      payload,
      successCallback,
    })
  })
  const ChangeSpread = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.CHANGE_SPREAD,
      payload,
      successCallback,
    })
  })
  const OpenCloseSubMatch = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.OPEN_CLOSE_SUB_MATCH,
      payload,
      successCallback,
    })
  })
  const PauseResumeMatch = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.PAUSE_RESUME_MATCH,
      payload,
      successCallback,
    })
  })
  const OpenCloseMatch = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.OPEN_CLOSE_MATCH,
      payload,
      successCallback,
    })
  })
  const ChangeOdds1X2 = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.CHANGE_ODDS_1X2,
      payload,
      successCallback,
    })
  })
  const ChangeLock = useEvent((payload, successCallback) => {
    dispatch({
      type: actionsMO.CHANGE_LOCK_1X2,
      payload,
      successCallback,
    })
  })

  return {
    EditMatch,
    SwapFavorite,
    UpdateZeroOdds,
    EditMatchRecord,
    MoveHandicap,
    ChangeHandicap,
    ChangeOdds,
    SwapOdds,
    MoveOdds,
    PauseResumeSubMatch,
    SwapHandicap,
    ChangeLOD,
    EditBetList,
    ChangeSpread,
    OpenCloseSubMatch,
    PauseResumeMatch,
    OpenCloseMatch,
    EditAcceptReject,
    EditOddsLog,
    ChangeOdds1X2,
    ChangeLock,
  }
}

export default useDispatchMO
