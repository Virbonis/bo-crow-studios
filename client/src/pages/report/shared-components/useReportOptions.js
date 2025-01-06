import { useSelector } from 'react-redux'
import { getGameTypeOptions } from 'helper'

const useReportOptions = page => {
  const branch = useSelector(state => state.branch)
  const userTeam = useSelector(state => state.userTeam)
  const sport = useSelector(state => state.sport)
  const specialCode = useSelector(state => state.specialCode)
  const competition = useSelector(state => state.competition)
  const product = useSelector(state => state.product)
  const currency = useSelector(state => state.currency)
  const platform = useSelector(state => state.platform)
  const vipCode = useSelector(state => state.vipCode)

  const branchOptions = [{ value: '', label: 'Show All Branch' }].concat(
    branch.select.map(data => ({ value: data.branch_id, label: data.branch_name })),
  )
  const userTeamOptions = [{ value: 0, label: 'Show All User Team' }].concat(
    userTeam.select.map(data => ({ value: data.user_team_id, label: data.user_team_name })),
  )
  const sportOptions = [{ value: -99, label: 'Show All Sport' }].concat(
    sport.select.map(data => ({ value: data.sport_id, label: data.name })),
  )
  const specialCodeOptions = [{ value: '', label: 'Show All Special Match' }].concat(
    specialCode.select.map(data => ({ value: data.special_id, label: data.special_name })),
  )
  const competitionOptions = [{ value: '', label: 'Show All Competition' }].concat(
    competition.select.map(data => ({ value: data, label: data })),
  )
  const productOptions = [{ value: '', label: 'Show All Product' }].concat(
    product.select.map(data => ({ value: data.product, label: data.product })),
  )
  const currencyOptions = [{ value: '', label: 'Show All Currency' }].concat(
    currency.select.map(data => ({ value: data.currency_id, label: data.currency_id })),
  )
  const platformOptions = [{ value: '', label: 'Show All Platform' }].concat(
    platform.select.map(data => ({ value: data.platform_id, label: data.platform_name })),
  )

  const breakdownReportTypeOptions = [
    { value: 'Month', label: 'Breakdown by Month' },
    { value: 'Date', label: 'Breakdown by Date' },
    { value: 'Branch', label: 'Breakdown by Branch' },
    { value: 'Sport', label: 'Breakdown by Sport' },
    { value: 'League', label: 'Breakdown by League' },
    { value: 'Match', label: 'Breakdown by Match' },
    { value: 'GameType', label: 'Breakdown by Game Type' },
    { value: 'Currency', label: 'Breakdown by Currency' },
    { value: 'Special', label: 'Breakdown by Special' },
    { value: 'Platform', label: 'Breakdown by Platform' },
  ]
  const gameTypeOptions = [{ value: -99, label: 'Show All Game Type' }].concat(
    getGameTypeOptions(page),
  )
  const GTGroupOptions = [
    { value: '', label: 'Show All GT Group' },
    { value: 'N', label: 'Dead Ball' },
    { value: 'Y', label: 'Live' },
  ]
  const groupOptions = [
    { value: 0, label: 'Show All Group' },
    { value: 1, label: 'Major' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'Tournament' },
    { value: 90, label: 'Minor' },
  ]

  const drawOptions = [
    { value: 0, label: 'Normal' },
    { value: 1, label: 'No Draws' },
    { value: 2, label: 'No Draws For Turnover Only' },
  ]

  const vipOptions = [
    ...(page?.toLowerCase() === 'betenquiry' ? [{ value: 0, label: 'Normal' }] : []),
    { value: -99, label: 'Show All VIP Customer' },
    ...(page?.toLowerCase() === 'memberwinloss'
      ? [
          { value: -98, label: 'New Member' },
          { value: -1, label: 'Show All VIP' },
        ]
      : []),
  ].concat(vipCode.select.map(data => ({ value: data.vip_code, label: data.vip_desc })))

  const customerTypeOptions = [
    { value: 'COMBI', label: 'Combine' },
    { value: '', label: 'All Customer Type' },
    { value: 'C', label: 'Credit and Kiosk' },
    { value: 'H', label: 'Cash' },
    { value: 'B', label: 'Buyback' },
  ]

  return {
    breakdownReportTypeOptions,
    branchOptions,
    userTeamOptions,
    gameTypeOptions,
    sportOptions,
    specialCodeOptions,
    competitionOptions,
    productOptions,
    drawOptions,
    GTGroupOptions,
    currencyOptions,
    platformOptions,
    groupOptions,
    vipOptions,
    customerTypeOptions,
    getBreakdownReportTypeDescription: report_type => {
      if (report_type.includes('UserTeam')) return 'Breakdown by User Team'

      return breakdownReportTypeOptions
        .concat([
          { value: 'SMA', label: 'Ledger' },
          { value: 'AvgSMA', label: 'Ledger Average' },
          { value: 'NewShareholder', label: 'Ledger New' },
        ]) // ledger page
        .find(data => data.value === report_type)?.label
    },
    getBranchDescription: branch_id => branchOptions.find(data => data.value === branch_id)?.label,
    getUserTeamDescription: user_team_id =>
      userTeamOptions.find(data => data.value === user_team_id)?.label,
    getGameTypeDescription: game_type =>
      gameTypeOptions
        .concat([{ value: -98, label: '- Forecast -' }])
        .find(data => data.value === game_type)?.label,
    getSportDescription: sport_id =>
      sportOptions
        .concat([
          { value: -1, label: 'Mix Parlay' },
          { value: -11, label: 'Outright' },
        ])
        .find(data => data.value === sport_id)?.label,
    getSpecialCodeDescription: special_id =>
      specialCodeOptions.find(data => data.value === special_id)?.label,
    getCompetitionDescription: c => competitionOptions.find(data => data.value === c)?.label,
    getProductDescription: p => productOptions.find(data => data.value === p)?.label,
    getDrawDescription: draw => drawOptions.find(data => data.value === draw)?.label,
    getGTGroupDescription: gt_group => GTGroupOptions.find(data => data.value === gt_group)?.label,
    getCurrencyDescription: currency_id =>
      currencyOptions.find(data => data.value === currency_id)?.label,
    getPlatformDescription: platform_id =>
      platformOptions.find(data => data.value === platform_id)?.label,
    getGroupDescription: group => groupOptions.find(data => data.value === group)?.label,
    getVIPDescription: vip => vipOptions.find(data => data.value === vip)?.label,
    getCustomerTypeDescription: customer_type =>
      customerTypeOptions.find(data => data.value === customer_type)?.label,
  }
}

export default useReportOptions
