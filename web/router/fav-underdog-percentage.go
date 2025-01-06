package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIFavUnderdogPercentage() {
	Base.HandleFunc("/fav-underdog-percentage", listFavUnderdogPercentage).Methods(http.MethodGet)
}

func listFavUnderdogPercentage(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateFrom   string `schema:"date_from"`
		DateTo     string `schema:"date_to"`
		BranchCode string `schema:"branch_code"`
		Currency   string `schema:"currency"`
		Product    string `schema:"product"`
		SportID    int    `schema:"sport_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListFavUnderdogPercentage(p.DateFrom, p.DateTo, p.BranchCode, p.Currency, p.Product, p.SportID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
