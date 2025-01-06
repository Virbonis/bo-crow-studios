import { notification } from 'antd'
import apiClient from 'services/axios'
import { showErrorNotification } from 'services/mo5'

export async function LoadMatch(payload, source) {
  return apiClient
    .get('/mo5/moeditahou', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMatch(payload, source) {
  return apiClient
    .put(`/mo5/moeditahou`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateProfile(payload, source) {
  return apiClient
    .put(`/mo5/profile`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Profile has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateSportsTicker(payload, source) {
  return apiClient
    .put(`/mo5/sportsticker`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Sports Ticker has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateSportsTickerCS(payload, source) {
  return apiClient
    .put(`/mo5/sportstickercs`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Sports Ticker CS has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateSportsTickerOE(payload, source) {
  return apiClient
    .put(`/mo5/sportstickeroe`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Sports Ticker OE has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMatchParlay(payload, source) {
  return apiClient
    .put(`/mo5/matchparlay`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match Parlay has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateOddsPointDiff(payload, source) {
  return apiClient
    .put(`/mo5/oddspointdiff`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Odds Point Diff has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateParlay(payload, source) {
  return apiClient
    .put(`/mo5/parlay`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Parlay has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateRBDelay(payload, source) {
  return apiClient
    .put(`/mo5/rbdelay`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'RB Delay has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateLinkOdds(payload, source) {
  return apiClient
    .put(`/mo5/linkodds`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Link Odds has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateTimedMaxBet(payload, source) {
  return apiClient
    .put(`/mo5/timedmaxbet`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Timed MaxBet & MaxLimit has been updated.',
        })
        return true
      }
      return false
    })
    .catch(showErrorNotification)
}

export async function UpdateMatchLiveStatus(payload, source) {
  return apiClient
    .put(`/mo5/matchlivestatus`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Live Finalize has been updated.',
        })
        return true
      }
      return false
    })
    .catch(showErrorNotification)
}
export async function UpdateFixMarket(payload, source) {
  return apiClient
    .put(`/mo5/fixmarket`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Fix Market has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateAutoProcessBetBazar(payload, source) {
  return apiClient
    .put(`/mo5/autoprocessbetbazar`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Auto Process BetBazar has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateAutoProcessIM(payload, source) {
  return apiClient
    .put(`/mo5/autoprocessim`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Auto Process IM has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateProfileGameType(payload, source) {
  return apiClient
    .put(`/mo5/profilegametype`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Profile Game Type has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMatchET(payload, source) {
  return apiClient
    .patch(`/mo5/et`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match ET has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMatchPEN(payload, source) {
  return apiClient
    .patch(`/mo5/pen`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match PEN has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function AddPenaltyShootOut(payload, source) {
  return apiClient
    .post(`/mo5/penaltyshootout`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Penalty ShootOut has been added.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function AddSubMatch(payload, source) {
  return apiClient
    .post(`/mo5/submatch`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Sub Match has been added.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function DeleteSubMatch(payload, source) {
  return apiClient
    .delete(`/mo5/submatch`, {
      headers: { source },
      data: payload,
    })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Sub Match has been deleted.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadMatch
