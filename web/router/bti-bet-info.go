package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIBTIBetInfo() {
	Base.HandleFunc("/bti-bet-info", listBTIBetInfo).Methods(http.MethodGet)
}

func listBTIBetInfo(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		ReqDateFrom       string `schema:"req_date_from"`
		ReqDateTo         string `schema:"req_date_to"`
		IsUsingDate       int    `schema:"is_using_date"`
		RequestID         string `schema:"request_id"`
		BetID             string `schema:"bet_id"`
		UserLogin         string `schema:"user_login"`
		MatchID           int    `schema:"match_id"`
		PurchaseID        string `schema:"purchase_id"`
		ReservationStatus int    `schema:"reservation_status"`
		TransStatus       int    `schema:"trans_status"`
	}

	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListBTIBetInfo(p.ReqDateFrom, p.ReqDateTo, p.IsUsingDate, p.RequestID, p.BetID, p.UserLogin, p.MatchID, p.PurchaseID, p.ReservationStatus, p.TransStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
