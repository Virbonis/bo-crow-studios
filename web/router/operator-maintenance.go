package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIOperatorMaintenance() {
	Base.HandleFunc("/operator-maintenance", listOperatorMaintenance).Methods(http.MethodGet)
	Base.HandleFunc("/operator-maintenance", middleware.AuthorizationAPIMiddleware(
		updateOperatorMaintenance,
		helper.ALLOWED_TO_SET_OPERATOR_MAINTENANCE)).Methods(http.MethodPut)
}

func listOperatorMaintenance(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	res, err := database.ListOperatorMaintenance(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func updateOperatorMaintenance(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		UpdString string `json:"upd_string"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateOperatorMaintenance(p.UpdString, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cache.DeleteOperatorMaintenance()
	writeJSON(w, statusSuccess, "OK")
}
