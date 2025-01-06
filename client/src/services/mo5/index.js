import { notification } from 'antd'
// import store from 'store'
import apiClient from 'services/axios'

export function showNotification(message) {
  // const disable = store.get('app.settings.disable_notification_mo')
  const disable = true
  if (!disable) notification.info({ message })
}

export function showErrorNotification(err) {
  const { data } = err.response
  notification.warning({
    placement: 'topRight',
    style: {
      whiteSpace: 'pre-wrap',
    },
    message: data.replaceAll('|', '\n'),
  })
}

export async function SwapFavorite(payload, source) {
  return apiClient
    .patch(`/mo5/swapfavorite`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Swap Favorite Success.')
          return true
        }
      }
      return false
    })
    .catch(showErrorNotification)
}
export async function UpdateZeroOdds(payload, source) {
  return apiClient
    .patch(`/mo5/zeroodds`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Update Zero Odds Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function MoveHandicap(payload, source) {
  return apiClient
    .patch(`/mo5/movehandicap`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Move Handicap Success.')
          return true
        }
      }
      return false
    })
    .catch(showErrorNotification)
}
export async function ChangeHandicap(payload, source) {
  return apiClient
    .patch(`/mo5/changehandicap`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Change Handicap Success.')
          return true
        }
      }
      return false
    })
    .catch(showErrorNotification)
}
export async function SwapHandicap(payload, source) {
  return apiClient
    .patch(`/mo5/swaphandicap`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Swap Handicap Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function ChangeOdds(payload, source) {
  return apiClient
    .patch(`/mo5/changeodds`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Change Odds Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function ChangeOddsEuro(payload, source) {
  return apiClient
    .patch(`/mo5/changeoddseuro`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Change Odds Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function ChangeOddsCSLive(payload, source) {
  return apiClient
    .patch(`/mo5/changeoddscslive`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Odds has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function ChangeOdds1x2(payload, source) {
  return apiClient
    .patch(`/mo5/changeodds1x2`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Change Odds Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function SwapOdds(payload, source) {
  return apiClient
    .patch(`/mo5/swapodds`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Swap Odds Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function MoveOdds(payload, source) {
  return apiClient
    .patch(`/mo5/moveodds`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Move Odds Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function ChangeLOD(payload, source) {
  return apiClient
    .patch(`/mo5/changelod`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Change LOD Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function ChangeSpread(payload, source) {
  return apiClient
    .patch(`/mo5/changespread`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Change Spread Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function ChangeAutoCalcOdds1X2(payload, source) {
  return apiClient
    .patch(`/mo5/changeautocalcodds1x2`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Change Auto Calc Odds Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function ChangeLDiff(payload, source) {
  return apiClient
    .patch(`/mo5/changeldiff`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Change LDiff Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function PauseResumeChoice(payload, source) {
  return apiClient
    .patch(`/mo5/pauseresumechoice`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Pause/Resume Choice Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function PauseResumeSubMatchCS(payload, source) {
  return apiClient
    .patch(`/mo5/pauseresumesubmatchcs`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Pause/Resume Sub Match Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function PauseResumeSubMatch(payload, source) {
  return apiClient
    .patch(`/mo5/pauseresumesubmatch`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Pause/Resume Sub Match Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function PauseResumeMatch(payload, source) {
  return apiClient
    .patch(`/mo5/pauseresumematch`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Pause/Resume Match Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function PauseResumeAll(payload, source) {
  return apiClient
    .patch(`/mo5/pauseresumeall`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Pause/Resume All Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function OpenCloseChoice(payload, source) {
  return apiClient
    .patch(`/mo5/openclosechoice`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Open/Close Choice Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function OpenCloseSubMatchCS(payload, source) {
  return apiClient
    .patch(`/mo5/openclosesubmatchcs`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Open/Close Sub Match Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function OpenCloseSubMatch(payload, source) {
  return apiClient
    .patch(`/mo5/openclosesubmatch`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Open/Close Sub Match Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function OpenCloseMatch(payload, source) {
  return apiClient
    .patch(`/mo5/openclosematch`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Open/Close Match Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function FollowLeechSubMatch(payload, source) {
  return apiClient
    .patch(`/mo5/followleechsubmatch`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Follow Leech Sub Match Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateLeechAssign(payload, source) {
  return apiClient
    .patch(`/mo5/leechassign`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Leech IBC has been updated.')
          return true
        }
      }
      return false
    })
    .catch(showErrorNotification)
}
export async function ChangeLock1X2(payload, source) {
  return apiClient
    .put(`/mo5/lock1x2`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          showNotification('Change Lock 1x2 Success.')
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function GetOGTPauseStatus(payload, source) {
  return apiClient
    .get(`/mo5/ogt-pause-status`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default UpdateLeechAssign
