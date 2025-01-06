package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIShareholderBuyback() {
	Base.HandleFunc("/shareholder-buyback", createShareholderBuyback).Methods(http.MethodPost)
}

func createShareholderBuyback(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Username  string `json:"username"`
		CompanyID int    `json:"company_id"`
		Currency  string `json:"currency"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.CreateShareholderBuyback(p.Username, p.CompanyID, p.Currency, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
