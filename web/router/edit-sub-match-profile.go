package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIEditSubMatchProfile() {
	Base.HandleFunc("/edit-sub-match-profile", listSubMatchProfile).Methods(http.MethodGet)
	Base.HandleFunc("/edit-sub-match-profile", updateSubMatchProfile).Methods(http.MethodPut)
}

func listSubMatchProfile(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID    int `schema:"match_id"`
		SubMatchID int `schema:"sub_match_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListSubMatchProfile(p.MatchID, p.SubMatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateSubMatchProfile(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID        int     `json:"match_id"`
		SubMatchID     int     `json:"sub_match_id"`
		GameType       int     `json:"game_type"`
		PriceStep1     float64 `json:"step1"`
		PriceStep2     float64 `json:"step2"`
		PriceStep3     float64 `json:"step3"`
		PriceStep4     float64 `json:"step4"`
		LimitChange1   float64 `json:"odds_trigger1"`
		LimitChange2   float64 `json:"odds_trigger2"`
		LimitChange3   float64 `json:"odds_trigger3"`
		LimitChange4   float64 `json:"odds_trigger4"`
		MaxLimit1      float64 `json:"max_limit1"`
		MaxLimit2      float64 `json:"max_limit2"`
		MaxLimit3      float64 `json:"max_limit3"`
		MaxLimit4      float64 `json:"max_limit4"`
		MaxBet1        float64 `json:"max_bet1"`
		MaxBet2        float64 `json:"max_bet2"`
		MaxBet3        float64 `json:"max_bet3"`
		MaxBet4        float64 `json:"max_bet4"`
		Lap1           float64 `json:"lap1"`
		Lap2           float64 `json:"lap2"`
		Lap3           float64 `json:"lap3"`
		Lap4           float64 `json:"lap4"`
		AutoPauseLimit float64 `json:"auto_pause_limit"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateSubMatchProfile(p.MatchID, p.SubMatchID, p.GameType, p.PriceStep1, p.PriceStep2, p.PriceStep3, p.PriceStep4, p.LimitChange1, p.LimitChange2, p.LimitChange3, p.LimitChange4, p.MaxLimit1, p.MaxLimit2, p.MaxLimit3, p.MaxLimit4, p.MaxBet1, p.MaxBet2, p.MaxBet3, p.MaxBet4, p.Lap1, p.Lap2, p.Lap3, p.Lap4, p.AutoPauseLimit, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
