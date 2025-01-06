package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPITotalBetAccount() {
	Base.HandleFunc("/total-bet-account", listSummaryTotalBetAccount).Methods(http.MethodGet)
}

func listSummaryTotalBetAccount(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateFrom string `schema:"date_from"`
		DateTo   string `schema:"date_to"`
	}

	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, totalPlayer, err := database.ListSummaryTotalBetAccount(p.DateFrom, p.DateTo, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res := model.ResultWithTotal{Result: result, Total: totalPlayer}

	writeJSON(w, statusSuccess, res)
}
