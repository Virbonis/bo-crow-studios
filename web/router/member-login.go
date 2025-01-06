package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMemberLogin() {
	Base.HandleFunc("/member-login", listMemberLogin).Methods(http.MethodGet)
}

func listMemberLogin(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		LoginDateFrom string `schema:"login_date_from"`
		LoginDateTo   string `schema:"login_date_to"`
		BranchId      string `schema:"branch_id"`
		Username      string `schema:"username"`
		CustomerType  string `schema:"customer_type"`
		IpAddress     string `schema:"ip_address"`
		CurrentPage   int    `schema:"current_page"`
		PageSize      int    `schema:"page_size"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, total, err := database.ListMemberLogin(p.LoginDateFrom, p.LoginDateTo, p.BranchId, p.Username, p.CustomerType, p.IpAddress, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res := model.ResultWithTotal{Result: result, Total: total}

	writeJSON(w, statusSuccess, res)
}
