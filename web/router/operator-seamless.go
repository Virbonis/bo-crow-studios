package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/config"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

func RegisterAPIOperatorSeamless() {
	Base.HandleFunc("/operator-seamless", listOperatorSeamless).Methods(http.MethodGet)
	Base.HandleFunc("/operator-seamless", middleware.AuthorizationAPIMiddleware(
		createOperatorSeamless, helper.ALLOWED_TO_ADD_OPERATOR_SEAMLESS)).Methods(http.MethodPost)
	Base.HandleFunc("/operator-seamless/{id}/config", listOperatorSeamlessConfig).Methods(http.MethodGet)
	Base.HandleFunc("/operator-seamless/{id}/config", createOperatorSeamlessConfig).Methods(http.MethodPost)
	Base.HandleFunc("/operator-seamless/{id}/config", updateOperatorSeamlessConfig).Methods(http.MethodPut)
	Base.HandleFunc("/operator-seamless/{id}/config", deleteOperatorSeamlessConfig).Methods(http.MethodDelete)
}

func listOperatorSeamless(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	res, err := database.ListOperatorSeamless(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func createOperatorSeamless(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BranchID     string `json:"branch_id"`
		BranchName   string `json:"branch_name"`
		Prefix       string `json:"prefix"`
		OperatorID   string `json:"operator_id"`
		OperatorName string `json:"operator_name"`
		IsActive     bool   `json:"is_active"`
		SecretKey    string `json:"secret_key"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.CreateOperatorSeamless(p.BranchID, p.BranchName, p.Prefix, p.OperatorID, p.OperatorName, p.SecretKey, p.IsActive, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	configOp := config.AppConfig.DefaultConfigNewOperator
	for _, data := range configOp {
		database.InsUpdConfigOperator(p.OperatorID, data, "", 5, 10, stampUser)
	}

	cache.DeleteOperator(p.OperatorID)
	cache.DeleteOperatorMaintenance()
	writeJSON(w, statusSuccess, "OK")
}

func listOperatorSeamlessConfig(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	operatorID := vars["id"]
	if operatorID == "" {
		httpError(w, http.StatusBadRequest, "Invalid ID")
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	res, err := database.ListOperatorConfig(operatorID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	redisRes, err := cache.GetOperator(operatorID)
	if err == nil {
		log.Debugf("Redis Op Config: %v", redisRes)
	}

	writeJSON(w, statusSuccess, res)
}
func createOperatorSeamlessConfig(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	operatorID := vars["id"]
	if operatorID == "" {
		httpError(w, http.StatusBadRequest, "Invalid ID")
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	var p struct {
		ConfigKey      string `json:"config_key"`
		ConfigValue    string `json:"config_value"`
		HTTPTimeout    int    `json:"http_timeout"`
		RequestTimeout int    `json:"request_timeout"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.InsUpdConfigOperator(operatorID, p.ConfigKey, p.ConfigValue, p.HTTPTimeout, p.RequestTimeout, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cache.DeleteOperator(operatorID)
	writeJSON(w, statusSuccess, "OK")
}
func updateOperatorSeamlessConfig(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	operatorID := vars["id"]
	if operatorID == "" {
		httpError(w, http.StatusBadRequest, "Invalid ID")
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		ConfigKey      string `json:"config_key"`
		ConfigValue    string `json:"config_value"`
		HttpTimeout    int    `json:"http_timeout"`
		RequestTimeout int    `json:"request_timeout"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.InsUpdConfigOperator(operatorID, p.ConfigKey, p.ConfigValue, p.HttpTimeout, p.RequestTimeout, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cache.DeleteOperator(operatorID)
	writeJSON(w, statusSuccess, "OK")
}
func deleteOperatorSeamlessConfig(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	operatorID := vars["id"]
	if operatorID == "" {
		httpError(w, http.StatusBadRequest, "Invalid ID")
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		ConfigKey string `json:"config_key"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.DeleteConfigOperator(operatorID, p.ConfigKey, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cache.DeleteOperator(operatorID)
	writeJSON(w, statusSuccess, "OK")
}
