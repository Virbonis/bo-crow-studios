package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIOutright() {
	Base.HandleFunc("/outright", createOutright).Methods(http.MethodPost)
	Base.HandleFunc("/outright", listOutright).Methods(http.MethodGet)
	Base.HandleFunc("/outright", deleteOutright).Methods(http.MethodDelete)
	Base.HandleFunc("/outright/team", listOutrightTeam).Methods(http.MethodGet)
	Base.HandleFunc("/outright/edit", getEditOutright).Methods(http.MethodGet)
	Base.HandleFunc("/outright/edit", middleware.AuthorizationAPIMiddlewareDisallow(
		updateEditOutright,
		helper.DISALLOW_EDIT_OUTRIGHT)).Methods(http.MethodPut)
}

func createOutright(w http.ResponseWriter, r *http.Request) {
	var p struct {
		SportID            int     `json:"sport_id"`
		LeagueID           int     `json:"league_id"`
		OutrightDate       string  `json:"outright_date"`
		MaxPayout          float64 `json:"max_payout"`
		PriceStep          float64 `json:"price_step"`
		LimitChange        float64 `json:"limit_change"`
		OutrightOpenStatus string  `json:"outright_open_status"`
		Teams              []struct {
			TeamSeq         int     `json:"team_seq"`
			TeamOdds        float64 `json:"team_odds"`
			TeamOpenStatus  string  `json:"team_open_status"`
			TeamPauseStatus string  `json:"team_pause_status"`
			TeamID          int     `json:"team_id"`
		} `json:"teams"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	outrightId, err := database.CreateOutright(p.SportID, p.LeagueID, p.OutrightDate, p.MaxPayout, p.PriceStep, p.LimitChange, p.OutrightOpenStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, v := range p.Teams {
		err := database.CreateOutrightTeam(outrightId, v.TeamSeq, v.TeamOdds, v.TeamOpenStatus, v.TeamPauseStatus, v.TeamID, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())

		}
	}
	if len(listErr) > 0 {
		errorMessage := fmt.Sprintf("Create Outright Team for this outright ids: %s is failed", strings.Join(listErr, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func listOutright(w http.ResponseWriter, r *http.Request) {
	var p struct {
		FromDate               string `schema:"from_date"`
		ToDate                 string `schema:"to_date"`
		SportID                int    `schema:"sport_id"`
		OutrightID             int    `schema:"outright_id"`
		OutrightOpenStatus     string `schema:"outright_open_status"`
		OutrightDeadHeatStatus string `schema:"outright_dead_heat_status"`
		OutrightScoreStatus    string `schema:"outright_score_status"`
		CurrentPage            int    `schema:"current_page"`
		PageSize               int    `schema:"page_size"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	res, total, err := database.ListOutright(p.FromDate, p.ToDate, p.SportID, p.OutrightID, p.OutrightOpenStatus, p.OutrightDeadHeatStatus, p.OutrightScoreStatus, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}
func deleteOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		OutrightID int `schema:"outright_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err = database.DeleteOutright(p.OutrightID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listOutrightTeam(w http.ResponseWriter, r *http.Request) {
	var p struct {
		OutrightID int `schema:"outright_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	res, err := database.ListOutrightTeam(p.OutrightID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func getEditOutright(w http.ResponseWriter, r *http.Request) {
	var p struct {
		OutrightID int `schema:"outright_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	outright, err := database.GetUpdateOutright(p.OutrightID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	team, err := database.ListUpdateOutrightTeam(p.OutrightID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result := map[string]interface{}{
		"outright": outright,
		"team":     team,
	}

	writeJSON(w, statusSuccess, result)
}
func updateEditOutright(w http.ResponseWriter, r *http.Request) {
	var p struct {
		OutrightID             int     `json:"outright_id"`
		OutrightDate           string  `json:"outright_date"`
		MaxPayout              float64 `json:"max_payout"`
		PriceStep              float64 `json:"price_step"`
		LimitChange            float64 `json:"limit_change"`
		OutrightOpenStatus     string  `json:"outright_open_status"`
		OutrightDeadHeatStatus string  `json:"outright_dead_heat_status"`
		Teams                  []struct {
			TeamSeq         int     `json:"team_seq"`
			TeamOdds        float64 `json:"team_odds"`
			TeamOpenStatus  string  `json:"team_open_status"`
			TeamPauseStatus string  `json:"team_pause_status"`
			IsExist         bool    `json:"is_exist"`
			TeamID          int     `json:"team_id"`
		} `json:"teams"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.UpdateOutright(p.OutrightID, p.OutrightDate, p.MaxPayout, p.PriceStep, p.LimitChange, p.OutrightOpenStatus, p.OutrightDeadHeatStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, v := range p.Teams {
		if v.IsExist {
			err := database.UpdateOutrightTeam(p.OutrightID, v.TeamID, v.TeamSeq, v.TeamOdds, v.TeamOpenStatus, v.TeamPauseStatus, stampUser)
			if err != nil {
				listErr = append(listErr, err.Error())
			}
		} else {
			err := database.CreateOutrightTeam(p.OutrightID, v.TeamSeq, v.TeamOdds, v.TeamOpenStatus, v.TeamPauseStatus, v.TeamID, stampUser)
			if err != nil {
				listErr = append(listErr, err.Error())
			}
		}

	}
	if len(listErr) > 0 {
		errorMessage := fmt.Sprintf("Update Outright Team for this outright ids: %s is failed", strings.Join(listErr, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
