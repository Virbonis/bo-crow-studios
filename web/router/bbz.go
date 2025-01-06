package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIBBZ() {
	Base.HandleFunc("/bbz/reset-service", resetBBZService).Methods(http.MethodPost)
	Base.HandleFunc("/bbz/channel-monitoring", listBBZChannelMonitoring).Methods(http.MethodGet)
	Base.HandleFunc("/bbz/match-list", listBBZMatchList).Methods(http.MethodGet)
	Base.HandleFunc("/bbz/action-log", listBBZActionLog).Methods(http.MethodGet)
	Base.HandleFunc("/bbz/market", listBBZMarket).Methods(http.MethodGet)
	Base.HandleFunc("/bbz/market-log", listBBZMarketLog).Methods(http.MethodGet)
	Base.HandleFunc("/bbz/incident", listBBZIncident).Methods(http.MethodGet)
}

func resetBBZService(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.ResetBBZService(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func listBBZChannelMonitoring(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	res, err := database.ListBBZChannelMonitoring(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func listBBZMatchList(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate   string `schema:"from_date"`
		ToDate     string `schema:"to_date"`
		MatchID    int    `schema:"match_id"`
		MatchIDBBZ string `schema:"match_id_bbz"`
		League     string `schema:"league"`
		HomeTeam   string `schema:"home_team"`
		AwayTeam   string `schema:"away_team"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListBBZMatchList(p.FromDate, p.ToDate, p.MatchID, p.MatchIDBBZ, p.League, p.HomeTeam, p.AwayTeam, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func listBBZActionLog(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID    int    `schema:"match_id"`
		MatchIDBBZ string `schema:"match_id_bbz"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListBBZActionLog(p.MatchID, p.MatchIDBBZ, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func listBBZMarket(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID    int    `schema:"match_id"`
		MatchIDBBZ string `schema:"match_id_bbz"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListBBZMarket(p.MatchID, p.MatchIDBBZ, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func listBBZMarketLog(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID    int    `schema:"match_id"`
		MatchIDBBZ string `schema:"match_id_bbz"`
		GameType   int    `schema:"game_type"`
		Status     string `schema:"status"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListBBZMarketLog(p.MatchID, p.MatchIDBBZ, p.GameType, p.Status, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func listBBZIncident(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID    int    `schema:"match_id"`
		MatchIDBBZ string `schema:"match_id_bbz"`
		FromDate   string `schema:"from_date"`
		ToDate     string `schema:"to_date"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListBBZIncident(p.MatchID, p.MatchIDBBZ, p.FromDate, p.ToDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
