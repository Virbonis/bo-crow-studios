package router

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/gorilla/mux"
)

func RegisterAPIRole() {
	Base.HandleFunc("/role", listRole).Methods(http.MethodGet)
	Base.HandleFunc("/role", createRole).Methods(http.MethodPost)
	Base.HandleFunc("/role/{id}", updateRole).Methods(http.MethodPut)
	Base.HandleFunc("/role/{id}", middleware.AuthorizationAPIMiddleware(
		deleteRole,
		helper.ALLOWED_TO_DELETE_CREDENTIAL)).Methods(http.MethodDelete)
	Base.HandleFunc("/role/{id}/user", listRoleUser).Methods(http.MethodGet)
	Base.HandleFunc("/role/{id}/user", updateRoleUser).Methods(http.MethodPut)
	Base.HandleFunc("/role/{id}/menu", listRoleMenu).Methods(http.MethodGet)
	Base.HandleFunc("/role/{id}/menu", updateRoleMenu).Methods(http.MethodPut)
	Base.HandleFunc("/role/{id}/permission", middleware.AuthorizationAPIMiddleware(
		listRolePermission,
		helper.ALLOWED_TO_VIEW_ROLE_PERMISSION)).Methods(http.MethodGet)
	Base.HandleFunc("/role/{id}/permission", middleware.AuthorizationAPIMiddleware(
		updateRolePermission,
		helper.ALLOWED_TO_UPDATE_ROLE_PERMISSION)).Methods(http.MethodPut)
}

func listRole(w http.ResponseWriter, r *http.Request) {
	prefix := ""
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListRole(prefix, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func createRole(w http.ResponseWriter, r *http.Request) {
	var p struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	prefix := ""
	err := database.CreateRole(p.Name, p.Description, prefix, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateRole(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	roleID, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var p struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateRole(roleID, p.Name, p.Description, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func deleteRole(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	roleID, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.DeleteRole(roleID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listRoleUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListRoleUser(id, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func updateRoleUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var p []struct {
		UserID int `json:"user_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var userids []string
	for _, v := range p {
		userids = append(userids, strconv.Itoa(v.UserID))
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateRoleUser(id, strings.Join(userids, ","), stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listRoleMenu(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	authCode := helper.WHO_CAN_CHANGE_ROLE_MENU_ISFORTRADING
	userAuthIDs := userSession.User.GetUserAuthIDs()
	isAuthValid := helper.IsAuthInclude(userAuthIDs, authCode)
	result, err := database.ListRoleMenu(id, isAuthValid, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func updateRoleMenu(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var p []struct {
		MenuID int `json:"menu_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var menuids []string
	for _, v := range p {
		menuids = append(menuids, strconv.Itoa(v.MenuID))
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateRoleMenu(id, strings.Join(menuids, ","), stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listRolePermission(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListRolePermission(id, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func updateRolePermission(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var p []struct {
		PermissionID int `json:"permission_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var permissionids []string
	for _, v := range p {
		permissionids = append(permissionids, strconv.Itoa(v.PermissionID))
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateRolePermission(id, strings.Join(permissionids, ","), stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
