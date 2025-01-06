package router

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/gorilla/mux"
)

func RegisterAPIApplication() {
	Base.HandleFunc("/application", listApplication).Methods(http.MethodGet)
	Base.HandleFunc("/application", createApplication).Methods(http.MethodPost)
	Base.HandleFunc("/application/{id}", updateApplication).Methods(http.MethodPut)
	Base.HandleFunc("/application/{id}/menu", listApplicationMenu).Methods(http.MethodGet)
	Base.HandleFunc("/application/{id}/menu", updateApplicationMenu).Methods(http.MethodPut)
}

func listApplication(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListApplication(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func createApplication(w http.ResponseWriter, r *http.Request) {
	var p struct {
		Name     string `json:"name"`
		IsActive bool   `json:"is_active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.CreateApplication(p.Name, p.IsActive, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateApplication(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		Name     string `json:"name"`
		IsActive bool   `json:"is_active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateApplication(id, p.Name, p.IsActive, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func listApplicationMenu(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListApplicationMenu(id, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func updateApplicationMenu(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p []struct {
		MenuID int    `json:"menu_id"`
		Title  string `json:"title"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var menuids []string
	var menus []string
	for _, v := range p {
		menuids = append(menuids, strconv.Itoa(v.MenuID))
		menus = append(menus, v.Title)
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateApplicationMenu(id, strings.Join(menuids, ","), stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
