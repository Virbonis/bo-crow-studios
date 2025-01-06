package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/AxionHQ/tsubasa-admin/web/util"
)

func RegisterAPILeagueHidden() {
	Base.HandleFunc("/league-hidden", getTableMasterLeagueHidden).Methods(http.MethodGet)
	Base.HandleFunc("/league-hidden", createMasterLeagueHidden).Methods(http.MethodPost)
	Base.HandleFunc("/league-hidden", deleteMasterLeagueHidden).Methods(http.MethodDelete)
}

func getTableMasterLeagueHidden(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	type Params struct {
		BranchCode  string `schema:"branch_code"`
		Currency    string `schema:"currency"`
		SportID     int    `schema:"sport_id"`
		LeagueName  string `schema:"league_name"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}

	var p Params
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListLeagueHidden(p.BranchCode, p.Currency, p.SportID, p.LeagueName, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}

	writeJSON(w, statusSuccess, resultWithTotal)
}

func createMasterLeagueHidden(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BranchCode string `json:"branch_code"`
		Currency   string `json:"currency"`
		SportID    int    `json:"sport_id"`
		LeagueIDs  []int  `json:"league_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Get all Hidden List
	res, _, err := database.ListLeagueHidden(p.BranchCode, p.Currency, p.SportID, "", 1, 1000, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var existHiddenLeagueIDs []int
	for _, col := range res {
		existHiddenLeagueIDs = append(existHiddenLeagueIDs, col.LeagueID)
	}
	var newHiddenLeagueIDsToProcess []int

	var listError []string
	for _, leagueID := range p.LeagueIDs {
		isExist := util.Contains(existHiddenLeagueIDs, leagueID)
		if isExist {
			listError = append(listError, fmt.Sprintf("League ID: %d Already Exist ", leagueID))
		} else {
			newHiddenLeagueIDsToProcess = append(newHiddenLeagueIDsToProcess, leagueID)
		}
	}

	// Process League ID
	if len(newHiddenLeagueIDsToProcess) > 0 {
		err = database.CreateLeagueHidden(p.BranchCode, p.Currency, p.SportID, util.ArrayIntToString(newHiddenLeagueIDsToProcess, ","), stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	}

	type Result struct {
		IsSuccess  bool   `json:"is_success"`
		DataFailed string `json:"data_failed"`
	}
	writeJSON(w, statusSuccess, Result{
		IsSuccess:  len(newHiddenLeagueIDsToProcess) > 0,
		DataFailed: strings.Join(listError, "\n"),
	})
}

func deleteMasterLeagueHidden(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	type Params struct {
		RowID      int    `json:"row_id"`
		BranchCode string `json:"branch_code"`
		BranchName string `json:"branch_alias"`
		Currency   string `json:"currency"`
		SportName  string `json:"sport_name"`
		SportID    int    `json:"sport_id"`
		LeagueName string `json:"league_name"`
		LeagueID   int64  `json:"league_id"`
	}

	var p Params
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.DeleteLeagueHidden(p.RowID, p.BranchName, p.Currency, p.SportName, p.LeagueName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
