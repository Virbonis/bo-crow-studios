package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPISpecialCode() {
	Base.HandleFunc("/special-code/select", listSelectSpecialCode).Methods(http.MethodGet)
	Base.HandleFunc("/special-code/selectbysport", listSpecialCodeBySportID).Methods(http.MethodGet)
}

func listSelectSpecialCode(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	res, err := database.ListSelectSpecialCode(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func listSpecialCodeBySportID(w http.ResponseWriter, r *http.Request) {
	var p struct {
		SportID int `schema:"sport_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListSpecialCodeBySportID(p.SportID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
