package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPICashFlowTracker() {
	Base.HandleFunc("/cash-flow-tracker", listReportCashFlowTracker).Methods(http.MethodGet)
}

func listReportCashFlowTracker(w http.ResponseWriter, r *http.Request) {
	BranchID := ""

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateFrom   string `schema:"date_from"`
		DateTo     string `schema:"date_to"`
		Username   string `schema:"username"`
		RefNo      int    `schema:"ref_no"`
		AffairID   int    `schema:"affair"`
		HistOrPost string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	if p.HistOrPost == "" {
		p.HistOrPost = "_Post"
	}
	rows, err := database.ListReportCashFlowTracker(p.DateFrom, p.DateTo, p.Username, p.RefNo, p.AffairID, BranchID, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, rows)
}
