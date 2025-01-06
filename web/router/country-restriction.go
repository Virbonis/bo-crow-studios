package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPICountryRestriction() {
	Base.HandleFunc("/country-restriction", getListCountryRestriction).Methods(http.MethodGet)
	Base.HandleFunc("/country-restriction/edit", getListEditCountryRestriction).Methods(http.MethodGet)
	Base.HandleFunc("/country-restriction/edit", updateListEditCountryRestriction).Methods(http.MethodPut)
}

func getListCountryRestriction(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID              string  `schema:"customer_id"`
		CustomerType            string  `schema:"customer_type"`
		CustomerLevel           string  `schema:"customer_level"`
		BranchCode              string  `schema:"branch_id"`
		Username                string  `schema:"username"`
		Currency                string  `schema:"currency"`
		Active                  string  `schema:"active"`
		Access                  string  `schema:"access"`
		DateFrom                *string `schema:"date_from"`
		DateTo                  *string `schema:"date_to"`
		CustomerTreeGetDownline string  `schema:"customer_tree_get_downline"`
		PageSize                int     `schema:"page_size"`
		CurrentPage             int     `schema:"current_page"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	if p.CustomerLevel == "" {
		p.CustomerLevel = "Shareholder"
	}
	if p.CustomerTreeGetDownline != "" {
		p.Username = ""
		p.CustomerLevel = ""
	}
	res, total, err := database.ListCountryRestriction(p.CurrentPage, p.PageSize, p.CustomerID, p.CustomerType, p.CustomerLevel, p.BranchCode, p.Username, p.Currency, p.DateFrom, p.DateTo, p.Access, p.Active, p.CustomerTreeGetDownline, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result := model.ResultWithTotal{Total: total, Result: res}
	writeJSON(w, statusSuccess, result)
}

func getListEditCountryRestriction(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CustomerID   string `schema:"customer_id"`
		AccessStatus string `schema:"access_status"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListEditCountryRestriction(p.CustomerID, p.AccessStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	selectedCountry := []string{}
	for _, v := range res {
		if v.IsSelected == 1 {
			selectedCountry = append(selectedCountry, v.CountryISO)
		}
	}

	// group res by Sort and CountryRegion
	var result map[int]map[string][]model.EditCountryRestriction
	result = make(map[int]map[string][]model.EditCountryRestriction)
	for _, v := range res {
		if _, ok := result[v.Sort]; !ok {
			result[v.Sort] = make(map[string][]model.EditCountryRestriction)
		}
		result[v.Sort][v.CountryRegion] = append(result[v.Sort][v.CountryRegion], v)
	}

	writeJSON(w, statusSuccess, map[string]interface{}{
		"result":   result,
		"selected": selectedCountry,
	})
}

func updateListEditCountryRestriction(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	var p struct {
		CustomerID int    `json:"customer_id"`
		Countries  string `json:"countries"`
		Access     int    `json:"access"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateListEditCountryRestriction(p.CustomerID, p.Access, p.Countries, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, 0)
}
