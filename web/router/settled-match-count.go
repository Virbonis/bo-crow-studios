package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPISettledMatchCount() {
	Base.HandleFunc("/settled-match-count", listSettledMatchCount).Methods(http.MethodGet)
}

func listSettledMatchCount(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListSettledMatchCount(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
