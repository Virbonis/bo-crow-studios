import { all, call, takeLeading } from 'redux-saga/effects'
import * as svc from 'services/export'
import { categoryName, getScoreGameTypeFGLG } from 'helper'
import { DOWNLOAD_BET_DETAIL } from 'redux/bet-enquiry/sagas'
import { Download } from 'utils'
import actions from './actions'

export function* EXPORT_BET_ENQUIRY({ payload, source }) {
  // dispatch original Bet Enquiry Export
  yield DOWNLOAD_BET_DETAIL({ payload, source, fromExportPage: true })
}
export function* EXPORT_MATCH_LIST({ payload, source }) {
  const response = yield call(svc.LoadExportMatchList, payload, source)
  if (response) {
    const { data } = response
    const title = [
      'No',
      'MatchID',
      'MatchDate',
      'Match Created Date',
      'Profile',
      'Sport',
      'League',
      'Home',
      'Away',
      'Leech',
      'Category',
      'Open',
      'Live',
      'Has Live',
      'Has Parlay',
      'Half Time',
      'Full Time',
      'FGLG',
      'Status',
    ]

    const dataNew = data.map((e, idx) => ({
      no: idx + 1,
      match_id: e.match_id,
      match_date: e.match_date,
      match_create_date: e.match_create_date,
      profile: e.profile_id,
      sport_name: e.sport_name,
      league_name: e.league_name,
      home_name: e.home_name,
      away_name: e.away_name,
      leech: e.auto_odds,
      category: categoryName[e.category],
      open: e.match_open_status === 'Y' ? 'Open' : 'Closed',
      live: e.match_live_status === 'Y' ? 'Live' : '-',
      has_live: e.match_has_live_status === 'Y' ? 'Live' : '-',
      has_parlay: e.match_has_parlay === 'Y' ? 'Has Parlay' : '-',
      half_time: getHTFTScore(e.ht_score_status, e.ht_home, e.ht_away, e.ht_score_desc),
      full_time: getHTFTScore(e.ft_score_status, e.fs_home, e.fs_away, e.ft_score_desc),
      fglg: getScoreGameTypeFGLG(e.fg_team, e.lg_team),
      status: getProcessStatus(e.process_date),
    }))

    Download(title, dataNew, 'MatchList.xlsx')
  }
}

export default function* rootSaga() {
  yield all([
    takeLeading(actions.EXPORT_BET_ENQUIRY, EXPORT_BET_ENQUIRY),
    takeLeading(actions.EXPORT_MATCH_LIST, EXPORT_MATCH_LIST),
  ])
}

function getHTFTScore(score_status, score_home, score_away, score_desc) {
  if (score_status === 'Y') return `(${score_home} - ${score_away})`
  if (score_status === 'C') return score_desc
  return ''
}
function getProcessStatus(status) {
  if (status === 'Y') return 'Unprocessed'
  if (status === 'N') return 'Processed'
  return ''
}
