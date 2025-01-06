package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/gorilla/schema"
)

func RegisterAPIEditSubMatchSetting() {
	Base.HandleFunc("/edit-sub-match-setting", listSubMatchSetting).Methods(http.MethodGet)
	Base.HandleFunc("/edit-sub-match-setting", updateSubMatchSetting).Methods(http.MethodPut)
	Base.HandleFunc("/edit-sub-match-outright-setting", listSubmatchOutrightSetting).Methods(http.MethodGet)
	Base.HandleFunc("/edit-sub-match-outright-setting", updateSubmatchOutrightSetting).Methods(http.MethodPut)
	Base.HandleFunc("/edit-sub-match-special-setting", listSubMatchSpecialSetting).Methods(http.MethodGet)
	Base.HandleFunc("/edit-sub-match-special-setting", updateSubMatchSpecialSetting).Methods(http.MethodPut)
}

func listSubMatchSetting(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID       int    `schema:"match_id"`
		SubMatchID    int    `schema:"sub_match_id"`
		GameType      int    `schema:"game_type"`
		MatchTimeSlot string `schema:"match_time_slot"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListSubMatchSetting(p.MatchID, p.SubMatchID, p.GameType, p.MatchTimeSlot, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func updateSubMatchSetting(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID              int     `json:"match_id"`
		SubMatchID           int     `json:"sub_match_id"`
		GameType             int     `json:"game_type"`
		ShiftLeeching        int     `json:"shift_leeching"`
		FollowLeeching       int     `json:"follow_leeching"`
		LockLeeching         int     `json:"lock_leeching"`
		AutoPause            int     `json:"auto_pause"`
		OddsSpread           int     `json:"odds_spread"`
		SubMatchPauseID      int     `json:"sub_match_pause_status"`
		SubMatchParlayStatus int     `json:"sub_match_parlay_status"`
		Odds1                float64 `json:"odds1"`
		Odds2                float64 `json:"odds2"`
		Odds3                float64 `json:"odds3"`
		Odds4                float64 `json:"odds4"`
		Odds5                float64 `json:"odds5"`
		Odds6                float64 `json:"odds6"`
		Odds7                float64 `json:"odds7"`
		Odds8                float64 `json:"odds8"`
		Odds9                float64 `json:"odds9"`
		Odds10               float64 `json:"odds10"`
		Odds11               float64 `json:"odds11"`
		Odds12               float64 `json:"odds12"`
		Odds13               float64 `json:"odds13"`
		Odds14               float64 `json:"odds14"`
		Odds15               float64 `json:"odds15"`
		Odds16               float64 `json:"odds16"`
		Odds17               float64 `json:"odds17"`
		Odds18               float64 `json:"odds18"`
		Odds19               float64 `json:"odds19"`
		Odds20               float64 `json:"odds20"`
		Odds21               float64 `json:"odds21"`
		Odds22               float64 `json:"odds22"`
		Odds23               float64 `json:"odds23"`
		Odds24               float64 `json:"odds24"`
		Odds25               float64 `json:"odds25"`
		Odds26               float64 `json:"odds26"`
		Odds27               float64 `json:"odds27"`
		OddsMargin           float64 `json:"odds_margin"`
		STOddsMargin         string  `json:"st_odds_margin"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateSubMatchSetting(p.MatchID, p.SubMatchID, p.GameType, p.ShiftLeeching, p.FollowLeeching, p.LockLeeching, p.AutoPause, p.OddsSpread, p.SubMatchPauseID, p.SubMatchParlayStatus, p.Odds1, p.Odds2, p.Odds3, p.Odds4, p.Odds5, p.Odds6, p.Odds7, p.Odds8, p.Odds9, p.Odds10, p.Odds11, p.Odds12, p.Odds13, p.Odds14, p.Odds15, p.Odds16, p.Odds17, p.Odds18, p.Odds19, p.Odds20, p.Odds21, p.Odds22, p.Odds23, p.Odds24, p.Odds25, p.Odds26, p.Odds27, p.OddsMargin, p.STOddsMargin, userInfo.TraderGroupORI, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listSubmatchOutrightSetting(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		OutrightID string `schema:"outright_id"`
	}
	if err := schema.NewDecoder().Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListSubmatchOutrightSetting(p.OutrightID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func updateSubmatchOutrightSetting(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		OutrightID  int     `json:"outright_id"`
		SubMatchSeq int     `json:"sub_match_seq"`
		Odds        float64 `json:"odds"`
		AutoOdds    int     `json:"auto_odds"`
		LockShift   int     `json:"lock_shift"`
		AutoPause   int     `json:"auto_pause"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var errTemp []string
	for _, data := range p {
		err := database.UpdateSubmatchOutrightSetting(data.OutrightID, data.SubMatchSeq, data.Odds, userSession.User.TraderGroup, data.AutoOdds, data.LockShift, data.AutoPause, stampUser)
		if err != nil {
			errTemp = append(errTemp, err.Error())
		}
	}
	if errTemp != nil {
		httpError(w, http.StatusBadRequest, strings.Join(errTemp, "\n"))
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listSubMatchSpecialSetting(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID  int    `schema:"match_id"`
		GameType string `schema:"game_type"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resultDesc, result, err := database.ListSubMatchSpecialSetting(p.MatchID, p.GameType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	type ResultWithMember struct {
		ResultDesc interface{} `json:"result_desc"`
		Result     interface{} `json:"result"`
	}

	var res = ResultWithMember{ResultDesc: resultDesc, Result: result}

	writeJSON(w, statusSuccess, res)
}
func updateSubMatchSpecialSetting(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		MatchID              int     `json:"match_id"`
		GameType             int     `json:"game_type"`
		Odds1                float64 `json:"odds1"`
		Odds2                float64 `json:"odds2"`
		Odds3                float64 `json:"odds3"`
		Odds4                float64 `json:"odds4"`
		Odds5                float64 `json:"odds5"`
		Odds6                float64 `json:"odds6"`
		Odds7                float64 `json:"odds7"`
		Odds8                float64 `json:"odds8"`
		Odds9                float64 `json:"odds9"`
		Odds10               float64 `json:"odds10"`
		MaxPayout            float64 `json:"max_payout"`
		Handicap             float64 `json:"handicap"`
		OddsMargin           float64 `json:"odds_margin"`
		OddsMargin2          float64 `json:"odds_margin2"`
		SubMatchParlayStatus string  `json:"sub_match_parlay_status"`
		STOddsMargin         string  `json:"st_odds_margin"`
		STOddsMargin2        string  `json:"st_odds_margin2"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, v := range p {
		err := database.UpdateSubMatchSpecialSetting(v.MatchID, v.GameType, v.Odds1, v.Odds2, v.Odds3, v.Odds4, v.Odds5, v.Odds6, v.Odds7, v.Odds8, v.Odds9, v.Odds10, v.MaxPayout, v.Handicap, v.OddsMargin, v.OddsMargin2, v.SubMatchParlayStatus, v.STOddsMargin, v.STOddsMargin2, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())

		}
	}
	if len(listErr) > 0 {
		errorMessage := fmt.Sprintf("Update for this game type: %s is failed", strings.Join(listErr, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
