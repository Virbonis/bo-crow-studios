package router

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIBTIAutoAddMatch() {
	Base.HandleFunc("/bti-auto-add-match/league/select", listBTILeagueAutoAddMatch).Methods(http.MethodGet)
	Base.HandleFunc("/bti-auto-add-match", listBTIAutoAddMatch).Methods(http.MethodGet)
	Base.HandleFunc("/bti-auto-add-match", insBTIAutoAddMatch).Methods(http.MethodPut)
}

func listBTILeagueAutoAddMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MappingStatus int    `schema:"mapping_status"`
		MSportID      int    `schema:"m_sport_id"`
		MatchDateFrom string `schema:"from_early_date"`
		MatchDateTo   string `schema:"to_early_date"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListBTILeagueAutoAddMatch(p.MappingStatus, p.MSportID, p.MatchDateFrom, p.MatchDateTo, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}

func listBTIAutoAddMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MappingStatus int    `schema:"mapping_status"`
		MSportID      int    `schema:"m_sport_id"`
		LeagueID      string `schema:"league_id"`
		MatchID       int    `schema:"match_id"`
		MatchDateFrom string `schema:"from_early_date"`
		MatchDateTo   string `schema:"to_early_date"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result, err := database.ListBTIAutoAddMatch(p.MappingStatus, p.MSportID, p.LeagueID, p.MatchID, p.MatchDateFrom, p.MatchDateTo, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func insBTIAutoAddMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BTIMatchIDs []string `json:"bti_match_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, BTIMatchID := range p.BTIMatchIDs {
		err := database.InsBTIAutoAddMatch(BTIMatchID, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())
		}
	}

	if listErr != nil {
		httpError(w, http.StatusBadRequest, strings.Join(listErr, "\n"))
		return
	}
	writeJSON(w, statusSuccess, 0)
}
