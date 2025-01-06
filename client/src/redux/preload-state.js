import { call, delay, put } from 'redux-saga/effects'

const arr = [
  'auth/menu/LOAD',
  'branch/PRELOAD',
  'company/PRELOAD',
  'competition/PRELOAD',
  'country/PRELOAD',
  'currency/PRELOAD',
  'news-ticker/PRELOAD',
  'odds-spread/PRELOAD',
  'platform/PRELOAD',
  'product/PRELOAD',
  'profile/PRELOAD',
  'profile1x2/PRELOAD',
  'provider/PRELOAD',
  'region/PRELOAD',
  'specialCode/PRELOAD',
  'sport/PRELOAD',
  'userTeam/PRELOAD',
  'vip-code/PRELOAD',
  'flag/PRELOAD',
]
export default function* loadGlobal() {
  yield* arr.map(x => put({ type: x }))
}

export function* RetryPreload(request, source, delayTime = 2000) {
  let response
  while (!response) {
    response = yield call(request, source)
    if (response) return response
    yield delay(delayTime)
  }
}
