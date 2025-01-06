package router

import (
	"net/http"
	"sync"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIRequestMoreOGT() {
	Base.HandleFunc("/request-more-ogt", getListGridRequestMoreOGT).Methods(http.MethodGet)
}

func getListGridRequestMoreOGT(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		PopupID       string `schema:"popup_id"`
		MatchTimeSlot string `schema:"match_time_slot"`
		FromEarlyDate string `schema:"from_early_date"`
		ToEarlyDate   string `schema:"to_early_date"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.GetListGridRequestMoreOGT(p.PopupID, p.MatchTimeSlot, p.FromEarlyDate, p.ToEarlyDate, userSession.SessionID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var wg sync.WaitGroup
	var mu sync.Mutex

	wg.Add(len(res)) // Add the wait counter
	for idx, v := range res {
		go func(idx int, v model.ListGridRequestMoreOGT) {
			defer wg.Done() // Decrease the counter by 1
			result, err := database.GetStatusMatchRequestMoreOGT(v.MatchID, v.LeagueID, v.HomeID, v.AwayID, v.MatchDate, stampUser)
			if err != nil {
				mu.Lock()
				httpError(w, http.StatusBadRequest, err.Error())
				mu.Unlock()
				return
			}
			mu.Lock()
			res[idx].MoreGT = result.MoreGT
			res[idx].LastRequestDate = result.LastRequestDate
			res[idx].MatchStart = result.MatchStart
			res[idx].MatchIDStatus = result.MatchIDStatus
			res[idx].League = result.League
			res[idx].HomeTeam = result.HomeTeam
			res[idx].AwayTeam = result.AwayTeam
			mu.Unlock()
		}(idx, v)
	}
	wg.Wait() // Wait until all the process is done

	writeJSON(w, statusSuccess, res)
}
