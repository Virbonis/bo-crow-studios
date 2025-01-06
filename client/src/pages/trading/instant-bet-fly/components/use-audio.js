import React from 'react'

const useAudio = (isPendingBet, isStake, isDanger, isVip3, isVip6, isVip11, play_sound) => {
  const audioStake = React.useMemo(() => new Audio('/resources/audios/stake.mp3'), [])
  const pendingBet = React.useMemo(() => new Audio('/resources/audios/figalarm.mp3'), [])
  // const danger = React.useMemo(() => new Audio('/resources/audios/danger.mp3'), [])
  const vip3 = React.useMemo(() => new Audio('/resources/audios/VIP3placebet.mp3'), [])
  const vip6 = React.useMemo(() => new Audio('/resources/audios/os_follow_bet.mp3'), [])
  const vip11 = React.useMemo(() => new Audio('/resources/audios/follow_bet.mp3'), [])
  // React.useEffect(() => {
  //   if (isDanger && danger.paused) {
  //     danger.currentTime = 0
  //     danger.play()
  //   } else {
  //     danger.pause()
  //   }
  // }, [danger, isDanger])

  // gak pake hook, karena audio diplay setiap reload
  //   if (isStake) audioStake.play()
  if (play_sound) {
    if (isStake) audioStake.play()
    if (isPendingBet) pendingBet.play()
    // if (isDanger) danger.play()
    if (isVip3) vip3.play()
    if (isVip6) vip6.play()
    if (isVip11) vip11.play()
  }
}
export default useAudio
