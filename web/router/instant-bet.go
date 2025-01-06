package router

import (
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/AxionHQ/tsubasa-admin/web/util"
)

func RegisterAPIInstantBet() {
	Base.HandleFunc("/instantbet", listInstantBet).Methods(http.MethodGet)
	// Base.HandleFunc("/instantbet/single", listMO5dSingle).Methods(http.MethodGet)
	// Base.HandleFunc("/instantbet/partai", listMO5dPartai).Methods(http.MethodGet)
	Base.HandleFunc("/instantbet/parlay", listInstantBetParlay).Methods(http.MethodGet)
	Base.HandleFunc("/instantbet/matchparlay", listInstantBetMatchParlay).Methods(http.MethodGet)
	Base.HandleFunc("/instantbet/lottery", listInstantBetLottery).Methods(http.MethodGet)
}

func listInstantBet(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroupORI := userInfo.TraderGroupORI
	userTeamID := userInfo.UserTeamID
	userTeamSubID := userInfo.UserTeamSubID

	var p struct {
		BranchID      string `schema:"branch_id"`
		Username      string `schema:"username"`
		Display       int    `schema:"display"`
		MatchTimeSlot string `schema:"match_time_slot"`
		Currency      string `schema:"currency"`
		SportID       int    `schema:"sport_id"`
		LeagueIDs     string `schema:"league_ids"`
		MatchIDs      string `schema:"match_ids"`
		MatchID       int    `schema:"match_id"`

		VIPFilter       string `schema:"vip_filter"`
		GameTypeSpecial string `schema:"game_type_special"`
		Pending         string `schema:"accept_pending"`
		FTHT            string `schema:"ftht"`
		GameTypes       string `schema:"game_types"`
		Platform        string `schema:"platform"`
		IsNewMember     string `schema:"new_member"`

		BetAmount     int `schema:"bet_amount"`
		BetAmountComp int `schema:"bet_amount_comp"`
		MaxPayout     int `schema:"max_payout"`
		MaxBet        int `schema:"max_bet"`

		// PopupID string `schema:"popup_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	leagueIds := strings.Split(p.LeagueIDs, ",")
	if util.Contains(leagueIds, "0") || p.LeagueIDs == "" {
		p.LeagueIDs = "0"
	}
	matchIds := strings.Split(p.MatchIDs, ",")
	if util.Contains(matchIds, "0") || p.MatchIDs == "" {
		p.MatchIDs = "0"
	}
	// vipBets := strings.Join(p.VIPBets, ",")

	result, err := database.ListInstantBet(
		p.BranchID,
		p.Username,
		p.Display,
		p.MatchTimeSlot,
		p.Currency,
		p.SportID,
		p.LeagueIDs,
		p.MatchIDs,
		p.MatchID,
		p.VIPFilter,
		p.GameTypeSpecial,
		p.Pending,
		p.FTHT,
		p.GameTypes,
		p.Platform,
		p.IsNewMember,
		p.BetAmount,
		p.BetAmountComp,
		p.MaxPayout,
		p.MaxBet,
		"",
		0,
		sessionID,
		stampUser,
		traderGroupORI,
		userTeamID,
		userTeamSubID,
	)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	// arrList := repository.ConvertToArrayLineMO(result)
	writeJSON(w, statusSuccess, result)
}

// func listMO5dSingle(w http.ResponseWriter, r *http.Request) {
// 	var p struct {
// 		PopupID       string `schema:"popup_id" json:"popup_id"`
// 		MatchTimeSlot string `schema:"match_time_slot" json:"match_time_slot"` // Live
// 		MatchID       string `schema:"match_id" json:"match_id"`
// 		DisplayAdmin  string `schema:"display_admin" json:"display_admin"`
// 	}
// 	err := decoder.Decode(&p, r.URL.Query())
// 	if err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	userSession, _ := session.GetRouterUserSession(r)
// 	sessionID := userSession.SessionID
// 	userInfo := userSession.User
// 	stampUser := userInfo.Username

// 	result, err := database.ListMOAHOUSingle(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, p.DisplayAdmin, stampUser)
// 	if err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	arrList := repository.ConvertToArrayLineMO(result)
// 	if len(arrList) == 0 {
// 		httpError(w, http.StatusBadRequest, "Wrong Data Found")
// 		return
// 	}
// 	writeJSON(w, statusSuccess, arrList[0])
// }
// func listMO5dPartai(w http.ResponseWriter, r *http.Request) {
// 	var p struct {
// 		PopupID       string `schema:"popup_id" json:"popup_id"`
// 		MatchTimeSlot string `schema:"match_time_slot" json:"match_time_slot"` // Live
// 		MatchID       string `schema:"match_id" json:"match_id"`
// 	}
// 	err := decoder.Decode(&p, r.URL.Query())
// 	if err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	userSession, _ := session.GetRouterUserSession(r)
// 	sessionID := userSession.SessionID
// 	userInfo := userSession.User
// 	stampUser := userInfo.Username

// 	result, err := database.ListMOAHOUPartai(sessionID, p.PopupID, p.MatchTimeSlot, p.MatchID, stampUser)
// 	if err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	arrList := repository.ConvertToArrayLineMO(result)
// 	if len(arrList) == 0 {
// 		httpError(w, http.StatusBadRequest, "Wrong Data Found")
// 		return
// 	}
// 	writeJSON(w, statusSuccess, arrList)
// }

func listInstantBetParlay(w http.ResponseWriter, r *http.Request) {
	var p struct {
		ParlaySequence int `schema:"parlay_seq"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListInstantBetParlay(p.ParlaySequence, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func listInstantBetMatchParlay(w http.ResponseWriter, r *http.Request) {
	var p struct {
		BetID int `schema:"bet_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListInstantBetMatchParlay(p.BetID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func listInstantBetLottery(w http.ResponseWriter, r *http.Request) {
	var p struct {
		BetID int `schema:"bet_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListInstantBetLottery(p.BetID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
