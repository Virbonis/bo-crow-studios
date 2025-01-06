package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMemberWinloss() {
	Base.HandleFunc("/member-winloss", getListMemberWinloss).Methods(http.MethodGet)
	Base.HandleFunc("/member-winloss/detail", getListMemberWinlossDetail).Methods(http.MethodGet)
}

func getListMemberWinloss(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userTeamID := userInfo.UserTeamID

	var p struct {
		GLDateFrom  string `schema:"gl_date_from"`
		GLDateTo    string `schema:"gl_date_to"`
		Username    string `schema:"username"`
		BranchID    string `schema:"branch_id"`
		UserTeam    int    `schema:"user_team"`
		VIPCode     int    `schema:"vip_code"`
		MatchID     int    `schema:"match_id"`
		GameType    int    `schema:"game_type"`
		STLive      string `schema:"st_live"`
		Param2      string `schema:"param2"`
		Param3      string `schema:"param3"`
		Param4      string `schema:"param4"`
		Param5      string `schema:"param5"`
		OrderBy     string `schema:"order_by"`
		SportID     string `schema:"sport_id"`
		LeagueID    int    `schema:"league_id"`
		Currency    string `schema:"currency"`
		TxnType     string `schema:"txn_type"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
		Product     string `schema:"product"`
		ReportType  string `schema:"report_type"`
		HistOrPost  string `schema:"hist_or_post"`
	}

	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	if p.SportID == "-99" { // normalize sportid
		p.SportID = ""
	}
	result, resultHeader, totalRecords, err := database.ListMemberWinloss(p.GLDateFrom, p.GLDateTo, p.Username, p.BranchID, p.UserTeam, p.VIPCode, p.Param2, p.Param3, p.Param4, p.Param5, p.OrderBy, p.HistOrPost, p.MatchID, p.GameType, p.STLive, p.SportID, p.LeagueID, userTeamID, p.Currency, p.TxnType, p.CurrentPage, p.PageSize, p.Product, p.ReportType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	type ResultWithHeader struct {
		Result       interface{} `json:"result,omitempty"`
		ResultHeader interface{} `json:"result_header,omitempty"`
		TotalRecords int         `json:"total"`
	}

	var res = ResultWithHeader{Result: result, ResultHeader: resultHeader, TotalRecords: totalRecords}

	writeJSON(w, statusSuccess, res)
}

func getListMemberWinlossDetail(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userTeamID := userInfo.UserTeamID

	var p struct {
		GLDateFrom  string `schema:"gl_date_from"`
		GLDateTo    string `schema:"gl_date_to"`
		Username    string `schema:"username"`
		BranchID    string `schema:"branch_id"`
		UserTeam    int    `schema:"user_team"`
		VIPCode     int    `schema:"vip_code"`
		MatchID     int    `schema:"match_id"`
		GameType    int    `schema:"game_type"`
		STLive      string `schema:"st_live"`
		Param2      string `schema:"param2"`
		Param3      string `schema:"param3"`
		Param4      string `schema:"param4"`
		Param5      string `schema:"param5"`
		OrderBy     string `schema:"order_by"`
		SportID     string `schema:"sport_id"`
		LeagueID    int    `schema:"league_id"`
		Currency    string `schema:"currency"`
		TxnType     string `schema:"txn_type"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
		Product     string `schema:"product"`
		ReportType  string `schema:"report_type"`
		HistOrPost  string `schema:"hist_or_post"`
	}

	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	if p.SportID == "-99" { // normalize sportid
		p.SportID = ""
	}

	result, summary, totalRecords, err := database.ListMemberWinlossDetail(p.GLDateFrom, p.GLDateTo, p.Username, p.BranchID, p.UserTeam, p.VIPCode, p.Param2, p.Param3, p.Param4, p.Param5, p.OrderBy, p.HistOrPost, p.MatchID, p.GameType, p.STLive, p.SportID, p.LeagueID, userTeamID, p.Currency, p.TxnType, p.CurrentPage, p.PageSize, p.Product, p.ReportType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	type ResultWithHeader struct {
		Result       interface{} `json:"result"`
		Summary      interface{} `json:"summary"`
		TotalRecords int         `json:"total"`
	}

	var res = ResultWithHeader{Result: result, Summary: summary, TotalRecords: totalRecords}

	writeJSON(w, statusSuccess, res)
}
