package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMemberPendingFunds() {
	Base.HandleFunc("/pending-funds", listMemberPendingFunds).Methods(http.MethodGet)
	Base.HandleFunc("/pending-funds/daily-statement", listPFDailyStatement).Methods(http.MethodGet)
	Base.HandleFunc("/pending-funds/bet-summary", listPFBetSummary).Methods(http.MethodGet)
	Base.HandleFunc("/pending-funds/bet-list", listPFBetList).Methods(http.MethodGet)
	Base.HandleFunc("/pending-funds/bet-list-running", listPFBetListRunning).Methods(http.MethodGet)

}

func listMemberPendingFunds(w http.ResponseWriter, r *http.Request) {
	var p struct {
		Branch      string `schema:"branch"`
		Currency    string `schema:"currency"`
		BaseCurr    string `schema:"base_curr"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, summary, total, err := database.ListMemberPendingFunds(p.Branch, p.Currency, "en", p.BaseCurr, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	type ReportSummaryTotal struct {
		Result  interface{} `json:"result"`
		Total   int         `json:"total"`
		Summary interface{} `json:"summary"`
	}

	res := ReportSummaryTotal{Result: result, Summary: summary, Total: total}
	writeJSON(w, statusSuccess, res)
}

func listPFDailyStatement(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		From     string `schema:"from"`
		To       string `schema:"to"`
		Username string `schema:"username"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListPFDailyStatement(p.From, p.To, p.Username, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func listPFBetSummary(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		From     string `schema:"from"`
		To       string `schema:"to"`
		Username string `schema:"username"`
		Branch   string `schema:"branch"`
		Currency string `schema:"currency"`
		BaseCurr string `schema:"base_curr"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListPFBetSummary(p.From, p.To, p.Username, p.Branch, p.Currency, "en", p.BaseCurr, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func listPFBetList(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		From       string `schema:"from"`
		To         string `schema:"to"`
		Username   string `schema:"username"`
		Branch     string `schema:"branch"`
		Currency   string `schema:"currency"`
		BaseCurr   string `schema:"base_curr"`
		ReportType int    `schema:"report_type"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListPFBetList(p.From, p.To, p.Username, p.Branch, p.Currency, "en", p.BaseCurr, p.ReportType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func listPFBetListRunning(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Username string `schema:"username"`
		Branch   string `schema:"branch"`
		Currency string `schema:"currency"`
		BaseCurr string `schema:"base_curr"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListPFBetListRunning(p.Username, p.Branch, p.Currency, "en", p.BaseCurr, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
