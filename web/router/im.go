package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIIM() {
	Base.HandleFunc("/im/reset-service", resetIMService).Methods(http.MethodPost)
	Base.HandleFunc("/im/match-list", listIMMatch).Methods(http.MethodGet)
	Base.HandleFunc("/im/action-log", listIMActionLog).Methods(http.MethodGet)
	Base.HandleFunc("/im/market", listIMMarket).Methods(http.MethodGet)
}

func resetIMService(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.ResetIMService(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func listIMMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate  string `schema:"from_date"`
		ToDate    string `schema:"to_date"`
		MatchID   int    `schema:"match_id"` // Match ID
		MatchIDIM string `schema:"match_id_im"`
		League    string `schema:"league"`
		HomeTeam  string `schema:"home_team"`
		AwayTeam  string `schema:"away_team"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListIMMatch(p.FromDate, p.ToDate, p.MatchID, p.MatchIDIM, p.League, p.HomeTeam, p.AwayTeam, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listIMActionLog(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID   int    `schema:"match_id"`
		MatchIDIM string `schema:"match_id_im"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListIMActionLog(p.MatchID, p.MatchIDIM, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listIMMarket(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID   int    `schema:"match_id"`
		MatchIDIM string `schema:"match_id_im"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListIMMarket(p.MatchID, p.MatchIDIM, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
