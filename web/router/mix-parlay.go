package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMixParlay() {
	Base.HandleFunc("/mix-parlay", listMixParlay).Methods(http.MethodGet)
	Base.HandleFunc("/mix-parlay/on-off-parlay-match", updateOnOffParlayMatch).Methods(http.MethodPut)
	Base.HandleFunc("/mix-parlay/on-off-parlay-sub-match", updateOnOffParlaySubMatch).Methods(http.MethodPut)
}

func listMixParlay(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchTimeSlot   string `schema:"match_time_slot"`
		FromEarlyDate   string `schema:"from_early_date"`
		ToEarlyDate     string `schema:"to_early_date"`
		IsShowNonParlay string `schema:"is_show_non_parlay"`
		PopupID         string `schema:"popup_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListMixParlay(p.MatchTimeSlot, p.FromEarlyDate, p.ToEarlyDate, p.IsShowNonParlay, p.PopupID, userSession.SessionID, stampUser, userInfo.TraderGroupORI)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func updateOnOffParlayMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID              int    `json:"match_id"`
		SubMatchParlayStatus string `json:"sub_match_parlay_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateOnOffParlayMatch(p.MatchID, p.SubMatchParlayStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateOnOffParlaySubMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID              int    `json:"match_id"`
		SubMatchID           int    `json:"sub_match_id"`
		GameType             int    `json:"game_type"`
		SubMatchParlayStatus string `json:"sub_match_parlay_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateOnOffParlaySubMatch(p.MatchID, p.SubMatchID, p.GameType, p.SubMatchParlayStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
	}

	writeJSON(w, statusSuccess, "OK")
}
