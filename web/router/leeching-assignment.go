package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPILeechingAssignment() {
	Base.HandleFunc("/leeching-assignment/sport", listLeechingAssignmentSport).Methods(http.MethodGet)
	Base.HandleFunc("/leeching-assignment/league", listLeechingAssignmentLeague).Methods(http.MethodGet)
	Base.HandleFunc("/leeching-assignment/sport", middleware.AuthorizationAPIMiddleware(
		updateLeechingAssignmentSport,
		helper.WHO_CAN_CHANGE_LEECHING_ASSIGNMENT)).Methods(http.MethodPut)
	Base.HandleFunc("/leeching-assignment/league", middleware.AuthorizationAPIMiddleware(
		updateLeechingAssignmentLeague,
		helper.WHO_CAN_CHANGE_LEECHING_ASSIGNMENT)).Methods(http.MethodPut)
}

func listLeechingAssignmentSport(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListLeechingAssignmentSport(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listLeechingAssignmentLeague(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID     int    `schema:"sport_id"`
		LeagueName  string `schema:"league_name"`
		PriceGroup  int    `schema:"price_group"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, totalRecords, err := database.ListLeechingAssignmentLeague(p.SportID, p.LeagueName, p.PriceGroup, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	type Result struct {
		Result       interface{} `json:"result"`
		TotalRecords int         `json:"total"`
	}

	var res = Result{Result: result, TotalRecords: totalRecords}

	writeJSON(w, statusSuccess, res)
}

func updateLeechingAssignmentSport(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		SportID    int `json:"sport_id"`
		DBAutoOdds int `json:"db_auto_odds"`
		RBAutoOdds int `json:"rb_auto_odds"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var listErr []string
	for _, v := range p {
		err := database.UpdateLeechingAssignmentSport(v.SportID, v.DBAutoOdds, v.RBAutoOdds, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())

		}
	}
	if len(listErr) > 0 {
		errorMessage := fmt.Sprintf("Update for this sport ids: %s is failed", strings.Join(listErr, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateLeechingAssignmentLeague(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		LeagueID   int `json:"league_id"`
		DBAutoOdds int `json:"db_auto_odds"`
		RBAutoOdds int `json:"rb_auto_odds"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var listErr []string
	for _, v := range p {
		err := database.UpdateLeechingAssignmentLeague(v.LeagueID, v.DBAutoOdds, v.RBAutoOdds, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())

		}
	}
	if len(listErr) > 0 {
		errorMessage := fmt.Sprintf("Update for this league ids: %s is failed", strings.Join(listErr, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
