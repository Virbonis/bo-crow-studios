import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadSelect(payload, source) {
  return apiClient
    .get('/league/select', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadSelectInInstantBet(payload, source) {
  return apiClient
    .get('/league/select/instantbet', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateSelect(payload, source) {
  return apiClient
    .put(`/league/select`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          // notification.info({
          //   message: 'Select league has been updated.',
          // })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateSelectRefresh(payload, source) {
  return apiClient
    .put(`/league/select/refresh`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          // notification.info({
          //   message: 'Select league has been updated.',
          // })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Load(source) {
  return apiClient
    .get(`/league`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadData(payload, source) {
  return apiClient
    .get(`/league`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Search(payload, source) {
  return apiClient
    .get(`/league/select/hidden-league`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadExportData(payload, source) {
  return apiClient
    .get(`/league/export`, { params: { sport_id: payload.sport_id }, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Create(payload, source) {
  return apiClient
    .post(`/league`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success create league',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Update(payload, source) {
  return apiClient
    .put(`/league`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit league',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadDetail(payload, source) {
  return apiClient
    .get(`/league/${payload.league_id}`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function EditParentLeague(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/parent-league`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit Parent League ID',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function EditOddsStep(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/odds-step`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit Odds Step',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function EditSpreadParlay(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/spread-parlay`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit Spread Parlay',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function EditOddsDiff(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/odds-diff`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit Odds Diff',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Edit1X2Diff(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/1x2-diff`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit 1X2 Diff',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function EditLAPShort(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/lap-short`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit LAP Short',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function EditAutoClose(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/auto-close`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit Auto Close',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function EditBetGenius(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/bet-genius`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit Bet Genius',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function EditTimedDiff(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/timed-diff`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit Timed Diff',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function EditProfileID(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/profile-id`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit Profile ID',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function EditProfile1X2(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/profile-1x2`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit Profile 1X2',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Edit1X2LAP(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/1x2-lap`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit 1X2 LAP',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function EditSpecialCode(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/special-code`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit Special Code',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function EditLeagueGroup(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/league-group`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit League Group',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function EditRegion(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/region`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit Region',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function EditLinkOddsDiff(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/linkoddsdiff`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success edit Link Odds Diff',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function CopyToLottery(payload, source) {
  return apiClient
    .put(`/league/${payload.league_id}/copy-lottery`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success Copy To Lottery',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLeagueAutoAddMatch(payload, source) {
  return apiClient
    .get('/league/select/auto-add-match', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLeagueAddMatch(payload, source) {
  return apiClient
    .get(`/league/select/add-match`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLeagueMatchList(payload, source) {
  return apiClient
    .get('/league/select/match-list', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLeagueMappingLottery(payload, source) {
  return apiClient
    .get(`/league/select/mapping-lottery`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLeagueMatchProfile(payload, source) {
  return apiClient
    .get(`/league/select/match-profile`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLeagueMatchStatistic(payload, source) {
  return apiClient
    .get(`/league/select/match-statistic`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLeagueProcessMatch(payload, source) {
  return apiClient
    .get('/league/select/process-match', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLeagueUnprocessMatch(payload, source) {
  return apiClient
    .get('/league/select/unprocess-match', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLeagueScoringMatch(payload, source) {
  return apiClient
    .get(`/league/select/scoring-match`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLeagueAddOutright(payload, source) {
  return apiClient
    .get('/league/select/add-outright', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLeagueMappingLeague(payload, source) {
  return apiClient
    .get('/league/select/mapping-league', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLeagueMappingLeagueRBall(payload, source) {
  return apiClient
    .get('/league/select/mapping-league-rball', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLeagueMappingBuilder(payload, source) {
  return apiClient
    .get('/league/select/mapping-bb', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLeagueOnlineList(payload, source) {
  return apiClient
    .get('/league/select/online-list', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export default LoadSelect
