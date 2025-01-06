package router

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIFlag() {
	Base.HandleFunc("/flag/select", listSelectFlag).Methods(http.MethodGet)
	Base.HandleFunc("/flag", listFlag).Methods(http.MethodGet)
	Base.HandleFunc("/flag", createFlag).Methods(http.MethodPost)
	Base.HandleFunc("/flag", updateFlag).Methods(http.MethodPut)
}

func listSelectFlag(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	res, err := database.ListSelectFlag(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listFlag(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FlagName    string `schema:"flag_name"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListFlag(p.FlagName, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	retVal := model.ResultWithTotal{Total: total, Result: res}
	writeJSON(w, statusSuccess, retVal)
}

func createFlag(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FlagName   string `json:"flag_name"`
		FlagSource string `json:"flag_source"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	flagID, err := database.CreateFlag(p.FlagName, p.FlagSource, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	cache.DeleteFlag(strconv.Itoa(flagID))
	writeJSON(w, statusSuccess, 0)
}

func updateFlag(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FlagID     int    `json:"flag_id"`
		FlagName   string `json:"flag_name"`
		FlagSource string `json:"flag_source"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateFlag(p.FlagID, p.FlagName, p.FlagSource, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	cache.DeleteFlag(strconv.Itoa(p.FlagID))

	writeJSON(w, statusSuccess, 0)
}
