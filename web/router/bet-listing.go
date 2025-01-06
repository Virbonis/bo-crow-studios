package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper/repository"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIBetListing() {
	Base.HandleFunc("/bet-listing", listBetListing).Methods(http.MethodGet)
	Base.HandleFunc("/bet-listing/league", listBetListingLeague).Methods(http.MethodGet)
	Base.HandleFunc("/bet-listing/match", listBetListingMatch).Methods(http.MethodGet)
}

func listBetListing(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID      int    `schema:"match_id"`
		ListGameType string `schema:"list_gt"`
		STLive       string `schema:"st_live"`
		FTHT         string `schema:"ftht"`
		Handicap     string `schema:"handicap"`
		Buyback      string `schema:"buyback"`
		HistOrPost   string `schema:"hist_or_post"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	p.HistOrPost = "_Post" // hardcode
	result, err := database.ListBetListing(p.MatchID, p.ListGameType, p.STLive, p.FTHT, p.Handicap, p.HistOrPost, p.Buyback, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	arrHome, arrDraw, arrAway, arrHome1x2, arrAway1x2, arrDraw1x2 := repository.ConvertToArrayListBetListAHOUOE1X2(result)

	// average odds of game type 1X2 is calculated in client-side in decimal odds unit
	res := map[string]interface{}{
		"home":    arrHome,
		"away":    arrAway,
		"draw":    arrDraw,
		"home1x2": arrHome1x2,
		"away1x2": arrAway1x2,
		"draw1x2": arrDraw1x2,
	}

	writeJSON(w, statusSuccess, res)
}

func listBetListingLeague(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchDateFrom string `schema:"match_date_from"`
		MatchDateTo   string `schema:"match_date_to"`
		HistOrPost    string `schema:"hist_or_post"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	p.HistOrPost = "_Post" // hardcode
	res, err := database.ListBetListingLeague(p.MatchDateFrom, p.MatchDateTo, p.HistOrPost, userInfo.UserTeamID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listBetListingMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchDateFrom string `schema:"match_date_from"`
		MatchDateTo   string `schema:"match_date_to"`
		LeagueID      int    `schema:"league_id"`
		HistOrPost    string `schema:"hist_or_post"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	p.HistOrPost = "_Post" // hardcode
	res, err := database.ListBetListingMatch(p.MatchDateFrom, p.MatchDateTo, p.LeagueID, p.HistOrPost, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
