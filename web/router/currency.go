package router

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/gorilla/mux"
)

func RegisterAPICurrency() {
	Base.HandleFunc("/currency/select", listCurrencySelect).Methods(http.MethodGet)
	Base.HandleFunc("/currency", listGridCurrency).Methods(http.MethodGet)
	Base.HandleFunc("/currency/{id}", updateCurrency).Methods(http.MethodPut)
}

func listCurrencySelect(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListSelectCurrency(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listGridCurrency(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListGridCurrency(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateCurrency(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	currencyID := vars["id"]
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CurrencyName    string    `json:"description"`
		Rate            float64   `json:"currency_rate"`
		MinBet          float64   `json:"minbet"`
		MaxPayoutCS     float64   `json:"max_payout_cs"`
		MaxPayoutParlay float64   `json:"max_payout_parlay"`
		EffectiveDate   time.Time `json:"effective_date"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateCurrency(currencyID, p.CurrencyName, p.Rate, p.MinBet, p.MaxPayoutCS, p.MaxPayoutParlay, p.EffectiveDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
