package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPISportsbookSetting() {
	Base.HandleFunc("/sportsbook-setting", getSportsbookSetting).Methods(http.MethodGet)
	Base.HandleFunc("/sportsbook-setting", middleware.AuthorizationAPIMiddleware(
		updateSportsbookSetting, helper.WHO_CAN_CHANGE_SB_SETTING)).Methods(http.MethodPut)
	Base.HandleFunc("/sportsbook-setting/default-match-outright", getDefaultMatchOutright).Methods(http.MethodGet)
	Base.HandleFunc("/sportsbook-setting/default-match-outright", middleware.AuthorizationAPIMiddleware(
		updateDefaultMatchOutright, helper.WHO_CAN_CHANGE_SB_SETTING)).Methods(http.MethodPut)
	Base.HandleFunc("/sportsbook-setting/status/maintenance", middleware.AuthorizationAPIMiddleware(
		updateMaintenanceStatus, helper.WHO_CAN_CHANGE_SB_SETTING)).Methods(http.MethodPut)
	Base.HandleFunc("/sportsbook-setting/status/seamless-maintenance", middleware.AuthorizationAPIMiddleware(
		updateSeamlessMaintenanceStatus, helper.WHO_CAN_CHANGE_SB_SETTING)).Methods(http.MethodPut)
	Base.HandleFunc("/sportsbook-setting/status/close-fund-transfer", middleware.AuthorizationAPIMiddleware(
		updateCloseFundTransferStatus, helper.WHO_CAN_CHANGE_SB_SETTING)).Methods(http.MethodPut)
	Base.HandleFunc("/sportsbook-setting/status/bet-bazar", middleware.AuthorizationAPIMiddleware(
		updateBetBazarStatus, helper.WHO_CAN_CHANGE_SB_SETTING)).Methods(http.MethodPut)
	Base.HandleFunc("/sportsbook-setting/status/im", middleware.AuthorizationAPIMiddleware(
		updateIMStatus, helper.WHO_CAN_CHANGE_SB_SETTING)).Methods(http.MethodPut)
	Base.HandleFunc("/sportsbook-setting/status/sis", middleware.AuthorizationAPIMiddleware(
		updateSISStatus, helper.WHO_CAN_CHANGE_SB_SETTING)).Methods(http.MethodPut)
	Base.HandleFunc("/sportsbook-setting/status/bti-auto-add-match", middleware.AuthorizationAPIMiddleware(
		updateBTIAutoAddMatch, helper.WHO_CAN_CHANGE_SB_SETTING)).Methods(http.MethodPut)
}

func getSportsbookSetting(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.GetSportsbookSetting(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func getDefaultMatchOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.GetDefaultMatchOutright(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateSportsbookSetting(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		IBPayoutTriggerAmt    int     `json:"ib_payout_trigger_amt"`
		IBMaxbetTriggerPct    float64 `json:"ib_max_bet_trigger_pct"`
		MaxbetPauseTriggerPct float64 `json:"max_bet_pause_trigger_pct"`
		LAPShortTriggerPct    float64 `json:"lap_short_trigger_pct"`
		AutoAcceptDelayHome   int     `json:"auto_accept_delay_home"`
		AutoAcceptDelayAway   int     `json:"auto_accept_delay_away"`
		AutoAcceptDelayOver   int     `json:"auto_accept_delay_over"`
		AutoAcceptDelayUnder  int     `json:"auto_accept_delay_under"`
		AutoAcceptDelayReject int     `json:"auto_accept_delay_reject"`
		DayLightSaving        int     `json:"day_light_saving"`
		AutoEarlySettlement   int     `json:"auto_early_settlement"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateSportsbookSetting(p.IBPayoutTriggerAmt, p.IBMaxbetTriggerPct, p.MaxbetPauseTriggerPct, p.LAPShortTriggerPct, p.AutoAcceptDelayHome, p.AutoAcceptDelayAway, p.AutoAcceptDelayOver, p.AutoAcceptDelayUnder, p.AutoAcceptDelayReject, p.DayLightSaving, p.AutoEarlySettlement, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateDefaultMatchOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		SportID            int    `json:"sport_id"`
		AutoCreateMatch    string `json:"auto_create_match"`
		AutoCreateOutright string `json:"auto_create_outright"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var errMessage []string

	for _, v := range p {
		err := database.UpdateDefaultMatchOutright(v.SportID, v.AutoCreateMatch, v.AutoCreateOutright, stampUser)
		if err != nil {
			errMessage = append(errMessage, err.Error())
		}
	}

	if len(errMessage) > 0 {
		errorMessage := fmt.Sprintf("Update Cancel Match Special for this match: %s is failed", strings.Join(errMessage, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateMaintenanceStatus(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		IsMaintenance string `json:"is_maintenance"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateMaintenanceStatus(p.IsMaintenance, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateSeamlessMaintenanceStatus(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		IsMaintenance string `json:"is_maintenance_seamless"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateSeamlessMaintenanceStatus(p.IsMaintenance, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateCloseFundTransferStatus(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		CloseFundTransfer int `json:"close_fund_transfer"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateCloseFundTransferStatus(p.CloseFundTransfer, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateBetBazarStatus(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BetBazar_Status bool `json:"bet_bazar_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateBetBazarStatus(p.BetBazar_Status, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateIMStatus(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		IM_Status bool `json:"im_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateIMStatus(p.IM_Status, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateSISStatus(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SIS_Status bool `json:"sis_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateSISStatus(p.SIS_Status, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateBTIAutoAddMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BTIAutoAddMatch bool `json:"bti_auto_add_match"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateBTIAutoAddMatch(p.BTIAutoAddMatch, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
