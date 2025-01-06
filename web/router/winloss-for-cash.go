package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIWinlossForCash() {
	Base.HandleFunc("/winloss-for-cash", listWinlossForCash).Methods(http.MethodGet)
	Base.HandleFunc("/winloss-for-cash/detail", listWinlossForCashDetail).Methods(http.MethodGet)
}

func listWinlossForCash(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		GLDateFrom    string `schema:"gl_date_from"`
		GLDateTo      string `schema:"gl_date_to"`
		Username      string `schema:"username"`
		BranchID      string `schema:"branch_id"`
		GameType      int    `schema:"game_type"`
		SportID       int    `schema:"sport_id"`
		IsGetDownline string `schema:"is_get_downline"`
		CurrentPage   int    `schema:"current_page"`
		PageSize      int    `schema:"page_size"`
		HistOrPost    string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, resSummary, total, err := database.ListWinlossForCash(p.GLDateFrom, p.GLDateTo, p.Username, p.BranchID, p.GameType, p.SportID, p.IsGetDownline, p.CurrentPage, p.PageSize, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	type ResultWithSummary struct {
		Result  interface{} `json:"result"`
		Summary interface{} `json:"summary"`
		Total   int         `json:"total"`
	}
	result := ResultWithSummary{res, resSummary, total}
	writeJSON(w, statusSuccess, result)
}

func listWinlossForCashDetail(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		GLDateFrom  string `schema:"gl_date_from"`
		GLDateTo    string `schema:"gl_date_to"`
		Username    string `schema:"username"`
		BranchID    string `schema:"branch_id"`
		GameType    int    `schema:"game_type"`
		SportID     int    `schema:"sport_id"`
		OrderBy     string `schema:"order_by"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
		HistOrPost  string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, resSummary, total, err := database.ListWinlossForCashBetDetail(p.GLDateFrom, p.GLDateTo, p.Username, p.BranchID, p.GameType, p.SportID, p.OrderBy, p.CurrentPage, p.PageSize, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	type ResultWithSummary struct {
		Result  interface{} `json:"result"`
		Summary interface{} `json:"summary"`
		Total   int         `json:"total"`
	}
	result := ResultWithSummary{res, resSummary, total}
	writeJSON(w, statusSuccess, result)
}
