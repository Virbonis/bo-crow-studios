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

func RegisterAPICancelOutright() {
	Base.HandleFunc("/cancel-outright", listCancelOutright).Methods(http.MethodGet)
	Base.HandleFunc("/cancel-outright", updateCancelOutright).Methods(http.MethodPut)
	Base.HandleFunc("/cancel-outright/team", listCancelOutrightTeam).Methods(http.MethodGet)

}

func listCancelOutright(w http.ResponseWriter, r *http.Request) {
	var p struct {
		OutrightID          int    `schema:"outright_id"`
		FromDate            string `schema:"from_date"`
		ToDate              string `schema:"to_date"`
		SportID             int    `schema:"sport_id"`
		OutrightScoreStatus string `schema:"outright_score_status"`
		CurrentPage         int    `schema:"current_page"`
		PageSize            int    `schema:"page_size"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	res, total, err := database.ListCancelOutright(p.OutrightID, p.FromDate, p.ToDate, p.SportID, p.OutrightScoreStatus, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}

func listCancelOutrightTeam(w http.ResponseWriter, r *http.Request) {
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
	res, err := database.ListCancelOutrightTeam(p.OutrightID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func updateCancelOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		OutrightID int    `json:"outright_id"`
		VoidID     int    `json:"void_id"`
		VoidReason string `json:"void_reason"`
		NoSequence int    `json:"no_sequence"`
		IsTeam     bool   `json:"is_team"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, v := range p {
		if v.IsTeam {
			err := database.UpdateCancelOutrightTeam(v.OutrightID, v.NoSequence, v.VoidID, v.VoidReason, stampUser)
			if err != nil {
				listErr = append(listErr, err.Error())

			}
		} else {
			err := database.UpdateCancelOutright(v.OutrightID, v.VoidID, v.VoidReason, stampUser)
			if err != nil {
				listErr = append(listErr, err.Error())

			}
		}
	}
	if len(listErr) > 0 {
		errorMessage := fmt.Sprintf("Cancel Outright for this match ids: %s is failed", strings.Join(listErr, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
