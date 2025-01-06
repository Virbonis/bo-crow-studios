package router

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/gorilla/mux"
)

func RegisterAPIProfile() {
	Base.HandleFunc("/profile/select", listSelectProfile).Methods(http.MethodGet)
	Base.HandleFunc("/profile", listMasterProfile).Methods(http.MethodGet)
	Base.HandleFunc("/profile", createMasterProfile).Methods(http.MethodPost)
	Base.HandleFunc("/profile/{profile_id}", middleware.AuthorizationAPIMiddleware(
		deleteMasterProfile,
		helper.ALLOWED_DELETE_MASTER_PROFILE)).Methods(http.MethodDelete)
	Base.HandleFunc("/profile/{profile_id}", updateMasterProfile).Methods(http.MethodPut)
	Base.HandleFunc("/profile/{profile_id}/payout", updatePayout).Methods(http.MethodPut)
	Base.HandleFunc("/profile/{profile_id}/payout-spec", updatePayoutSpec).Methods(http.MethodPut)
	Base.HandleFunc("/profile/{profile_id}/odds-trigger/{game_type}", listOddsTrigger).Methods(http.MethodGet)
	Base.HandleFunc("/profile/{profile_id}/odds-trigger/{game_type}", addOddsTrigger).Methods(http.MethodPost)
	Base.HandleFunc("/profile/{profile_id}/odds-trigger/{game_type}", updateOddsTrigger).Methods(http.MethodPut)
	Base.HandleFunc("/profile/{profile_id}/odds-trigger/{game_type}", deleteOddsTrigger).Methods(http.MethodDelete)
}

func listSelectProfile(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListSelectProfile(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}

func listMasterProfile(w http.ResponseWriter, r *http.Request) {
	var p struct {
		ProfileID string `schema:"profile_id" json:"profile_id"`
		SoccerOS  string `schema:"soccer_os" json:"soccer_os"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	resEventLimit, resPayout, resPayoutSpec, err := database.ListProfile(p.ProfileID, p.SoccerOS, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result := model.ResultTableProfile{ResultEventLimit: resEventLimit, ResultPayout: resPayout, ResultPayoutSpec: resPayoutSpec}
	writeJSON(w, statusSuccess, result)
}

func createMasterProfile(w http.ResponseWriter, r *http.Request) {
	var p struct {
		ProfileID string `json:"profile_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.CreateMasterProfile(p.ProfileID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func deleteMasterProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	profileID := vars["profile_id"]

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.DeleteProfile(profileID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateMasterProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	profileID := vars["profile_id"]
	var p struct {
		MarketGroup      string  `json:"market_group"`
		GameType         int     `json:"game_type"`
		GameTypeSequence int     `json:"game_type_sequence"`
		Step             int     `json:"step"`
		OddsTrigger      float32 `json:"odds_trigger"`
		MaxLimit         float32 `json:"max_limit"`
		MaxBet           float32 `json:"max_bet"`
		Spread           float32 `json:"spread"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	oddsName := 2000 - (p.Spread * 10)
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateMasterProfile(profileID, p.MarketGroup, p.GameType, p.GameTypeSequence, p.Step, &p.OddsTrigger, &p.MaxLimit, &p.MaxBet, &oddsName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updatePayout(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	profileID := vars["profile_id"]

	var p struct {
		Spread          float32 `json:"spread"`
		AmountTrigger   float32 `json:"amount_trigger"`
		GameType        int     `json:"game_type"`
		IsLive          string  `json:"is_live"`
		Lap             float32 `json:"lap"`
		MaxPayout       float32 `json:"max_payout"`
		MaxPayoutTicket float32 `json:"max_payout_ticket"`
		MaxBet          float32 `json:"max_bet"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	if p.IsLive == "Y" {
		err := database.UpdateProfilePayout(profileID, &p.GameType, nil, &p.MaxPayout, nil, &p.MaxPayoutTicket, nil, &p.MaxBet, nil, &p.AmountTrigger, nil, &p.Spread, p.IsLive, nil, &p.Lap, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	} else if p.IsLive == "N" {
		err := database.UpdateProfilePayout(profileID, &p.GameType, &p.MaxPayout, nil, &p.MaxPayoutTicket, nil, &p.MaxBet, nil, &p.AmountTrigger, nil, &p.Spread, nil, p.IsLive, &p.Lap, nil, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	}
	writeJSON(w, statusSuccess, "OK")
}

func updatePayoutSpec(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	profileID := vars["profile_id"]

	var p struct {
		SpreadSpec          float32 `json:"spread_spec"`
		AmountTrigger       float32 `json:"amount_trigger_spec"`
		GameTypeSpec        int     `json:"game_type_spec"`
		IsLiveSpec          string  `json:"is_live_spec"`
		LapSpec             float32 `json:"lap_spec"`
		MaxPayoutSpec       float32 `json:"max_payout_spec"`
		MaxPayoutSpecTicket float32 `json:"max_payout_spec_ticket"`
		MaxBetSpec          float32 `json:"max_bet_spec"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	if p.IsLiveSpec == "Y" {
		err := database.UpdateProfilePayout(profileID, &p.GameTypeSpec, nil, &p.MaxPayoutSpec, nil, &p.MaxPayoutSpecTicket, nil, &p.MaxBetSpec, nil, &p.AmountTrigger, nil, &p.SpreadSpec, p.IsLiveSpec, nil, &p.LapSpec, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	} else if p.IsLiveSpec == "N" {
		err := database.UpdateProfilePayout(profileID, &p.GameTypeSpec, &p.MaxPayoutSpec, nil, &p.MaxPayoutSpecTicket, nil, &p.MaxBetSpec, nil, &p.AmountTrigger, nil, &p.SpreadSpec, nil, p.IsLiveSpec, &p.LapSpec, nil, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	}

	writeJSON(w, statusSuccess, "OK")
}

func listOddsTrigger(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	vars := mux.Vars(r)
	profileID := vars["profile_id"]
	gameType, err := strconv.Atoi(vars["game_type"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListProfileOddsTrigger(profileID, gameType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}

func addOddsTrigger(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	vars := mux.Vars(r)
	profileID := vars["profile_id"]
	gameType, err := strconv.Atoi(vars["game_type"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err = database.InsertOddsTrigger(profileID, gameType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func updateOddsTrigger(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	profileID := vars["profile_id"]
	gameType, err := strconv.Atoi(vars["game_type"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var p struct {
		OddsTriggerPercent float32 `json:"odds_trigger_percent"`
		OddsTriggerID      int     `json:"odds_trigger_id"`
		OddsTo             float32 `json:"odds_to"`
		OddsFrom           float32 `json:"odds_from"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	if p.OddsFrom > p.OddsTo {
		httpError(w, http.StatusBadRequest, "Odds To Cannot Smaller Than Odds From!")
		return
	} else {
		err := database.UpdateOddsTrigger(profileID, gameType, p.OddsTriggerID, &p.OddsTriggerPercent, &p.OddsTo, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	}
	writeJSON(w, statusSuccess, "OK")
}

func deleteOddsTrigger(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	vars := mux.Vars(r)
	profileID := vars["profile_id"]
	gameType, err := strconv.Atoi(vars["game_type"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err = database.DeleteOddsTrigger(profileID, gameType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
