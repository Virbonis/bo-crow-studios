package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/AxionHQ/tsubasa-admin/web/util"
	"github.com/shopspring/decimal"
)

func RegisterAPIMatch() {
	Base.HandleFunc("/match/select", listSelectMatch).Methods(http.MethodGet)
	Base.HandleFunc("/match/select", updateSelectMatch).Methods(http.MethodPut)
	Base.HandleFunc("/match/select/mo", listSelectMatchMO).Methods(http.MethodGet)
	Base.HandleFunc("/match/select/betlist", listMatchInBetList).Methods(http.MethodGet)
	Base.HandleFunc("/match/select/instantbet", listMatchInstantBet).Methods(http.MethodGet)

	Base.HandleFunc("/match/maxline", getMaxLine).Methods(http.MethodGet)
	Base.HandleFunc("/match/autoaddsubmatch/ibc", getAutoAddMatchIBC).Methods(http.MethodGet)
	Base.HandleFunc("/match/autoaddsubmatch/glive", getAutoAddMatchGLive).Methods(http.MethodGet)
	Base.HandleFunc("/match/autoaddsubmatch", updateAutoAddMatchSubMatch).Methods(http.MethodPut)
	Base.HandleFunc("/match/autoaddsubmatchsyncmarket", updateAutoAddMatchSubMatchSyncMarket).Methods(http.MethodPut)
	Base.HandleFunc("/match/autoaddsubmatchsyncleague", updateAutoAddMatchSubMatchSyncLeague).Methods(http.MethodPut)

	Base.HandleFunc("/match/autoaddsubmatchmore/status", getStatusSubMatchMoreGT).Methods(http.MethodGet)
	Base.HandleFunc("/match/autoaddsubmatchmore/request", requestSubMatchMoreGT).Methods(http.MethodPatch)
	Base.HandleFunc("/match/autoaddsubmatchmore/reset", resetSubMatchMoreGT).Methods(http.MethodPatch)
	Base.HandleFunc("/match/autoaddsubmatchmore", listAutoAddSubMatchMore).Methods(http.MethodGet)
	Base.HandleFunc("/match/autoaddsubmatchmore", updateAutoAddSubMatchMore).Methods(http.MethodPut)

	Base.HandleFunc("/match/autoaddmatch", listMatchInAutoAddMatch).Methods(http.MethodGet)
	Base.HandleFunc("/match/autoaddmatch", insertAutoAddMatch).Methods(http.MethodPost)

	Base.HandleFunc("/match/add-match", createMatch).Methods(http.MethodPost)

	Base.HandleFunc("/match/sequence", listMatchSequence).Methods(http.MethodGet)
	Base.HandleFunc("/match/sequence", updateMatchSequence).Methods(http.MethodPut)
	Base.HandleFunc("/match/sequence/swap", swapMatchSequence).Methods(http.MethodPut)

}

func listSelectMatch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID string `schema:"popup_id"`
		Group   string `schema:"group"` // nilai dari match_time_slot/Forecast-Post
		// early_date: deadball, runningball, moquick, moquickeuro, movquick, mixparlay
		FromEarlyDate string `schema:"from_early_date"`
		ToEarlyDate   string `schema:"to_early_date"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListSelectMatch(p.PopupID, userSession.SessionID, p.Group, p.FromEarlyDate, p.ToEarlyDate, userInfo.UserTeamID, userInfo.UserTeamSubID, userInfo.TraderGroupORI, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func updateSelectMatch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID  string `json:"popup_id"`
		Group    string `json:"group"`
		MatchIDs string `json:"match_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	if err := database.UpdateSelectMatch(p.PopupID, userSession.SessionID, p.Group, p.MatchIDs, stampUser); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func listSelectMatchMO(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID string `schema:"popup_id" json:"popup_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	var result interface{}
	result, err = database.ListSelectMatchMO(userSession.SessionID, p.PopupID, stampUser, userInfo.TraderGroupORI)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func listMatchInBetList(w http.ResponseWriter, r *http.Request) {
	var p struct {
		Group   string `schema:"group"` // MO-Live
		PopupID string `schema:"popup_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListMatchBetList("", sessionID, p.PopupID, p.Group, userInfo.TraderGroupORI, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listMatchInstantBet(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroupORI := userInfo.TraderGroupORI
	userTeamID := userInfo.UserTeamID
	userTeamSubID := userInfo.UserTeamSubID
	var p struct {
		SportID   int    `schema:"sport_id"`
		LeagueIDs string `schema:"league_ids"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	leagueIds := strings.Split(p.LeagueIDs, ",")
	if util.Contains(leagueIds, "0") || p.LeagueIDs == "" {
		p.LeagueIDs = "0"
	}

	result, err := database.ListMatchInstantBet(p.SportID, p.LeagueIDs, sessionID, stampUser, traderGroupORI, userTeamID, userTeamSubID)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func getMaxLine(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `schema:"match_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.GetMaxLine(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func getAutoAddMatchIBC(w http.ResponseWriter, r *http.Request) {
	var p struct {
		SportID   int    `schema:"sport_id"`
		LeagueID  int    `schema:"league_id"`
		HomeID    int    `schema:"home_id"`
		AwayID    int    `schema:"away_id"`
		MatchDate string `schema:"match_date"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.GetAutoAddMatchIBCMatchDate(p.SportID, p.LeagueID, p.HomeID, p.AwayID, p.MatchDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result2, err := database.ListAutoAddMatchIBC(p.SportID, p.LeagueID, p.HomeID, p.AwayID, p.MatchDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res := map[string]interface{}{
		"match_date": result,
		"list":       result2,
	}
	writeJSON(w, statusSuccess, res)
}
func getAutoAddMatchGLive(w http.ResponseWriter, r *http.Request) {
	var p struct {
		SportID        int    `schema:"sport_id"`
		LeagueID       int    `schema:"league_id"`
		HomeID         int    `schema:"home_id"`
		AwayID         int    `schema:"away_id"`
		MatchDate      string `schema:"match_date"`
		BookmarkerName string `schema:"bookmarker_name"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.GetAutoAddMatchIBCMatchDate(p.SportID, p.LeagueID, p.HomeID, p.AwayID, p.MatchDate, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result2, err := database.ListAutoAddMatchGLive(p.SportID, p.LeagueID, p.HomeID, p.AwayID, p.MatchDate, p.BookmarkerName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res := map[string]interface{}{
		"match_date": result,
		"list":       result2,
	}
	writeJSON(w, statusSuccess, res)
}

func updateAutoAddMatchSubMatch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `json:"match_id"`
		Arr     []struct {
			DisplayLine int             `json:"display_line"`
			GameType    int             `json:"game_type"`
			Handicap    decimal.Decimal `json:"handicap"`
			OddsHome    decimal.Decimal `json:"odds_home"`
			OddsAway    decimal.Decimal `json:"odds_away"`
		} `json:"arr"`

		PopupID        string `json:"popup_id"` // unused
		BookmarkerName string `json:"bookmarker_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	traderGroup := userInfo.TraderGroup
	stampUser := userInfo.Username

	for _, v := range p.Arr {
		err := database.UpdateAutoAddMatchSubMatch(p.MatchID, v.DisplayLine, v.GameType, v.Handicap, v.OddsHome, v.OddsAway, p.PopupID, p.BookmarkerName, traderGroup, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateAutoAddMatchSubMatchSyncMarket(w http.ResponseWriter, r *http.Request) {
	var p struct {
		SportID        int    `json:"sport_id"`
		LeagueID       int    `json:"league_id"`
		MatchID        int    `json:"match_id"`
		HomeID         int    `json:"home_id"`
		AwayID         int    `json:"away_id"`
		MatchDate      string `json:"match_date"`
		BookmarkerName string `json:"bookmarker_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var oddsString *string
	var err error
	if p.BookmarkerName == "" {
		oddsString, err = database.GetAutoAddMatchOddsString(p.SportID, p.LeagueID, p.HomeID, p.AwayID, p.MatchDate, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	} else {
		oddsString, err = database.GetAutoAddMatchOddsStringGLive(p.SportID, p.LeagueID, p.HomeID, p.AwayID, p.MatchDate, p.BookmarkerName, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	}

	err = database.UpdateSubMatchSyncMarket(p.SportID, p.MatchID, *oddsString, p.BookmarkerName, userInfo.TraderGroupORI, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateAutoAddMatchSubMatchSyncLeague(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID        int    `json:"match_id"`
		PopupID        string `json:"popup_id"`
		MatchTimeSlot  string `json:"match_time_slot"`
		MOPage         string `json:"mo_page"`
		BookmarkerName string `json:"bookmarker_name"`
		Confirm        bool   `json:"confirm"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	list1, list2, err := database.ListAutoAddMatchSyncLeague(p.MatchID, p.MatchTimeSlot, p.MOPage, userSession.SessionID, p.PopupID, userInfo.TraderGroupORI, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	if len(list1) > 0 && !p.Confirm {
		var matchIds []string
		for _, v := range list1 {
			matchIds = append(matchIds, strconv.Itoa(v.MatchID))
		}
		if len(list2) == 0 {
			// if all matches is disabled, then return error
			matchString := fmt.Sprintf("%s", strings.Join(matchIds, ", "))
			errMessage := fmt.Sprintf("Sync Market for this match: %s is disabled", matchString)
			httpError(w, http.StatusBadRequest, errMessage)
			return
		} else {
			// else return list of matches that is disabled
			writeJSON(w, -30, matchIds)
			return
		}
	} else {
		syncMarket := func(sportID, matchID, leagueID, homeID, awayID int, matchDate string) error {
			var oddsString *string
			if p.BookmarkerName == "" {
				oddsString, err = database.GetAutoAddMatchOddsString(sportID, leagueID, homeID, awayID, matchDate, stampUser)
			} else {
				oddsString, err = database.GetAutoAddMatchOddsStringGLive(sportID, leagueID, homeID, awayID, matchDate, p.BookmarkerName, stampUser)
			}
			return database.UpdateSubMatchSyncMarket(sportID, matchID, *oddsString, p.BookmarkerName, userInfo.TraderGroupORI, stampUser)
		}

		var listErr []string
		for _, v := range list2 {
			err := syncMarket(v.SportID, v.MatchID, v.LeagueID, v.HomeID, v.AwayID, v.MatchDate)
			if err != nil {
				listErr = append(listErr, err.Error())
			}
		}
		if len(listErr) > 0 {
			errMessage := fmt.Sprintf("Sync Market for this match is failed:\n%s", strings.Join(listErr, "\n"))
			httpError(w, http.StatusBadRequest, errMessage)
			return
		}
	}
	writeJSON(w, statusSuccess, "OK")
}

func getStatusSubMatchMoreGT(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `schema:"match_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.GetStatusSubMatchMoreGT(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func requestSubMatchMoreGT(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `json:"match_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.RequestSubMatchMoreGT(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func resetSubMatchMoreGT(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `json:"match_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.ResetSubMatchMoreGT(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func listAutoAddSubMatchMore(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `schema:"match_id"`
		SportID int `schema:"sport_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListAutoAddSubMatchMore(p.MatchID, p.SportID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateAutoAddSubMatchMore(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `json:"match_id"`
		Arr     []struct {
			DisplayLine int             `json:"display_line"`
			GameType    int             `json:"game_type"`
			Handicap    decimal.Decimal `json:"handicap"`
			OddsString  string          `json:"odds_string"`
		} `json:"arr"`

		PopupID string `json:"popup_id"` // unused
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	traderGroup := userInfo.TraderGroup
	stampUser := userInfo.Username

	for _, v := range p.Arr {
		err := database.UpdateAutoAddSubMatchMore(p.MatchID, v.GameType, v.Handicap, v.OddsString, p.PopupID, traderGroup, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	}

	writeJSON(w, statusSuccess, "OK")
}

func listMatchInAutoAddMatch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		SportID  int `schema:"sport_id"`
		LeagueID int `schema:"league_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListMatchInAutoAddMatch(p.SportID, p.LeagueID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	// filter result uniq by HomeID and AwayID
	var result2 []model.ListMatchAutoAdd
	for _, v := range result {
		var exist bool
		for _, v2 := range result2 {
			if v.HomeId == v2.HomeId && v.AwayId == v2.AwayId {
				exist = true
				break
			}
		}
		if !exist {
			result2 = append(result2, v)
		}
	}
	writeJSON(w, statusSuccess, result2)
}

func insertAutoAddMatch(w http.ResponseWriter, r *http.Request) {

	var err error
	var odds *string
	var matchId int

	var p []struct {
		AwayId              int    `json:"away_id"`
		AwayName            string `json:"away_name"`
		HomeId              int    `json:"home_id"`
		HomeName            string `json:"home_name"`
		LeagueId            int    `json:"league_id"`
		LeagueName          string `json:"league_name"`
		SportId             int    `json:"sport_id"`
		MatchStart          string `json:"match_start"`
		IsCreateMainQuarter string `json:"is_create_main_quarter"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var stringError []string
	for _, data := range p {
		odds, err = database.GetAutoAddMatchOddsString(data.SportId, data.LeagueId, data.HomeId, data.AwayId, data.MatchStart, stampUser)
		if err != nil {
			stringError = append(stringError, fmt.Sprintf("%v [ %v - %v ] Oddstring Empty", data.LeagueName, data.HomeName, data.AwayName))
		}
		if *odds != "" {
			matchId, err = database.ProcInsAutoAddMatch(data.SportId, data.LeagueId, data.HomeId, data.AwayId, data.MatchStart, *odds, data.LeagueName, data.HomeName, data.AwayName, data.IsCreateMainQuarter, stampUser)
			if err != nil {
				stringError = append(stringError, err.Error())
			} else if matchId > 0 {
				err = database.ProcInsPartai(matchId, data.SportId, data.LeagueId, data.HomeId, data.AwayId, data.MatchStart, stampUser)
				if err != nil {
					stringError = append(stringError, err.Error())
				}

			}
		}
	}

	if len(stringError) > 0 {
		httpError(w, http.StatusBadRequest, strings.Join(stringError, "|"))
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func createMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Category         string `json:"category"`
		HasLive          string `json:"has_live"`
		HiddenTime       int    `json:"hidden_time"`
		LeagueID         int    `json:"league_id"`
		Live             string `json:"live"`
		MatchDate        string `json:"match_date"`
		MatchParentID    int    `json:"match_parent_id"`
		NeutralGround    string `json:"neutral_ground"`
		Open             string `json:"open"`
		RBDelayAway      int    `json:"rb_delay_away"`
		RBDelayHome      int    `json:"rb_delay_home"`
		RBDelayOver      int    `json:"rb_delay_over"`
		RBDelayUnder     int    `json:"rb_delay_under"`
		SpecialCode      string `json:"special_code"`
		ForceCreateMatch string `json:"force_create_match"`
		SportID          int    `json:"sport_id"`
		TeamAway         int    `json:"team_away"`
		TeamHome         int    `json:"team_home"`
		Website          string `json:"website"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	rs, err := database.CreateMatch(p.SportID, p.LeagueID, p.TeamHome, p.TeamAway, p.MatchParentID, p.HiddenTime, p.RBDelayHome, p.RBDelayAway, p.RBDelayOver, p.RBDelayUnder, p.MatchDate, p.Open, p.Live, p.HasLive, p.NeutralGround, p.Category, p.ForceCreateMatch, p.SpecialCode, stampUser)
	if rs == -1 && p.SportID != 10 {
		writeJSON(w, -1, err.Error())
		return
	}

	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listMatchSequence(w http.ResponseWriter, r *http.Request) {
	var p struct {
		DateStart  time.Time `schema:"date_start"`
		DateEnd    time.Time `schema:"date_end"`
		SportID    int       `schema:"sport_id"`
		LeagueName string    `schema:"league_name"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListMatchSequence(p.DateStart, p.DateEnd, p.SportID, p.LeagueName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateMatchSequence(w http.ResponseWriter, r *http.Request) {
	type List struct {
		MatchID         int    `json:"match_id"`
		Sequence        string `json:"sequence"`
		SpecialSequence string `json:"special_sequence"`
	}

	var p struct {
		Match []List `json:"match"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	var tempErr []string
	for _, data := range p.Match {
		err := database.UpdateMatchSequence(data.MatchID, data.SpecialSequence, data.Sequence, stampUser)
		if err != nil {
			tempErr = append(tempErr, err.Error())
		}
	}

	if len(tempErr) > 0 {
		httpError(w, http.StatusBadRequest, strings.Join(tempErr, "\n"))
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func swapMatchSequence(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID     int `json:"match_id"`
		MatchIDSwap int `json:"match_id_swap"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.SwapMatchSequence(p.MatchID, p.MatchIDSwap, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
