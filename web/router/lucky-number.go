package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPILuckyNumber() {
	Base.HandleFunc("/lucky-number", listLuckyNumber).Methods(http.MethodGet)
}

func listLuckyNumber(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateFrom string `schema:"date_from"`
		DateTo   string `schema:"date_to"`
		BetId    string `schema:"bet_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListLuckyNumber(p.DateFrom, p.DateTo, p.BetId, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
