const getClassTdMO = ({ ArrMatch, ArrHDP, ArrOU, ArrOE, Arr1X2, ArrML, ArrGAH }) => {
  return {
    earlysettlement: ArrMatch.early_settlement_alert === 1 ? 'bg-lawngreen' : '',
    scoreBox:
      (ArrHDP?.st_auto_odds ?? true) > 0 &&
      (ArrOU?.st_auto_odds ?? true) > 0 &&
      (ArrOE?.st_auto_odds ?? true) > 0 &&
      (Arr1X2?.st_auto_odds ?? true) > 0
        ? 'bg-lime'
        : 'bg-orange',
    hdp: baseClass(ArrHDP),
    ou: baseClass(ArrOU),
    oe: baseClass(ArrOE),
    ml: baseClass(ArrML),
    gah: baseClass(ArrGAH),
    '1x2': Arr1X2
      ? {
          stopen: Arr1X2?.st_open === 'N' ? 'bg-red' : '',
          get stock() {
            const { stock, alert_stock } = Arr1X2
            return stock * 1 !== 0 && alert_stock === 1 ? 'bg-light-yellow' : ''
          },
        }
      : {},
  }
}

export const baseClass = source => {
  if (!source) return {}
  const { st_4point_diff, st_open } = source
  return {
    st4pointldiff: st_4point_diff === 'Y' ? 'bg-pink' : '',
    stopen: st_open === 'N' ? 'bg-red' : '',
    get handicap() {
      const { last_change_handicap, alert_trader_handicap, trader_group_hdc_display } = source
      let alertTraderClass = ''
      if (last_change_handicap === 1 && alert_trader_handicap === 1)
        alertTraderClass = getTraderClass(trader_group_hdc_display, 'handicap')
      return `${alertTraderClass} ${this.st4pointldiff} font-weight-bold`
    },
    get odds() {
      const { last_change_odds, alert_trader_odds, trader_group_odds } = source
      let alertTraderClass = ''
      if (last_change_odds === 1 && alert_trader_odds === 1)
        alertTraderClass = getTraderClass(trader_group_odds, 'odds')
      return `${alertTraderClass} ${this.st4pointldiff} font-weight-bold`
    },
    get ha() {
      const { last_change_ha, alert_trader_ha, trader_group_ha } = source
      let alertTraderClass = 'background-odds'
      if (last_change_ha === 1 && alert_trader_ha === 1)
        alertTraderClass = getTraderClass(trader_group_ha, 'ha')
      return `${alertTraderClass} ${this.st4pointldiff} font-weight-bold`
    },
    get ldiff() {
      const { last_change_ldiff, alert_trader_ldiff, trader_group_odds_step_mapping } = source
      let alertTraderClass = ''
      if (last_change_ldiff === 1 && alert_trader_ldiff === 1)
        alertTraderClass = getTraderClass(trader_group_odds_step_mapping, 'ldiff')
      return `${alertTraderClass} ${this.st4pointldiff} font-weight-bold`
    },
  }
}
const getTraderClass = (traderGroup, lastChg) => {
  if (lastChg === 'ha') {
    return 'bg-yellow'
  }
  switch (traderGroup) {
    case 'TraderGroupIsBoss':
      return 'alert_trader_boss'
    case 'TraderGroupIsSeniorSupervisor':
    case 'TraderGroupIsSupervisor':
      return 'alert_trader_spv'
    case 'TraderGroupIsTrader':
      return 'alert_trader'
    case 'TraderGroupIsLeeching':
      return 'alert_trader_leeching'
    default:
      return ''
  }
}

export const getShortPause = reason_pause => {
  reason_pause = reason_pause.toLowerCase()
  return {
    maxbet: 'maxbet',
    'lap short': 'lap',
    'lap long': 'lap',
    'vip 03': 'vip3',
  }[reason_pause]
}

export const getTraderClassMOTest = (traderGroup, lastChg) => {
  return getTraderClass(traderGroup, lastChg)
}

export default getClassTdMO
