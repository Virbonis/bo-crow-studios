package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIKnockouts() {
	Base.HandleFunc("/knockouts/category", listKnockoutsCategory).Methods(http.MethodGet)
	Base.HandleFunc("/knockouts", listKnockouts).Methods(http.MethodGet)
	Base.HandleFunc("/knockouts", createKnockouts).Methods(http.MethodPost)
	Base.HandleFunc("/knockouts", updateKnockouts).Methods(http.MethodPut)
	Base.HandleFunc("/knockouts", deleteKnockouts).Methods(http.MethodDelete)
}

func listKnockoutsCategory(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	res, err := database.ListKnockoutsCategory(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func listKnockouts(w http.ResponseWriter, r *http.Request) {
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
	rows, err := database.ListKnockouts(p.Category, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, rows)
}
func createKnockouts(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Category       string `json:"category"`
		KnockoutsID    int    `json:"knockouts_id"`
		KnockoutsRound int    `json:"knockouts_round"`
		TeamID1        int    `json:"team_id_1"`
		TeamID2        int    `json:"team_id_2"`
		MatchDate      string `json:"match_date"`
		Result         string `json:"result"`
		ResultState    string `json:"results_state"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.CreateKnockouts(p.KnockoutsID, p.KnockoutsRound, p.TeamID1, p.TeamID2, p.MatchDate, p.Category, p.Result, p.ResultState, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cache.DeleteTournament(p.Category)
	resetRedisKnockoutsTeam(p.Category, stampUser)
	writeJSON(w, statusSuccess, 0)
}
func updateKnockouts(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		RowID          int    `json:"row_id"`
		Category       string `json:"category"`
		KnockoutsID    int    `json:"knockouts_id"`
		KnockoutsRound int    `json:"knockouts_round"`
		TeamID1        int    `json:"team_id_1"`
		TeamID2        int    `json:"team_id_2"`
		MatchDate      string `json:"match_date"`
		Result         string `json:"result"`
		ResultState    string `json:"results_state"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateKnockouts(p.RowID, p.KnockoutsID, p.KnockoutsRound, p.TeamID1, p.TeamID2, p.Category, p.MatchDate, p.Result, p.ResultState, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cache.DeleteTournament(p.Category)
	resetRedisKnockoutsTeam(p.Category, stampUser)
	writeJSON(w, statusSuccess, 0)
}
func deleteKnockouts(w http.ResponseWriter, r *http.Request) {
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
	err := database.DeleteKnockouts(p.RowID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cache.DeleteTournament(p.Category)
	resetRedisKnockoutsTeam(p.Category, stampUser)
	writeJSON(w, statusSuccess, 0)
}

func resetRedisKnockoutsTeam(category, stampUser string) {
	res, err := database.ListKnockouts(category, stampUser)
	if err != nil {
		return
	}

	teams := []model.TeamSelect{}
	for _, v := range res {
		if v.TeamID1 != 0 {
			teams = append(teams, model.TeamSelect{
				NoTeam:   v.TeamID1,
				TeamName: v.HomeName,
			})
		}
		if v.TeamID2 != 0 {
			teams = append(teams, model.TeamSelect{
				NoTeam:   v.TeamID2,
				TeamName: v.AwayName,
			})
		}
	}
	cache.SetKnockOutsAllTeams(category, teams)
}
