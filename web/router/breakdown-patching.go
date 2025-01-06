package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIBreakdownPatching() {
	Base.HandleFunc("/breakdown-patching", loadSummaryTraderDeadBallCopy).Methods(http.MethodGet)
	Base.HandleFunc("/breakdown-patching", updSummaryTraderDeadBallCopy).Methods(http.MethodPut)
}

func loadSummaryTraderDeadBallCopy(w http.ResponseWriter, r *http.Request) {
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

	res, err := database.LoadSummaryTraderDeadBallCopy(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func updSummaryTraderDeadBallCopy(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID     int `json:"match_id"`
		MatchIDCopy int `json:"match_id_copy"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	match, err := database.LoadSummaryTraderDeadBallCopy(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, "Error MatchID is not valid data! "+err.Error())
		return
	}
	if len(match) == 0 {
		httpError(w, http.StatusBadRequest, "Error MatchID is not valid data!")
		return
	}
	matchCopy, err := database.LoadSummaryTraderDeadBallCopy(p.MatchIDCopy, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, "Error MatchIDCopy is not valid data! "+err.Error())
		return
	}
	if len(matchCopy) == 0 {
		httpError(w, http.StatusBadRequest, "Error MatchIDCopy is not valid data!")
		return
	}

	err = database.UpdSummaryTraderDeadBallCopy(p.MatchID, matchCopy[0].Trader, matchCopy[0].UserTeamID, matchCopy[0].UserTeamSubID, matchCopy[0].SpecialCode, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
