package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPICashLimitProfile() {
	Base.HandleFunc("/cash-limit-profile", listCashLimitProfile).Methods(http.MethodGet)
	Base.HandleFunc("/cash-limit-profile", createCashLimitProfile).Methods(http.MethodPost)
	Base.HandleFunc("/cash-limit-profile", deleteCashLimitProfile).Methods(http.MethodDelete)
	Base.HandleFunc("/cash-limit-profile/log", listCashLimitProfileLog).Methods(http.MethodGet)
	Base.HandleFunc("/cash-limit-profile/detail", getCashLimitProfileDetail).Methods(http.MethodGet)
	Base.HandleFunc("/cash-limit-profile/detail", createCashLimitProfileDetail).Methods(http.MethodPost)
	Base.HandleFunc("/cash-limit-profile/detail", updateCashLimitProfileDetail).Methods(http.MethodPut)
	Base.HandleFunc("/cash-limit-profile/detail", deleteCashLimitProfileDetail).Methods(http.MethodDelete)
}

func listCashLimitProfile(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		ProfileID  string `schema:"profile_id"`
		BranchCode string `schema:"branch_code"`
		Currency   string `schema:"currency"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListCashLimitProfile(p.ProfileID, p.BranchCode, p.Currency, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func createCashLimitProfile(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		ProfileID  string `json:"profile_id"`
		BranchCode string `json:"branch_code"`
		Currency   string `json:"currency"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.CreateCashLimitProfile(p.ProfileID, p.BranchCode, p.Currency, -99, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func deleteCashLimitProfile(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	var p struct {
		ProfileID  string `json:"profile_id"`
		BranchCode string `json:"branch_code"`
		Currency   string `json:"currency"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.DeleteCashLimitProfile(p.ProfileID, p.BranchCode, p.Currency, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func listCashLimitProfileLog(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		ProfileID  string `schema:"profile_id"`
		BranchCode string `schema:"branch_code"`
		Currency   string `schema:"currency"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListCashLimitProfileLog(p.ProfileID, p.BranchCode, p.Currency, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func getCashLimitProfileDetail(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		ProfileID  string `schema:"profile_id"`
		BranchCode string `schema:"branch_code"`
		Currency   string `schema:"currency"`
		PriceGroup int    `schema:"league_group"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	listLeagueGroup, err := database.GetCountCashLimitProfileDetail(p.ProfileID, p.BranchCode, p.Currency, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	listMain, listParlay, err := database.GetCashLimitProfileDetail(p.ProfileID, p.BranchCode, p.Currency, p.PriceGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, map[string]interface{}{
		"league_group": listLeagueGroup,
		"main":         listMain,
		"parlay":       listParlay,
	})
}
func createCashLimitProfileDetail(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		ProfileID   string `json:"profile_id"`
		BranchCode  string `json:"branch_code"`
		Currency    string `json:"currency"`
		LeagueGroup int    `json:"league_group"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	// using same function for create profile but with leaguegroupID
	err := database.CreateCashLimitProfile(p.ProfileID, p.BranchCode, p.Currency, p.LeagueGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func deleteCashLimitProfileDetail(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	var p struct {
		ProfileId   string `json:"profile_id"`
		BranchCode  string `json:"branch_code"`
		Currency    string `json:"currency"`
		SportId     string `json:"sport_id"`
		LeagueGroup int    `json:"league_group"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.DeleteCashLimitProfileDetail(p.ProfileId, p.BranchCode, p.Currency, p.SportId, p.LeagueGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func updateCashLimitProfileDetail(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		ProfileParlay []struct {
			ProfileID  string `json:"profile_id"`
			BranchCode string `json:"branch_code"`
			Currency   string `json:"currency"`
			SportId    string `json:"sport_id"`
			PriceGroup int    `json:"price_group"`
			MaxBet     int    `json:"max_bet"`
			MinBet     int    `json:"min_bet"`
			MatchLimit int    `json:"match_limit"`
		} `json:"parlay"`
		ProfileMain []struct {
			ProfileID  string `json:"profile_id"`
			BranchCode string `json:"branch_code"`
			Currency   string `json:"currency"`
			SportId    string `json:"sport_id"`
			PriceGroup int    `json:"price_group"`
			MaxBet     int    `json:"max_bet"`
			MinBet     int    `json:"min_bet"`
			MatchLimit int    `json:"match_limit"`
		} `json:"main"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	for _, d := range p.ProfileParlay {
		err := database.UpdateCashLimitProfileDetail(d.ProfileID, d.BranchCode, d.Currency, d.SportId, d.PriceGroup, d.MinBet, d.MaxBet, d.MatchLimit, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	}
	for _, d := range p.ProfileMain {
		err := database.UpdateCashLimitProfileDetail(d.ProfileID, d.BranchCode, d.Currency, d.SportId, d.PriceGroup, d.MinBet, d.MaxBet, d.MatchLimit, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	}

	writeJSON(w, statusSuccess, "OK")
}
