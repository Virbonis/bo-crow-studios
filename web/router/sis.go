package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPISIS() {
	Base.HandleFunc("/sis-action-log", getSISActionLog).Methods(http.MethodGet)
	Base.HandleFunc("/sis-market", getSISMarket).Methods(http.MethodGet)
	Base.HandleFunc("/sis-market-log", getSISMarketLog).Methods(http.MethodGet)
	Base.HandleFunc("/sis-match-list", getSISMatchList).Methods(http.MethodGet)
}

func getSISActionLog(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID    int    `schema:"match_id"`
		MatchIDSIS string `schema:"match_id_sis"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListSISActionLog(p.MatchID, p.MatchIDSIS, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func getSISMarket(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID    int    `schema:"match_id"`
		MatchIDSIS string `schema:"match_id_sis"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListSISMarket(p.MatchID, p.MatchIDSIS, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func getSISMarketLog(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID     int    `schema:"match_id"`
		MatchIDSIS  string `schema:"match_id_sis"`
		GameType    int    `schema:"game_type"`
		Status      string `schema:"status"`
		IsDisplayed string `schema:"is_displayed"`
		ID          string `schema:"id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListSISMarketLog(p.MatchID, p.MatchIDSIS, p.GameType, p.Status, p.IsDisplayed, p.ID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func getSISMatchList(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate   string `schema:"from_date"`
		ToDate     string `schema:"to_date"`
		MatchID    int    `schema:"match_id"` // Match ID
		MatchIDSIS string `schema:"match_id_sis"`
		LeagueSIS  string `schema:"league_sis"`
		HomeSIS    string `schema:"home_sis"`
		AwaySIS    string `schema:"away_sis"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListSISMatchList(p.FromDate, p.ToDate, p.MatchID, p.MatchIDSIS, p.LeagueSIS, p.HomeSIS, p.AwaySIS, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
