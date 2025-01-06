import apiClient from 'services/axios'
import { showNotification } from 'services/mo5'

export async function UpdateMatchMoreGT(payload, source) {
  return apiClient
    .put(`/trading-floor/more-gt`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Request More GT is successful.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateOpenCloseMatch(payload, source) {
  return apiClient
    .put(`/trading-floor/open-close-match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Open/Close Match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdatePauseResumeMatch(payload, source) {
  return apiClient
    .put(`/trading-floor/pause-resume-match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Pause/Resume Match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateOpenCloseSubMatch(payload, source) {
  return apiClient
    .put(`/trading-floor/open-close-sub-match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Open/Close Sub Match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdatePauseResumeSubMatch(payload, source) {
  return apiClient
    .put(`/trading-floor/pause-resume-sub-match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Pause/Resume Sub Match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateLiveFinalize(payload, source) {
  return apiClient
    .put(`/trading-floor/live-finalize`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Live Finalize Match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateOddsHDC(payload, source) {
  return apiClient
    .put(`/trading-floor/odds-hdc`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Odds HDC has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateTradingMoveOdds(payload, source) {
  return apiClient
    .put(`/trading-floor/move-odds`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Move Odds has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateOpenCloseSubMatchOutright(payload, source) {
  return apiClient
    .put(`/trading-floor/open-close-sub-match-outright`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Success Open / Close Sub Match Outright.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdatePauseResumeSubMatchOutright(payload, source) {
  return apiClient
    .put(`/trading-floor/pause-resume-sub-match-outright`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Success Pause / Resume Sub Match Outright.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateOpenCloseOutright(payload, source) {
  return apiClient
    .put(`/trading-floor/open-close-outright`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Success Open / Close Outright.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdatePauseResumeOutright(payload, source) {
  return apiClient
    .put(`/trading-floor/pause-resume-outright`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Success Pause / Resume Outright.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateTradingOutrightSetting(payload, source) {
  return apiClient
    .put(`/trading-floor/outright-setting`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Outright Setting has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateTradingConfirmOutright(payload, source) {
  return apiClient
    .put(`/trading-floor/confirm-outright`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Success Confirm Outright.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default UpdateOpenCloseMatch
