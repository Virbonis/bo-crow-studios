package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIReportLastBet() {
	Base.HandleFunc("/last-bet", getReportLastBet).Methods(http.MethodGet)
}

func getReportLastBet(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	type Params struct {
		MatchID    int `schema:"match_id"`
		HomePosisi int `schema:"home_posisi"`
		AwayPosisi int `schema:"away_posisi"`
		Status     int `schema:"status"`
		TotalRow   int `schema:"total_row"`
	}

	var p Params
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListLastBet(p.MatchID, p.HomePosisi, p.AwayPosisi, p.Status, p.TotalRow, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
