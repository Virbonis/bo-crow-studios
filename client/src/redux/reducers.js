import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import authuser from './auth/user/reducers'
import authmenu from './auth/menu/reducers'
import authsettings from './auth/setting/reducers'
// admin
import audit from './admin/audit/reducers'
import application from './admin/application/reducers'
import menu from './admin/menu/reducers'
import user from './admin/user/reducers'
import permission from './admin/permission/reducers'
import role from './admin/role/reducers'
import userLoginSession from './user-login-session/reducers'
import operatorList from './operator-list/reducers'
import operatorDetail from './operator-detail/reducers'
import clearRedis from './admin/clear-redis/reducers'
// master
import profile from './profile/reducers'
import profile1x2 from './profile-1x2/reducers'
import sport from './sport/reducers'
import league from './league/reducers'
import leagueGroup from './league-group/reducers'
import leagueHidden from './league-hidden/reducers'
import leagueSequence from './league-sequence/reducers'
import currency from './currency/reducers'
import cashCategory from './cash-category/reducers'
import cashLimitProfile from './cash-limit-profile/reducers'
import branch from './branch/reducers'
import team from './team/reducers'
import region from './region/reducers'
import flag from './flag/reducers'
import leagueDuplicateMatch from './league-duplicate-match/reducers'
// customer
import customerList from './customer-list/reducers'
import countryRestriction from './country-restriction/reducers'
import customerBuyback from './customer-buyback/reducers'
import shareholderBuyback from './shareholder-buyback/reducers'
// match
import autoAddMatch from './auto-add-match/reducers'
import match from './match/reducers'
import matchList from './match-list/reducers'
import scoringMatch from './scoring-match/reducers'
import cancelMatch from './cancel-match/reducers'
import processMatch from './process-match/reducers'
import unprocessMatch from './unprocess-match/reducers'
import matchProfile from './match-profile/reducers'
import matchStatistic from './match-statistic/reducers'
import listAutoOdds from './list-auto-oods/reducers'
import matchLiveStream from './match-live-stream/reducers'
import popularPick from './popular-pick/reducers'
import standings from './standings/reducers'
import knockouts from './knockouts/reducers'
import mappingLottery from './mapping-lottery/reducers'
// bti
import BTIautoAddMatch from './bti-auto-add-match/reducers'
import BTIBetInfo from './bti-bet-info/reducers'
import BTIpayoutTracker from './bti-payout-tracker/reducers'
// outright
import outright from './outright/reducers'
import scoringOutright from './scoring-outright/reducers'
import cancelOutright from './cancel-outright/reducers'
import processOutright from './process-outright/reducers'
import unprocessOutright from './unprocess-outright/reducers'
// report
import cashFlowTracker from './cash-flow-tracker/reducers'
import ledger from './ledger/reducers'
import breakdownReport from './breakdown-report/reducers'
import breakdownReportUT from './breakdown-report-ut/reducers'
import memberWinloss from './member-winloss/reducers'
import companyWinloss from './company-winloss/reducers'
import companyWinlossForeign from './company-winloss-foreign/reducers'
import winlossForCash from './winloss-for-cash/reducers'
import memberLogin from './member-login/reducers'
import memberDuplicateIP from './member-duplicate-ip/reducers'
import traderPerformance from './trader-performance/reducers'
import totalBetAccount from './total-bet-account/reducers'
import customerVIP from './customer-vip/reducers'
import lastBetReport from './last-bet-report/reducers'
import oddsLog from './odds-log/reducers'
import oddsLog1x2 from './odds-log-1x2/reducers'
import cancelledBetList from './cancelled-bet-list/reducers'
import exportReport from './export/reducers'
import favUnderdogPercentage from './fav-underdog-percentage/reducers'
import fundTransfer from './fund-transfer/reducers'
import memberPendingFunds from './member-pending-funds/reducers'
import negativeBalance from './negative-balance/reducers'
import settledMatchCount from './settled-match-count/reducers'
import sbPlatformSummary from './sb-platform-summary/reducers'
import luckyNumber from './lucky-number/reducers'
// trading
import mo5 from './mo5/reducers'
import moEdit from './mo-match-edit/reducers'
import autoAddSubMatch from './auto-add-sub-match/reducers'
import autoAddSubMatchMore from './auto-add-sub-match-more/reducers'
import matchRecord from './match-record/reducers'
import betList from './bet-list/reducers'
import acceptReject from './accept-reject/reducers'
import moOtherGameType from './mo-other-game-type/reducers'
import moScoring from './mo-scoring/reducers'
import moScoringDetail from './mo-scoring-detail/reducers'
import tradingMixParlay from './mix-parlay/reducers'
import earlySettlement from './early-settlement/reducers'
import earlySettlementBetList from './early-settlement-bet-list/reducers'
import matchTime from './match-time/reducers'
import basketTimer from './basket-timer/reducers'
import userOnline from './user-online/reducers'
import tradingInfo from './trading-info/reducers'
import betEnquiry from './bet-enquiry/reducers'
import betListing from './bet-listing/reducers'
import voidTicket from './void-ticket/reducers'
import onlineList from './online-list/reducers'
import myMatches from './my-matches/reducers'
import userTeamMatches from './user-team-matches/reducers'
import leechingAssignment from './leeching-assignment/reducers'
import moBetListSummary from './mo-bet-list-summary/reducers'
import instantBet from './instant-bet/reducers'
import editSubMatchSetting from './edit-sub-match-setting/reducers'
import editSubMatchProfile from './edit-sub-match-profile/reducers'
import matchAssignment from './match-assignment/reducers'
// tools
import sportsbookSetting from './sportsbook-setting/reducers'
import newsTicker from './news-ticker/reducers'
import resetEngine from './reset-engine/reducers'
import mappingLeague from './mapping-league/reducers'
import mappingTeam from './mapping-team/reducers'
import mappingRBallLeague from './mapping-rball-league/reducers'
import mappingRBallTeam from './mapping-rball-team/reducers'
import mappingRBallMatch from './mapping-rball-match/reducers'
import mappingBGMatch from './mapping-bg-match/reducers'
import mappingBB from './mapping-bb/reducers'
import mappingBetRadar from './mapping-bet-radar/reducers'
import mappingGLiveStream from './mapping-glive-stream/reducers'
import leechAssign from './leech-assign/reducers'
import acceptRejectedTicket from './accept-rejected-ticket/reducers'
import breakdownPatching from './breakdown-patching/reducers'
import bbz from './bbz/reducers'
import im from './im/reducers'
import sis from './sis/reducers'
// seamless
import failedPayout from './failed-payout/reducers'
import listCancelGame from './list-cancel-game/reducers'
import listPayoutInfo from './list-payout-info/reducers'
import betRequestInfo from './bet-request-info/reducers'
import listPayoutTracker from './list-payout-tracker/reducers'
import operatorSeamless from './operator-seamless/reducers'
import operatorSetting from './operator-setting/reducers'
import operatorMaintenance from './operator-maintenance/reducers'
// other
import competition from './competition/reducers'
import provider from './provider/reducers'
import country from './country/reducers'
import specialCode from './special-code/reducers'
import company from './company/reducers'
import userTeam from './user-team/reducers'
import product from './product/reducers'
import platform from './platform/reducers'
import vipCode from './vip-code/reducers'
import oddsSpread from './odds-spread/reducers'

export default history =>
  combineReducers({
    router: connectRouter(history),
    auth: combineReducers({
      user: authuser,
      menu: authmenu,
      settings: authsettings,
    }),
    // admin
    audit,
    application,
    menu,
    user,
    permission,
    role,
    userLoginSession,
    operatorList,
    operatorDetail,
    clearRedis,
    // master
    profile,
    profile1x2,
    sport,
    league,
    leagueGroup,
    leagueHidden,
    leagueSequence,
    currency,
    cashCategory,
    cashLimitProfile,
    branch,
    team,
    region,
    flag,
    leagueDuplicateMatch,
    // customer
    customerList,
    countryRestriction,
    customerBuyback,
    shareholderBuyback,
    // match
    autoAddMatch,
    match,
    matchList,
    scoringMatch,
    cancelMatch,
    processMatch,
    unprocessMatch,
    matchProfile,
    matchStatistic,
    listAutoOdds,
    matchLiveStream,
    popularPick,
    standings,
    knockouts,
    mappingLottery,
    // bti
    BTIautoAddMatch,
    BTIBetInfo,
    BTIpayoutTracker,
    // outright
    outright,
    scoringOutright,
    cancelOutright,
    processOutright,
    unprocessOutright,
    // report
    cashFlowTracker,
    ledger,
    breakdownReport,
    breakdownReportUT,
    memberWinloss,
    companyWinloss,
    companyWinlossForeign,
    winlossForCash,
    memberLogin,
    memberDuplicateIP,
    traderPerformance,
    totalBetAccount,
    customerVIP,
    lastBetReport,
    oddsLog,
    oddsLog1x2,
    cancelledBetList,
    exportReport,
    favUnderdogPercentage,
    fundTransfer,
    memberPendingFunds,
    negativeBalance,
    settledMatchCount,
    sbPlatformSummary,
    luckyNumber,
    // trading
    mo5,
    moEdit,
    autoAddSubMatch,
    autoAddSubMatchMore,
    matchRecord,
    betList,
    acceptReject,
    moOtherGameType,
    moScoring,
    moScoringDetail,
    tradingMixParlay,
    earlySettlement,
    earlySettlementBetList,
    matchTime,
    basketTimer,
    userOnline,
    tradingInfo,
    betEnquiry,
    betListing,
    voidTicket,
    onlineList,
    myMatches,
    userTeamMatches,
    leechingAssignment,
    moBetListSummary,
    instantBet,
    editSubMatchSetting,
    editSubMatchProfile,
    matchAssignment,
    // tools
    sportsbookSetting,
    newsTicker,
    resetEngine,
    mappingLeague,
    mappingTeam,
    mappingRBallLeague,
    mappingRBallTeam,
    mappingRBallMatch,
    mappingBGMatch,
    mappingBB,
    mappingBetRadar,
    mappingGLiveStream,
    leechAssign,
    acceptRejectedTicket,
    breakdownPatching,
    bbz,
    im,
    sis,
    // seamless
    failedPayout,
    listCancelGame,
    listPayoutInfo,
    betRequestInfo,
    listPayoutTracker,
    operatorSeamless,
    operatorSetting,
    operatorMaintenance,
    // other
    competition,
    provider,
    country,
    specialCode,
    company,
    userTeam,
    product,
    platform,
    vipCode,
    oddsSpread,
  })
