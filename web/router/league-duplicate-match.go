package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPILeagueDuplicateMatch() {
	Base.HandleFunc("/league-duplicate-match", getTableMasterLeagueDuplicateMatch).Methods(http.MethodGet)
	Base.HandleFunc("/league-duplicate-match/search", searchMasterLeagueDuplicateMatch).Methods(http.MethodGet)
	Base.HandleFunc("/league-duplicate-match", insertMasterLeagueDuplicateMatch).Methods(http.MethodPost)
	Base.HandleFunc("/league-duplicate-match", deleteMasterLeagueDuplicateMatch).Methods(http.MethodDelete)
}

func getTableMasterLeagueDuplicateMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	type Params struct {
		SportID int `schema:"sport_id"`
	}

	var p Params
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListLeagueDuplicateMatch(p.SportID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func insertMasterLeagueDuplicateMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		LeagueIDs string `json:"league_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.InsertLeagueDuplicateMatch(p.LeagueIDs, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func searchMasterLeagueDuplicateMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID    int    `schema:"sport_id"`
		LeagueID   int    `schema:"league_id"`
		LeagueName string `schema:"league_name"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.SearchLeagueDuplicateMatch(p.SportID, p.LeagueID, p.LeagueName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func deleteMasterLeagueDuplicateMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	type Params struct {
		LeagueID int `json:"league_id"`
	}

	var p Params
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.DeleteLeagueDuplicateMatch(p.LeagueID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
