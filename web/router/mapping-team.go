package router

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMappingTeam() {
	Base.HandleFunc("/mapping-team", listMappingTeam).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-team", updateMappingTeam).Methods(http.MethodPut)
}

func listMappingTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		WebsiteName string `schema:"website_name"`
		SportID     int    `schema:"sport_id"`
		IBCTeamName string `schema:"ibc_team_name"`
		OurTeamName string `schema:"our_team_name"`
		Unmapped    string `schema:"unmapped"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListMappingTeam(p.WebsiteName, p.SportID, p.IBCTeamName, p.OurTeamName, p.Unmapped, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}

func updateMappingTeam(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		IBCTeamID int `json:"ibc_team_id"`
		OurTeamID int `json:"our_team_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var errMessage []string

	for _, v := range p {
		err := database.UpdateMappingTeam(v.IBCTeamID, v.OurTeamID, stampUser)
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
