package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPICompanyWinloss() {
	Base.HandleFunc("/company-winloss", listCompanyWinloss).Methods(http.MethodGet)
	Base.HandleFunc("/company-winloss-foreign", listCompanyWinlossForeign).Methods(http.MethodGet)
	Base.HandleFunc("/company-winloss/detail", listCompanyWinlossDetail).Methods(http.MethodGet)
}

func listCompanyWinloss(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateFrom          string `schema:"date_from"`
		DateTo            string `schema:"date_to"`
		Username          string `schema:"username"`
		BranchID          string `schema:"branch_id"`
		CurrentPageCash   int    `schema:"current_page_cash"`
		PageSizeCash      int    `schema:"page_size_cash"`
		CurrentPageCredit int    `schema:"current_page_credit"`
		PageSizeCredit    int    `schema:"page_size_credit"`
		HistOrPost        string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cash, credit, totalCash, totalCredit, err := database.ListCompanyWinloss(p.DateFrom, p.DateTo, p.Username, p.BranchID, p.CurrentPageCash, p.PageSizeCash, p.CurrentPageCredit, p.PageSizeCredit, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result := struct {
		Cash        []model.CompanyWinloss `json:"result_cash"`
		Credit      []model.CompanyWinloss `json:"result_credit"`
		TotalCash   int                    `json:"total_cash"`
		TotalCredit int                    `json:"total_credit"`
	}{cash, credit, totalCash, totalCredit}
	writeJSON(w, statusSuccess, result)
}
func listCompanyWinlossForeign(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateFrom          string `schema:"date_from"`
		DateTo            string `schema:"date_to"`
		Username          string `schema:"username"`
		BranchID          string `schema:"branch_id"`
		CurrentPageCash   int    `schema:"current_page_cash"`
		PageSizeCash      int    `schema:"page_size_cash"`
		CurrentPageCredit int    `schema:"current_page_credit"`
		PageSizeCredit    int    `schema:"page_size_credit"`
		HistOrPost        string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cash, credit, totalCash, totalCredit, err := database.ListCompanyWinlossForeign(p.DateFrom, p.DateTo, p.Username, p.BranchID, p.CurrentPageCash, p.PageSizeCash, p.CurrentPageCredit, p.PageSizeCredit, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result := struct {
		Cash        []model.CompanyWinlossForeign `json:"result_cash"`
		Credit      []model.CompanyWinlossForeign `json:"result_credit"`
		TotalCash   int                           `json:"total_cash"`
		TotalCredit int                           `json:"total_credit"`
	}{cash, credit, totalCash, totalCredit}
	writeJSON(w, statusSuccess, result)
}

// detail is shared w/in foreign
func listCompanyWinlossDetail(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateFrom    string `schema:"date_from"`
		DateTo      string `schema:"date_to"`
		Username    string `schema:"username"`
		OrderBy     string `schema:"order_by"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
		HistOrPost  string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListCompanyWinlossDetail(p.DateFrom, p.DateTo, p.Username, p.OrderBy, p.CurrentPage, p.PageSize, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, result)
}
