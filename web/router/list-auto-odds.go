package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIListAutoOdds() {
	Base.HandleFunc(`/list-auto-odds`, listAutoOdds).Methods(http.MethodGet)
	Base.HandleFunc(`/list-auto-odds`, updateListAutoOdds).Methods(http.MethodPut)
	Base.HandleFunc(`/list-auto-odds`, deleteListAutoOdds).Methods(http.MethodDelete)
}

func listAutoOdds(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID       int    `schema:"sport_id"`
		MatchID       int    `schema:"match_id"`
		LeagueNameIBC string `schema:"league_name_ibc"`
		HomeTeamIBC   string `schema:"home_name_ibc"`
		AwayTeamIBC   string `schema:"away_name_ibc"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListAutoOddsMatch(p.MatchID, p.SportID, p.LeagueNameIBC, p.HomeTeamIBC, p.AwayTeamIBC, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func updateListAutoOdds(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchIDIBC   int    `json:"match_id_ibc"`
		MatchDateIBC string `json:"match_date_ibc"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateAutoOddsMatch(p.MatchIDIBC, p.MatchDateIBC, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func deleteListAutoOdds(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchIDIBC int `json:"match_id_ibc"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.DeleteAutoOddsMatch(p.MatchIDIBC, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
