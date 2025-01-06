package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIOnlineList() {
	Base.HandleFunc("/online-list", listOnlineList).Methods(http.MethodGet)
	Base.HandleFunc("/online-list/detail", listOnlineListDetail).Methods(http.MethodGet)
	Base.HandleFunc("/online-list/bet-detail", listBetDetailOnlineList).Methods(http.MethodGet)
}

func listOnlineList(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchDate string `schema:"match_date"`
		SportID   int    `schema:"sport_id"`
		League    string `schema:"league"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListOnlineList(p.MatchDate, p.SportID, p.League, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listOnlineListDetail(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchIDs     string `schema:"match_ids"`
		GameTypeDead string `schema:"game_type_dead"`
		GameTypeRun  string `schema:"game_type_run"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListOnlineListDetail(p.MatchIDs, p.GameTypeDead, p.GameTypeRun, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listBetDetailOnlineList(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID         string `schema:"match_id"`
		MatchLiveStatus string `schema:"match_live_status"`
		BetChoice       string `schema:"bet_choice"`
		HomeScore       string `schema:"home_score"`
		AwayScore       string `schema:"away_score"`
		Handicap        string `schema:"handicap"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListBetDetailOnlineList(p.MatchID, p.MatchLiveStatus, p.BetChoice, p.HomeScore, p.AwayScore, p.Handicap, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
