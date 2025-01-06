package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPITradingRunningBall() {
	Base.HandleFunc("/trading-running-ball", getListTradingRunningBall).Methods(http.MethodGet)
	Base.HandleFunc("/trading-running-ball/popup", getListTradingRunningBallPopUp).Methods(http.MethodGet)
}

func getListTradingRunningBall(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	type ResultWithMember struct {
		Result             interface{} `json:"result"`
		TotalPausedMatches interface{} `json:"total_paused_matches"`
	}
	var res = ResultWithMember{}
	var p struct {
		IsShowInActive   string `schema:"is_show_in_active"`
		IsMatchConfirmed string `schema:"is_match_confirmed"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result, resultPaused, err := database.GetListTradingRunningBall(p.IsShowInActive, p.IsMatchConfirmed, userSession.SessionID, userInfo.TraderGroupORI, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res = ResultWithMember{Result: result, TotalPausedMatches: resultPaused}

	writeJSON(w, statusSuccess, res)
}

func getListTradingRunningBallPopUp(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID        int    `schema:"match_id"`
		IsShowInActive string `schema:"is_show_in_active"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result, err := database.GetListTradingRunningBallPopUp(p.MatchID, p.IsShowInActive, userSession.SessionID, userInfo.TraderGroupORI, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultPendingSummary, err := database.GetListPendingSummary(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultPending, err := database.GetListPAR(p.MatchID, "Pending", userSession.SessionID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultAccept, err := database.GetListPAR(p.MatchID, "Accept", userSession.SessionID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultReject, err := database.GetListPAR(p.MatchID, "Reject", userSession.SessionID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	type ResultWithMember struct {
		Result               interface{} `json:"result"`
		ResultPendingSummary interface{} `json:"result_pending_summary"`
		ResultPending        interface{} `json:"result_pending"`
		ResultAccept         interface{} `json:"result_accept"`
		ResultReject         interface{} `json:"result_reject"`
	}

	var res = ResultWithMember{}
	res = ResultWithMember{Result: result, ResultPendingSummary: resultPendingSummary, ResultPending: resultPending, ResultAccept: resultAccept, ResultReject: resultReject}

	writeJSON(w, statusSuccess, res)
}
