package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIBranch() {
	Base.HandleFunc("/branch/select", listSelectBranch).Methods(http.MethodGet)
	Base.HandleFunc("/branch", listGridBranch).Methods(http.MethodGet)
	Base.HandleFunc("/branch", updateGridBranch).Methods(http.MethodPut)
	Base.HandleFunc("/branch/live-stream", updateBranchLiveStream).Methods(http.MethodPut)

	Base.HandleFunc("/branch/limit", listBranchLimit).Methods(http.MethodGet)
	Base.HandleFunc("/branch/limit", updateBranchLimit).Methods(http.MethodPut)

	Base.HandleFunc("/branch/sport-limit", listBranchSportLimit).Methods(http.MethodGet)
	Base.HandleFunc("/branch/sport-limit", deleteBranchSportLimit).Methods(http.MethodDelete)
	Base.HandleFunc("/branch/sport-limit", updateBranchSportLimit).Methods(http.MethodPut)
}

func listSelectBranch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListSelectBranch(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listGridBranch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListGridBranch(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateBranchLiveStream(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BranchID   string `json:"branch_id"`
		LiveStream string `json:"live_stream"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateBranchLiveStream(p.BranchID, p.LiveStream, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateGridBranch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		HostID                string  `json:"host_id"`
		BranchID              string  `json:"branch_id"`
		BranchName            string  `json:"branch_name"`
		MaxBetMultiplier      float64 `json:"max_bet_multiplier"`
		OddsTriggerMultiplier float64 `json:"odds_trigger_multiplier"`
		PauseMultiplier       float64 `json:"pause_multiplier"`
	}

	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateGridBranch(p.HostID, p.BranchID, p.BranchName, p.MaxBetMultiplier, p.OddsTriggerMultiplier, p.PauseMultiplier, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listBranchLimit(w http.ResponseWriter, r *http.Request) {
	var p struct {
		BranchID   string `schema:"branch_id"`
		CurrencyID string `schema:"currency_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListBranchLimit(p.BranchID, p.CurrencyID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateBranchLimit(w http.ResponseWriter, r *http.Request) {
	var p struct {
		BranchID        string  `json:"branch_id"`
		Currency        string  `json:"currency"`
		MinBet          float64 `json:"min_bet"`
		MinBetParlay    float64 `json:"min_bet_parlay"`
		MaxPayoutParlay float64 `json:"max_payout_parlay"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateBranchLimit(p.BranchID, p.Currency, p.MinBet, p.MinBetParlay, p.MaxPayoutParlay, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listBranchSportLimit(w http.ResponseWriter, r *http.Request) {
	var p struct {
		BranchID string `schema:"branch_id"`
		Currency string `schema:"currency"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListBranchSportLimit(p.BranchID, p.Currency, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateBranchSportLimit(w http.ResponseWriter, r *http.Request) {
	var p struct {
		BranchID    string `json:"branch_id"`
		Currency    string `json:"currency"`
		SportLimits []struct {
			SportID          string  `json:"sport_id"`
			MinBetLiveStream float64 `json:"min_bet_live_stream"`
		} `json:"sport_limits"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	for _, sportLimit := range p.SportLimits {
		err := database.UpdateBranchSportLimit(p.BranchID, p.Currency, sportLimit.SportID, sportLimit.MinBetLiveStream, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	}

	writeJSON(w, statusSuccess, "OK")
}

func deleteBranchSportLimit(w http.ResponseWriter, r *http.Request) {
	var p struct {
		BranchID string `schema:"branch_id"`
		SportID  string `schema:"sport_id"`
		Currency string `schema:"currency"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.DeleteBranchSportLimit(p.BranchID, p.SportID, p.Currency, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
