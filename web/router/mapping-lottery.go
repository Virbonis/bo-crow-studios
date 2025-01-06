package router

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMappingToLottery() {
	Base.HandleFunc("/mapping-lottery", listLotteryMatch).Methods(http.MethodGet)
	Base.HandleFunc("/mapping-lottery", insertLotteryMatch).Methods(http.MethodPost)
}

func listLotteryMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateStart  string `schema:"date_start"`
		DateEnd    string `schema:"date_end"`
		SportID    int    `schema:"sport_id"`
		LeagueID   int    `schema:"league_id"`
		LeagueName string `schema:"league_name"`
		MatchID    int    `schema:"match_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListLotteryMatch(p.MatchID, p.LeagueID, p.SportID, p.DateStart, p.DateEnd, p.LeagueName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func insertLotteryMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	var tempError []string

	var p []struct {
		MatchID  int `json:"match_id"`
		LeagueID int `json:"league_id"`
		HomeID   int `json:"team_id_home"`
		AwayID   int `json:"team_id_away"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	for _, data := range p {
		err := database.InsertLotteryMatch(data.MatchID, data.LeagueID, data.HomeID, data.AwayID, stampUser)
		if err != nil {
			tempError = append(tempError, err.Error())
		}
	}
	if len(tempError) > 0 {
		httpError(w, http.StatusBadRequest, strings.Join(tempError, "\n"))
		return
	}

	writeJSON(w, statusSuccess, 0)
}
