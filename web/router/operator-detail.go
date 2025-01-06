package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/config"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIOperatorDetail() {
	Base.HandleFunc("/operator-detail", getOperatorDetail).Methods(http.MethodGet)
	Base.HandleFunc("/operator-detail", middleware.AuthorizationAPIMiddleware(
		updateOperatorDetail, helper.ALLOWED_TO_EDIT_OPERATOR_DETAIL)).Methods(http.MethodPut)
}

func getOperatorDetail(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	if len(config.AppConfig.OperatorDetail) < 3 {
		httpError(w, http.StatusBadRequest, "Config OperatorDetail is not set")
		return
	}
	BranchID := config.AppConfig.OperatorDetail[1]
	BranchName := config.AppConfig.OperatorDetail[2]

	config, currency, err := database.GetOperatorDetail(BranchID, BranchName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	type Result struct {
		BranchID   string                   `json:"branch_id"`
		BranchName string                   `json:"branch_name"`
		Config     []model.OperatorConfig   `json:"configs"`
		Currency   []model.OperatorCurrency `json:"currencies"`
	}

	res := Result{Config: config, Currency: currency, BranchID: BranchID, BranchName: BranchName}
	writeJSON(w, statusSuccess, res)
}
func updateOperatorDetail(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BranchID          string `json:"branch_id"`
		BranchName        string `json:"branch_name"`
		ConfigKeyAndValue string `json:"configs"`
		ListCurrency      string `json:"currencies"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateOperatorDetail(p.BranchID, p.BranchName, p.ConfigKeyAndValue, p.ListCurrency, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cache.DeleteOperator(config.AppConfig.OperatorDetail[0])
	writeJSON(w, statusSuccess, "OK")
}
