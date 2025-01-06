package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPISBPlatformSummary() {
	Base.HandleFunc("/sb-platform-summary", listSBPlatformSummary).Methods(http.MethodGet)

}

func listSBPlatformSummary(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TransDateFrom string `schema:"trans_date_from"`
		TransDateTo   string `schema:"trans_date_to"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListSBPlatformSummary(p.TransDateFrom, p.TransDateTo, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
