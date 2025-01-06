package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIUserTeam() {
	Base.HandleFunc("/user-team/select", listSelectUserTeam).Methods(http.MethodGet)
	Base.HandleFunc("/user-team", listUserTeam).Methods(http.MethodGet)
	Base.HandleFunc("/user-team", middleware.AuthorizationAPIMiddleware(
		addUserTeam,
		helper.ALLOWED_TO_ADD_USER_TEAM)).Methods(http.MethodPost)
	Base.HandleFunc("/user-team", updUserTeam).Methods(http.MethodPut)
	Base.HandleFunc("/user-team", middleware.AuthorizationAPIMiddleware(
		delUserTeam,
		helper.ALLOWED_TO_DELETE_USER_TEAM)).Methods(http.MethodDelete)
	Base.HandleFunc("/user-team/user", listUserUserTeam).Methods(http.MethodGet)
	Base.HandleFunc("/user-team/user", updUserUserTeam).Methods(http.MethodPut)

	Base.HandleFunc("/user-team/team-sub", listUserTeamSub).Methods(http.MethodGet)
	Base.HandleFunc("/user-team/team-sub", addUserTeamSub).Methods(http.MethodPost)
	Base.HandleFunc("/user-team/team-sub", updUserTeamSub).Methods(http.MethodPut)
	Base.HandleFunc("/user-team/team-sub", delUserTeamSub).Methods(http.MethodDelete)
	Base.HandleFunc("/user-team/team-sub/user", listUserUserTeamSub).Methods(http.MethodGet)
	Base.HandleFunc("/user-team/team-sub/user", updUserUserTeamSub).Methods(http.MethodPut)
	Base.HandleFunc("/user-team/team-sub/league", listLeagueUserTeamSub).Methods(http.MethodGet)
	Base.HandleFunc("/user-team/team-sub/league", updLeagueUserTeamSub).Methods(http.MethodPut)
}

func listSelectUserTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListSelectUserTeam(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listUserTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamID int `schema:"team_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListUserTeam(p.TeamID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func addUserTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamName string `json:"team_name"`
		IsActive string `json:"is_active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.AddUserTeam(p.TeamName, p.IsActive, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func updUserTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamID   int    `json:"team_id"`
		TeamName string `json:"team_name"`
		IsActive string `json:"is_active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdUserTeam(p.TeamID, p.TeamName, p.IsActive, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, 0)
}
func delUserTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamID int `schema:"team_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.DelUserTeam(p.TeamID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func listUserUserTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamID int `schema:"team_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListUserUserTeam(p.TeamID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func updUserUserTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamID int    `json:"team_id"`
		UserID string `json:"user_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdUserUserTeam(p.TeamID, p.UserID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, 0)
}

func listUserTeamSub(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamID int `schema:"team_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListUserTeamSub(p.TeamID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func addUserTeamSub(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamID      int    `json:"team_id"`
		TeamSubName string `json:"team_sub_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.AddUserTeamSub(p.TeamID, p.TeamSubName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func updUserTeamSub(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamID   int    `json:"team_id"`
		TeamName string `json:"team_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdUserTeamSub(p.TeamID, p.TeamName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, 0)
}
func delUserTeamSub(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamSubID int `schema:"user_team_sub_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.DelUserTeamSub(p.TeamSubID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func listUserUserTeamSub(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamID int `schema:"team_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListUserUserTeamSub(p.TeamID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func updUserUserTeamSub(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamID int    `json:"team_id"`
		UserID string `json:"user_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdUserUserTeamSub(p.TeamID, p.UserID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, 0)
}

func listLeagueUserTeamSub(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		UserTeamID    int    `schema:"user_team_id"`
		UserTeamSubID int    `schema:"user_team_sub_id"`
		SportID       int    `schema:"sport_id"`
		League        string `schema:"league"`
		CurrentPage   int    `schema:"current_page"`
		PageSize      int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, total, err := database.ListLeagueUserTeamSub(p.UserTeamID, p.UserTeamSubID, p.SportID, p.League, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	ret := model.ResultWithTotal{
		Total:  total,
		Result: result,
	}
	writeJSON(w, statusSuccess, ret)
}
func updLeagueUserTeamSub(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		UserTeamID    int    `json:"user_team_id"`
		UserTeamSubID int    `json:"user_team_sub_id"`
		SportID       int    `json:"sport_id"`
		LeagueRemoved string `json:"league_removed"`
		LeagueAdded   string `json:"league_added"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdLeagueUserTeamSub(p.UserTeamID, p.UserTeamSubID, p.SportID, p.LeagueRemoved, p.LeagueAdded, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, 0)
}
