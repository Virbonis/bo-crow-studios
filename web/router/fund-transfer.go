package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIFundTransfer() {
	Base.HandleFunc("/fund-transfer", listFundTransfer).Methods(http.MethodGet)
	Base.HandleFunc("/fund-transfer/detail", listFundTransferDetail).Methods(http.MethodGet)
}

func listFundTransfer(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate    string `schema:"from_date"`
		ToDate      string `schema:"to_date"`
		Username    string `schema:"username"`
		BranchID    string `schema:"branch_id"`
		Currency    string `schema:"currency"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
		SortBy      string `schema:"sort_by"`
		AscDesc     string `schema:"asc_desc"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, resultSummary, total, err := database.ListFundTransfer(p.FromDate, p.ToDate, p.Username, p.BranchID, p.Currency, p.CurrentPage, p.PageSize, p.SortBy, p.AscDesc, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	type ResultFundTransfer struct {
		Result  interface{} `json:"result"`
		Summary interface{} `json:"summary"`
		Total   interface{} `json:"total"`
	}

	res := ResultFundTransfer{result, resultSummary, total}

	writeJSON(w, statusSuccess, res)
}

func listFundTransferDetail(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate    string `schema:"from_date"`
		ToDate      string `schema:"to_date"`
		Username    string `schema:"username"`
		BranchID    string `schema:"branch_id"`
		Currency    string `schema:"currency"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
		SortBy      string `schema:"sort_by"`
		AscDesc     string `schema:"asc_desc"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListFundTransferDetail(p.FromDate, p.ToDate, p.Username, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
