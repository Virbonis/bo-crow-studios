package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPILedger() {
	Base.HandleFunc("/ledger-main", ListReportLedgerMain).Methods(http.MethodGet)
	Base.HandleFunc("/ledger-main/shareholder-cash", ListReportLedgerMainShareholderCash).Methods(http.MethodGet)
	Base.HandleFunc("/ledger-main/member", ListReportLedgerMainMember).Methods(http.MethodGet)
	Base.HandleFunc("/ledger-avg", ListReportLedgerAverage).Methods(http.MethodGet)
	Base.HandleFunc("/ledger-avg/shareholder-cash", ListReportLedgerAvgShareholderCash).Methods(http.MethodGet)
	Base.HandleFunc("/ledger-avg/member", ListReportLedgerAvgMember).Methods(http.MethodGet)
	Base.HandleFunc("/ledger-new", ListReportLedgerNew).Methods(http.MethodGet)
	Base.HandleFunc("/ledger-new/shareholder-cash", ListReportLedgerNewShareholderCash).Methods(http.MethodGet)
	Base.HandleFunc("/ledger-new/member", ListReportLedgerNewMember).Methods(http.MethodGet)
	Base.HandleFunc("/ledger-breakdown", ListReportLedgerBreakdown).Methods(http.MethodGet)
	Base.HandleFunc("/ledger-detail", ListReportBetDetail).Methods(http.MethodGet)
}

func ListReportLedgerMain(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate      string `schema:"from_date"`
		ToDate        string `schema:"to_date"`
		CustomerType  string `schema:"customer_type"`
		Branch        string `schema:"branch_id"`
		GameType      int    `schema:"game_type"`
		SportID       int    `schema:"sport_id"`
		VIP           string `schema:"vip_code"`
		Currency      string `schema:"currency"`
		Draw          int    `schema:"draw"`
		ShareholderID string `schema:"shareholder_id"`
		SSMAID        string `schema:"ssma_id"`
		SMAID         string `schema:"sma_id"`
		Username      string `schema:"username"`
		HistOrPost    string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListReportLedgerMain(p.FromDate, p.ToDate, p.CustomerType, p.Branch, p.GameType, p.SportID, p.VIP, p.Currency, p.Draw, p.ShareholderID, p.SSMAID, p.SMAID, p.Username, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func ListReportLedgerMainShareholderCash(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate      string `schema:"from_date"`
		ToDate        string `schema:"to_date"`
		CustomerType  string `schema:"customer_type"`
		Branch        string `schema:"branch_id"`
		GameType      int    `schema:"game_type"`
		SportID       int    `schema:"sport_id"`
		VIP           string `schema:"vip_code"`
		Currency      string `schema:"currency"`
		Draw          int    `schema:"draw"`
		ShareholderID string `schema:"shareholder_id"`
		SSMAID        string `schema:"ssma_id"`
		SMAID         string `schema:"sma_id"`
		Username      string `schema:"username"`
		HistOrPost    string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListReportLedgerMainShareholderCash(p.FromDate, p.ToDate, p.CustomerType, p.Branch, p.GameType, p.SportID, p.VIP, p.Currency, p.Draw, p.ShareholderID, p.SSMAID, p.SMAID, p.Username, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func ListReportLedgerMainMember(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate      string `schema:"from_date"`
		ToDate        string `schema:"to_date"`
		CustomerType  string `schema:"customer_type"`
		Branch        string `schema:"branch_id"`
		GameType      int    `schema:"game_type"`
		SportID       int    `schema:"sport_id"`
		VIP           string `schema:"vip_code"`
		Currency      string `schema:"currency"`
		Draw          int    `schema:"draw"`
		ShareholderID string `schema:"shareholder_id"`
		AgentID       string `schema:"agent_id"`
		Username      string `schema:"username"`
		HistOrPost    string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListReportLedgerMainMember(p.FromDate, p.ToDate, p.CustomerType, p.Branch, p.GameType, p.SportID, p.VIP, p.Currency, p.Draw, p.ShareholderID, p.AgentID, p.Username, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func ListReportLedgerAverage(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate      string `schema:"from_date"`
		ToDate        string `schema:"to_date"`
		CustomerType  string `schema:"customer_type"`
		Branch        string `schema:"branch_id"`
		GameType      int    `schema:"game_type"`
		SportID       int    `schema:"sport_id"`
		VIP           string `schema:"vip_code"`
		Currency      string `schema:"currency"`
		Draw          int    `schema:"draw"`
		ShareholderID string `schema:"shareholder_id"`
		SSMAID        string `schema:"ssma_id"`
		SMAID         string `schema:"sma_id"`
		Username      string `schema:"username"`
		HistOrPost    string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListReportLedgerAverage(p.FromDate, p.ToDate, p.CustomerType, p.Branch, p.GameType, p.SportID, p.VIP, p.Currency, p.Draw, p.ShareholderID, p.SSMAID, p.SMAID, p.Username, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func ListReportLedgerAvgShareholderCash(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate      string `schema:"from_date"`
		ToDate        string `schema:"to_date"`
		CustomerType  string `schema:"customer_type"`
		Branch        string `schema:"branch_id"`
		GameType      int    `schema:"game_type"`
		SportID       int    `schema:"sport_id"`
		VIP           string `schema:"vip_code"`
		Currency      string `schema:"currency"`
		Draw          int    `schema:"draw"`
		ShareholderID string `schema:"shareholder_id"`
		SSMAID        string `schema:"ssma_id"`
		SMAID         string `schema:"sma_id"`
		Username      string `schema:"username"`
		HistOrPost    string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListReportLedgerAvgShareholderCash(p.FromDate, p.ToDate, p.CustomerType, p.Branch, p.GameType, p.SportID, p.VIP, p.Currency, p.Draw, p.ShareholderID, p.SSMAID, p.SMAID, p.Username, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func ListReportLedgerAvgMember(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate      string `schema:"from_date"`
		ToDate        string `schema:"to_date"`
		CustomerType  string `schema:"customer_type"`
		Branch        string `schema:"branch_id"`
		GameType      int    `schema:"game_type"`
		SportID       int    `schema:"sport_id"`
		VIP           string `schema:"vip_code"`
		Currency      string `schema:"currency"`
		Draw          int    `schema:"draw"`
		ShareholderID string `schema:"shareholder_id"`
		AgentID       string `schema:"agent_id"`
		Username      string `schema:"username"`
		HistOrPost    string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListReportLedgerAvgMember(p.FromDate, p.ToDate, p.CustomerType, p.Branch, p.GameType, p.SportID, p.VIP, p.Currency, p.Draw, p.ShareholderID, p.AgentID, p.Username, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func ListReportLedgerNew(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate      string `schema:"from_date"`
		ToDate        string `schema:"to_date"`
		CustomerType  string `schema:"customer_type"`
		Branch        string `schema:"branch_id"`
		GameType      int    `schema:"game_type"`
		SportID       int    `schema:"sport_id"`
		VIP           string `schema:"vip_code"`
		Currency      string `schema:"currency"`
		Draw          int    `schema:"draw"`
		ShareholderID string `schema:"shareholder_id"`
		SSMAID        string `schema:"ssma_id"`
		SMAID         string `schema:"sma_id"`
		Username      string `schema:"username"`
		HistOrPost    string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListReportLedgerNew(p.FromDate, p.ToDate, p.CustomerType, p.Branch, p.GameType, p.SportID, p.VIP, p.Currency, p.Draw, p.ShareholderID, p.SSMAID, p.SMAID, p.Username, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func ListReportLedgerNewShareholderCash(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate      string `schema:"from_date"`
		ToDate        string `schema:"to_date"`
		CustomerType  string `schema:"customer_type"`
		Branch        string `schema:"branch_id"`
		GameType      int    `schema:"game_type"`
		SportID       int    `schema:"sport_id"`
		VIP           string `schema:"vip_code"`
		Currency      string `schema:"currency"`
		Draw          int    `schema:"draw"`
		BetAdj        string `schema:"bet_adj"`
		ShareholderID string `schema:"shareholder_id"`
		SSMAID        string `schema:"ssma_id"`
		SMAID         string `schema:"sma_id"`
		Username      string `schema:"username"`
		HistOrPost    string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListReportLedgerNewShareholderCash(p.FromDate, p.ToDate, p.CustomerType, p.Branch, p.GameType, p.SportID, p.VIP, p.Currency, p.Draw, p.BetAdj, p.ShareholderID, p.SSMAID, p.SMAID, p.Username, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func ListReportLedgerNewMember(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate      string `schema:"from_date"`
		ToDate        string `schema:"to_date"`
		CustomerType  string `schema:"customer_type"`
		Branch        string `schema:"branch_id"`
		GameType      int    `schema:"game_type"`
		SportID       int    `schema:"sport_id"`
		VIP           string `schema:"vip_code"`
		Currency      string `schema:"currency"`
		Draw          int    `schema:"draw"`
		ShareholderID string `schema:"shareholder_id"`
		AgentID       string `schema:"agent_id"`
		Username      string `schema:"username"`
		BetAdj        string `schema:"bet_adj"`
		HistOrPost    string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListReportLedgerNewMember(p.FromDate, p.ToDate, p.CustomerType, p.Branch, p.GameType, p.SportID, p.VIP, p.Currency, p.Draw, p.ShareholderID, p.AgentID, p.Username, p.BetAdj, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func ListReportLedgerBreakdown(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userTeamID := userInfo.UserTeamID

	var p struct {
		FromDate      string `schema:"from_date"`
		ToDate        string `schema:"to_date"`
		CustomerType  string `schema:"customer_type"`
		Branch        string `schema:"branch_id"`
		GameType      int    `schema:"game_type"`
		SportID       int    `schema:"sport_id"`
		VIP           string `schema:"vip_code"`
		Currency      string `schema:"currency"`
		Draw          int    `schema:"draw"`
		ShareholderID string `schema:"shareholder_id"`
		SSMAID        string `schema:"ssma_id"`
		SMAID         string `schema:"sma_id"`
		Username      string `schema:"username"`
		// CurrentPage   int    `schema:"current_page"`
		// PageSize      int    `schema:"page_size"`
		ReportType string `schema:"report_type"`
		HistOrPost string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, total, err := database.ListReportLedgerBreakdown(p.FromDate, p.ToDate, p.CustomerType, p.Branch, p.GameType, p.SportID, p.VIP, p.Currency, p.Draw, p.ShareholderID, p.SSMAID, p.SMAID, p.Username, p.ReportType, p.HistOrPost, userTeamID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}

	writeJSON(w, statusSuccess, resultWithTotal)
}

func ListReportBetDetail(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userTeamID := userInfo.UserTeamID

	var p struct {
		GLDateFrom   string `schema:"from_date"`
		GLDateTo     string `schema:"to_date"`
		CustomerType string `schema:"customer_type"`
		Branch       string `schema:"branch_id"`
		Gametype     int    `schema:"game_type"`
		SportID      int    `schema:"sport_id"`
		VIP          string `schema:"vip_code"`
		Currency     string `schema:"currency"`
		Draw         int    `schema:"draw"`

		LeagueID    int    `schema:"league_id"`
		MatchID     int    `schema:"match_id"`
		BetAdj      string `schema:"bet_adj"`
		Username    string `schema:"username"`
		Status7     string `schema:"status7"`
		OrderBy     string `schema:"order_by"`
		STLive      string `schema:"st_live"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
		ReportType  string `schema:"report_type"`
		HistOrPost  string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, summary, total, err := database.ListReportBetDetail(p.GLDateFrom, p.GLDateTo, p.CustomerType, p.Branch, p.Gametype, p.SportID, p.VIP, p.Currency, p.Draw, p.LeagueID, p.MatchID, p.BetAdj, p.Username, p.Status7, p.OrderBy, p.STLive, p.CurrentPage, p.PageSize, p.ReportType, p.HistOrPost, userTeamID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	type Result struct {
		Data    []model.ReportLedgerBetDetail `json:"result"`
		Summary *model.GrandTotalBetDetail    `json:"summary"`
		Total   int                           `json:"total"`
	}

	result := Result{Data: res, Summary: summary, Total: total}
	writeJSON(w, statusSuccess, result)
}
