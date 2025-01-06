package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPILeagueSequence() {
	Base.HandleFunc("/league-sequence", listTableMasterLeagueSequence).Methods(http.MethodGet)
	Base.HandleFunc("/league-sequence/swap", masterLeagueSequenceSwap).Methods(http.MethodPut)
	Base.HandleFunc("/league-sequence/swap-special", masterLeagueSequenceSwapSpecial).Methods(http.MethodPut)
	Base.HandleFunc("/league-sequence/special", listTableMasterLeagueSequenceSpecial).Methods(http.MethodGet)
}

func listTableMasterLeagueSequence(w http.ResponseWriter, r *http.Request) {
	type Params struct {
		IsShowAll     string `schema:"is_show_all"`
		MatchTimeSlot string `schema:"match_time"`
		SportId       int    `schema:"sport_id"`
	}
	var p Params
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	res, err := database.ListLeagueSequence(p.IsShowAll, p.MatchTimeSlot, p.SportId, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func masterLeagueSequenceSwap(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchTimeSlot string `json:"match_time"`
		NoEvents1     int    `json:"no_events_1"`
		NoEvents2     int    `json:"no_events_2"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateLeagueSequenceSwap(p.MatchTimeSlot, p.NoEvents1, p.NoEvents2, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func masterLeagueSequenceSwapSpecial(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchTimeSlot  string `json:"match_time"`
		NoEvents1      int    `json:"no_events_1"`
		NoEvents2      int    `json:"no_events_2"`
		LeagueParentID int    `json:"league_parent_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateLeagueSequenceSwapSpecial(p.MatchTimeSlot, p.NoEvents1, p.NoEvents2, p.LeagueParentID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listTableMasterLeagueSequenceSpecial(w http.ResponseWriter, r *http.Request) {
	type Params struct {
		ParentLeagueID int    `schema:"parent_league_id"`
		MatchTimeSlot  string `schema:"match_time"`
	}
	var p Params
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	res, err := database.ListLeagueSequenceSpecial(p.MatchTimeSlot, p.ParentLeagueID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
