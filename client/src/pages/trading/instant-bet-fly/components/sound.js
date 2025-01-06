import React from 'react'
import { isEqual } from 'lodash'
import useAudio from './use-audio'

const Sound = React.memo(
  ({ data, bet_amount_comp, play_sound }) => {
    const lastIDRef = React.useRef()

    const [isPending, isStake, isDanger, isVip3, isVip6, isVip11] = React.useMemo(() => {
      const newLastID = data[0]?.id
      const temp = lastIDRef.current
      lastIDRef.current = newLastID
      return [
        data.some(e => e.is_long_pending === 1),
        newLastID - temp > 0,
        data.some(e => e.bet_amount_comp > bet_amount_comp),
        data.some(e => e.vip_code.split('^').includes('3') && e.vip_timer <= 5),
        data.some(e => e.vip_code.split('^').includes('6') && e.vip_timer <= 5),
        data.some(e => e.vip_code.split('^').includes('11') && e.vip_timer <= 5),
      ]
    }, [data, bet_amount_comp, lastIDRef])

    useAudio(isPending, isStake, isDanger, isVip3, isVip6, isVip11, play_sound) // useAudio taro di component ini biar gk ke-trigger setiap ada perubahan saat di Client Side
    return null
  },
  (prev, next) => isEqual(prev.data, next.data),
)

export default Sound
