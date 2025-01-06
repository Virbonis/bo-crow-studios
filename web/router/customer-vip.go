package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPICustomerVIP() {
	Base.HandleFunc("/customer-vip", listCustomerVIP).Methods(http.MethodGet)
	Base.HandleFunc("/customer-vip-compliance", listCustomerVIPCompliance).Methods(http.MethodGet)
	// Base.HandleFunc("/customer-vip/list-code", listVIPCode).Methods(http.MethodGet)
}

func listCustomerVIP(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BranchID    string `schema:"branch_id"`
		VIPCode     int    `schema:"vip_code"`
		OrderBy     string `schema:"order_by"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
		LogDate     string `schema:"log_date"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, resultSummary, total, err := database.ListCustomerVIP(p.BranchID, p.VIPCode, p.OrderBy, p.CurrentPage, p.PageSize, p.LogDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	type Result struct {
		Result        interface{} `json:"result"`
		Total         int         `json:"total"`
		ResultSummary interface{} `json:"result_summary"`
	}
	res := Result{result, total, resultSummary}
	writeJSON(w, statusSuccess, res)
}

func listCustomerVIPCompliance(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate    string `schema:"from_date"`
		ToDate      string `schema:"to_date"`
		BranchID    string `schema:"branch_id"`
		VIPCode     int    `schema:"vip_code"`
		OrderBy     string `schema:"order_by"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, total, err := database.ListCustomerVIPCompliance(p.FromDate, p.ToDate, p.BranchID, p.VIPCode, p.OrderBy, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res := model.ResultWithTotal{Result: result, Total: total}

	writeJSON(w, statusSuccess, res)
}

// func listVIPCode(w http.ResponseWriter, r *http.Request) {
// 	userSession, _ := session.GetRouterUserSession(r)
// 	userInfo := userSession.User
// 	stampUser := userInfo.Username

// 	result := database.ListVIPCode(stampUser)
// 	writeJSON(w, statusSuccess, result)
// }
