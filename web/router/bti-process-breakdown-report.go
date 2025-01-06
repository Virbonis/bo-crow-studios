package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIBTIProcessBreakdownReport() {
	Base.HandleFunc("/bti-process-breakdown-report", procBTIProcessBreakdownReport).Methods(http.MethodPost)
}

func procBTIProcessBreakdownReport(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID int    `json:"sport_id"`
		GLDate  string `json:"gl_date"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.ProcBTIProcessBreakdownReport(p.SportID, p.GLDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, 0)
}
