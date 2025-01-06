package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMatchStatistic() {
	Base.HandleFunc("/match-statistic", listMatchStatistic).Methods(http.MethodGet)
	Base.HandleFunc("/match-statistic", updateMatchStatistic).Methods(http.MethodPut)
}

func listMatchStatistic(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateStart   string `schema:"date_start"`
		DateEnd     string `schema:"date_end"`
		MatchID     int    `schema:"match_id"`
		SportID     int    `schema:"sport_id"`
		LeagueID    int    `schema:"league_id"`
		OrderBy     string `schema:"order_by"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListMatchStatistic(p.DateStart, p.DateEnd, p.MatchID, p.SportID, p.LeagueID, p.OrderBy, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}

func updateMatchStatistic(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		MatchID     int    `json:"match_id"`
		StatisticID string `json:"statistic_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string

	for _, v := range p {

		err := database.UpdateMatchStatistic(v.MatchID, v.StatisticID, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())
		}
	}

	if len(listErr) > 0 {
		ErrorMessage := fmt.Sprintf("Update Match Statistic for this match: %s is failed", strings.Join(listErr, "\n"))
		httpError(w, http.StatusBadRequest, ErrorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
