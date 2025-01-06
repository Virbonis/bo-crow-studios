package router

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPITradingFloor() {
	Base.HandleFunc("/trading-floor/more-gt", updateMatchMoreGT).Methods(http.MethodPut)
	Base.HandleFunc("/trading-floor/open-close-match", updateOpenCloseMatch).Methods(http.MethodPut)
	Base.HandleFunc("/trading-floor/pause-resume-match", updatePauseResumeMatch).Methods(http.MethodPut)
	Base.HandleFunc("/trading-floor/open-close-sub-match", updateOpenCloseSubMatch).Methods(http.MethodPut)
	Base.HandleFunc("/trading-floor/pause-resume-sub-match", updatePauseResumeSubMatch).Methods(http.MethodPut)
	Base.HandleFunc("/trading-floor/live-finalize", updateLiveFinalize).Methods(http.MethodPut)
	Base.HandleFunc("/trading-floor/odds-hdc", updateOddsHDC).Methods(http.MethodPut)
	Base.HandleFunc("/trading-floor/move-odds", updateMoveOdds).Methods(http.MethodPut)
	Base.HandleFunc("/trading-floor/open-close-outright", updateOpenCloseOutright).Methods(http.MethodPut)
	Base.HandleFunc("/trading-floor/pause-resume-outright", updatePauseResumeOutright).Methods(http.MethodPut)
	Base.HandleFunc("/trading-floor/open-close-sub-match-outright", updateOpenCloseSubmatchOutright).Methods(http.MethodPut)
	Base.HandleFunc("/trading-floor/pause-resume-sub-match-outright", updatePauseResumeSubmatchOutright).Methods(http.MethodPut)
	Base.HandleFunc("/trading-floor/outright-setting", updateOutrightSetting).Methods(http.MethodPut)
	Base.HandleFunc("/trading-floor/confirm-outright", updateConfirmOutright).Methods(http.MethodPut)
}

func updateMatchMoreGT(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchIDs []int `json:"match_ids"`
		MoreGT   int   `json:"more_gt"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var errTemp []string
	for _, matchID := range p.MatchIDs {
		err := database.UpdateMatchMoreGT(matchID, p.MoreGT, stampUser)
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

func updateOpenCloseMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID         int    `json:"match_id"`
		MatchOpenStatus string `json:"match_open_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateOpenCloseMatch(p.MatchID, p.MatchOpenStatus, userInfo.TraderGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updatePauseResumeMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID         int `json:"match_id"`
		SubMatchPauseID int `json:"sub_match_pause_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdatePauseResumeMatch(p.MatchID, p.SubMatchPauseID, userInfo.TraderGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateOpenCloseSubMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID            int    `json:"match_id"`
		SubMatchID         int    `json:"sub_match_id"`
		GameType           int    `json:"game_type"`
		SubMatchOpenStatus string `json:"sub_match_open_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateOpenCloseSubMatch(p.MatchID, p.SubMatchID, p.GameType, p.SubMatchOpenStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updatePauseResumeSubMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID         int `json:"match_id"`
		SubMatchID      int `json:"sub_match_id"`
		GameType        int `json:"game_type"`
		SubMatchPauseID int `json:"sub_match_pause_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdatePauseResumeSubMatch(p.MatchID, p.SubMatchID, p.GameType, p.SubMatchPauseID, userInfo.TraderGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateLiveFinalize(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID         int    `json:"match_id"`
		MatchLiveStatus string `json:"match_live_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateLiveFinalize(p.MatchID, p.MatchLiveStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateOddsHDC(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID      int     `json:"match_id"`
		SubMatchID   int     `json:"sub_match_id"`
		MatchOddStep int     `json:"match_odd_step"`
		Odds         float64 `json:"odds"`
		Handicap     float64 `json:"handicap"`
		STFav        int     `json:"st_fav"`
		PopupID      string  `json:"popup_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateOddsHDC(p.MatchID, p.SubMatchID, p.MatchOddStep, p.Odds, p.Handicap, p.STFav, p.PopupID, userInfo.TraderGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateMoveOdds(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID       int    `json:"match_id"`
		SubMatchID    int    `json:"sub_match_id"`
		GameType      int    `json:"game_type"`
		MoveDirection string `json:"move_direction"`
		PopupID       string `json:"popup_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateMoveOdds(p.MatchID, p.SubMatchID, p.GameType, p.MoveDirection, p.PopupID, userInfo.TraderGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateOpenCloseOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		OutrightID      int    `json:"outright_id"`
		MatchOpenStatus string `json:"match_open_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateOpenCloseOutright(p.OutrightID, p.MatchOpenStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updatePauseResumeOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		OutrightID       int    `json:"outright_id"`
		MatchPauseStatus string `json:"match_pause_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdatePauseResumeOutright(p.OutrightID, p.MatchPauseStatus, userInfo.TraderGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateOpenCloseSubmatchOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		OutrightID         int    `json:"outright_id"`
		SubMatchSeq        int    `json:"sub_match_seq"`
		SubMatchOpenStatus string `json:"sub_match_open_status"`
		// LimitChange float64 `json:"limit_change"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateOpenCloseSubmatchOutright(p.OutrightID, p.SubMatchSeq, p.SubMatchOpenStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updatePauseResumeSubmatchOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		OutrightID          int `json:"outright_id"`
		SubMatchSeq         int `json:"sub_match_seq"`
		SubMatchPauseStatus int `json:"sub_match_pause_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	stringSubMatchPauseStatus := "Y"
	if p.SubMatchPauseStatus == 0 {
		stringSubMatchPauseStatus = "N"
	}
	err := database.UpdatePauseResumeSubmatchOutright(p.OutrightID, p.SubMatchSeq, stringSubMatchPauseStatus, userInfo.TraderGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateOutrightSetting(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		OutrightID  int     `json:"outright_id"`
		MaxPayout   float64 `json:"max_payout"`
		PriceStep   float64 `json:"price_step"`
		LimitChange float64 `json:"limit_change"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateOutrightSetting(p.OutrightID, p.MaxPayout, p.PriceStep, p.LimitChange, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateConfirmOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		OutrightID int `json:"outright_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateConfirmOutright(p.OutrightID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
