package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIUserOnline() {
	Base.HandleFunc("/user-online", listUserOnline).Methods(http.MethodGet)
}

func listUserOnline(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, totalUserOnline, err := database.ListUserOnline(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res := model.ResultWithTotal{Result: result, Total: totalUserOnline}

	writeJSON(w, statusSuccess, res)
}
