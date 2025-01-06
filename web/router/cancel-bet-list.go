package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIReportCancelBetList() {
	Base.HandleFunc("/cancel-bet-list", listCancelBet).Methods(http.MethodGet)
	Base.HandleFunc("/cancel-bet-list/user", listCancelBetUser).Methods(http.MethodGet)
}

func listCancelBet(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	type Params struct {
		Branch   string `schema:"branch_id"`
		Currency string `schema:"currency"`
		UserName string `schema:"username"`
		// Lang     string `schema:"lang"`
		// BaseCurr string `schema:"basecurr"`
	}

	var p Params
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListCancelBet(p.Branch, p.Currency, p.UserName, "en", "Y", stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listCancelBetUser(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	type Params struct {
		Branch   string `schema:"branch_id"`
		Currency string `schema:"currency"`
		Lang     string `schema:"lang"`
		BaseCurr string `schema:"basecurr"`
	}

	var p Params
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result, err := database.ListCancelBetUser(p.Branch, p.Currency, p.Lang, p.BaseCurr, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
