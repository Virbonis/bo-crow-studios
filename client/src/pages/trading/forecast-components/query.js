import { useQuery } from 'react-query'
import CountWL_GT, {
  RoundMarginWL,
  RoundWL,
  GetScoreIndex,
  GetGameTypeForecastLine,
  ListGTForecastScoreHomeAwayFT,
  ListGTForecastScoreHomeAwayFH,
  ListGTForecastScoreHomeAwayGAH,
  ListGTForecastScoreHomeAwaySW,
  ListGTForecastScoreHomeAwaySG,
  ListGTForecastScoreHomeAwayQ1,
  ListGTForecastScoreHomeAwayQ2,
  ListGTForecastScoreHomeAwayQ3,
  ListGTForecastScoreHomeAwayQ4,
  ListGTForecastScoreTotalScoreFT,
  ListGTForecastScoreTotalScoreFH,
  ListGTForecastScoreTotalScoreGOU,
  ListGTForecastScoreTotalScoreSG,
  ListGTForecastScoreTotalScoreQ1,
  ListGTForecastScoreTotalScoreQ2,
  ListGTForecastScoreTotalScoreQ3,
  ListGTForecastScoreTotalScoreQ4,
  getScore,
} from 'helper/forecast'
import apiClient from 'services/axios'
import { getTraderDBRBPick } from 'helper'

export const QueryForecast = ({ hdp_home, hdp_away, ou_home, ou_away, ...params }) => {
  return useQuery(
    ['forecast', params],
    () =>
      apiClient.get('/forecast', { params }).then(response => {
        return response?.data?.data
      }),
    {
      enabled: !!params?.popup_id, // The query will not execute until the popup_id exists
      refetchOnMount: false,
      // refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: params.interval * 1000 || false,
      refetchIntervalInBackground: true,
      cacheTime: 1, // disable cache
    },
  )
}

export const QueryForecastArchive = ({ hdp_home, hdp_away, ou_home, ou_away, ...params }) => {
  return useQuery(
    ['forecast-post', params],
    () =>
      apiClient.get('/forecast-post', { params }).then(response => {
        return response?.data?.data
      }),
    {
      enabled: !!params?.popup_id, // The query will not execute until the popup_id exists
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: params.interval * 1000 || false,
      refetchIntervalInBackground: true,
      cacheTime: 1, // disable cache
    },
  )
}

export const QueryForecastSingle = ({
  hdp_home,
  hdp_away,
  ou_home,
  ou_away,
  columnHDP,
  columnOU,
  fs_home,
  fs_away,
  ...params
}) => {
  return useQuery(
    ['forecast-single', params],
    () =>
      apiClient.get('/forecast-single', { params }).then(response => {
        return response?.data?.data
      }),
    {
      enabled: params.page === 'MOQuick' ? !!params?.popup_id : true, // The query will not execute until the popup_id exists
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: params.interval * 1000 || false,
      refetchIntervalInBackground: true,
      cacheTime: 1, // disable cache
    },
  )
}

export const transmuteData = (data = [], columnHDP, columnOU) => {
  let prevMatchID = 0
  let prevCodeRound = ''
  // arr utk hitung CountWL_GT
  let arrHDP = []
  let arrOU = []
  // arr utk hasil CountWL_GT
  let arrScoreHDP
  let arrScoreOU
  // utk hitung betAmount
  let totalBAHDP = 0
  let totalBAOU = 0

  return data.reduce((acc, curr, index) => {
    const currCodeRound = GetGameTypeForecastLine(curr.game_type)
    if (!currCodeRound) return acc // skip if game_type is not valid

    if (curr.match_id !== prevMatchID || currCodeRound !== prevCodeRound) {
      totalBAHDP = 0
      totalBAOU = 0

      // bet profit value
      arrScoreHDP = []
      arrScoreOU = []

      const currScore = getScore(curr)
      const currScoreHome = currScore[0]
      const currScoreAway = currScore[1]
      arrHDP = [
        ...columnHDP,
        `${currScoreHome}-${currScoreAway}`,
        `${currScoreHome + 1}-${currScoreAway}`,
        `${currScoreHome}-${currScoreAway + 1}`,
      ]
      arrOU = [
        ...columnOU,
        `${currScoreHome + currScoreAway}`,
        `${currScoreHome + currScoreAway + 1}`,
      ]
    }

    // region
    if (
      ListGTForecastScoreHomeAwayFT.includes(curr.game_type) ||
      ListGTForecastScoreHomeAwayFH.includes(curr.game_type) ||
      ListGTForecastScoreHomeAwayGAH.includes(curr.game_type) ||
      ListGTForecastScoreHomeAwaySW.includes(curr.game_type) ||
      ListGTForecastScoreHomeAwaySG.includes(curr.game_type) ||
      ListGTForecastScoreHomeAwayQ1.includes(curr.game_type) ||
      ListGTForecastScoreHomeAwayQ2.includes(curr.game_type) ||
      ListGTForecastScoreHomeAwayQ3.includes(curr.game_type) ||
      ListGTForecastScoreHomeAwayQ4.includes(curr.game_type)
    ) {
      totalBAHDP += curr.t_home + curr.t_away + curr.t_draw
      arrScoreHDP = CountWL_GT(curr, arrHDP, arrScoreHDP, false)
    } else if (
      ListGTForecastScoreTotalScoreFT.includes(curr.game_type) ||
      ListGTForecastScoreTotalScoreFH.includes(curr.game_type) ||
      ListGTForecastScoreTotalScoreGOU.includes(curr.game_type) ||
      ListGTForecastScoreTotalScoreSG.includes(curr.game_type) ||
      ListGTForecastScoreTotalScoreQ1.includes(curr.game_type) ||
      ListGTForecastScoreTotalScoreQ2.includes(curr.game_type) ||
      ListGTForecastScoreTotalScoreQ3.includes(curr.game_type) ||
      ListGTForecastScoreTotalScoreQ4.includes(curr.game_type)
    ) {
      totalBAOU += curr.t_home + curr.t_away + curr.t_draw
      arrScoreOU = CountWL_GT(curr, arrOU, arrScoreOU, false)
    }
    // #endregion

    const nextMatchID = data[index + 1]?.match_id
    const nextGameType = data[index + 1]?.game_type
    if (curr.match_id !== nextMatchID || currCodeRound !== GetGameTypeForecastLine(nextGameType)) {
      const lastLength = acc.length
      // Region Full Time
      const [dataRB, dataDB, dataPick] = getTraderDBRBPick(curr.trader)
      const defaultValue = {
        ...curr,
        rb_result: dataRB.find(x => x.substring(2, 4).toUpperCase() === currCodeRound),
        db_result: dataDB.find(x => x.substring(2, 4).toUpperCase() === currCodeRound),
        pick_result: dataPick.join('\n'),
      }
      let total = 0
      let totalHome = 0
      let totalAway = 0
      if (arrScoreHDP.length > 0) {
        total += arrScoreHDP[arrScoreHDP.length - 3] || 0
        totalHome += arrScoreHDP[arrScoreHDP.length - 2] || 0
        totalAway += arrScoreHDP[arrScoreHDP.length - 1] || 0
      }
      if (arrScoreOU.length > 0) {
        total += arrScoreOU[arrScoreOU.length - 2] || 0
        totalHome += arrScoreOU[arrScoreOU.length - 1] || 0
        totalAway += arrScoreOU[arrScoreOU.length - 1] || 0
      }

      arrScoreHDP = arrScoreHDP.slice(0, columnHDP.length)
      arrScoreOU = arrScoreOU.slice(0, columnOU.length + 1)

      const [arrScoreHDPResult, arrBetAmtHDPResult] = RoundWL(arrScoreHDP, totalBAHDP, [])
      const [arrScoreOUResult, arrBetAmtOUResult] = RoundWL(arrScoreOU, totalBAOU, [])

      const marginCenter = RoundMarginWL(total, totalBAHDP, totalBAOU)
      const marginHome = RoundMarginWL(totalHome, totalBAHDP, totalBAOU)
      const marginAway = RoundMarginWL(totalAway, totalBAHDP, totalBAOU)

      const [scorePosisiHDP, scorePosisiOU] = GetScoreIndex(curr, columnHDP, columnOU)
      acc.push({
        ...defaultValue,
        GT: currCodeRound,
        arrScoreHDP: arrScoreHDPResult,
        arrBetAmtHDP: arrBetAmtHDPResult,
        arrScoreOU: arrScoreOUResult,
        arrBetAmtOU: arrBetAmtOUResult,
        total,
        margin_home: marginHome,
        margin_center: marginCenter,
        margin_away: marginAway,
        score_posisi_hdp: scorePosisiHDP,
        score_posisi_ou: scorePosisiOU,
      })
      if (lastLength === acc.length) acc.push([])
    }
    prevMatchID = curr.match_id
    prevCodeRound = currCodeRound
    return acc
  }, [])
}

export default QueryForecast
