package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIAudit() {
	Base.HandleFunc("/audit", listAudit).Methods(http.MethodGet)
	Base.HandleFunc("/audit/task", listAuditTask).Methods(http.MethodGet)
}

func listAudit(w http.ResponseWriter, r *http.Request) {
	var p struct {
		DateStart  string `schema:"date_start"`
		DateEnd    string `schema:"date_end"`
		SeverityID int    `schema:"severity_id"`
		SourceName string `schema:"source_name"`
		TaskName   string `schema:"task_name"`
		MatchID    string `schema:"match_id"`
		Username   string `schema:"username"`
		Page       int    `schema:"page"`
		Display    int    `schema:"display"`
		Hist       bool   `schema:"hist"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, total, err := database.ListAudit("0", "", p.DateStart, p.DateEnd, p.SeverityID, p.SourceName, p.TaskName, p.Username, p.Page, p.Display, p.MatchID, p.Hist, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, model.ResultWithTotal{
		Total:  total,
		Result: result,
	})
}

func listAuditTask(w http.ResponseWriter, r *http.Request) {
	var p struct {
		SourceName string `schema:"source_name"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	if p.SourceName == "tsubasa-admin" {
		p.SourceName = "sbadmin"
	} else if p.SourceName == "tsubasa-admin-mc" {
		p.SourceName = "sbop"
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListAuditTask(p.SourceName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
