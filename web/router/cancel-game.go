package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPICancelGame() {
	Base.HandleFunc("/cancel-game", listCancelGame).Methods(http.MethodGet)
	Base.HandleFunc("/cancel-game", updateCancelGame).Methods(http.MethodPut)
}

func listCancelGame(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		ReportType int    `schema:"report_type"`
		DateFrom   string `schema:"date_from"`
		DateTo     string `schema:"date_to"`
		BranchID   string `schema:"branch_id"`
		RequestIDs string `schema:"request_ids"`
	}

	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListCancelGame(p.ReportType, p.DateFrom, p.DateTo, p.BranchID, p.RequestIDs, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func updateCancelGame(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		RowID      int `json:"row_id"`
		UpdateType int `json:"update_type"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateCancelGame(p.RowID, p.UpdateType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
