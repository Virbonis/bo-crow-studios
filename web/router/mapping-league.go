package router

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMappingLeague() {
	Base.HandleFunc("/mapping-league", listMappingLeague).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-league", updateMappingLeague).Methods(http.MethodPut)
}

func listMappingLeague(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		WebsiteName   string `schema:"website_name"`
		SportID       int    `schema:"sport_id"`
		IBCLeagueName string `schema:"ibc_league_name"`
		OurLeagueName string `schema:"our_league_name"`
		Unmapped      string `schema:"unmapped"`
		CurrentPage   int    `schema:"current_page"`
		PageSize      int    `schema:"page_size"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListMappingLeague(p.WebsiteName, p.SportID, p.IBCLeagueName, p.OurLeagueName, p.Unmapped, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}
func updateMappingLeague(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		IBCLeagueID int `json:"ibc_league_id"`
		OurLeagueID int `json:"our_league_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var errMessage []string

	for _, v := range p {
		err := database.UpdateMappingLeague(v.IBCLeagueID, v.OurLeagueID, stampUser)
		if err != nil {
			errMessage = append(errMessage, err.Error())
		}
	}

	if len(errMessage) > 0 {
		errorMessage := fmt.Sprintf("Error when update Data")
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
