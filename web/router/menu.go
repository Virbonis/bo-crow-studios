package router

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/gorilla/mux"
)

func RegisterAPIMenu() {
	Base.HandleFunc("/menu", listMenu).Methods(http.MethodGet)
	Base.HandleFunc("/menu", createMenu).Methods(http.MethodPost)
	Base.HandleFunc("/menu/{id}", updateMenu).Methods(http.MethodPut)
	Base.HandleFunc("/menu/{id}", middleware.AuthorizationAPIMiddleware(
		deleteMenu,
		helper.ALLOWED_TO_DELETE_CREDENTIAL)).Methods(http.MethodDelete)
}

func listMenu(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	var p struct {
		IsMulticomp bool `schema:"is_multicomp"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result, err := database.ListMenu(p.IsMulticomp, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}

func createMenu(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MenuNo      int    `json:"menu_number"`
		Title       string `json:"title"`
		Key         string `json:"key"`
		URL         string `json:"url"`
		Icon        string `json:"icon"`
		Category    bool   `json:"category"`
		ParentID    *int   `json:"parent_id"`
		IsMulticomp bool   `json:"is_multicomp"`
		IsForTrader bool   `json:"is_for_trader"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.CreateMenu(p.MenuNo, p.Title, p.Key, p.URL, p.Icon, p.Category, p.ParentID, p.IsMulticomp, p.IsForTrader, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateMenu(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	menuID, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		MenuNo      int    `json:"menu_number"`
		Title       string `json:"title"`
		Key         string `json:"key"`
		URL         string `json:"url"`
		Icon        string `json:"icon"`
		Category    bool   `json:"category"`
		ParentID    *int   `json:"parent_id"`
		IsMulticomp bool   `json:"is_multicomp"`
		IsForTrader bool   `json:"is_for_trader"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateMenu(menuID, p.MenuNo, p.Title, p.Key, p.URL, p.Icon, p.Category, p.ParentID, p.IsMulticomp, p.IsForTrader, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func deleteMenu(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	menuID, err := strconv.Atoi(vars["id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.DeleteMenu(menuID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
