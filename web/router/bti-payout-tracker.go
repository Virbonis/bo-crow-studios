package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIBTIPayoutTracker() {
	Base.HandleFunc("/bti-payout-tracker", listBTIPayoutTracker).Methods(http.MethodGet)
}
func listBTIPayoutTracker(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BetID      int    `schema:"bet_id"`
		PurchaseID string `schema:"purchase_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	// fix for empty purchase_id
	if p.PurchaseID == "" {
		p.PurchaseID = "0"
	}

	res, err := database.ListBTIPayoutTracker(p.BetID, p.PurchaseID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
