package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIBetRequestInfo() {
	Base.HandleFunc("/bet-request-info", getListBetRequestInfo).Methods(http.MethodGet)
}

func getListBetRequestInfo(w http.ResponseWriter, r *http.Request) {

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateFrom         string `schema:"date_from"`
		DateTo           string `schema:"date_to"`
		IsUsingDate      bool   `schema:"is_using_date"`
		UserLogin        string `schema:"user_login"`
		RequestID        string `schema:"request_id"`
		MatchID          int    `schema:"match_id"`
		BetID            string `schema:"bet_id"`
		BetStatus        string `schema:"bet_status"`
		BetConfirm       string `schema:"bet_confirm"`
		PayoutStatus     string `schema:"payout_status"`
		PayoutConfirm    string `schema:"payout_confirm"`
		UnProcessStatus  string `schema:"unprocess_status"`
		UnProcessConfirm string `schema:"unprocess_confirm"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	useDate := "0"
	if p.IsUsingDate {
		useDate = "1"
	}
	res, err := database.GetListBetRequestInfo(p.DateFrom, p.DateTo, useDate, p.UserLogin, p.RequestID, p.MatchID, p.BetID, p.BetStatus, p.BetConfirm, p.PayoutStatus, p.PayoutConfirm, p.UnProcessStatus, p.UnProcessConfirm, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
