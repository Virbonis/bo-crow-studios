import { Space } from 'antd'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { amount } from '../custom/Amount'

// const profileExcludePage = ['ProfileMaster']
// const profileExcludePage = ['ProfileMaster']

const useSelectOptions = () => {
  const profileSelect = useSelector(state => state.profile.select)
  const profile1x2Select = useSelector(state => state.profile1x2.select)
  const profile1x2SelectHDP = useSelector(state => state.profile1x2.selectHDP)
  const sportSelect = useSelector(state => state.sport.select)
  const competitionSelect = useSelector(state => state.competition.select)
  const branchSelect = useSelector(state => state.branch.select)
  const userTeamSelect = useSelector(state => state.userTeam.select)
  const currencySelect = useSelector(state => state.currency.select)
  const companySelect = useSelector(state => state.company.select)
  const leagueSelectInMatchProfile = useSelector(state => state.league.select_in_match_profile)
  const leagueSelectInMappingLottery = useSelector(state => state.league.select_in_mapping_lottery)
  const leagueSelectInMatchList = useSelector(state => state.league.select_in_matchlist)
  const vipCodeSelect = useSelector(state => state.vipCode.select)
  const productSelect = useSelector(state => state.product.select)
  const platformSelect = useSelector(state => state.platform.select)
  const matchSelectInInstantBet = useSelector(state => state.match.select_in_instantbet)
  const leagueSelectInInstantBet = useSelector(state => state.league.select_in_instantbet)
  const customerBuybackSelect = useSelector(state => state.customerBuyback.select)
  const regionSelect = useSelector(state => state.region.select)
  const countrySelect = useSelector(state => state.country.select)
  const newsTickerSelect = useSelector(state => state.newsTicker.select)
  const betListingLeagueSelect = useSelector(state => state.betListing.league_select)
  const betListingMatchSelect = useSelector(state => state.betListing.match_select)
  const flagSelect = useSelector(state => state.flag.select)

  const leagueBetListingOptions = betListingLeagueSelect.map(data => ({
    value: data.league_id,
    label: data.league_name,
  }))
  const matchBetListingOptions = betListingMatchSelect.map(data => ({
    value: data.match_id,
    label: data.team,
  }))

  const countryOptions = countrySelect.map(e => ({
    value: e.iso_country_code,
    label: e.country_name,
  }))

  const profileOptions = useMemo(
    () =>
      profileSelect.map(data => ({
        value: data.profile_id,
        label: data.profile_id,
      })),
    [profileSelect],
  )

  const profile1x2Options = useMemo(
    () =>
      profile1x2Select.map(e => ({
        value: e,
        label: e,
      })),

    [profile1x2Select],
  )

  const sportOptions = useMemo(
    () =>
      sportSelect.map(e => ({
        value: e.sport_id,
        label: e.name,
      })),
    [sportSelect],
  )

  const competitionOptions = useMemo(
    () =>
      competitionSelect.map(e => ({
        value: e,
        label: e,
      })),
    [competitionSelect],
  )

  const matchInInstantBetOptions = matchSelectInInstantBet.map(data => ({
    value: data.match_id,
    label: data.match_name,
  }))

  const branchOptions = useMemo(
    () =>
      branchSelect.map(e => ({
        value: e.branch_id,
        label: e.branch_name,
      })),
    [branchSelect],
  )

  const platformOptions = platformSelect.map(data => ({
    value: data.platform_id,
    label: data.platform_name,
  }))

  const userTeamOptions = useMemo(
    () =>
      userTeamSelect.map(data => ({
        value: data.user_team_id,
        label: data.user_team_name,
      })),

    [userTeamSelect],
  )

  const currencyOptions = useMemo(
    () =>
      currencySelect.map(data => ({
        value: data.currency_id,
        label: data.currency_id,
      })),
    [currencySelect],
  )

  const companyOptions = useMemo(
    () =>
      companySelect.map(e => ({
        value: e.company_id,
        label: e.company_name,
      })),
    [companySelect],
  )

  const leagueInMatchOptions = [{ value: 0, label: 'All League' }].concat(
    leagueSelectInMatchProfile.map(e => ({
      value: e.league_id,
      label: e.league_name,
    })),
  )

  const leagueInMappingLotteryOptions = [{ value: '', label: 'All League' }].concat(
    leagueSelectInMappingLottery.map(e => ({
      value: e.league_id,
      label: e.league_name,
    })),
  )

  const leagueInMatchListOptions = [{ value: '', label: 'All League' }].concat(
    leagueSelectInMatchList.map(e => ({
      value: e.league_id,
      label: e.league_name,
    })),
  )

  const vipCodeOptions = vipCodeSelect.map(e => ({
    value: e.vip_code,
    label: e.vip_desc,
  }))

  const profile1x2hdpOptions = profile1x2SelectHDP.map(data => ({
    value: data,
    label: amount(data),
  }))

  const productOptions = productSelect.map(data => ({
    value: data.product,
    label: data.product,
  }))

  const leagueInInstantBetOptions = leagueSelectInInstantBet.map(data => ({
    value: data.league_id,
    label: data.league_name,
  }))

  const customerUplineOptions = customerBuybackSelect.map(e => ({
    value: e.customer_id,
    label: e.username,
  }))

  const regionOptions = regionSelect.map(e => ({
    value: e.region_id,
    label: e.region_name,
  }))

  const websiteOptions = newsTickerSelect.map(data => ({
    value: data.website_id,
    label: data.website_name,
  }))

  const flagOptions = flagSelect.map(data => ({
    value: data.flag_id,
    label: data.flag_name,
    render: (
      <Space direction="vertical">
        <img src={data.flag_source} alt="No Img" width={100} height={50} />
        {data.flag_name}
      </Space>
    ),
  }))

  return {
    profileOptions,
    profile1x2Options,
    profile1x2hdpOptions,
    sportOptions,
    competitionOptions,
    branchOptions,
    userTeamOptions,
    currencyOptions,
    companyOptions,
    leagueInMatchOptions,
    leagueInMappingLotteryOptions,
    leagueInMatchListOptions,
    vipCodeOptions,
    productOptions,
    platformOptions,
    matchInInstantBetOptions,
    leagueInInstantBetOptions,
    customerUplineOptions,
    regionOptions,
    countryOptions,
    websiteOptions,
    leagueBetListingOptions,
    matchBetListingOptions,
    flagOptions,
  }
}

export default useSelectOptions
