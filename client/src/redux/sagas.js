import { all } from 'redux-saga/effects'
import authuser from './auth/user/sagas'
import authsettings from './auth/setting/sagas'
// admin
import audit from './admin/audit/sagas'
import application from './admin/application/sagas'
import menu from './admin/menu/sagas'
import user from './admin/user/sagas'
import permission from './admin/permission/sagas'
import role from './admin/role/sagas'
import userLoginSession from './user-login-session/sagas'
import forceLogoutPlayerSession from './force-logout-player-session/sagas'
import operatorList from './operator-list/sagas'
import operatorDetail from './operator-detail/sagas'
import clearRedis from './admin/clear-redis/sagas'
// master
import profile from './profile/sagas'
import profile1x2 from './profile-1x2/sagas'
import sport from './sport/sagas'
import league from './league/sagas'
import leagueGroup from './league-group/sagas'
import leagueHidden from './league-hidden/sagas'
import leagueSequence from './league-sequence/sagas'
import currency from './currency/sagas'
import cashCategory from './cash-category/sagas'
import cashLimitProfile from './cash-limit-profile/sagas'
import branch from './branch/sagas'
import team from './team/sagas'
import region from './region/sagas'
import flag from './flag/sagas'
import leagueDuplicateMatch from './league-duplicate-match/sagas'
// customer
import customerList from './customer-list/sagas'
import countryRestriction from './country-restriction/sagas'
import customerBuyback from './customer-buyback/sagas'
import shareholderBuyback from './shareholder-buyback/sagas'
// match
import autoAddMatch from './auto-add-match/sagas'
import match from './match/sagas'
import matchList from './match-list/sagas'
import scoringMatch from './scoring-match/sagas'
import cancelMatch from './cancel-match/sagas'
import processMatch from './process-match/sagas'
import unprocessMatch from './unprocess-match/sagas'
import matchProfile from './match-profile/sagas'
import matchStatistic from './match-statistic/sagas'
import listAutoOdds from './list-auto-oods/sagas'
import matchLiveStream from './match-live-stream/sagas'
import popularPick from './popular-pick/sagas'
import standings from './standings/sagas'
import knockouts from './knockouts/sagas'
import mappingLottery from './mapping-lottery/sagas'
// bti
import BTIautoAddMatch from './bti-auto-add-match/sagas'
import BTIBetInfo from './bti-bet-info/sagas'
import BTIpayoutTracker from './bti-payout-tracker/sagas'
import BTIProcessBreakdownReport from './bti-process-breakdown-report/sagas'
// outright
import outright from './outright/sagas'
import scoringOutright from './scoring-outright/sagas'
import cancelOutright from './cancel-outright/sagas'
import processOutright from './process-outright/sagas'
import unprocessOutright from './unprocess-outright/sagas'
// report
import cashFlowTracker from './cash-flow-tracker/sagas'
import ledger from './ledger/sagas'
import breakdownReport from './breakdown-report/sagas'
import breakdownReportUT from './breakdown-report-ut/sagas'
import memberWinloss from './member-winloss/sagas'
import companyWinloss from './company-winloss/sagas'
import companyWinlossForeign from './company-winloss-foreign/sagas'
import winlossForCash from './winloss-for-cash/sagas'
import memberLogin from './member-login/sagas'
import memberDuplicateIP from './member-duplicate-ip/sagas'
import traderPerformance from './trader-performance/sagas'
import totalBetAccount from './total-bet-account/sagas'
import customerVIP from './customer-vip/sagas'
import lastBetReport from './last-bet-report/sagas'
import oddsLog from './odds-log/sagas'
import oddsLog1x2 from './odds-log-1x2/sagas'
import cancelledBetList from './cancelled-bet-list/sagas'
import exportReport from './export/sagas'
import favUnderdogPercentage from './fav-underdog-percentage/sagas'
import fundTransfer from './fund-transfer/sagas'
import memberPendingFunds from './member-pending-funds/sagas'
import negativeBalance from './negative-balance/sagas'
import settledMatchCount from './settled-match-count/sagas'
import sbPlatformSummary from './sb-platform-summary/sagas'
import luckyNumber from './lucky-number/sagas'
// trading
import mo5 from './mo5/sagas'
import moEdit from './mo-match-edit/sagas'
import autoAddSubMatch from './auto-add-sub-match/sagas'
import autoAddSubMatchMore from './auto-add-sub-match-more/sagas'
import matchRecord from './match-record/sagas'
import betList from './bet-list/sagas'
import acceptReject from './accept-reject/sagas'
import moOtherGameType from './mo-other-game-type/sagas'
import moScoring from './mo-scoring/sagas'
import moScoringDetail from './mo-scoring-detail/sagas'
import tableMixParlay from './mix-parlay/sagas'
import earlySettlement from './early-settlement/sagas'
import earlySettlementBetList from './early-settlement-bet-list/sagas'
import matchTime from './match-time/sagas'
import basketTimer from './basket-timer/sagas'
import userOnline from './user-online/sagas'
import tradingInfo from './trading-info/sagas'
import betEnquiry from './bet-enquiry/sagas'
import betListing from './bet-listing/sagas'
import voidTicket from './void-ticket/sagas'
import onlineList from './online-list/sagas'
import myMatches from './my-matches/sagas'
import userTeamMatches from './user-team-matches/sagas'
import leechingAssignment from './leeching-assignment/sagas'
import moBetListSummary from './mo-bet-list-summary/sagas'
import tradingFloor from './trading-floor/sagas'
import instantBet from './instant-bet/sagas'
import editSubMatchSetting from './edit-sub-match-setting/sagas'
import editSubMatchProfile from './edit-sub-match-profile/sagas'
import matchAssignment from './match-assignment/sagas'
// tools
import sportsbookSetting from './sportsbook-setting/sagas'
import newsTicker from './news-ticker/sagas'
import resetEngine from './reset-engine/sagas'
import mappingLeague from './mapping-league/sagas'
import mappingTeam from './mapping-team/sagas'
import mappingRBallLeague from './mapping-rball-league/sagas'
import mappingRBallTeam from './mapping-rball-team/sagas'
import mappingRBallMatch from './mapping-rball-match/sagas'
import mappingBGMatch from './mapping-bg-match/sagas'
import mappingBB from './mapping-bb/sagas'
import mappingBetRadar from './mapping-bet-radar/sagas'
import mappingGLiveStream from './mapping-glive-stream/sagas'
import leechAssign from './leech-assign/sagas'
import acceptRejectedTicket from './accept-rejected-ticket/sagas'
import breakdownPatching from './breakdown-patching/sagas'
import bbz from './bbz/sagas'
import im from './im/sagas'
import sis from './sis/sagas'
// seamless
import failedPayout from './failed-payout/sagas'
import listCancelGame from './list-cancel-game/sagas'
import listPayoutInfo from './list-payout-info/sagas'
import betRequestInfo from './bet-request-info/sagas'
import listPayoutTracker from './list-payout-tracker/sagas'
import operatorSeamless from './operator-seamless/sagas'
import operatorSetting from './operator-setting/sagas'
import operatorMaintenance from './operator-maintenance/sagas'
// other
import competition from './competition/sagas'
import provider from './provider/sagas'
import country from './country/sagas'
import specialCode from './special-code/sagas'
import company from './company/sagas'
import userTeam from './user-team/sagas'
import product from './product/sagas'
import platform from './platform/sagas'
import vipCode from './vip-code/sagas'
import oddsSpread from './odds-spread/sagas'

export default function* rootSaga() {
  yield all([
    authuser(),
    authsettings(),
    // admin
    audit(),
    application(),
    menu(),
    user(),
    permission(),
    role(),
    userLoginSession(),
    forceLogoutPlayerSession(),
    operatorList(),
    operatorDetail(),
    clearRedis(),
    // master
    profile(),
    profile1x2(),
    sport(),
    league(),
    leagueGroup(),
    leagueHidden(),
    leagueSequence(),
    currency(),
    cashCategory(),
    cashLimitProfile(),
    branch(),
    team(),
    region(),
    flag(),
    leagueDuplicateMatch(),
    // customer
    customerList(),
    countryRestriction(),
    customerBuyback(),
    shareholderBuyback(),
    // match
    autoAddMatch(),
    match(),
    matchList(),
    scoringMatch(),
    cancelMatch(),
    processMatch(),
    unprocessMatch(),
    matchProfile(),
    matchStatistic(),
    listAutoOdds(),
    matchLiveStream(),
    popularPick(),
    standings(),
    knockouts(),
    mappingLottery(),
    // bti
    BTIautoAddMatch(),
    BTIBetInfo(),
    BTIpayoutTracker(),
    BTIProcessBreakdownReport(),
    // outright
    outright(),
    scoringOutright(),
    cancelOutright(),
    processOutright(),
    unprocessOutright(),
    // report
    cashFlowTracker(),
    ledger(),
    breakdownReport(),
    breakdownReportUT(),
    memberWinloss(),
    companyWinloss(),
    companyWinlossForeign(),
    winlossForCash(),
    memberLogin(),
    memberDuplicateIP(),
    traderPerformance(),
    totalBetAccount(),
    customerVIP(),
    lastBetReport(),
    oddsLog(),
    oddsLog1x2(),
    cancelledBetList(),
    exportReport(),
    favUnderdogPercentage(),
    fundTransfer(),
    memberPendingFunds(),
    negativeBalance(),
    settledMatchCount(),
    sbPlatformSummary(),
    luckyNumber(),
    // trading
    mo5(),
    moEdit(),
    autoAddSubMatch(),
    autoAddSubMatchMore(),
    matchRecord(),
    betList(),
    acceptReject(),
    moOtherGameType(),
    moScoring(),
    moScoringDetail(),
    tableMixParlay(),
    earlySettlement(),
    earlySettlementBetList(),
    matchTime(),
    basketTimer(),
    userOnline(),
    tradingInfo(),
    betEnquiry(),
    betListing(),
    voidTicket(),
    onlineList(),
    myMatches(),
    userTeamMatches(),
    leechingAssignment(),
    moBetListSummary(),
    tradingFloor(),
    instantBet(),
    editSubMatchSetting(),
    editSubMatchProfile(),
    matchAssignment(),
    // tools
    sportsbookSetting(),
    newsTicker(),
    resetEngine(),
    mappingLeague(),
    mappingTeam(),
    mappingRBallLeague(),
    mappingRBallTeam(),
    mappingRBallMatch(),
    mappingBGMatch(),
    mappingBB(),
    mappingBetRadar(),
    mappingGLiveStream(),
    leechAssign(),
    acceptRejectedTicket(),
    breakdownPatching(),
    bbz(),
    im(),
    sis(),
    // seamless
    failedPayout(),
    listCancelGame(),
    listPayoutInfo(),
    betRequestInfo(),
    listPayoutTracker(),
    operatorSeamless(),
    operatorSetting(),
    operatorMaintenance(),
    // other
    competition(),
    provider(),
    country(),
    specialCode(),
    company(),
    userTeam(),
    product(),
    platform(),
    vipCode(),
    oddsSpread(),
  ])
}
