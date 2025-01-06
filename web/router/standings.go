package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIStandings() {
	Base.HandleFunc("/standings/category", listStandingsCategory).Methods(http.MethodGet)
	Base.HandleFunc("/standings", listStandings).Methods(http.MethodGet)
	Base.HandleFunc("/standings", createStandings).Methods(http.MethodPost)
	Base.HandleFunc("/standings", updateStandings).Methods(http.MethodPut)
	Base.HandleFunc("/standings", deleteStandings).Methods(http.MethodDelete)
}

func listStandingsCategory(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	res, err := database.ListStandingsCategory(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func listStandings(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Category string `schema:"category"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListStandings(p.Category, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func createStandings(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Category   string `json:"category"`
		GroupName  string `json:"group_name"`
		NoTeam     int    `json:"team_id"`
		Play       int    `json:"play"`
		Win        int    `json:"win"`
		Draw       int    `json:"draw"`
		Lose       int    `json:"lose"`
		Goal       int    `json:"goal"`
		Conceded   int    `json:"conceded"`
		Points     int    `json:"points"`
		SortNumber int    `json:"sort_number"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.CreateStandings(p.NoTeam, p.Play, p.Win, p.Draw, p.Lose, p.Goal, p.Conceded, p.Points, p.SortNumber, p.Category, p.GroupName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cache.DeleteTournament(p.Category)
	resetRedisStandingsTeam(p.Category, stampUser)
	writeJSON(w, statusSuccess, 0)
}
func updateStandings(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		RowID      int    `json:"row_id"`
		Category   string `json:"category"`
		GroupName  string `json:"group_name"`
		NoTeam     int    `json:"team_id"`
		Play       int    `json:"play"`
		Win        int    `json:"win"`
		Draw       int    `json:"draw"`
		Lose       int    `json:"lose"`
		Goal       int    `json:"goal"`
		Conceded   int    `json:"conceded"`
		Points     int    `json:"points"`
		SortNumber int    `json:"sort_number"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateStandings(p.RowID, p.NoTeam, p.Play, p.Win, p.Draw, p.Lose, p.Goal, p.Conceded, p.Points, p.SortNumber, p.Category, p.GroupName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cache.DeleteTournament(p.Category)
	resetRedisStandingsTeam(p.Category, stampUser)
	writeJSON(w, statusSuccess, 0)
}
func deleteStandings(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Category string `json:"category"`
		RowID    int    `schema:"row_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.DeleteStandings(p.RowID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cache.DeleteTournament(p.Category)
	resetRedisStandingsTeam(p.Category, stampUser)
	writeJSON(w, statusSuccess, 0)
}

func resetRedisStandingsTeam(category string, stampUser string) {
	res, err := database.ListStandings(category, stampUser)
	if err != nil {
		return
	}

	teams := []model.TeamSelect{}
	for _, v := range res {
		teams = append(teams, model.TeamSelect{
			NoTeam:   v.NoTeam,
			TeamName: v.NameTeamEN,
		})
	}
	cache.SetStandingsAllTeams(category, teams)
}
