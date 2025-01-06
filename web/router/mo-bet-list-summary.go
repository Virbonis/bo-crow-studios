package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/middleware"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMOBetListSummary() {
	Base.HandleFunc("/mo-bet-list-summary", getMOBetListSummary).Methods(http.MethodGet)
	Base.HandleFunc("/mo-bet-list-summary", middleware.AuthorizationAPIMiddleware(
		resetFTHTScore, helper.ALLOWED_TO_RECALCULATE_FORECAST)).Methods(http.MethodPut)
}

func getMOBetListSummary(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID int `schema:"match_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resFT, resHT, resMatrix, err := database.GetMOBetListSummary(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	type ResultWithLive struct {
		ResultFT     interface{} `json:"result_ft"`
		ResultHT     interface{} `json:"result_ht"`
		ResultMatrix interface{} `json:"result_matrix"`
	}
	result := ResultWithLive{ResultFT: resFT, ResultHT: resHT, ResultMatrix: resMatrix}
	writeJSON(w, statusSuccess, result)
}

func resetFTHTScore(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID     int `json:"match_id"`
		ProcessType int `json:"process_type"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.ResetFTHTScore(p.MatchID, p.ProcessType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
