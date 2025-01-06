package router

import (
	"encoding/json"
	"fmt"
	"net/http"

	// TODO:
	_ "image/png"

	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/gorilla/mux"
	"github.com/gorilla/schema"
	log "github.com/sirupsen/logrus"
)

type httpResponse struct {
	Status int32       `json:"status"`
	Data   interface{} `json:"data"`
}

const (
	statusFailed  int32 = 1
	statusSuccess int32 = 0
)

var Base *mux.Router
var decoder *schema.Decoder

func InitRouter(path string, r *mux.Router) {
	log.Infof("Configuring API handler: %s", path)

	Base = r.PathPrefix(path).Subrouter()
	decoder = schema.NewDecoder()
	decoder.IgnoreUnknownKeys(true)

	RegisterAPIAuth()
	// Admin
	RegisterAPIAudit()
	RegisterAPIApplication()
	RegisterAPIMenu()
	RegisterAPIUser()
	RegisterAPIPermission()
	RegisterAPIRole()
	RegisterAPIUserLoginSession()
	RegisterAPIForceLogoutPlayerSession()
	RegisterAPIOperatorList()
	RegisterAPIOperatorDetail()
	RegisterAPIClearRedis()
	// Master
	RegisterAPIProfile()
	RegisterAPIProfile1x2()
	RegisterAPISport()
	RegisterAPILeague()
	RegisterAPILeagueGroup()
	RegisterAPILeagueHidden()
	RegisterAPILeagueSequence()
	RegisterAPICurrency()
	RegisterAPICashCategory()
	RegisterAPICashLimitProfile()
	RegisterAPIBranch()
	RegisterAPITeam()
	RegisterAPIRegion()
	RegisterAPIFlag()
	RegisterAPILeagueDuplicateMatch()
	// Customer
	RegisterAPICustomer()
	RegisterAPICountryRestriction()
	RegisterAPIShareholderBuyback()
	RegisterAPICustomerBuyback()
	// Match
	RegisterAPIMatch()
	RegisterAPIMatchList()
	RegisterAPIScoringMatch()
	RegisterAPICancelMatch()
	RegisterAPIProcUnprocMatch()
	RegisterAPIMatchProfile()
	RegisterAPIMatchStatistic()
	RegisterAPIMatchLiveStream()
	RegisterAPIListAutoOdds()
	RegisterAPIPopularPicks()
	RegisterAPIStandings()
	RegisterAPIKnockouts()
	RegisterAPIMappingToLottery()
	// Outright
	RegisterAPIOutright()
	RegisterAPIScorintOutright()
	RegisterAPICancelOutright()
	RegisterAPIProcUnprocOutright()
	// Report
	RegisterAPICashFlowTracker()
	RegisterAPILedger()
	RegisterAPIBreakdownWinloss()
	RegisterAPIMemberWinloss()
	RegisterAPICompanyWinloss()
	RegisterAPIWinlossForCash()
	RegisterAPIMemberLogin()
	RegisterAPIMemberDuplicateIP()
	RegisterAPITraderPerformance()
	RegisterAPITotalBetAccount()
	RegisterAPICustomerVIP()
	RegisterAPIReportLastBet()
	RegisterAPIOddsLog()
	RegisterAPIOddsLog1x2()
	RegisterAPIReportCancelBetList()
	RegisterAPIExport()
	RegisterAPIFavUnderdogPercentage()
	RegisterAPIFundTransfer()
	RegisterAPIMemberPendingFunds()
	RegisterAPINegativeBalance()
	RegisterAPISettledMatchCount()
	RegisterAPISBPlatformSummary()
	RegisterAPILuckyNumber()
	// Trading
	RegisterAPITradingFloor()
	RegisterAPITradingDeadball()
	RegisterAPITradingDeadballSpecial()
	RegisterAPITradingRunningBall()
	RegisterAPIMixParlay()
	RegisterAPIMO()
	RegisterAPIMOMore()
	RegisterAPIRequestMoreOGT()
	RegisterAPIBetList()
	RegisterAPIAcceptReject()
	RegisterAPIUserOnline()
	RegisterAPITradingInfo()
	RegisterAPIBetEnquiry()
	RegisterAPIBetListing()
	RegisterAPIVoidTicket()
	RegisterAPIOnlineList()
	RegisterAPILeechingAssignment()
	RegisterAPIInstantBet()
	RegisterAPIForecast()
	RegisterAPIMOBetListSummary()
	RegisterAPIRequestMoreOGT()
	RegisterAPIEditSubMatchSetting()
	RegisterAPIEditSubMatchProfile()
	RegisterAPIMatchAssignment()
	// Tools
	RegisterAPISportsbookSetting()
	RegisterAPINewsTicker()
	RegisterAPIResetEngine()
	RegisterAPIMappingLeague()
	RegisterAPIMappingTeam()
	RegisterAPIMappingRBall()
	RegisterAPIMappingBG()
	RegisterAPIMappingBB()
	RegisterAPIMappingBetRadar()
	RegisterAPIMappingGLiveStream()
	RegisterAPILeechAssign()
	RegisterAPIAcceptRejectedTicket()
	RegisterAPIBreakdownPatching()
	RegisterAPIBBZ()
	RegisterAPIIM()
	RegisterAPISIS()
	// Seamless
	RegisterAPIOperatorSeamless()
	RegisterAPIOperatorMaintenance()
	RegisterAPIOperatorSetting()
	RegisterAPIFailedPayout()
	RegisterAPICancelGame()
	RegisterAPIPayoutInfo()
	RegisterAPIBetRequestInfo()
	RegisterAPIPayoutTracker()
	// Other
	RegisterAPIGeneral()
	RegisterAPICompetition()
	RegisterAPIProvider()
	RegisterAPICountry()
	RegisterAPISpecialCode()
	RegisterAPIUserTeam()
	RegisterAPIProduct()
	RegisterAPIPlatform()
	RegisterAPIVIPCode()
	// BTI
	RegisterAPIBTIAutoAddMatch()
	RegisterAPIBTIBetInfo()
	RegisterAPIBTIPayoutTracker()
	RegisterAPIBTIProcessBreakdownReport()
	// Default page
	http.Handle("/", r)

	// Allow API endpoint access to authenticated user only
	Base.Use(middleware.LoggingMiddleware)
	Base.Use(middleware.AuthenticationAPIMiddleware)
}

func writeJSON(w http.ResponseWriter, status int32, data interface{}) {
	resp := httpResponse{
		Status: status,
		Data:   data,
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(resp)
}

func httpError(w http.ResponseWriter, code int, format string, args ...interface{}) {
	text := fmt.Sprintf(format, args...)
	w.WriteHeader(code)
	fmt.Fprint(w, text)
}
