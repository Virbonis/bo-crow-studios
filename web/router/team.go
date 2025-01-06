package router

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPITeam() {
	Base.HandleFunc("/team", listMasterTeam).Methods(http.MethodGet)
	Base.HandleFunc("/team", createMasterTeam).Methods(http.MethodPost)
	Base.HandleFunc("/team", updateMasterTeam).Methods(http.MethodPut)
	Base.HandleFunc("/team", middleware.AuthorizationAPIMiddleware(
		deleteMasterTeam,
		helper.ALLOWED_DELETE_MASTER_TEAM)).Methods(http.MethodDelete)
	Base.HandleFunc("/team/detail", getDetailCountryMasterTeam).Methods(http.MethodGet)
	Base.HandleFunc("/team/country", updateCountryMasterTeam).Methods(http.MethodPut)
	Base.HandleFunc("/team/select/add-match", listTeamAddMatch).Methods(http.MethodGet)
	Base.HandleFunc("/team/select/standingsknockout", listTeamStandingsKnockout).Methods(http.MethodGet)
	Base.HandleFunc("/team/select/add-outright", listTeamAddOutright).Methods(http.MethodGet)
	Base.HandleFunc("/team/select/mapping-team", listTeamMappingTeam).Methods(http.MethodGet)
	Base.HandleFunc("/team/select/mapping-team-rball", listTeamMappingTeamRBall).Methods(http.MethodGet)
}

func listMasterTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamId      int    `schema:"team_id"`
		SportId     int    `schema:"sport_id"`
		TeamName    string `schema:"team_name_en"`
		ShortName   string `schema:"short_name"`
		Active      string `schema:"active"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, total, err := database.ListMasterTeam(p.TeamId, p.SportId, p.TeamName, p.ShortName, p.Active, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultWithTotal := model.ResultWithTotal{Result: result, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}
func createMasterTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportId    int    `json:"sport_id"`
		Active     string `json:"active"`
		ShortName  string `json:"shortname"`
		TeamNameEN string `json:"team_name_en"`
		TeamNameCN string `json:"team_name_cn"`
		TeamNameTW string `json:"team_name_tw"`
		TeamNameTH string `json:"team_name_th"`
		TeamNameJP string `json:"team_name_jp"`
		TeamNameKR string `json:"team_name_kr"`
		TeamNameVN string `json:"team_name_vn"`
		TeamNameID string `json:"team_name_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	if p.TeamNameCN == "" {
		p.TeamNameCN = p.TeamNameEN
	}
	if p.TeamNameTW == "" {
		p.TeamNameTW = p.TeamNameEN
	}
	if p.TeamNameTH == "" {
		p.TeamNameTH = p.TeamNameEN
	}
	if p.TeamNameJP == "" {
		p.TeamNameJP = p.TeamNameEN
	}
	if p.TeamNameKR == "" {
		p.TeamNameKR = p.TeamNameEN
	}
	if p.TeamNameVN == "" {
		p.TeamNameVN = p.TeamNameEN
	}
	if p.TeamNameID == "" {
		p.TeamNameID = p.TeamNameEN
	}

	err := database.CreateMasterTeam(p.SportId, p.Active,
		p.ShortName, p.TeamNameEN, p.TeamNameCN, p.TeamNameTW, p.TeamNameTH, p.TeamNameJP, p.TeamNameKR, p.TeamNameVN, p.TeamNameID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func updateMasterTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	type List struct {
		TeamID     int    `json:"team_id"`
		Active     string `json:"active"`
		Shortname  string `json:"short_name"`
		TeamNameEN string `json:"team_name_en"`
		TeamNameCN string `json:"team_name_cn"`
		TeamNameTW string `json:"team_name_tw"`
		TeamNameTH string `json:"team_name_th"`
		TeamNameJP string `json:"team_name_jp"`
		TeamNameKR string `json:"team_name_kr"`
		TeamNameVN string `json:"team_name_vn"`
		TeamNameID string `json:"team_name_id"`
	}

	var p []List
	var tempErr []string
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	for _, data := range p {
		err := database.UpdateMasterTeam(data.TeamID, data.Active,
			data.Shortname, data.TeamNameEN, data.TeamNameCN, data.TeamNameTW, data.TeamNameTH, data.TeamNameJP, data.TeamNameKR, data.TeamNameVN, data.TeamNameID, stampUser)
		if err != nil {
			tempErr = append(tempErr, err.Error())
		}
		err = database.UpdateTeamName(data.TeamID, data.TeamNameEN, stampUser)
		if err != nil {
			tempErr = append(tempErr, err.Error())
		}

		cache.DeleteTournamentByTeamID(data.TeamID)
	}
	if len(tempErr) > 0 {
		httpError(w, http.StatusBadRequest, strings.Join(tempErr, "\n"))
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func deleteMasterTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamId int `schema:"team_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.DeleteMasterTeam(p.TeamId, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func getDetailCountryMasterTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamId int `schema:"team_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.GetDetailMasterTeam(p.TeamId, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func updateCountryMasterTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamID  int    `json:"team_id"`
		Country string `json:"country"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateCountryMasterTeam(p.TeamID, p.Country, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	cache.DeleteTournamentByTeamID(p.TeamID)
	writeJSON(w, statusSuccess, "OK")
}

func listTeamAddMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Website  string `schema:"website"`
		SportId  int    `schema:"sport_id"`
		TeamName string `schema:"team_name"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListTeamAddMatch(p.Website, p.SportId, p.TeamName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func listTeamStandingsKnockout(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		TeamName string `schema:"team_name"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	// same sp with add-match, website "ALL", sport_id soccer
	result, err := database.ListTeamAddMatch("ALL", 10, p.TeamName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listTeamAddOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID  int    `schema:"sport_id"`
		TeamName string `schema:"team_name"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListTeamAddOutright(p.SportID, p.TeamName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listTeamMappingTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID  int    `schema:"sport_id"`
		TeamName string `schema:"team_name"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListTeamMappingTeam(p.SportID, p.TeamName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listTeamMappingTeamRBall(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID  int    `schema:"sport_id"`
		TeamName string `schema:"team_name"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListTeamMappingTeamRBall(p.SportID, p.TeamName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
