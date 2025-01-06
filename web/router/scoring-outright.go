package router

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIScorintOutright() {
	Base.HandleFunc("/scoring-outright", getListScoringOutmatch).Methods(http.MethodGet)
	Base.HandleFunc("/scoring-outright/team", getListScoringOutmatchTeam).Methods(http.MethodGet)
	Base.HandleFunc("/scoring-outright/team", upateListScoringOutmatchTeam).Methods(http.MethodPut)
	Base.HandleFunc("/scoring-outright/team", deleteListScoringOutmatchTeam).Methods(http.MethodDelete)
}

func getListScoringOutmatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateFrom      string `schema:"date_from"`
		DateTo        string `schema:"date_to"`
		SportID       int    `schema:"sport_id"`
		ScoringStatus string `schema:"scoring_status"`
		CurrentPage   int    `schema:"current_page"`
		PageSize      int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.GetListScoringOutmatch(p.DateFrom, p.DateTo, p.SportID, p.ScoringStatus, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, result)
}

func getListScoringOutmatchTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		OutrightID int `schema:"outright_id"`
		LeagueID   int `schema:"league_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.GetListScoringOutmatchTeam(p.OutrightID, p.LeagueID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func upateListScoringOutmatchTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var listErr []string
	var p []struct {
		OutrightID int    `json:"outright_id"`
		LeagueID   int    `json:"league_id"`
		TeamID     string `json:"team_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	for _, data := range p {
		err := database.UpateListScoringOutmatchTeam(data.OutrightID, data.LeagueID, data.TeamID, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())
		}
	}
	if len(listErr) > 0 {
		httpError(w, http.StatusBadRequest, strings.Join(listErr, "\n"))
		return
	}

	writeJSON(w, statusSuccess, 0)
}

func deleteListScoringOutmatchTeam(w http.ResponseWriter, r *http.Request) {

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		OutrightID int `schema:"outright_id"`
		LeagueID   int `schema:"league_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.DeleteListScoringOutmatchTeam(p.OutrightID, p.LeagueID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, 0)
}
