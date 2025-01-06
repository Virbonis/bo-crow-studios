package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPITraderPerformance() {
	Base.HandleFunc("/trader-performance/trader", listTraderTraderPerformance).Methods(http.MethodGet)
	Base.HandleFunc("/trader-performance/league", listLeagueTraderPerformance).Methods(http.MethodGet)
	Base.HandleFunc("/trader-performance", listTraderPerformance).Methods(http.MethodGet)
}

func listTraderTraderPerformance(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate   string `schema:"from_date"`
		ToDate     string `schema:"to_date"`
		Section    string `schema:"section"`
		LeagueID   int    `schema:"league_id"`
		HistOrPost string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListTraderTraderPerformance(p.FromDate, p.ToDate, p.Section, p.LeagueID, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func listLeagueTraderPerformance(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate   string `schema:"from_date"`
		ToDate     string `schema:"to_date"`
		Section    string `schema:"section"`
		Trader     string `schema:"trader"`
		HistOrPost string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListLeagueTraderPerformance(p.FromDate, p.ToDate, p.Section, p.Trader, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func listTraderPerformance(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateFrom   string `schema:"from_date"`
		DateTo     string `schema:"to_date"`
		Section    string `schema:"section"`
		Trader     string `schema:"trader"`
		League     int    `schema:"league_id"`
		HistOrPost string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListTraderPerformance(p.DateFrom, p.DateTo, p.Section, p.Trader, p.League, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
