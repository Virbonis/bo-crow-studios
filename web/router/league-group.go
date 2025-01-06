package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPILeagueGroup() {
	Base.HandleFunc("/league-group", getTableMasterLeagueGroup).Methods(http.MethodGet)
	Base.HandleFunc("/league-group", createMasterLeagueGroup).Methods(http.MethodPost)
	Base.HandleFunc("/league-group", deleteMasterLeagueGroup).Methods(http.MethodDelete)
}

func getTableMasterLeagueGroup(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	type Params struct {
		SportID     int    `schema:"sport_id" json:"sport_id"`
		LeagueGroup string `schema:"league_group" json:"league_group"`
	}

	var p Params
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListLeagueGroup(stampUser, p.SportID)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func createMasterLeagueGroup(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		LeagueGroup string `json:"league_group"`
		SportID     int    `json:"sport_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.CreateLeagueGroup(p.SportID, stampUser, p.LeagueGroup)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func deleteMasterLeagueGroup(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	type Params struct {
		SportID     int    `schema:"sport_id" json:"sport_id"`
		LeagueGroup string `schema:"league_group" json:"league_group"`
	}

	var p Params
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err = database.DeleteMasterLeagueGroup(p.SportID, stampUser, p.LeagueGroup)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
