package router

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/gorilla/mux"
)

func RegisterAPIPermission() {
	Base.HandleFunc("/permission", listPermission).Methods(http.MethodGet)
	Base.HandleFunc("/permission", createPermission).Methods(http.MethodPost)
	Base.HandleFunc("/permission/{id}", updatePermission).Methods(http.MethodPut)
	Base.HandleFunc("/permission/{id}", deletePermission).Methods(http.MethodDelete)
}

func listPermission(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListPermission(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func createPermission(w http.ResponseWriter, r *http.Request) {
	var p struct {
		Code          string `json:"code"`
		Description   string `json:"description"`
		Group         string `json:"group"`
		SeqNo         int    `json:"seq_no"`
		IsForOperator bool   `json:"is_for_operator"`
		IsForAdmin    bool   `json:"is_for_admin"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.CreatePermission(p.Code, p.Description, p.Group, p.SeqNo, p.IsForOperator, p.IsForAdmin, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updatePermission(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	permissionID, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		Code          string `json:"code"`
		Description   string `json:"description"`
		Group         string `json:"group"`
		SeqNo         int    `json:"seq_no"`
		IsForOperator bool   `json:"is_for_operator"`
		IsForAdmin    bool   `json:"is_for_admin"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdatePermission(permissionID, p.Code, p.Description, p.Group, p.SeqNo, p.IsForOperator, p.IsForAdmin, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func deletePermission(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	permissionID, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.DeletePermission(permissionID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
