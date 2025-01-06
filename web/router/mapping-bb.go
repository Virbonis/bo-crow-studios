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

func RegisterAPIMappingBB() {
	Base.HandleFunc("/mapping-bb", listMappingBB).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-bb", updateMappingBB).Methods(http.MethodPut)
}

func listMappingBB(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchDateFrom string `schema:"match_date_from"`
		MatchDateTo   string `schema:"match_date_to"`
		MatchID       int    `schema:"match_id"`
		SportID       int    `schema:"sport_id"`
		LeagueID      int    `schema:"league_id"`
		CurrentPage   int    `schema:"current_page"`
		PageSize      int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, total, err := database.ListMappingBB(p.MatchDateFrom, p.MatchDateTo, p.MatchID, p.SportID, p.LeagueID, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}

func updateMappingBB(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		BB_Status string `json:"bb_status"`
		MatchID   int    `json:"match_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, v := range p {
		err := database.UpdateMappingBB(v.BB_Status, v.MatchID, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())

		}
	}

	if len(listErr) > 0 {
		errorMessage := fmt.Sprintf("Cancel Outright for this match ids: %s is failed", strings.Join(listErr, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
