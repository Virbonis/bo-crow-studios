export const getTraderClass = (
  traderGroup,
  traderGroupPause,
  alertTrader,
  pause_status,
  tag,
  lastChange,
) => {
  // normalize pause_status
  pause_status = ['0', 'N', 0].includes(pause_status) ? 0 : 1

  if (
    lastChange === 'odds'
    // &&
    // traderGroup !== 'TraderGroupIsTrader' &&
    // traderGroup !== 'TraderGroupIsLeeching'
  ) {
    switch (traderGroup) {
      case 'TraderGroupIsBoss':
        return 'Boss'
      case 'TraderGroupIsSeniorSupervisor':
      case 'TraderGroupIsSpv':
      case 'TraderGroupIsSupervisor':
        return 'SpvOdds'
      default:
        return ''
    }
  } else if (
    lastChange === 'pause'
    // &&
    // traderGroupPause !== 'TraderGroupIsTrader' &&
    // traderGroupPause !== ''
  ) {
    switch (traderGroupPause) {
      case 'TraderGroupIsBoss':
        return pause_status !== 0 ? 'Boss' : ''
      case 'TraderGroupIsSeniorSupervisor':
      case 'TraderGroupIsSpv':
      case 'TraderGroupIsSupervisor':
        return pause_status !== 0 ? 'SpvPause' : ''
      default:
        return ''
    }
  } else {
    let className = ''
    if (traderGroup === 'TraderGroupIsTrader') {
      if (alertTrader === 1) className = 'Trader3'
    } else if (traderGroup === 'TraderGroupIsLeeching') {
      if (alertTrader === 1) className = 'TraderLeeching'
    }

    switch (traderGroupPause) {
      case 'TraderGroupIsBoss':
        return `${className} ${pause_status !== 0 ? 'Boss' : ''}`
      case 'TraderGroupIsSeniorSupervisor':
      case 'TraderGroupIsSpv':
      case 'TraderGroupIsSupervisor':
        return `${className} ${pause_status !== 0 ? 'SpvPause' : ''}`
      case 'TraderGroupIsTrader':
        return `${className} ${pause_status !== 0 ? 'TraderPause' : ''}`
      default:
        return ''
    }
  }
}

export default getTraderClass
