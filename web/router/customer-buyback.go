package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPICustomerBuyback() {
	Base.HandleFunc("/customer-buyback", listCustomerBuyback).Methods(http.MethodGet)
	Base.HandleFunc("/customer-buyback", updateCustomerBuyback).Methods(http.MethodPut)
	Base.HandleFunc("/customer-buyback", createCustomerBuyback).Methods(http.MethodPost)
	Base.HandleFunc("/customer-buyback/upline", listUplineCustomerBuyback).Methods(http.MethodGet)
}

func listCustomerBuyback(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID              string `schema:"customer_id"`
		CustomerLevel           string `schema:"customer_level"`
		CompanyID               int    `schema:"company_id"`
		Username                string `schema:"username"`
		Currency                string `schema:"currency"`
		CustomerTreeGetDownline string `schema:"customer_tree_get_downline"`
		CurrentPage             int    `schema:"current_page"`
		PageSize                int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListCustomerBuyback(p.CustomerID, p.CustomerLevel, p.Username, p.Currency, p.CompanyID, p.CustomerTreeGetDownline, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}

func listUplineCustomerBuyback(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	res, err := database.ListUplineCustomerBuyBack(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func updateCustomerBuyback(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		CustomerID    int     `json:"customer_id"`
		CommPct       float64 `json:"comm_pct"`
		CommPctOthers float64 `json:"comm_pct_others"`
		PTShare       float64 `json:"pt_share"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var listErr []string
	for _, v := range p {
		err := database.UpdateCustomerBuyback(v.CustomerID, v.CommPct, v.CommPctOthers, v.PTShare, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())

		}
	}
	if len(listErr) > 0 {
		errorMessage := fmt.Sprintf("Cancel Match for this match ids: %s is failed", strings.Join(listErr, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func createCustomerBuyback(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Username         string  `json:"username"`
		CustomerUplineID int     `json:"customer_upline_id"`
		CommPct          float64 `json:"comm_pct"`
		CommPctOthers    float64 `json:"comm_pct_others"`
		PTShare          float64 `json:"pt_share"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.CreateCustomerBuyback(p.Username, p.CustomerUplineID, p.CommPct, p.CommPctOthers, p.PTShare, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
	}

	writeJSON(w, statusSuccess, "OK")
}

// func listCustomerBetLimitLog(w http.ResponseWriter, r *http.Request) {
// 	userSession, _ := session.GetRouterUserSession(r)
// 	userInfo := userSession.User
// 	stampUser := userInfo.Username

// 	var p struct {
// 		CustomerID string `schema:"customer_id"`
// 	}
// 	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	res, err := database.ListCustomerBetLimitLog(p.CustomerID, stampUser)
// 	if err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	writeJSON(w, statusSuccess, res)
// }
// func listCustomerVIPLog(w http.ResponseWriter, r *http.Request) {
// 	userSession, _ := session.GetRouterUserSession(r)
// 	userInfo := userSession.User
// 	stampUser := userInfo.Username

// 	var p struct {
// 		CustomerID string `schema:"customer_id"`
// 	}
// 	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	res, err := database.ListCustomerVIPLog(p.CustomerID, stampUser)
// 	if err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	writeJSON(w, statusSuccess, res)
// }

// func getEditCustomer(w http.ResponseWriter, r *http.Request) {
// 	userSession, _ := session.GetRouterUserSession(r)
// 	userInfo := userSession.User
// 	stampUser := userInfo.Username

// 	var p struct {
// 		CustomerID string `schema:"customer_id"`
// 	}
// 	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	resMain, resVIP, resUpline, err := database.GetEditCustomer(p.CustomerID, stampUser)
// 	if err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	type ResultEditCustomer struct {
// 		ResultMain   interface{} `json:"result_main"`
// 		ResultVIP    interface{} `json:"result_vip"`
// 		ResultUpline interface{} `json:"result_upline"`
// 	}

// 	resultEditCustomer := ResultEditCustomer{ResultMain: resMain, ResultVIP: resVIP, ResultUpline: resUpline}

// 	writeJSON(w, statusSuccess, resultEditCustomer)
// }

// func updateCustomer(w http.ResponseWriter, r *http.Request) {
// 	userSession, _ := session.GetRouterUserSession(r)
// 	userInfo := userSession.User
// 	stampUser := userInfo.Username

// 	var p struct {
// 		CustomerID             string  `json:"customer_id"`
// 		Currency               string  `json:"currency"`
// 		CustomerActiveStatus   string  `json:"customer_active_status"`
// 		CustomerBetLimitFactor float64 `json:"customer_bet_limit_factor"`
// 		CashCategoryID         string  `json:"cash_category_id"`
// 		SmartPunterLevel       int     `json:"smart_punter_level"`
// 		OddsGroup              int     `json:"odds_group"`
// 		MinBet                 int     `json:"min_bet"`
// 		MaxBet                 int     `json:"max_bet"`
// 		MatchLimit             int     `json:"match_limit"`
// 		CreditLimit            int     `json:"credit_limit"`
// 		VIP                    string  `json:"vip"`
// 		CustomerSuspendStatus  string  `json:"customer_suspend_status"`
// 	}
// 	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	err := database.UpdateCustomer(p.CustomerID, p.Currency, p.CustomerActiveStatus, p.CustomerBetLimitFactor, p.CashCategoryID, p.SmartPunterLevel, p.OddsGroup, p.MinBet, p.MaxBet, p.MatchLimit, p.CreditLimit, p.VIP, p.CustomerSuspendStatus, stampUser)
// 	if err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 	}

// 	writeJSON(w, statusSuccess, "OK")
// }

// func getCustomerBetLimit(w http.ResponseWriter, r *http.Request) {
// 	userSession, _ := session.GetRouterUserSession(r)
// 	userInfo := userSession.User
// 	stampUser := userInfo.Username

// 	var p struct {
// 		CustomerID string `schema:"customer_id"`
// 	}
// 	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	res, err := database.GetCustomerBetLimit(p.CustomerID, stampUser)
// 	if err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}
// 	// if res!=nil {
// 	// }
// 	writeJSON(w, statusSuccess, res)
// }
// func updateCustomerBetLimit(w http.ResponseWriter, r *http.Request) {
// 	userSession, _ := session.GetRouterUserSession(r)
// 	userInfo := userSession.User
// 	stampUser := userInfo.Username

// 	var p struct {
// 		CustomerID          string  `json:"customer_id"`
// 		CommissionAHOUOEPct float64 `json:"commission_ahouoe_pct"`
// 		CommissionOtherPct  float64 `json:"commission_other_pct"`
// 		LimitProfileID      string  `json:"limit_profile_id"`
// 	}
// 	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	err := database.UpdateCustomerBetLimit(p.CustomerID, p.CommissionAHOUOEPct, p.CommissionOtherPct, p.LimitProfileID, stampUser)
// 	if err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 	}

// 	writeJSON(w, statusSuccess, "OK")
// }

// func listCustomerBetLimitBySport(w http.ResponseWriter, r *http.Request) {
// 	userSession, _ := session.GetRouterUserSession(r)
// 	userInfo := userSession.User
// 	stampUser := userInfo.Username

// 	var p struct {
// 		CustomerID string `schema:"customer_id"`
// 	}
// 	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	res, err := database.ListCustomerBetLimitBySport(p.CustomerID, stampUser)
// 	if err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	writeJSON(w, statusSuccess, res)
// }
// func updateCustomerBetLimitBySport(w http.ResponseWriter, r *http.Request) {
// 	userSession, _ := session.GetRouterUserSession(r)
// 	userInfo := userSession.User
// 	stampUser := userInfo.Username

// 	var p []struct {
// 		CustomerID  string  `json:"customer_id"`
// 		SportID     int     `json:"sport_id"`
// 		MinBet2     float64 `json:"min_ah"`
// 		MaxBet2     float64 `json:"max_ah"`
// 		MatchLimit2 float64 `json:"limit_ah"`
// 	}
// 	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	var listErr []string
// 	for _, v := range p {
// 		err := database.UpdateCustomerBetLimitBySport(v.CustomerID, v.SportID, v.MinBet2, v.MaxBet2, v.MatchLimit2, stampUser)
// 		if err != nil {
// 			listErr = append(listErr, err.Error())
// 		}
// 	}

// 	if len(listErr) > 0 {
// 		ErrorMessage := fmt.Sprintf("Update Customer Bet Limit By Sport Error: %s", strings.Join(listErr, ", "))
// 		httpError(w, http.StatusBadRequest, ErrorMessage)
// 		return
// 	}

// 	writeJSON(w, statusSuccess, "OK")
// }
