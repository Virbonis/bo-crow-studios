package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIBreakdownWinloss() {
	Base.HandleFunc("/breakdown-winloss", getListBreakdownWinloss).Methods(http.MethodGet)
	Base.HandleFunc("/breakdown-winloss-user-team", getListBreakdownWinlossUT).Methods(http.MethodGet)
	Base.HandleFunc("/breakdown-winloss/bet-detail", getListBreakdownWinlossBetDetail).Methods(http.MethodGet)
	Base.HandleFunc("/breakdown-winloss/date-export", getListExportBreakdownWinlossBetDetailDate).Methods(http.MethodGet)
}

func getListBreakdownWinloss(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		GLDateFrom string `schema:"gl_date_from"`
		GLDateTo   string `schema:"gl_date_to"`
		ReportType string `schema:"report_type"`
		MatchID    int    `schema:"match_id"`
		BranchID   string `schema:"branch_id"`

		UserTeam     int    `schema:"user_team"`
		GameType     int    `schema:"game_type"`
		SportID      int    `schema:"sport_id"`
		LeagueID     int    `schema:"league_id"`
		SpecialMatch string `schema:"special_match"`

		Competition string `schema:"competition"`
		Product     string `schema:"product"`

		STLive     string `schema:"st_live"`
		Currency   string `schema:"currency"`
		TxnType    string `schema:"txn_type"`
		PriceGroup int    `schema:"price_group"`

		Draw               int    `schema:"draw"`
		IncludeMemberCount int    `schema:"include_member_count"`
		HistOrPost         string `schema:"hist_or_post"`
	}

	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, resultSingleParlay, resultComboParlay, totalMember, err := database.ListBreakdownWinloss(
		p.GLDateFrom, p.GLDateTo, p.BranchID, p.UserTeam, p.Draw,
		p.HistOrPost, p.MatchID, p.GameType, p.STLive, p.SportID,
		p.LeagueID, p.IncludeMemberCount, p.SpecialMatch, userInfo.UserTeamID,
		p.Currency, p.TxnType, p.Competition, p.PriceGroup, p.Product, p.ReportType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	type ResultWithMember struct {
		Result             interface{} `json:"result,omitempty"`
		ResultSingleParlay interface{} `json:"result_single_parlay,omitempty"`
		ResultComboParlay  interface{} `json:"result_combo_parlay,omitempty"`
		TotalMember        int         `json:"total_member"`
	}

	var res = ResultWithMember{Result: result, ResultSingleParlay: resultSingleParlay, ResultComboParlay: resultComboParlay, TotalMember: totalMember}

	writeJSON(w, statusSuccess, res)
}

func getListBreakdownWinlossUT(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userTeamID := userInfo.UserTeamID
	userTeamSubID := userInfo.UserTeamSubID

	var p struct {
		GLDateFrom         string `schema:"gl_date_from"`
		GLDateTo           string `schema:"gl_date_to"`
		BranchID           string `schema:"branch_id"`
		UserTeam           int    `schema:"user_team"`
		Draw               int    `schema:"draw"`
		FIDUserTeam        int    `schema:"fid_user_team"`
		MatchID            int    `schema:"match_id"`
		GameType           int    `schema:"game_type"`
		STLive             string `schema:"st_live"`
		SportID            int    `schema:"sport_id"`
		LeagueID           int    `schema:"league_id"`
		IncludeMemberCount int    `schema:"include_member_count"`
		SpecialMatch       string `schema:"special_match"`
		Param2             int    `schema:"param2"`
		Param3             int    `schema:"param3"`
		Param4             int    `schema:"param4"`
		Param5             int    `schema:"param5"`
		Currency           string `schema:"currency"`
		TxnType            string `schema:"txn_type"`
		Competition        string `schema:"competition"`
		PriceGroup         int    `schema:"price_group"`
		Product            string `schema:"product"`
		ReportType         string `schema:"report_type"`
		HistOrPost         string `schema:"hist_or_post"`
	}

	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, resultHeader, totalMember, err := database.ListBreakdownWinlossUT(p.GLDateFrom, p.GLDateTo, p.BranchID, p.UserTeam, p.Draw, p.FIDUserTeam, p.HistOrPost, p.MatchID, p.GameType, p.STLive, p.SportID, p.LeagueID, p.IncludeMemberCount, p.SpecialMatch, userTeamID, p.Param2, p.Param3, p.Param4, p.Param5, userTeamSubID, p.Currency, p.TxnType, p.Competition, p.PriceGroup, p.Product, p.ReportType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	type ResultWithMember struct {
		Result       interface{} `json:"result"`
		ResultHeader interface{} `json:"result_header"`
		TotalMember  int         `json:"total_member"`
	}

	var res = ResultWithMember{Result: result, ResultHeader: resultHeader, TotalMember: totalMember}

	writeJSON(w, statusSuccess, res)
}

func getListBreakdownWinlossBetDetail(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userTeamID := userInfo.UserTeamID
	userTeamSubID := userInfo.UserTeamSubID

	var p struct {
		GLDateFrom         string `schema:"gl_date_from"`
		GLDateTo           string `schema:"gl_date_to"`
		BranchID           string `schema:"branch_id"`
		UserTeam           int    `schema:"user_team"`
		Draw               int    `schema:"draw"`
		FIDUserTeam        int    `schema:"fid_user_team"`
		MatchID            int    `schema:"match_id"`
		GameType           int    `schema:"game_type"`
		STLive             string `schema:"st_live"`
		SportID            int    `schema:"sport_id"`
		LeagueID           int    `schema:"league_id"`
		IncludeMemberCount int    `schema:"include_member_count"`
		SpecialMatch       string `schema:"special_match"`
		Param2             int    `schema:"param2"`
		Param3             int    `schema:"param3"`
		Param4             int    `schema:"param4"`
		Param5             int    `schema:"param5"`
		Currency           string `schema:"currency"`
		TxnType            string `schema:"txn_type"`
		Competition        string `schema:"competition"`
		PriceGroup         int    `schema:"price_group"`
		Product            string `schema:"product"`
		ReportType         string `schema:"report_type"`
		CurrentPage        int    `schema:"current_page"`
		PageSize           int    `schema:"page_size"`
		OrderBy            string `schema:"order_by"`
		HistOrPost         string `schema:"hist_or_post"`
	}

	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, summary, totalRecords, err := database.ListBreakdownWinlossBetDetail(p.GLDateFrom, p.GLDateTo, p.BranchID, p.UserTeam, p.Draw, p.FIDUserTeam, p.HistOrPost, p.MatchID, p.GameType, p.STLive, p.SportID, p.LeagueID, userTeamID, p.Param2, p.Param3, p.Param4, p.Param5, userTeamSubID, p.Currency, p.TxnType, p.Competition, p.PriceGroup, p.CurrentPage, p.PageSize, p.Product, p.ReportType, p.SpecialMatch, p.OrderBy, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	type ResultWithMember struct {
		Result       interface{} `json:"result"`
		Summary      interface{} `json:"summary"`
		TotalRecords int         `json:"total"`
	}

	var res = ResultWithMember{Result: result, Summary: summary, TotalRecords: totalRecords}

	writeJSON(w, statusSuccess, res)
}

func getListExportBreakdownWinlossBetDetailDate(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userTeamID := userInfo.UserTeamID

	var p struct {
		GLDateFrom   string `schema:"gl_date_from"`
		GLDateTo     string `schema:"gl_date_to"`
		BranchID     string `schema:"branch_id"`
		Draw         int    `schema:"draw"`
		UserTeam     int    `schema:"user_team"`
		MatchID      int    `schema:"match_id"`
		GameType     int    `schema:"game_type"`
		STLive       string `schema:"st_live"`
		SportID      int    `schema:"sport_id"`
		OrderBy      string `schema:"order_by"`
		SpecialMatch string `schema:"special_match"`
		Currency     string `schema:"currency"`
		TxnType      string `schema:"txn_type"`
		PriceGroup   int    `schema:"price_group"`
		Competition  string `schema:"competition"`
		Product      string `schema:"product"`
		CurrentPage  int    `schema:"current_page"`
		PageSize     int    `schema:"page_size"`
		HistOrPost   string `schema:"hist_or_post"`
	}

	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, totalRecords, err := database.ListExportBreakdownWinlossBetDetailDate(p.GLDateFrom, p.GLDateTo, p.BranchID, p.Draw, p.UserTeam, p.MatchID, p.GameType, p.STLive, p.SportID, p.OrderBy, p.SpecialMatch, p.Currency, p.TxnType, p.PriceGroup, p.Competition, p.Product, p.CurrentPage, p.PageSize, p.HistOrPost, userTeamID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	type ResultWithMember struct {
		Result       interface{} `json:"result"`
		TotalRecords int         `json:"total"`
	}

	var res = ResultWithMember{Result: result, TotalRecords: totalRecords}

	writeJSON(w, statusSuccess, res)
}
