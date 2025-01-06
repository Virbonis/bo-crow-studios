package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIOddsLog() {
	Base.HandleFunc("/odds-log", listOdds).Methods(http.MethodGet)
}

func listOdds(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID  int    `schema:"match_id"`
		Line     int    `schema:"line"`
		GameType int    `schema:"game_type"`
		Market   string `schema:"market"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListOdds(p.MatchID, p.Line, p.Market, p.GameType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
