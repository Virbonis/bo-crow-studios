import React from 'react'

const useAudioPause = (isAnyPaused, PMaxBet, PLap, PVIP3) => {
  const audioPause = React.useMemo(() => new Audio('/resources/audios/pause.mp3'), [])
  const audioPauseMaxBet = React.useMemo(() => new Audio('/resources/audios/pauseMaxBets.mp3'), [])
  const audioPauseLAP = React.useMemo(() => new Audio('/resources/audios/pauseLAP.mp3'), [])
  const audioPauseVIP3 = React.useMemo(() => new Audio('/resources/audios/pauseVIP3.mp3'), [])

  React.useEffect(() => {
    if (isAnyPaused && audioPause.paused) {
      audioPause.currentTime = 0
      audioPause.loop = true
      audioPause.play()
    } else {
      audioPause.pause()
    }
  }, [audioPause, isAnyPaused])

  // gak pake hook, karena audio diplay setiap reload
  if (PMaxBet) audioPauseMaxBet.play()
  if (PLap) audioPauseLAP.play()
  if (PVIP3) audioPauseVIP3.play()
}
export default useAudioPause
