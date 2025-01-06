package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPINegativeBalance() {
	Base.HandleFunc("/negative-balance", listNegativeBalance).Methods(http.MethodGet)
}

func listNegativeBalance(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID  int    `schema:"match_id"`
		Username string `schema:"username"`
		BranchID string `schema:"branch_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, total, err := database.ListNegativeBalance(p.MatchID, p.Username, p.BranchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res := model.ResultWithTotal{Result: result, Total: total}

	writeJSON(w, statusSuccess, res)
}
