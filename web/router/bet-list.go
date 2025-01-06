package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper/repository"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIBetList() {
	Base.HandleFunc("/betlist", listBetList).Methods(http.MethodGet)
	Base.HandleFunc("/betlistcs", listBetListCS).Methods(http.MethodGet)
	Base.HandleFunc("/betlist/forecast", getForecast).Methods(http.MethodGet)
	Base.HandleFunc("/betlist/trading", listBetListTrading).Methods(http.MethodGet)
}

func listBetList(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID      int    `schema:"match_id"`
		SubMatchID   int    `schema:"sub_match_id"`
		ListGameType string `schema:"list_game_type"`
		StatusLive   string `schema:"st_live"`
		FTHT         string `schema:"ftht"`
		Handicap     string `schema:"handicap"`
		GT           string `schema:"gt"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	if p.GT == "HDP" || p.GT == "OU" || p.GT == "ML" {
		result, err := database.ListBetListAHOU(p.MatchID, p.SubMatchID, p.ListGameType, p.StatusLive, p.FTHT, p.Handicap, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
		arrHome, arrAway := repository.ConvertToArrayListMOBetListAHOUOE(result)

		// average odds of game type AH/OU are calculated in sp in malay odds unit
		result2, err := database.GetBetListAverageOdds(p.MatchID, p.SubMatchID, p.StatusLive, p.FTHT, p.Handicap, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}

		res := map[string]interface{}{
			"home":    arrHome,
			"away":    arrAway,
			"average": result2,
		}

		writeJSON(w, statusSuccess, res)
	} else if p.GT == "OE" {
		result, err := database.ListBetListOE(p.MatchID, p.SubMatchID, p.StatusLive, p.FTHT, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
		arrHome, arrAway := repository.ConvertToArrayListMOBetListAHOUOE(result)

		// average odds of game type AH/OU are calculated in sp in malay odds unit
		result2, err := database.GetBetListAverageOddsOE(p.MatchID, p.SubMatchID, p.StatusLive, p.FTHT, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}

		res := map[string]interface{}{
			"home":    arrHome,
			"away":    arrAway,
			"average": result2,
		}

		writeJSON(w, statusSuccess, res)
	} else if p.GT == "1X2" {
		result, err := database.ListBetList1X2(p.MatchID, p.SubMatchID, p.ListGameType, p.StatusLive, p.FTHT, p.Handicap, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
		arrHome, arrDraw, arrAway := repository.ConvertToArrayListMOBetList1X2(result)

		// average odds of game type 1X2 is calculated in client-side in decimal odds unit
		res := map[string]interface{}{
			"home": arrHome,
			"away": arrAway,
			"draw": arrDraw,
		}

		writeJSON(w, statusSuccess, res)
	} else {
		httpError(w, http.StatusBadRequest, "Invalid game type")
		return
	}
}
func listBetListCS(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int    `schema:"match_id"`
		GameType   int    `schema:"game_type"`
		ChoiceCode string `schema:"choice_code"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListBetListCS(p.MatchID, p.GameType, p.ChoiceCode, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func listBetListTrading(w http.ResponseWriter, r *http.Request) {

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID    int    `schema:"match_id"`
		SubMatchID int    `schema:"sub_match_id"`
		GameType   int    `schema:"game_type"`
		BetChoice  string `schema:"bet_choice"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListBetListTrading(p.MatchID, p.SubMatchID, p.GameType, p.BetChoice, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func getForecast(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID      int    `schema:"match_id"`
		ListGameType string `schema:"list_game_type"`
		StatusLive   string `schema:"st_live"`
		FTHT         string `schema:"ftht"`
		Score        string `schema:"score"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListBetListForecast(p.MatchID, p.ListGameType, p.StatusLive, p.FTHT, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var count float64
	for _, row := range result {
		// asd := row.Handicap + row.LiabHome
		count += repository.CountWL(p.Score, "H", row.BetScoreHome, row.BetScoreAway, row.GameType, row.Handicap, row.LiabHome, row.LiabAway, row.LiabDraw)
	}
	writeJSON(w, statusSuccess, count)
}
