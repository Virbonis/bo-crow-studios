package router

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMatchAssignment() {
	Base.HandleFunc("/match-assignment/my-matches/counter", getCounterMatchAssignedToMyMatches).Methods(http.MethodGet)
	Base.HandleFunc("/match-assignment/user-team-matches/counter", getCounterMatchAssignedToUserTeamMatches).Methods(http.MethodGet)
	Base.HandleFunc("/match-assignment/my-matches", listMyMatches).Methods(http.MethodGet)
	Base.HandleFunc("/match-assignment/user-team-matches", listUserTeamMatches).Methods(http.MethodGet)

	Base.HandleFunc("/match-assignment/list-trader", listMatchAssignmentTrader).Methods(http.MethodGet)
	Base.HandleFunc("/match-assignment/league", listLeagueMatchAssignment).Methods(http.MethodGet)
	Base.HandleFunc("/match-assignment/league", updateLeagueMatchAssignment).Methods(http.MethodPut)
	Base.HandleFunc("/match-assignment/match", listMatchAssignment).Methods(http.MethodGet)
	Base.HandleFunc("/match-assignment/match", updateMatchAssignment).Methods(http.MethodPut)
	Base.HandleFunc("/match-assignment/detail", listMatchAssignmentDetail).Methods(http.MethodGet)
	Base.HandleFunc("/match-assignment/detail", updateMatchAssignmentDetail).Methods(http.MethodPut)
	Base.HandleFunc("/match-assignment/log", listMatchAssignmentLog).Methods(http.MethodGet)
	Base.HandleFunc("/match-assignment-pick/match", listLeagueMatchAssignmentPick).Methods(http.MethodGet)
	Base.HandleFunc("/match-assignment-pick/match", updateMatchAssignmentPick).Methods(http.MethodPut)
	Base.HandleFunc("/match-assignment-ro/league", listLeagueMatchAssignmentRO).Methods(http.MethodGet)
	Base.HandleFunc("/match-assignment-ro/match", listMatchAssignmentRO).Methods(http.MethodPost)
}

func getCounterMatchAssignedToMyMatches(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var trader string

	var p struct {
		TraderName string `schema:"trader_name"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	if p.TraderName != "" {
		trader = p.TraderName
	} else {
		trader = stampUser
	}

	result, err := database.GetCounterMatchAssignedToTrader(trader, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func getCounterMatchAssignedToUserTeamMatches(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		UserTeamID int `schema:"user_team_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.GetCounterMatchAssignedToUserTeam(p.UserTeamID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}

func listMyMatches(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchTimeSlot string `schema:"match_time_slot"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListMyMatches(p.MatchTimeSlot, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listUserTeamMatches(w http.ResponseWriter, r *http.Request) {
	var p struct {
		UserTeamID    int    `schema:"user_team_id"`
		MatchTimeSlot string `schema:"match_time_slot"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListUserTeamMatches(p.UserTeamID, p.MatchTimeSlot, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listMatchAssignmentTrader(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroup := userInfo.TraderGroupORI

	result, err := database.ListMatchAssignmentTrader(traderGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listLeagueMatchAssignment(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userTeamID := userInfo.UserTeamID

	var traderName string

	var p struct {
		TraderName string `schema:"trader_name"`
		IsPick     string `schema:"is_pick"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	if p.IsPick == "Y" {
		traderName = stampUser
	} else {
		traderName = p.TraderName
	}

	result, err := database.ListLeagueMatchAssignment(userTeamID, traderName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateLeagueMatchAssignment(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userTeamID := userInfo.UserTeamID

	var traderName string

	var p struct {
		LeagueIDs  string `json:"league_ids"`
		TraderName string `json:"trader_name"`
		IsPick     string `json:"is_pick"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	if p.IsPick == "Y" {
		traderName = stampUser
	} else {
		traderName = p.TraderName
	}

	err := database.UpdateLeagueMatchAssignment(traderName, p.LeagueIDs, userTeamID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listMatchAssignment(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userTeamID := userInfo.UserTeamID

	var p struct {
		TraderName string `schema:"trader_name"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListMatchAssignment(userTeamID, p.TraderName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateMatchAssignment(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userTeamID := userInfo.UserTeamID

	var p struct {
		MatchIDs   string `json:"match_ids"`
		TraderName string `json:"trader_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateMatchAssignment(p.TraderName, p.MatchIDs, userTeamID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listMatchAssignmentDetail(w http.ResponseWriter, r *http.Request) {
	var p struct {
		LeagueID        int    `schema:"league_id"`
		MatchID         int    `schema:"match_id"`
		IsPick          string `schema:"is_pick"`
		MatchStatusLive string `schema:"match_status_live"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	var result interface{}
	if p.IsPick == "Y" {
		result, err = database.ListMatchAssignmentDetailPick(p.LeagueID, p.MatchID, p.MatchStatusLive, stampUser)
	} else {
		result, err = database.ListMatchAssignmentDetail(p.LeagueID, p.MatchID, stampUser)
	}
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func updateMatchAssignmentDetail(w http.ResponseWriter, r *http.Request) {
	var p struct {
		LeagueID int `json:"league_id"`
		MatchID  int `json:"match_id"`

		FTAH  []string `json:"FTAH"`
		FTOU  []string `json:"FTOU"`
		FT1X2 []string `json:"FT1X2"`
		HTAH  []string `json:"HTAH"`
		HTOU  []string `json:"HTOU"`
		HT1X2 []string `json:"HT1X2"`

		IsPick          string `json:"is_pick"`
		MatchStatusLive string `json:"match_status_live"`
	}
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	if p.IsPick == "Y" {
		err = database.UpdateMatchAssignmentDetailPick(p.LeagueID, p.MatchID, p.MatchStatusLive,
			strings.Join(p.FTAH, ","), strings.Join(p.FTOU, ","), strings.Join(p.FT1X2, ","),
			strings.Join(p.HTAH, ","), strings.Join(p.HTOU, ","), strings.Join(p.HT1X2, ","), stampUser)
	} else {
		err = database.UpdateMatchAssignmentDetail(p.LeagueID, p.MatchID,
			strings.Join(p.FTAH, ","), strings.Join(p.FTOU, ","), strings.Join(p.FT1X2, ","),
			strings.Join(p.HTAH, ","), strings.Join(p.HTOU, ","), strings.Join(p.HT1X2, ","), stampUser)
	}
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listMatchAssignmentLog(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID    int    `schema:"match_id"`
		TraderName string `schema:"trader_name"`
		OrderBy    string `schema:"order_by"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListMatchAssignmentLog(p.MatchID, p.TraderName, p.OrderBy, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listLeagueMatchAssignmentPick(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userTeamID := userInfo.UserTeamID

	result, err := database.ListLeagueMatchAssignmentPick(userTeamID, stampUser, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateMatchAssignmentPick(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userTeamID := userInfo.UserTeamID

	var p struct {
		MatchIDs string `json:"match_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateMatchAssignmentPick(stampUser, p.MatchIDs, userTeamID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listLeagueMatchAssignmentRO(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListLeagueMatchAssignmentRO(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listMatchAssignmentRO(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		LeagueIDs string `json:"league_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListMatchAssignmentRO(p.LeagueIDs, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
