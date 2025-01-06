package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMappingBG() {
	Base.HandleFunc("/mapping-bg/match/select/league", listLeagueMappingBGMatch).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-bg/match/select/league-bg", listLeagueBGMappingBGMatch).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-bg/match", listMatchMappingBGMatch).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-bg/match-bg", listMatchBGMappingBGMatch).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-bg/match", updateMappingBGMatch).Methods(http.MethodPut)

	Base.HandleFunc("/mapping-bg/game-event", listBGGameEvent).Methods(http.MethodGet)
}

func listLeagueMappingBGMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchDate       string `schema:"match_date"`
		SportID         int    `schema:"sport_id"`
		IsFinishedMatch string `schema:"is_finished_match"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListLeagueMappingBGMatch(p.MatchDate, p.MatchDate, p.SportID, p.IsFinishedMatch, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func listLeagueBGMappingBGMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID   int    `schema:"sport_id"`
		MatchDate string `schema:"match_date"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListLeagueBGMappingBGMatch(p.SportID, p.MatchDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listMatchMappingBGMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID         int    `schema:"sport_id"`
		MatchDate       string `schema:"match_date"`
		IsFinishedMatch string `schema:"is_finished_match"`
		LeagueID        int    `schema:"league_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListMatchMappingBGMatch(p.SportID, p.LeagueID, p.MatchDate, p.MatchDate, p.IsFinishedMatch, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func listMatchBGMappingBGMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchDate string `schema:"match_date"`
		LeagueID  int    `schema:"league_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListMatchBGMappingBGMatch(p.LeagueID, p.MatchDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateMappingBGMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		MatchID        int `json:"match_id"`
		SportsTickerID int `json:"sports_ticker_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var errMessage []string
	for _, v := range p {
		err := database.UpdateMappingBGMatch(v.MatchID, v.SportsTickerID, stampUser)
		if err != nil {
			errMessage = append(
				errMessage,
				strings.ReplaceAll(err.Error(), `\n`, " "), // remove \n from sp
			)
		}
	}

	if len(errMessage) > 0 {
		errorMessage := fmt.Sprintf("Update Mapping BG Match is failed:\n%s", strings.Join(errMessage, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listBGGameEvent(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID        int `schema:"match_id"`
		SportsTickerID int `schema:"sports_ticker_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListBGGameEvent(p.MatchID, p.SportsTickerID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
