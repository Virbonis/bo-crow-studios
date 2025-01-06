package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPICustomer() {
	Base.HandleFunc("/customer/list", listCustomerList).Methods(http.MethodGet)
	Base.HandleFunc("/customer/export", exportCustomerList).Methods(http.MethodGet)
	Base.HandleFunc("/customer/list/password", middleware.AuthorizationAPIMiddleware(
		updateResetPasswordCustomer,
		helper.DISALLOW_RESET_NON_CASH_PASSWORD)).Methods(http.MethodPut)
	Base.HandleFunc("/customer/list/bet-limit-log", listCustomerBetLimitLog).Methods(http.MethodGet)
	Base.HandleFunc("/customer/list/vip-log", middleware.AuthorizationAPIMiddleware(
		listCustomerVIPLog,
		helper.ALLOWED_TO_VIEW_BET_LIMIT_LOG)).Methods(http.MethodGet)
	Base.HandleFunc("/customer/edit", getEditCustomer).Methods(http.MethodGet)
	Base.HandleFunc("/customer/edit", middleware.AuthorizationAPIMiddlewareDisallow(
		updateCustomer,
		helper.DISALLOW_EDIT_CUSTOMER_DETAIL)).Methods(http.MethodPut)
	Base.HandleFunc("/customer/list/upline", listUplineCustomer).Methods(http.MethodGet)

	Base.HandleFunc("/customer/limit-profile", listCustomerLimitProfile).Methods(http.MethodGet)

	Base.HandleFunc("/customer/edit-bet-limit", getCustomerBetLimit).Methods(http.MethodGet)
	Base.HandleFunc("/customer/edit-bet-limit", middleware.AuthorizationAPIMiddlewareDisallow(
		updateCustomerBetLimit,
		helper.DISALLOW_EDIT_CUSTOMER_BET_LIMIT)).Methods(http.MethodPut)
	// by sport
	Base.HandleFunc("/customer/edit-bet-limit/sport", listCustomerBetLimitBySport).Methods(http.MethodGet)
	Base.HandleFunc("/customer/edit-bet-limit/sport", updateCustomerBetLimitBySport).Methods(http.MethodPut)
	Base.HandleFunc("/customer/list/delay-bet", listCustomerDelayBet).Methods(http.MethodGet)
	Base.HandleFunc("/customer/list/delay-bet", updateCustomerDelayBet).Methods(http.MethodPut)
}

func listCustomerList(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID              string  `schema:"customer_id"`
		CustomerType            string  `schema:"customer_type"`
		CustomerLevel           string  `schema:"customer_level"`
		BranchID                string  `schema:"branch_id"`
		Username                string  `schema:"username"`
		Currency                string  `schema:"currency"`
		CashBalance             int     `schema:"cash_balance"`
		JoinDateFrom            *string `schema:"join_date_from"`
		JoinDateTo              *string `schema:"join_date_to"`
		CustomerActiveStatus    string  `schema:"customer_active_status"`
		LimitProfileID          string  `schema:"limit_profile_id"`
		SmartPunterLevel        int     `schema:"smart_punter_level"`
		CustomerTreeGetDownline string  `schema:"customer_tree_get_downline"`
		CurrentPage             int     `schema:"current_page"`
		PageSize                int     `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	if p.JoinDateFrom == nil {
		p.JoinDateFrom = new(string)
		*p.JoinDateFrom = "1/1/1900"
	}
	if p.JoinDateTo == nil {
		p.JoinDateTo = new(string)
		*p.JoinDateTo = "1/1/1900"
	}

	res, total, err := database.ListCustomerList(p.CustomerID, p.CustomerType, p.CustomerLevel, p.BranchID, p.Username, p.Currency, p.CashBalance, p.JoinDateFrom, p.JoinDateTo, p.CustomerActiveStatus, p.LimitProfileID, p.SmartPunterLevel, p.CustomerTreeGetDownline, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}

func exportCustomerList(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID              string  `schema:"customer_id"`
		CustomerType            string  `schema:"customer_type"`
		CustomerLevel           string  `schema:"customer_level"`
		BranchID                string  `schema:"branch_id"`
		Username                string  `schema:"username"`
		Currency                string  `schema:"currency"`
		CashBalance             int     `schema:"cash_balance"`
		JoinDateFrom            *string `schema:"join_date_from"`
		JoinDateTo              *string `schema:"join_date_to"`
		CustomerActiveStatus    string  `schema:"customer_active_status"`
		LimitProfileID          string  `schema:"limit_profile_id"`
		SmartPunterLevel        int     `schema:"smart_punter_level"`
		CustomerTreeGetDownline string  `schema:"customer_tree_get_downline"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ExportCustomerList(p.CustomerID, p.CustomerType, p.CustomerLevel, p.BranchID, p.Username, p.Currency, p.CashBalance, p.JoinDateFrom, p.JoinDateTo, p.CustomerActiveStatus, p.LimitProfileID, p.SmartPunterLevel, p.CustomerTreeGetDownline, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func updateResetPasswordCustomer(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID string `json:"customer_id"`
		Password   string `json:"password"`
		Username   string `json:"username"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateResetPasswordCustomer(p.CustomerID, p.Password, p.Username, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
	}

	writeJSON(w, statusSuccess, "OK")
}
func listCustomerBetLimitLog(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID string `schema:"customer_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListCustomerBetLimitLog(p.CustomerID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func listCustomerVIPLog(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID string `schema:"customer_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListCustomerVIPLog(p.CustomerID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func listUplineCustomer(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID string `schema:"customer_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListUplineCustomer(p.CustomerID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func getEditCustomer(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID string `schema:"customer_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resMain, resVIP, resUpline, err := database.GetEditCustomer(p.CustomerID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	type ResultEditCustomer struct {
		ResultMain   interface{} `json:"result_main"`
		ResultVIP    interface{} `json:"result_vip"`
		ResultUpline interface{} `json:"result_upline"`
	}

	resultEditCustomer := ResultEditCustomer{ResultMain: resMain, ResultVIP: resVIP, ResultUpline: resUpline}

	writeJSON(w, statusSuccess, resultEditCustomer)
}

func updateCustomer(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID             string  `json:"customer_id"`
		CustomerName           string  `json:"username"`
		Currency               string  `json:"currency"`
		CustomerActiveStatus   string  `json:"customer_active_status"`
		CustomerBetLimitFactor float64 `json:"customer_bet_limit_factor"`
		CashCategoryID         string  `json:"cash_category_id"`
		SmartPunterLevel       int     `json:"smart_punter_level"`
		OddsGroup              int     `json:"odds_group"`
		MinBet                 int     `json:"min_bet"`
		MaxBet                 int     `json:"max_bet"`
		MatchLimit             int     `json:"match_limit"`
		CreditLimit            int     `json:"credit_limit"`
		VIP                    string  `json:"vip"`
		CustomerSuspendStatus  string  `json:"customer_suspend_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateCustomer(p.CustomerID, p.CustomerName, p.Currency, p.CustomerActiveStatus, p.CustomerBetLimitFactor, p.CashCategoryID, p.SmartPunterLevel, p.OddsGroup, p.MinBet, p.MaxBet, p.MatchLimit, p.CreditLimit, p.VIP, p.CustomerSuspendStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
	}

	writeJSON(w, statusSuccess, "OK")
}

func listCustomerLimitProfile(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID string `schema:"customer_id"`
		BranchID   string `schema:"branch_id"`
		Currency   string `schema:"currency"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListCustomerLimitProfile(p.CustomerID, p.BranchID, p.Currency, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func getCustomerBetLimit(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID string `schema:"customer_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.GetCustomerBetLimit(p.CustomerID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	// if res!=nil {
	// }
	writeJSON(w, statusSuccess, res)
}
func updateCustomerBetLimit(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID          string  `json:"customer_id"`
		CustomerName        string  `json:"username"`
		CommissionAHOUOEPct float64 `json:"commission_ahouoe_pct"`
		CommissionOtherPct  float64 `json:"commission_other_pct"`
		LimitProfileID      string  `json:"limit_profile_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateCustomerBetLimit(p.CustomerID, p.CustomerName, p.CommissionAHOUOEPct, p.CommissionOtherPct, p.LimitProfileID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
	}

	writeJSON(w, statusSuccess, "OK")
}

func listCustomerBetLimitBySport(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID string `schema:"customer_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListCustomerBetLimitBySport(p.CustomerID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func updateCustomerBetLimitBySport(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		CustomerID   string  `json:"customer_id"`
		CustomerName string  `json:"username"`
		SportID      int     `json:"sport_id"`
		MinBet2      float64 `json:"min_ah"`
		MaxBet2      float64 `json:"max_ah"`
		MatchLimit2  float64 `json:"limit_ah"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, v := range p {
		err := database.UpdateCustomerBetLimitBySport(v.CustomerID, v.CustomerName, v.SportID, v.MinBet2, v.MaxBet2, v.MatchLimit2, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())
		}
	}

	if len(listErr) > 0 {
		ErrorMessage := fmt.Sprintf("Update Customer Bet Limit By Sport Error: %s", strings.Join(listErr, ", "))
		httpError(w, http.StatusBadRequest, ErrorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listCustomerDelayBet(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		NoCustomer string `schema:"customer_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListCustomerDelayBet(p.NoCustomer, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)

}

func updateCustomerDelayBet(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		NoCustomer   string `json:"customer_id"`
		ListDelayBet string `json:"list_delay_bet"` // No_Sport^DelayEarly^DelayToday^DelayLive
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateCustomerDelayBet(p.NoCustomer, p.ListDelayBet, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")

}
