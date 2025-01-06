package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMappingGLiveStream() {
	Base.HandleFunc("/mapping-gls/match/select/league", listLeagueMappingGLive).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-gls/match/select/league-gl", listLeagueGLMappingGLive).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-gls/match", listMatchMappingGLive).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-gls/match-gl", listMatchGLMappingGLive).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-gls/match", updateMappingGLive).Methods(http.MethodPut)
}

func listLeagueMappingGLive(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID   int    `schema:"sport_id"`
		MatchDate string `schema:"match_date"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListLeagueMappingGLive(p.SportID, p.MatchDate, p.MatchDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func listLeagueGLMappingGLive(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID   int    `schema:"sport_id"`
		MatchDate string `schema:"match_date"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListLeagueGLMappingGLive(p.SportID, p.MatchDate, p.MatchDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listMatchMappingGLive(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID   int    `schema:"sport_id"`
		MatchDate string `schema:"match_date"`
		LeagueID  int    `schema:"league_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListMatchMappingGLive(p.SportID, p.LeagueID, p.MatchDate, p.MatchDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func listMatchGLMappingGLive(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID   int    `schema:"sport_id"`
		MatchDate string `schema:"match_date"`
		GLeague   string `schema:"g_league"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListMatchGLMappingGLive(p.SportID, p.GLeague, p.MatchDate, p.MatchDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func updateMappingGLive(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		MatchID  int `json:"match_id"`
		GMatchID int `json:"g_match_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var errMessage []string
	for _, v := range p {
		err := database.UpdateMappingGLive(v.MatchID, v.GMatchID, stampUser)
		if err != nil {
			errMessage = append(errMessage, err.Error())
		}
	}

	if len(errMessage) > 0 {
		errorMessage := fmt.Sprintf("Update Mapping GLiveStream is failed:\n%s", strings.Join(errMessage, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
