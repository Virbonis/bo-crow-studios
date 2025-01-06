package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMappingRBall() {
	Base.HandleFunc("/mapping-rb/league", listMappingRBLeague).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-rb/league", updateMappingRBLeague).Methods(http.MethodPut)
	Base.HandleFunc("/mapping-rb/team", listMappingRBTeam).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-rb/team", updateMappingRBTeam).Methods(http.MethodPut)
	Base.HandleFunc("/mapping-rb/match/select/league", listLeagueMappingRBMatch).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-rb/match/select/league-rb", listLeagueRBMappingRBMatch).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-rb/match", listMatchMappingRBMatch).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-rb/match-rb", listMatchRBMappingRBMatch).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-rb/match", updateMappingRBMatch).Methods(http.MethodPut)
}

func listMappingRBLeague(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID       int    `schema:"sport_id"`
		RBLeagueName  string `schema:"rb_league_name"`
		OurLeagueName string `schema:"our_league_name"`
		Unmapped      string `schema:"unmapped"`
		CurrentPage   int    `schema:"current_page"`
		PageSize      int    `schema:"page_size"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListMappingRBLeague(p.SportID, p.RBLeagueName, p.OurLeagueName, p.Unmapped, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}
func updateMappingRBLeague(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		RBLeagueID  int `json:"rb_league_id"`
		OurLeagueID int `json:"our_league_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var errMessage []string

	for _, v := range p {
		err := database.UpdateMappingRBLeague(v.RBLeagueID, v.OurLeagueID, stampUser)
		if err != nil {
			errMessage = append(errMessage, err.Error())
		}
	}

	if len(errMessage) > 0 {
		errorMessage := fmt.Sprintf("Error when update Data")
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listMappingRBTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID     int    `schema:"sport_id"`
		RBTeamName  string `schema:"rb_team_name"`
		OurTeamName string `schema:"our_team_name"`
		Unmapped    string `schema:"unmapped"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListMappingRBTeam(p.SportID, p.RBTeamName, p.OurTeamName, p.Unmapped, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}
func updateMappingRBTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		RBTeamID  int `json:"rb_team_id"`
		OurTeamID int `json:"our_team_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var errMessage []string

	for _, v := range p {
		err := database.UpdateMappingRBTeam(v.RBTeamID, v.OurTeamID, stampUser)
		if err != nil {
			errMessage = append(errMessage, err.Error())
		}
	}

	if len(errMessage) > 0 {
		errorMessage := fmt.Sprintf("Error when update Data")
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listLeagueMappingRBMatch(w http.ResponseWriter, r *http.Request) {
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

	res, err := database.ListLeagueMappingRBMatch(p.MatchDate, p.MatchDate, p.SportID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func listLeagueRBMappingRBMatch(w http.ResponseWriter, r *http.Request) {
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

	res, err := database.ListLeagueRBMappingRBMatch(p.SportID, p.MatchDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func listMatchMappingRBMatch(w http.ResponseWriter, r *http.Request) {
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

	res, err := database.ListMatchMappingRBMatch(p.SportID, p.LeagueID, p.MatchDate, p.MatchDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for i, v := range res {
		sportTickerID := v.SportsTickerID
		result, err := database.ListMatchMappingRBMatchByID(sportTickerID, stampUser)
		t, err := time.Parse(time.RFC3339, result.RBMatchDate)
		if result != nil && result.SportsTickerID != 0 {
			res[i].RBAwayName = result.RBAwayName
			res[i].RBHomeName = result.RBHomeName
			res[i].RBLeague = result.RBLeague
			res[i].RBMatchDate = t.Format("02 January 2006 15:04") // Convert the time value to the desired string format
		}

		if err != nil {
			listErr = append(listErr, err.Error())
		}
	}
	writeJSON(w, statusSuccess, res)
}
func listMatchRBMappingRBMatch(w http.ResponseWriter, r *http.Request) {
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

	result, err := database.ListMatchRBMappingRBMatch(p.LeagueID, p.MatchDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func updateMappingRBMatch(w http.ResponseWriter, r *http.Request) {
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
		err := database.UpdateMappingRBMatch(v.MatchID, v.SportsTickerID, stampUser)
		if err != nil {
			errMessage = append(errMessage, err.Error())
		}
	}

	if len(errMessage) > 0 {
		errorMessage := fmt.Sprintf("Update Match Mapping is failed:\n %s", strings.Join(errMessage, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
