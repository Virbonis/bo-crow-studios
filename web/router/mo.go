package router

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/helper/repository"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/shopspring/decimal"
)

func RegisterAPIMO() {
	Base.HandleFunc("/mo5", listMO5).Methods(http.MethodGet)
	Base.HandleFunc("/mo5/single", listMO5Single).Methods(http.MethodGet)
	Base.HandleFunc("/mo5/partai", listMO5Partai).Methods(http.MethodGet)

	Base.HandleFunc("/mo5euro", listMO5Euro).Methods(http.MethodGet)
	Base.HandleFunc("/mo5euro/single", listMO5EuroSingle).Methods(http.MethodGet)
	Base.HandleFunc("/mo5euro/partai", listMO5EuroPartai).Methods(http.MethodGet)

	Base.HandleFunc("/mo5cs", listMO5CS).Methods(http.MethodGet)
	Base.HandleFunc("/mo5cs/partai", listMO5CSPartai).Methods(http.MethodGet)

	Base.HandleFunc("/mo5oe", listMO5OE).Methods(http.MethodGet)
	Base.HandleFunc("/mo5oe/single", listMO5OESingle).Methods(http.MethodGet)
	Base.HandleFunc("/mo5oe/partai", listMO5OEPartai).Methods(http.MethodGet)

	Base.HandleFunc("/mo5os", listMO5OS).Methods(http.MethodGet)
	Base.HandleFunc("/mo5os/single", listMO5OSSingle).Methods(http.MethodGet)
	Base.HandleFunc("/mo5os/partai", listMO5OSPartai).Methods(http.MethodGet)

	Base.HandleFunc("/mo5tennis", listMO5Tennis).Methods(http.MethodGet)
	Base.HandleFunc("/mo5tennis/single", listMO5TennisSingle).Methods(http.MethodGet)
	Base.HandleFunc("/mo5tennis/partai", listMO5TennisPartai).Methods(http.MethodGet)

	Base.HandleFunc("/mo5/swapfavorite", swapFavorite).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/zeroodds", updateZeroOdds).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/movehandicap", moveHandicap).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/changehandicap", changeHandicap).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/swaphandicap", swapHandicap).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/changeodds", changeOdds).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/changeoddseuro", changeOddsEuro).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/changeoddscslive", changeOddsCSLive).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/changeodds1x2", changeOdds1X2).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/swapodds", swapOdds).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/moveodds", moveOdds).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/changelod", changeLOD).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/changespread", changeSpread).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/pauseresumechoice", pauseResumeChoice).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/pauseresumesubmatchcs", pauseResumeSubMatchCS).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/pauseresumesubmatch", pauseResumeSubMatch).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/pauseresumematch", pauseResumeMatch).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/pauseresumeall", pauseResumeAll).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/openclosechoice", openCloseChoice).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/openclosesubmatchcs", openCloseSubMatchCS).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/openclosesubmatch", openCloseSubMatch).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/openclosematch", openCloseMatch).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/changeautocalcodds1x2", changeAutoCalcOdds1X2).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/changeldiff", changeLDiff).Methods(http.MethodPatch)

	Base.HandleFunc("/mo5/goal", updateGoal).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/yellowcard", updateYellowCard).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/redcard", updateRedCard).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/penalty", updatePenalty).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/scorematch", updateScoreMatch).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/scoredetail", getScoreDetail).Methods(http.MethodGet)
	Base.HandleFunc("/mo5/scoredetail", updateScoreDetail).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/earlysettlement", listEarlySettlement).Methods(http.MethodGet)
	Base.HandleFunc("/mo5/earlysettlement", updateEarlySettlement).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/earlysettlement/betlist", listEarlySettlementBetList).Methods(http.MethodGet)

	Base.HandleFunc("/mo5/moeditahou", getMOEditAHOU).Methods(http.MethodGet)
	Base.HandleFunc("/mo5/moeditahou", updateMOEditAHOU).Methods(http.MethodPut)

	Base.HandleFunc("/mo5/profile", updateMOMatchProfile).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/sportsticker", updateSportsTicker).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/sportstickercs", updateSportsTickerCS).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/sportstickeroe", updateSportsTickerOE).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/matchparlay", updateMatchParlay).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/oddspointdiff", updateOddsPointDiff).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/parlay", updateParlay).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/rbdelay", updateRBDelay).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/linkodds", updateLinkOdds).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/timedmaxbet", updateMOTimedMaxBet).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/matchlivestatus", updateMatchLiveStatus).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/fixmarket", middleware.AuthorizationAPIMiddleware( // fix market belum di test
		updateFixMarket,
		helper.WHO_CAN_FIX_MARKET)).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/autoprocessbetbazar", updateAutoProcessBetBazar).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/autoprocessim", updateAutoProcessIM).Methods(http.MethodPut)

	Base.HandleFunc("/mo5/profilegametype", updateProfileGameType).Methods(http.MethodPut)

	Base.HandleFunc("/mo5/et", addMatchET).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/pen", addMatchPEN).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/penaltyshootout", addPenaltyShootOut).Methods(http.MethodPost)
	Base.HandleFunc("/mo5/submatch", addSubMatch).Methods(http.MethodPost)
	Base.HandleFunc("/mo5/submatch", deleteSubMatch).Methods(http.MethodDelete)

	Base.HandleFunc("/mo5/followleechsubmatch", followLeechSubMatch).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/leechassign", updateLeechAssign).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/autocloseautotimer", getAutoCloseAutoTimer).Methods(http.MethodGet)
	Base.HandleFunc("/mo5/autoclose", updateAutoClose).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/autotimer", updateAutoTimer).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/matchtime", updateMatchTime).Methods(http.MethodPut)

	Base.HandleFunc("/mo5/baskettimer", getBasketTimer).Methods(http.MethodGet)
	Base.HandleFunc("/mo5/baskettimer", updateBasketTimer).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/adjustbaskettimer", updateAdjustBasketTimer).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/finalscore", getFinalScore).Methods(http.MethodGet)
	Base.HandleFunc("/mo5/lock1x2", updMOChangeLock1X2).Methods(http.MethodPut)

	Base.HandleFunc("/mo5/ogt-pause-status", getOGTIsPauseStatus).Methods(http.MethodGet)

}

func listMO5(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // MO-Live
		MatchID       string `schema:"match_id"`
		DisplayAdmin  string `schema:"display_admin"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroupORI := userInfo.TraderGroupORI

	result, err := database.ListMOAHOU(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, "", stampUser, traderGroupORI)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	writeJSON(w, statusSuccess, arrList)
}

func listMO5Single(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id" json:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot" json:"match_time_slot"` // Live
		MatchID       string `schema:"match_id" json:"match_id"`
		DisplayAdmin  string `schema:"display_admin" json:"display_admin"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListMOAHOUSingle(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, p.DisplayAdmin, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	if len(arrList) == 0 {
		httpError(w, http.StatusBadRequest, "Wrong Data Found")
		return
	}
	writeJSON(w, statusSuccess, arrList[0])
}

func listMO5Partai(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id" json:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot" json:"match_time_slot"` // Live
		MatchID       string `schema:"match_id" json:"match_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListMOAHOUPartai(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	if len(arrList) == 0 {
		httpError(w, http.StatusBadRequest, "Wrong Data Found")
		return
	}
	writeJSON(w, statusSuccess, arrList)
}

func listMO5Euro(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // MO-Live
		MatchID       string `schema:"match_id"`
		DisplayAdmin  string `schema:"display_admin"`
		// Group         string `schema:"group"` // cth: MO-Live
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroupORI := userInfo.TraderGroupORI

	result, err := database.ListMOEuroAHOU(sessionID, p.PopupID, p.MatchTimeSlot, "", "", stampUser, traderGroupORI)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	writeJSON(w, statusSuccess, arrList)
}
func listMO5EuroSingle(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // Live
		MatchID       string `schema:"match_id"`
		DisplayAdmin  string `schema:"display_admin"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListMOEuroAHOUSingle(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, p.DisplayAdmin, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	if len(arrList) == 0 {
		httpError(w, http.StatusBadRequest, "Wrong Data Found")
		return
	}
	writeJSON(w, statusSuccess, arrList[0])
}
func listMO5EuroPartai(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // Live
		MatchID       string `schema:"match_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListMOEuroAHOUPartai(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	if len(arrList) == 0 {
		httpError(w, http.StatusBadRequest, "Wrong Data Found")
		return
	}
	writeJSON(w, statusSuccess, arrList)
}

func listMO5CS(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		FTHT          string `schema:"ftht"`
		MatchTimeSlot string `schema:"match_time_slot"` // MO-Live
		MatchID       string `schema:"match_id"`
		DisplayAdmin  string `schema:"display_admin"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroupORI := userInfo.TraderGroupORI

	result, err := database.ListMOCS(sessionID, p.PopupID, p.MatchTimeSlot, "", p.FTHT, stampUser, traderGroupORI)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMOCS(result)
	writeJSON(w, statusSuccess, arrList)
}
func listMO5CSPartai(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // Live
		MatchID       string `schema:"match_id"`
		GameType      string `schema:"game_type"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListMOCSPartai(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, p.GameType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMOCS(result)
	if len(arrList) == 0 {
		httpError(w, http.StatusBadRequest, "Wrong Data Found")
		return
	}
	writeJSON(w, statusSuccess, arrList)
}

func listMO5OE(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // MO-Live
		MatchID       string `schema:"match_id"`
		DisplayAdmin  string `schema:"display_admin"`
		// Group         string `schema:"group"` // cth: MO-Live
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroupORI := userInfo.TraderGroupORI

	result, err := database.ListMOOE(sessionID, p.PopupID, p.MatchTimeSlot, "", "", stampUser, traderGroupORI)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	writeJSON(w, statusSuccess, arrList)
}
func listMO5OESingle(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // Live
		MatchID       string `schema:"match_id"`
		DisplayAdmin  string `schema:"display_admin"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroupORI := userInfo.TraderGroupORI

	result, err := database.ListMOOE(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, p.DisplayAdmin, stampUser, traderGroupORI)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	if len(arrList) == 0 {
		httpError(w, http.StatusBadRequest, "Wrong Data Found")
		return
	}
	writeJSON(w, statusSuccess, arrList[0])
}
func listMO5OEPartai(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // Live
		MatchID       string `schema:"match_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroupORI := userInfo.TraderGroupORI

	result, err := database.ListMOOE(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, "", stampUser, traderGroupORI)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	if len(arrList) == 0 {
		httpError(w, http.StatusBadRequest, "Wrong Data Found")
		return
	}
	writeJSON(w, statusSuccess, arrList)
}

func listMO5OS(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // MO-Live
		MatchID       string `schema:"match_id"`
		DisplayAdmin  string `schema:"display_admin"`
		// Group         string `schema:"group"` // cth: MO-Live
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroupORI := userInfo.TraderGroupORI

	result, err := database.ListMOOS(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, "", stampUser, traderGroupORI)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	writeJSON(w, statusSuccess, arrList)
}
func listMO5OSSingle(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // Live
		MatchID       string `schema:"match_id"`
		DisplayAdmin  string `schema:"display_admin"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListMOOSSingle(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, p.DisplayAdmin, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	if len(arrList) == 0 {
		httpError(w, http.StatusBadRequest, "Wrong Data Found")
		return
	}
	writeJSON(w, statusSuccess, arrList[0])
}
func listMO5OSPartai(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // Live
		MatchID       string `schema:"match_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListMOOSPartai(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	if len(arrList) == 0 {
		httpError(w, http.StatusBadRequest, "Wrong Data Found")
		return
	}
	writeJSON(w, statusSuccess, arrList)
}

func listMO5Tennis(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // MO-Live
		MatchID       string `schema:"match_id"`
		DisplayAdmin  string `schema:"display_admin"`
		// Group         string `schema:"group"` // cth: MO-Live
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroupORI := userInfo.TraderGroupORI

	result, err := database.ListMOTennis(sessionID, p.PopupID, p.MatchTimeSlot, "", "", stampUser, traderGroupORI)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	writeJSON(w, statusSuccess, arrList)
}
func listMO5TennisSingle(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // Live
		MatchID       string `schema:"match_id"`
		DisplayAdmin  string `schema:"display_admin"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListMOTennisSingle(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, p.DisplayAdmin, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	if len(arrList) == 0 {
		httpError(w, http.StatusBadRequest, "Wrong Data Found")
		return
	}
	writeJSON(w, statusSuccess, arrList[0])
}
func listMO5TennisPartai(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"` // Live
		MatchID       string `schema:"match_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListMOTennisPartai(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrList := repository.ConvertToArrayLineMO(result)
	if len(arrList) == 0 {
		httpError(w, http.StatusBadRequest, "Wrong Data Found")
		return
	}
	writeJSON(w, statusSuccess, arrList)
}

func swapFavorite(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID        int    `json:"match_id"`
		SubMatchID     int    `json:"sub_match_id"`
		StatusFavorite int    `json:"st_fav"`
		PopupID        string `json:"popup_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup

	err := database.SwapFavorite(p.MatchID, p.SubMatchID, p.StatusFavorite, p.PopupID, stampUser, traderGroup)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func updateZeroOdds(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `json:"match_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateZeroOdds(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func moveHandicap(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int     `json:"match_id"`
		SubMatchID int     `json:"sub_match_id"`
		Direction  string  `json:"direction"`
		Point      float64 `json:"point"`
		PopupID    string  `json:"popup_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup
	err := database.MoveHandicap(p.MatchID, p.SubMatchID, p.Direction, p.Point, p.PopupID, stampUser, traderGroup)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func changeHandicap(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int     `json:"match_id"`
		SubMatchID int     `json:"sub_match_id"`
		Handicap   float64 `json:"handicap"`
		PopupID    string  `json:"popup_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup
	err := database.ChangeHandicap(p.MatchID, p.SubMatchID, p.Handicap, p.PopupID, stampUser, traderGroup)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func swapHandicap(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int    `json:"match_id"`
		SubMatchID int    `json:"sub_match_id"`
		GameType   int    `json:"game_type"`
		Direction  string `json:"direction"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.SwapHandicap(p.MatchID, p.SubMatchID, p.GameType, p.Direction, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func changeOdds(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int     `json:"match_id"`
		SubMatchID int     `json:"sub_match_id"`
		Odds       float32 `json:"odds"`
		PopupID    string  `json:"popup_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup
	err := database.ChangeOdds(p.MatchID, p.SubMatchID, p.Odds, p.PopupID, stampUser, traderGroup)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func changeOddsEuro(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int     `json:"match_id"`
		SubMatchID int     `json:"sub_match_id"`
		Odds       float32 `json:"odds"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup
	err := database.ChangeOddsEuro(p.MatchID, p.SubMatchID, p.Odds, traderGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func changeOddsCSLive(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int     `json:"match_id"`
		GameType   int     `json:"game_type"`
		Odds       float32 `json:"odds"`
		ChoiceCode string  `json:"choice_code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.ChangeOddsCSLive(p.MatchID, p.GameType, p.Odds, p.ChoiceCode, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func changeOdds1X2(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int     `json:"match_id"`
		SubMatchID int     `json:"sub_match_id"`
		Odds1      float32 `json:"odds1"`
		Odds2      float32 `json:"odds2"`
		Odds3      float32 `json:"odds3"`
		Spread     int     `json:"spread"`
		Profile    string  `json:"profile"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup

	err := database.ChangeOdds1X2(p.MatchID, p.SubMatchID, p.Odds1, p.Odds2, p.Odds3, p.Spread, p.Profile, traderGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func swapOdds(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int     `json:"match_id"`
		SubMatchID int     `json:"sub_match_id"`
		Odds       float64 `json:"odds"`
		PopupID    string  `json:"popup_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup
	err := database.SwapOdds(p.MatchID, p.SubMatchID, p.Odds, p.PopupID, stampUser, traderGroup)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func moveOdds(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int     `json:"match_id"`
		SubMatchID int     `json:"sub_match_id"`
		Direction  string  `json:"direction"`
		Point      float64 `json:"point"`
		PopupID    string  `json:"popup_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup
	err := database.MoveOdds(p.MatchID, p.SubMatchID, p.Direction, p.Point, "", p.PopupID, stampUser, traderGroup)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func changeLOD(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int `json:"match_id"`
		SubMatchID int `json:"sub_match_id"`
		LOD        int `json:"lod"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup
	err := database.ChangeLOD(p.MatchID, p.SubMatchID, p.LOD, stampUser, traderGroup)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func changeSpread(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int    `json:"match_id"`
		SubMatchID int    `json:"sub_match_id"`
		Spread     int    `json:"spread"`
		PopupID    string `json:"popup_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup
	err := database.ChangeSpread(p.MatchID, p.SubMatchID, p.Spread, p.PopupID, stampUser, traderGroup)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func pauseResumeChoice(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID           int    `json:"match_id"`
		GameType          int    `json:"game_type"`
		ChoiceCode        string `json:"choice_code"`
		ChoicePauseStatus int    `json:"choice_pause_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateStatusPauseCS(p.MatchID, p.GameType, p.ChoiceCode, p.ChoicePauseStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func pauseResumeSubMatchCS(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID             int `json:"match_id"`
		GameType            int `json:"game_type"`
		SubMatchPauseStatus int `json:"sub_match_pause_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateStatusPauseCSAll(p.MatchID, p.GameType, p.SubMatchPauseStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func pauseResumeSubMatch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID             int `json:"match_id"`
		SubMatchID          int `json:"sub_match_id"`
		GameType            int `json:"game_type"`
		SubMatchPauseStatus int `json:"sub_match_pause_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup
	err := database.PauseResumeSubMatch(p.MatchID, p.SubMatchID, p.GameType, p.SubMatchPauseStatus, stampUser, traderGroup)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func pauseResumeMatch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID          int    `json:"match_id"`
		MatchPauseStatus int    `json:"match_pause_status"`
		PopupID          string `json:"popup_id"`
		MatchTimeSlot    string `json:"match_time_slot"` // *
		MOPage           string `json:"mo_page"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup
	err := database.PauseResumeMatch(p.MatchID, p.MatchPauseStatus, sessionID, p.PopupID, p.MatchTimeSlot, stampUser, traderGroup, p.MOPage)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func pauseResumeAll(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchPauseStatus int    `json:"match_pause_status"`
		PopupID          string `json:"popup_id"`
		MatchTimeSlot    string `json:"match_time_slot"`
		MOPage           string `json:"mo_page"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup

	var err error
	if p.MOPage == "MOCS" {
		err = database.PauseResumeAllCS(p.MatchPauseStatus, sessionID, p.PopupID, p.MatchTimeSlot, traderGroup, stampUser)
	} else {
		err = database.PauseResumeAll(p.MatchPauseStatus, sessionID, p.PopupID, p.MatchTimeSlot, p.MOPage, traderGroup, stampUser)
	}
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func openCloseChoice(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID          int    `json:"match_id"`
		GameType         int    `json:"game_type"`
		ChoiceCode       string `json:"choice_code"`
		ChoiceOpenStatus string `json:"choice_open_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateStatusOpenCS(p.MatchID, p.GameType, p.ChoiceCode, p.ChoiceOpenStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func openCloseSubMatchCS(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID            int    `json:"match_id"`
		GameType           int    `json:"game_type"`
		SubMatchOpenStatus string `json:"sub_match_open_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateStatusOpenCSAll(p.MatchID, p.GameType, p.SubMatchOpenStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func openCloseSubMatch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID            int    `json:"match_id"`
		SubMatchID         int    `json:"sub_match_id"`
		GameType           int    `json:"game_type"`
		SubMatchOpenStatus string `json:"sub_match_open_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.OpenCloseSubMatch(p.MatchID, p.SubMatchID, p.GameType, p.SubMatchOpenStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func openCloseMatch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID         int    `json:"match_id"`
		MatchOpenStatus string `json:"match_open_status"`
		MOPage          string `json:"mo_page"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup
	err := database.OpenCloseMatch(p.MatchID, p.MatchOpenStatus, stampUser, traderGroup, p.MOPage)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func changeAutoCalcOdds1X2(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID            int    `json:"match_id"`
		SubMatchID         int    `json:"sub_match_id"`
		GameType           int    `json:"game_type"`
		AutoCalcOddsStatus string `json:"auto_call_odds_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.ChangeAutoCalcOdds1X2(p.MatchID, p.SubMatchID, p.GameType, p.AutoCalcOddsStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func changeLDiff(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int `json:"match_id"`
		SubMatchID int `json:"sub_match_id"`
		LDiff      int `json:"ldiff"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroup
	err := database.ChangeLDiff(p.MatchID, p.SubMatchID, p.LDiff, traderGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func updateGoal(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int `json:"match_id"`
		HomePosisi int `json:"home_posisi"`
		AwayPosisi int `json:"away_posisi"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateGoal(p.MatchID, p.HomePosisi, p.AwayPosisi, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func updateYellowCard(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `json:"match_id"`
		HomeYC  int `json:"home_yc"`
		AwayYC  int `json:"away_yc"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateYellowCard(p.MatchID, p.HomeYC, p.AwayYC, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func updateRedCard(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `json:"match_id"`
		HomeRC  int `json:"home_rc"`
		AwayRC  int `json:"away_rc"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateRedCard(p.MatchID, p.HomeRC, p.AwayRC, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func updatePenalty(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID   int    `json:"match_id"`
		STPenalty string `json:"st_penalty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdatePenalty(p.MatchID, p.STPenalty, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func updateScoreMatch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID       int  `json:"match_id"`
		HTHomeScore   int  `json:"ht_home_score"`
		HTAwayScore   int  `json:"ht_away_score"`
		HTProcess     bool `json:"ht_process"`
		FSHomeScore   int  `json:"fs_home_score"`
		FSAwayScore   int  `json:"fs_away_score"`
		FTProcess     bool `json:"ft_process"`
		FGLGFirstGoal int  `json:"fglg_first_goal"`
		FGLGLastGoal  int  `json:"fglg_last_goal"`
		FGLGProcess   bool `json:"fglg_process"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	if p.FTProcess {
		p.HTProcess = true
	}
	if p.FGLGProcess {
		p.HTProcess = true
		p.FTProcess = true
		if p.FGLGFirstGoal == 0 && p.FGLGLastGoal == 0 {
			p.HTHomeScore = 0
			p.HTAwayScore = 0
			p.FSHomeScore = 0
			p.FSAwayScore = 0
		}
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	var totalPending int
	var err error
	if p.HTProcess {
		totalPending, err = database.UpdateScoringMatch(p.MatchID, "HS", p.HTHomeScore, p.HTAwayScore, p.FSHomeScore, p.FSAwayScore, p.FGLGFirstGoal, p.FGLGLastGoal, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, "Error when update HT Score")
			return
		}
	}
	if p.FTProcess {
		totalPending, err = database.UpdateScoringMatch(p.MatchID, "FS", p.HTHomeScore, p.HTAwayScore, p.FSHomeScore, p.FSAwayScore, p.FGLGFirstGoal, p.FGLGLastGoal, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, "Error when update FT Score")
			return
		}
	}
	if p.FGLGProcess {
		totalPending, err = database.UpdateScoringMatch(p.MatchID, "FGLG", p.HTHomeScore, p.HTAwayScore, p.FSHomeScore, p.FSAwayScore, p.FGLGFirstGoal, p.FGLGLastGoal, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, "Error when update FGLG Score")
			return
		}
	}
	if totalPending > 0 {
		httpError(w, http.StatusBadRequest, "You still have pending bets")
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func getScoreDetail(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID string `schema:"match_id" json:"match_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.GetScoreDetail(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}

func updateScoreDetail(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID  int    `json:"match_id"`
		SportID  int    `json:"sport_id"`
		Set      int    `json:"set"`
		Point    string `json:"point"`
		Group    string `json:"group"`
		HomeAway string `json:"home_away"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateScoreDetail(p.Group, p.MatchID, p.SportID, p.Set, p.Point, p.HomeAway, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listEarlySettlement(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `schema:"match_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListEarlySettlement(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}

func updateEarlySettlement(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID           int    `json:"match_id"`
		StSettle          int    `json:"st_settle"`
		HomePosisi        int    `json:"home_posisi"`
		AwayPosisi        int    `json:"away_posisi"`
		StProcessType     int    `json:"st_process_type"`
		EarlySettlementId string `json:"early_settlement_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.ValidateInsQueueJobProcess(p.MatchID, p.StSettle, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err = database.UpdateEarlySettlement(p.MatchID, p.HomePosisi, p.AwayPosisi, p.StProcessType, p.StSettle, p.EarlySettlementId, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listEarlySettlementBetList(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID           int    `schema:"match_id"`
		EarlySettlementID string `schema:"early_settlement_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListEarlySettlementBetList(p.MatchID, p.EarlySettlementID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}

func getMOEditAHOU(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID      int `schema:"match_id"`
		DisplayAdmin int `schema:"display_admin"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	// 1. Data Match
	// 2. Data Profile AH OU OE ML
	// 3. Data Profile 1X2
	list1, list2, list3, err := database.GetMOEditAHOU(p.MatchID, p.DisplayAdmin, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result := map[string]interface{}{
		"match":        list1,
		"submatch":     list2,
		"submatch_1X2": list3,
	}
	writeJSON(w, statusSuccess, result)
}

func updateMOEditAHOU(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID               int    `json:"match_id"`
		MatchDate             string `json:"match_date"`
		MatchOpenStatus       string `json:"match_open_status"`
		MatchLiveStatus       string `json:"match_live_status"`
		MatchHasLiveStatus    string `json:"match_has_live_status"`
		MatchHiddenTimeStatus int    `json:"match_hidden_time_status"`
		MatchNeutralStatus    string `json:"match_neutral_status"`
		Category              string `json:"category"`
		Weather               int    `json:"weather"`
		SpecialCode           string `json:"special_code"`
		ProviderName          string `json:"provider"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateMOMatchEdit(p.MatchID, p.MatchDate,
		p.MatchOpenStatus, p.MatchLiveStatus, p.MatchHasLiveStatus, p.MatchHiddenTimeStatus, p.MatchNeutralStatus,
		p.Category, p.Weather, p.SpecialCode, p.ProviderName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func updateMOMatchProfile(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID   int    `json:"match_id"`
		ProfileID string `json:"profile_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateMOMatchProfile(p.MatchID, p.ProfileID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func updateSportsTicker(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID            int    `json:"match_id"`
		SportsTickerStatus string `json:"st_sports_ticker"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateSportsTicker(p.MatchID, p.SportsTickerStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func updateSportsTickerCS(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID            int    `json:"match_id"`
		SportsTickerStatus string `json:"st_sports_ticker"`
		GameType           int    `json:"game_type"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateSportTickerCS(p.MatchID, p.SportsTickerStatus, p.GameType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func updateSportsTickerOE(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID            int    `json:"match_id"`
		SportsTickerStatus string `json:"st_sports_ticker"`
		GameType           int    `json:"game_type"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateSportTickerOE(p.MatchID, p.SportsTickerStatus, p.GameType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func updateMatchParlay(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID  int    `json:"match_id"`
		BbStatus string `json:"bb_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateMatchParlay(p.MatchID, p.BbStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func updateOddsPointDiff(w http.ResponseWriter, r *http.Request) {
	var p struct {
		// DisplayAdmin         int `json:"display_admin"` // diSP gak dipake
		MatchID              int `json:"match_id"`
		HDPOddsPointDiff     int `json:"hdp_odds_point_diff"`
		HDPOddsPointDiffLive int `json:"hdp_odds_point_diff_live"`
		OUOddsPointDiff      int `json:"ou_odds_point_diff"`
		OUOddsPointDiffLive  int `json:"ou_odds_point_diff_live"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateOddsPointDiff(p.MatchID, 0, p.HDPOddsPointDiff, p.HDPOddsPointDiffLive, p.OUOddsPointDiff, p.OUOddsPointDiffLive, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func updateParlay(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID              int `json:"match_id"`
		DisplayAdmin         int `json:"display_admin"`
		ParlayAH             int `json:"hdp_mix_parlay"`
		ParlayGAH            int `json:"gah_mix_parlay"`
		ParlayOE             int `json:"oe_mix_parlay"`
		ParlayOU             int `json:"ou_mix_parlay"`
		Parlay1X2            int `json:"1X2_mix_parlay"`
		ParlayML             int `json:"ml_mix_parlay"`
		ParlayHWNW           int `json:"hwnw_mix_parlay"`
		ParlayAWNW           int `json:"awnw_mix_parlay"`
		ParlaySpreadAH       int `json:"hdp_odds_spread_parlay"`
		ParlaySpreadGAH      int `json:"gah_odds_spread_parlay"`
		ParlaySpreadOE       int `json:"oe_odds_spread_parlay"`
		ParlaySpreadOU       int `json:"ou_odds_spread_parlay"`
		ParlaySpreadML       int `json:"ml_odds_spread_parlay"`
		ParlaySpreadHWNW     int `json:"hwnw_odds_spread_parlay"`
		ParlaySpreadAWNW     int `json:"awnw_odds_spread_parlay"`
		ParlaySpreadAHLive   int `json:"hdp_odds_spread_parlay_live"`
		ParlaySpreadGAHLive  int `json:"gah_odds_spread_parlay_live"`
		ParlaySpreadOELive   int `json:"oe_odds_spread_parlay_live"`
		ParlaySpreadOULive   int `json:"ou_odds_spread_parlay_live"`
		ParlaySpreadMLLive   int `json:"ml_odds_spread_parlay_live"`
		ParlaySpreadHWNWLive int `json:"hwnw_odds_spread_parlay_live"`
		ParlaySpreadAWNWLive int `json:"awnw_odds_spread_parlay_live"`
		SportID              int `json:"sport_id"`
	}
	// set default -1, -1 mean no update to DB
	p.ParlayAH = -1
	p.ParlayGAH = -1
	p.ParlayOE = -1
	p.ParlayOU = -1
	p.Parlay1X2 = -1
	p.ParlayML = -1
	p.ParlayHWNW = -1
	p.ParlayAWNW = -1
	p.ParlaySpreadAH = -1
	p.ParlaySpreadGAH = -1
	p.ParlaySpreadOE = -1
	p.ParlaySpreadOU = -1
	p.ParlaySpreadML = -1
	p.ParlaySpreadHWNW = -1
	p.ParlaySpreadAWNW = -1
	p.ParlaySpreadAHLive = -1
	p.ParlaySpreadGAHLive = -1
	p.ParlaySpreadOELive = -1
	p.ParlaySpreadOULive = -1
	p.ParlaySpreadMLLive = -1
	p.ParlaySpreadHWNWLive = -1
	p.ParlaySpreadAWNWLive = -1
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var err error
	// if sport tennis / badminton
	if p.SportID == 11 || p.SportID == 32 {
		err = database.UpdateParlayTennis(p.MatchID, p.DisplayAdmin,
			p.ParlayAH, p.ParlayGAH, p.ParlayOU, p.ParlayOE, p.Parlay1X2,
			p.ParlaySpreadAH, p.ParlaySpreadGAH, p.ParlaySpreadOU, p.ParlaySpreadOE,
			p.ParlaySpreadAHLive, p.ParlaySpreadGAHLive, p.ParlaySpreadOULive, p.ParlaySpreadOELive,
			p.ParlayML, p.ParlaySpreadML, p.ParlaySpreadMLLive,
			stampUser)
	} else {
		err = database.UpdateParlay(p.MatchID, p.DisplayAdmin,
			p.ParlayAH, p.ParlayOU, p.ParlayOE, p.Parlay1X2,
			p.ParlaySpreadAH, p.ParlaySpreadOU, p.ParlaySpreadOE,
			p.ParlaySpreadAHLive, p.ParlaySpreadOULive, p.ParlaySpreadOELive,
			p.ParlayML, p.ParlaySpreadML, p.ParlaySpreadMLLive,
			p.ParlayHWNW, p.ParlaySpreadHWNW, p.ParlaySpreadHWNWLive, p.ParlayAWNW, p.ParlaySpreadAWNW, p.ParlaySpreadAWNWLive,
			stampUser)
	}
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func updateRBDelay(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID              int `json:"match_id"`
		AutoAcceptDelayAway  int `json:"auto_accept_delay_away"`
		AutoAcceptDelayHome  int `json:"auto_accept_delay_home"`
		AutoAcceptDelayOver  int `json:"auto_accept_delay_over"`
		AutoAcceptDelayUnder int `json:"auto_accept_delay_under"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateRBDelay(p.MatchID, p.AutoAcceptDelayHome, p.AutoAcceptDelayAway, p.AutoAcceptDelayOver, p.AutoAcceptDelayUnder, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func updateLinkOdds(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID          int `json:"match_id"`
		SubMatchID       int `json:"sub_match_id" `
		LinkOddsDiff     int `json:"link_odds_diff"`
		LinkSpreadDiff   int `json:"link_spread_diff"`
		LinkOddsDiffLock int `json:"link_odds_diff_lock"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	traderGroup := userInfo.TraderGroup
	stampUser := userInfo.Username

	err := database.UpdateLinkOdds(p.MatchID, p.SubMatchID, p.LinkOddsDiff, p.LinkSpreadDiff, p.LinkOddsDiffLock, traderGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func updateMOTimedMaxBet(w http.ResponseWriter, r *http.Request) {
	var p struct {
		Time                  int `json:"time"`
		MatchID               int `json:"match_id"`
		SubMatchID            int `json:"sub_match_id" `
		TimedMaxBetDiffMinute int `json:"timed_maxbet_diff_minute"`
		TimedMaxBetDiff       int `json:"timed_maxbet_diff"`
		TimedMaxLimitDiff     int `json:"timed_maxlimit_diff"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	if p.Time != 1 && p.Time != 2 {
		httpError(w, http.StatusBadRequest, "Invalid Time")
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateMOTimedMaxBet(p.Time, p.MatchID, p.SubMatchID, p.TimedMaxBetDiffMinute, p.TimedMaxBetDiff, p.TimedMaxLimitDiff, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateMatchLiveStatus(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID         int    `json:"match_id"`
		MatchLiveStatus string `json:"match_live_status" db:"Match_Live_Status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateMatchLiveStatus(p.MatchID, p.MatchLiveStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateFixMarket(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `json:"match_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateFixMarket(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateAutoProcessBetBazar(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID               int    `json:"match_id"`
		IsAutoProcessBetBazar string `json:"is_autoprocess_betbazar"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateAutoProcessBetBazar(p.MatchID, p.IsAutoProcessBetBazar, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateAutoProcessIM(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID         int    `json:"match_id"`
		IsAutoProcessIM string `json:"is_autoprocess_im"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateAutoProcessIM(p.MatchID, p.IsAutoProcessIM, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateProfileGameType(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int `json:"match_id"`
		SubMatchID int `json:"sub_match_id"`
		GameType   int `json:"game_type"`
		// AH,OU,OE,ML payload
		Step1        int             `json:"step_1"`
		Step2        int             `json:"step_2"`
		Step3        int             `json:"step_3"`
		Step4        int             `json:"step_4"`
		OddsTrigger1 decimal.Decimal `json:"odds_trigger_1"`
		OddsTrigger2 decimal.Decimal `json:"odds_trigger_2"`
		OddsTrigger3 decimal.Decimal `json:"odds_trigger_3"`
		OddsTrigger4 decimal.Decimal `json:"odds_trigger_4"`
		MaxLimit1    decimal.Decimal `json:"max_limit_1"`
		MaxLimit2    decimal.Decimal `json:"max_limit_2"`
		MaxLimit3    decimal.Decimal `json:"max_limit_3"`
		MaxLimit4    decimal.Decimal `json:"max_limit_4"`
		MaxBet1      decimal.Decimal `json:"max_bet_1"`
		MaxBet2      decimal.Decimal `json:"max_bet_2"`
		MaxBet3      decimal.Decimal `json:"max_bet_3"`
		MaxBet4      decimal.Decimal `json:"max_bet_4"`

		// 1X2 payload
		Odds1     decimal.Decimal `json:"odds1"`
		Odds2     decimal.Decimal `json:"odds2"`
		Odds3     decimal.Decimal `json:"odds3"`
		OddsDiff1 decimal.Decimal `json:"oddsdiff1"`
		OddsDiff2 decimal.Decimal `json:"oddsdiff2"`
		OddsDiff3 decimal.Decimal `json:"oddsdiff3"`
		LAP       decimal.Decimal `json:"lap"`
		LAPLive   decimal.Decimal `json:"laplive"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	traderGroup := userInfo.TraderGroup
	stampUser := userInfo.Username

	var result int
	var err error
	if p.GameType != 1 {
		err = database.UpdateProfileGameType(p.MatchID, p.SubMatchID, p.GameType, p.Step1, p.Step2, p.Step3, p.Step4,
			p.OddsTrigger1, p.OddsTrigger2, p.OddsTrigger3, p.OddsTrigger4,
			p.MaxLimit1, p.MaxLimit2, p.MaxLimit3, p.MaxLimit4,
			p.MaxBet1, p.MaxBet2, p.MaxBet3, p.MaxBet4,
			stampUser)
	} else { // 1X2
		err = database.UpdateProfileGameType1X2(p.MatchID, p.SubMatchID, p.Odds1, p.Odds2, p.Odds3, p.OddsDiff1, p.OddsDiff2, p.OddsDiff3, p.LAP, p.LAPLive, traderGroup, stampUser)
	}

	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func addMatchET(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `json:"match_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.InsertMatchET(p.MatchID, "SET", stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func addMatchPEN(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `json:"match_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.InsertMatchPEN(p.MatchID, "SET", stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func addPenaltyShootOut(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID         int      `json:"match_id"`
		SpecialCode     string   `json:"special_code"`
		PenaltyShootOut []string `json:"penalty_shoot_out"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var result int
	var err error
	for _, v := range p.PenaltyShootOut {
		teamNamePrefix := fmt.Sprintf("%s Penalty - Goal", v)
		teamNamePrefix2 := fmt.Sprintf("%s Penalty - No Goal", v)
		err = database.InsertMatchSpecialKembar(p.MatchID, "PENALTY SHOOT-OUT", teamNamePrefix, teamNamePrefix2, p.SpecialCode, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	}

	writeJSON(w, statusSuccess, result)
}

func addSubMatch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int    `json:"match_id"`
		HTFT    string `json:"htft"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.AddSubMatch(p.MatchID, p.HTFT, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func deleteSubMatch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID      int `json:"match_id"`
		DisplayAdmin int `json:"display_admin"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.DeleteSubMatch(p.MatchID, p.DisplayAdmin, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func followLeechSubMatch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID                   int `json:"match_id"`
		SubMatchID                int `json:"sub_match_id"`
		GameType                  int `json:"game_type"`
		SubMatchFollowLeechStatus int `json:"sub_match_follow_leech_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateFollowLeechSubMatch(p.MatchID, p.SubMatchID, p.GameType, p.SubMatchFollowLeechStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateLeechAssign(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `json:"match_id"`
		Status  int `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateLeechAssign(p.MatchID, p.Status, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func getAutoCloseAutoTimer(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `schema:"match_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.GetAutoCloseAutoTimer(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func updateAutoClose(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int    `json:"match_id"`
		Status  string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateAutoClose(p.MatchID, p.Status, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateAutoTimer(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int    `json:"match_id"`
		Status  string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateAutoTimer(p.MatchID, p.Status, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateMatchTime(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID       int    `json:"match_id"`
		Round         int    `json:"match_round"`
		Minutes       int    `json:"minutes"`
		STInjuryHT    string `json:"st_injury_ht"`
		STInjuryFT    string `json:"st_injury_ft"`
		MatchInjuryHT int    `json:"injury_ht"`
		MatchInjuryFT int    `json:"injury_ft"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateMatchTime(p.MatchID, p.Round, p.Minutes, p.STInjuryHT, p.STInjuryFT, p.MatchInjuryHT, p.MatchInjuryFT, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func getBasketTimer(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `schema:"match_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.GetBasketTimer(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func updateBasketTimer(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID   int    `json:"match_id"`
		TimerCode string `json:"timer_code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateBasketTimer(p.MatchID, p.TimerCode, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateAdjustBasketTimer(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `json:"match_id"`
		Round   int `json:"match_round"`
		Minutes int `json:"minutes"`
		Seconds int `json:"seconds"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateAdjustBasketTimer(p.MatchID, p.Round, p.Minutes, p.Seconds, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func getFinalScore(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `schema:"match_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.GetFinalScore(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}

func updMOChangeLock1X2(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID          int `json:"match_id"`
		SubMatchID       int `json:"sub_match_id"`
		LinkOddsDiffLock int `json:"link_odds_diff_lock"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdMOChangeLock1X2(p.MatchID, p.SubMatchID, p.LinkOddsDiffLock, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")

}

func getOGTIsPauseStatus(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	var p struct {
		MatchID int `schema:"match_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	pauseStatus, err := database.GetOGTIsPauseStatus(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, pauseStatus)
}
