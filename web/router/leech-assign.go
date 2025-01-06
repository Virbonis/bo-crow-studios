package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPILeechAssign() {
	Base.HandleFunc("/leech-assign/league", listLeagueLeechAssign).Methods(http.MethodGet)
	Base.HandleFunc("/leech-assign/league", updateLeagueLeechAssign).Methods(http.MethodPut)
	Base.HandleFunc("/leech-assign/match", listMatchLeechAssign).Methods(http.MethodGet)
	Base.HandleFunc("/leech-assign/match", updateMatchLeechAssign).Methods(http.MethodPut)
	Base.HandleFunc("/leech-assign/popup", listAuditTrailLeechAssignUpdateMatch).Methods(http.MethodGet)
}

func listLeagueLeechAssign(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchDateFrom string `schema:"match_date_from"`
		MatchDateTo   string `schema:"match_date_to"`
		SportID       int    `schema:"sport_id"`
		IsChecked     string `schema:"is_checked"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result, err := database.ListLeagueLeechAssign(p.MatchDateFrom, p.MatchDateTo, p.IsChecked, p.SportID, stampUser, userInfo.UserTeamID)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}

func updateLeagueLeechAssign(w http.ResponseWriter, r *http.Request) {
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

	err := database.UpdateLeagueLeechAssign(p.LeagueIDs, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
	}

	writeJSON(w, statusSuccess, "OK")
}

func listMatchLeechAssign(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchDateFrom string `schema:"match_date_from"`
		MatchDateTo   string `schema:"match_date_to"`
		SportID       int    `schema:"sport_id"`
		IsChecked     string `schema:"is_checked"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result, err := database.ListMatchLeechAssign(p.MatchDateFrom, p.MatchDateTo, p.IsChecked, p.SportID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}

func updateMatchLeechAssign(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchIDs string `json:"match_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateMatchLeechAssign(p.MatchIDs, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
	}

	writeJSON(w, statusSuccess, "OK")
}

func listAuditTrailLeechAssignUpdateMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID int `schema:"match_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result, err := database.ListAuditTrailLeechAssignUpdateMatch(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
