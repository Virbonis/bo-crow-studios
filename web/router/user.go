package router

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/config"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/gorilla/mux"
)

func RegisterAPIUser() {
	Base.HandleFunc("/user", listUser).Methods(http.MethodGet)
	Base.HandleFunc("/user", createUser).Methods(http.MethodPost)
	Base.HandleFunc("/user/{id}", updateUser).Methods(http.MethodPut)
	Base.HandleFunc("/user/{id}", middleware.AuthorizationAPIMiddleware(
		deleteUser,
		helper.ALLOWED_TO_DELETE_CREDENTIAL)).Methods(http.MethodDelete)
	Base.HandleFunc("/user/{id}/resetpassword", resetUserPassword).Methods(http.MethodPut)
	Base.HandleFunc("/user/session", middleware.AuthorizationAPIMiddleware(
		listUserSession,
		helper.ALLOWED_TO_SEE_USER_SESSION_LOG)).Methods(http.MethodGet)
}

func listUser(w http.ResponseWriter, r *http.Request) {
	var p struct {
		Username string `schema:"username"`
		Page     int    `schema:"page"`
		Display  int    `schema:"display"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, total, err := database.ListUser(p.Username, "", "", "", "", p.Page, p.Display, "all", stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resultWithTotal := model.ResultWithTotal{Result: result, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}

func createUser(w http.ResponseWriter, r *http.Request) {
	var p struct {
		Username   string `json:"username"`
		Name       string `json:"name"`
		Email      string `json:"email"`
		IsActive   bool   `json:"is_active"`
		IsSysAdmin bool   `json:"is_sys_admin"`
		IsLOB      bool   `json:"is_lob"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	defaultPassword := config.AppConfig.DefaultPassword
	encryptPassword := strings.ToUpper(helper.GetMD5Hash(strings.ToUpper(defaultPassword)))
	prefix := ""
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.CreateUser(p.Username, encryptPassword, p.Name, p.Email, p.IsActive, p.IsSysAdmin, p.IsLOB, prefix, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		Name       string `json:"name"`
		Email      string `json:"email"`
		IsActive   bool   `json:"is_active"`
		IsSysAdmin bool   `json:"is_sys_admin"`
		IsLOB      bool   `json:"is_lob"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateUser(userID, p.Name, p.Email, p.IsActive, p.IsSysAdmin, p.IsLOB, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.DeleteUser(userID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func resetUserPassword(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	defaultPassword := config.AppConfig.DefaultPassword
	encryptPassword := strings.ToUpper(helper.GetMD5Hash(strings.ToUpper(defaultPassword)))
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateUserPassword(userID, encryptPassword, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	// remove redis session
	cache.DeleteWebUserSession(strconv.Itoa(userID))

	writeJSON(w, statusSuccess, "OK")
}
func listUserSession(w http.ResponseWriter, r *http.Request) {
	var p struct {
		UserID    int       `schema:"user_id"`
		DateStart time.Time `schema:"date_start"`
		DateEnd   time.Time `schema:"date_end"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListUserSession(p.UserID, p.DateStart, p.DateEnd, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
