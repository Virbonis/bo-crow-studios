package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIOperatorList() {
	Base.HandleFunc("/operator-list", listOperator).Methods(http.MethodGet)
	Base.HandleFunc("/operator-list", middleware.AuthorizationAPIMiddleware(
		createOperator, helper.ALLOWED_TO_ADD_OPERATOR)).Methods(http.MethodPost)
	Base.HandleFunc("/operator-list", middleware.AuthorizationAPIMiddleware(
		updateOperator, helper.ALLOWED_TO_ADD_OPERATOR)).Methods(http.MethodPut)
}

func listOperator(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Page     int `schema:"current_page"`
		PageSize int `schema:"page_size"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, total, err := database.ListOperator(p.Page, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res := model.ResultWithTotal{Result: result, Total: total}

	writeJSON(w, statusSuccess, res)
}

func createOperator(w http.ResponseWriter, r *http.Request) {
	var p struct {
		BranchID   string `json:"branch_id"`
		BranchName string `json:"branch_name"`
		OperatorID string `json:"operator_id"`
		SecretKey  string `json:"secret_key"`
		Prefix     string `json:"prefix"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.CreateOperator(p.BranchID, p.BranchName, p.OperatorID, p.SecretKey, p.Prefix, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateOperator(w http.ResponseWriter, r *http.Request) {
	var p struct {
		OperatorID  string `json:"operator_id"`
		SecretKey   string `json:"secret_key"`
		ValidateUrl string `json:"validate_url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateOperator(p.OperatorID, p.SecretKey, p.ValidateUrl, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
