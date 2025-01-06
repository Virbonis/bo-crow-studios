package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMatchProfile() {
	Base.HandleFunc("/match-profile", listMatchProfile).Methods(http.MethodGet)
	Base.HandleFunc("/match-profile", updateMatchProfile).Methods(http.MethodPut)
}

func listMatchProfile(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateStart   string `schema:"date_start"`
		DateEnd     string `schema:"date_end"`
		MatchID     int    `schema:"match_id"`
		SportID     int    `schema:"sport_id"`
		LeagueID    int    `schema:"league_id"`
		ProfileID   string `schema:"profile_id"`
		TeamName    string `schema:"team_name"`
		OrderBy     string `schema:"order_by"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListMatchProfile(p.DateStart, p.DateEnd, p.MatchID, p.SportID, p.LeagueID, p.ProfileID, p.TeamName, p.OrderBy, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}
func updateMatchProfile(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchIDs  string `json:"match_ids"`
		ProfileID string `json:"profile_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateMatchProfile(p.MatchIDs, p.ProfileID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
