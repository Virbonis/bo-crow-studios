package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIOperatorSetting() {
	Base.HandleFunc("/operator-setting", listOperatorSetting).Methods(http.MethodGet)
	Base.HandleFunc("/operator-setting", updateOperatorSetting).Methods(http.MethodPut)
}

func listOperatorSetting(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	res, err := database.ListOperatorSetting(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func updateOperatorSetting(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		OperatorID        string `json:"operator_id"`
		OddsType          int    `json:"odds_type"`
		DefaultLanguage   string `json:"default_language"`
		SupportedLanguage string `json:"supported_language"`
		PortalURL         string `json:"portal_url"`
		IsSubDomain       bool   `json:"is_sub_domain"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateOperatorSetting(p.OperatorID, p.OddsType, p.DefaultLanguage, p.SupportedLanguage, p.PortalURL, p.IsSubDomain, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cache.DeleteOperator(p.OperatorID)
	writeJSON(w, statusSuccess, "OK")
}
