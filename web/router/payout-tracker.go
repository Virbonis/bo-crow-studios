package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIPayoutTracker() {
	Base.HandleFunc("/payout-tracker", listPayoutTracker).Methods(http.MethodGet)
}

func listPayoutTracker(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateFrom         string `schema:"date_from"`
		DateTo           string `schema:"date_to"`
		IsSettlementDate bool   `schema:"is_settlement_date"`
		BetID            int    `schema:"bet_id"`
		MemberID         string `schema:"member_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListPayoutTracker(p.DateFrom, p.DateTo, p.IsSettlementDate, p.BetID, p.MemberID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
