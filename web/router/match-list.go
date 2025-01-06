package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"sync"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/AxionHQ/tsubasa-admin/web/util"
)

func RegisterAPIMatchList() {
	Base.HandleFunc("/match-list", listMatchList).Methods(http.MethodGet)
	Base.HandleFunc("/match-list/edit", getMatchList).Methods(http.MethodGet)
	Base.HandleFunc("/match-list/edit", updateMatchList).Methods(http.MethodPut)
	Base.HandleFunc("/match-list", deleteMatchList).Methods(http.MethodDelete)
	Base.HandleFunc("/match-list/info", getMatchListInfo).Methods(http.MethodGet)
	Base.HandleFunc("/match-list/info", updateMatchListInfo).Methods(http.MethodPut)

	Base.HandleFunc("/match-list/submatch", listSubMatch).Methods(http.MethodGet)

	Base.HandleFunc("/match-list/detail-special", listDetailMatchSpecial).Methods(http.MethodGet)
	Base.HandleFunc("/match-list/detail-special", deleteDetailMatchSpecial).Methods(http.MethodDelete)

	Base.HandleFunc("/match-list/special", getMatchSpecial).Methods(http.MethodGet)
	Base.HandleFunc("/match-list/special", updateMatchSpecial).Methods(http.MethodPut)

	Base.HandleFunc("/match-list/special/more", getMatchSpecialMore).Methods(http.MethodGet)
	Base.HandleFunc("/match-list/special/more", updateMatchSpecialMore).Methods(http.MethodPut)
}

func listMatchList(w http.ResponseWriter, r *http.Request) {
	var p struct {
		DateStart            string `schema:"date_start"`
		DateEnd              string `schema:"date_end"`
		OrderBy              string `schema:"order_by"`
		MatchID              int    `schema:"match_id"`
		SportID              int    `schema:"sport_id"`
		LeagueID             int    `schema:"league_id"`
		AutoOdds             string `schema:"auto_odds"`
		Category             string `schema:"category"`
		MatchOpenStatus      string `schema:"match_open_status"`
		MatchLiveStatus      string `schema:"match_live_status"`
		MatchHasLiveStatus   string `schema:"match_has_live_status"`
		MatchHasParlayStatus string `schema:"match_has_parlay_status"`
		CurrentPage          int    `schema:"current_page"`
		PageSize             int    `schema:"page_size"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, total, err := database.ListMatchList(p.DateStart, p.DateEnd,
		p.OrderBy, p.MatchID, p.SportID, p.LeagueID,
		p.AutoOdds, p.Category, p.MatchOpenStatus, p.MatchLiveStatus, p.MatchHasLiveStatus, p.MatchHasParlayStatus,
		p.CurrentPage, p.PageSize, stampUser)

	resultWithTotal := model.ResultWithTotal{Result: result, Total: total}

	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, resultWithTotal)
}
func getMatchList(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchId int `schema:"match_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	data, err := database.GetMatchList(p.MatchId, stampUser)
	if err != nil {
		httpError(w, http.StatusBadGateway, err.Error())
		return
	}
	writeJSON(w, statusSuccess, data)
}
func updateMatchList(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		AutoAcceptDelayAway   int    `json:"auto_accept_delay_away"`
		AutoAcceptDelayHome   int    `json:"auto_accept_delay_home"`
		AutoAcceptDelayOver   int    `json:"auto_accept_delay_over"`
		AutoAcceptDelayUnder  int    `json:"auto_accept_delay_under"`
		Category              string `json:"category"`
		EvOddsStep            int    `json:"ev_odds_step"`
		EvOddsStepOU          int    `json:"ev_odds_step_ou"`
		MatchDate             string `json:"match_date"`
		MatchHasLiveStatus    string `json:"match_has_live_status"`
		MatchHiddenTimeStatus int    `json:"match_hidden_time_status"`
		MatchID               int    `json:"match_id"`
		MatchIdParent         int    `json:"parent_match_id"`
		MatchIdACRJ           int    `json:"parent_match_id_action"`
		MatchLiveStatus       string `json:"match_live_status"`
		MatchNeutralStatus    string `json:"match_neutral_status"`
		MatchOpenStatus       string `json:"match_open_status"`
		ParentUnnormalStatus  int    `json:"match_unnormal_status"`
		StShowToday           string `json:"match_show_today_status"`
		STEarlySettlement     string `json:"match_early_settlement_status"`
		SpecialCode           string `json:"special_code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateMatchList(p.AutoAcceptDelayAway, p.AutoAcceptDelayHome, p.AutoAcceptDelayOver, p.AutoAcceptDelayUnder, p.MatchHiddenTimeStatus, p.EvOddsStep, p.EvOddsStepOU, p.MatchID, p.MatchIdParent, p.MatchIdACRJ, p.Category, p.MatchDate, p.MatchOpenStatus, p.MatchHasLiveStatus, p.MatchLiveStatus, p.MatchNeutralStatus, p.StShowToday, p.STEarlySettlement, p.ParentUnnormalStatus, p.SpecialCode, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
	}
	writeJSON(w, statusSuccess, "OK")
}
func deleteMatchList(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID int `json:"match_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.DeleteMatchList(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadGateway, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func getMatchListInfo(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchId int `schema:"match_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.GetMatchListInfo(p.MatchId, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func updateMatchListInfo(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchId       int    `json:"match_id"`
		StInfo        string `json:"st_information"`
		InformationEN string `json:"information_en"`
		InformationCH string `json:"information_ch"`
		InformationTH string `json:"information_th"`
		InformationJP string `json:"information_jp"`
		InformationKR string `json:"information_kr"`
		InformationVN string `json:"information_vn"`
		InformationID string `json:"information_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateMatchListInfo(p.MatchId, p.StInfo, p.InformationEN, p.InformationCH, p.InformationTH, p.InformationJP, p.InformationKR, p.InformationVN, p.InformationID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listSubMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchId int `schema:"match_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resSpecial, _ := database.ListSubMatchSpecial(p.MatchId, stampUser)
	resAHOU, _ := database.ListSubMatchAHOU(p.MatchId, stampUser)
	res1X2, _ := database.ListSubMatch1X2(p.MatchId, stampUser)
	resHTFT, _ := database.ListSubMatchHTFT(p.MatchId, stampUser)
	resTG, _ := database.ListSubMatchTG(p.MatchId, stampUser)
	resFGLG, _ := database.ListSubMatchFGLG(p.MatchId, stampUser)
	resCS, _ := database.ListSubMatchCS(p.MatchId, stampUser)
	resCSLive, _ := database.ListSubMatchCSL(p.MatchId, stampUser)
	// if err != nil {
	// 	httpError(w, http.StatusBadRequest, err.Error())
	// }

	resultListMatchList := model.ResultListMatchList{
		ListSpecial: resSpecial,
		ListAHOU:    resAHOU,
		List1X2:     res1X2,
		ListHTFT:    resHTFT,
		ListTG:      resTG,
		ListFGLG:    resFGLG,
		ListCS:      resCS,
		ListCSLive:  resCSLive,
	}

	writeJSON(w, statusSuccess, resultListMatchList)
}

func listDetailMatchSpecial(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchId int `schema:"match_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListMatchSpecial(p.MatchId, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func deleteDetailMatchSpecial(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchId   int    `json:"match_id"`
		GameTypes string `json:"game_types"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var listErr []string
	listGameType := strings.Split(p.GameTypes, ",")
	var wg sync.WaitGroup
	wg.Add(len(listGameType))
	for _, v := range listGameType {
		gameTypeSpecial, _ := strconv.Atoi(v)
		go func(gameTypeSpecial int) {
			defer wg.Done()
			if gameTypeSpecial == 59 || gameTypeSpecial == 60 {
				err := database.DelMatchSpecialNextGoal(p.MatchId, gameTypeSpecial, 1, stampUser)
				if err != nil {
					listErr = append(listErr, err.Error())
				}
			} else {
				err := database.DeleteMatchSpecial(p.MatchId, gameTypeSpecial, stampUser)
				if err != nil {
					listErr = append(listErr, err.Error())
				}
			}
		}(gameTypeSpecial)

	}
	wg.Wait()

	if len(listErr) > 0 {
		httpError(w, http.StatusBadRequest, strings.Join(listErr, "\n"))
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

type selectedSpecialMatch map[string][]string

func getMatchSpecial(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID    int    `schema:"sport_id"`
		MatchID    int    `schema:"match_id"`
		LeagueName string `schema:"league_name"`
		HomeName   string `schema:"home_name"`
		AwayName   string `schema:"away_name"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	data, err := database.GetSelectedAddSpecial(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadGateway, err.Error())
		return
	}

	selected := selectedSpecialMatch{}
	if p.SportID == 10 {
		selected.getSpecialSoccer(data, p.LeagueName, p.HomeName, p.AwayName)
	} else if p.SportID == 11 {
		selected.getSpecialTennis(data, p.LeagueName, p.HomeName, p.AwayName)
	} else if p.SportID == 12 {
		selected.getSpecialBasket(data, p.LeagueName, p.HomeName, p.AwayName)
	} else if p.SportID == 16 || p.SportID == 35 {
		selected.getSpecialVolley(data, p.LeagueName, p.HomeName, p.AwayName)
	} else if p.SportID == 22 {
		selected.getSpecialCricket(data, p.LeagueName, p.HomeName, p.AwayName)
	} else if p.SportID == 32 {
		selected.getSpecialBadminton(data, p.LeagueName, p.HomeName, p.AwayName)
	} else if p.SportID == 38 {
		selected.getSpecialPool(data, p.LeagueName, p.HomeName, p.AwayName)
	} else if p.SportID == 52 {
		selected.getSpecialEsport(data, p.LeagueName, p.HomeName, p.AwayName)
	} else {
		httpError(w, http.StatusBadRequest, "Invalid sportID")
		return
	}

	writeJSON(w, statusSuccess, selected)
}
func (selected selectedSpecialMatch) getSpecialSoccer(data []model.SelectedAddSpecial, leagueName, homeName, awayName string) {
	var specialCodeSoccer = map[string]string{
		"STG":   "Over/Under",
		"SSTOU": "Over/Under",
		"SSTOE": "Odd/Even",
		"SS":    "Clean Sheet/No Clean Sheet",
	}
	for _, d := range data {
		prefixLeague := fmt.Sprintf("%s - ", leagueName)
		specialKey := strings.TrimPrefix(d.LeagueName, prefixLeague)

		if d.SpecialCode == "STG" || d.SpecialCode == "SSTOU" || d.SpecialCode == "SSTOE" || d.SpecialCode == "SS" {
			// ↓ butuh 2 SpecialCode untuk 1 special
			if _, exist := selected[specialKey]; !exist {
				selected[specialKey] = []string{}
			} else {
				selected[specialKey] = []string{specialCodeSoccer[d.SpecialCode]}
			}
		} else { // SC, SB, SGO, S10M,S15M,S15C,S15B, SGK,SFK,SOFF
			prefixTeam := fmt.Sprintf("%s ", homeName)
			specialValue := strings.TrimPrefix(d.HomeName, prefixTeam)
			selected[specialKey] = append(selected[specialKey], specialValue)
		}
	}
}
func (selected selectedSpecialMatch) getSpecialTennis(data []model.SelectedAddSpecial, leagueName, homeName, awayName string) {
	for _, d := range data {
		prefixLeague := fmt.Sprintf("%s ", leagueName)
		specialKey := util.TrimNonLetterNonNumber(strings.TrimPrefix(d.LeagueName, prefixLeague))

		// prefixTeam := fmt.Sprintf("%s", homeName)
		specialValue := strings.TrimPrefix(d.HomeName, homeName)
		if d.SpecialCode == "TS" {
			selected["SPECIALS"] = append(selected["SPECIALS"], specialValue+"|"+specialKey)
		} else {
			selected[strings.ToUpper(specialKey)] = append(selected[strings.ToUpper(specialKey)], specialValue)
		}
	}
}
func (selected selectedSpecialMatch) getSpecialBasket(data []model.SelectedAddSpecial, leagueName, homeName, awayName string) {
	for _, d := range data {
		if d.SpecialCode == "BQ" {
			specialValue := util.TrimNonLetterNonNumber(strings.TrimPrefix(d.HomeName, homeName))
			selected["QUARTER"] = append(selected["QUARTER"], specialValue)
		} else if d.SpecialCode == "BTT" {
			if _, isExisted := selected["TEAM TOTAL"]; !isExisted {
				selected["TEAM TOTAL"] = append(selected["TEAM TOTAL"], "")
			} else {
				selected["TEAM TOTAL"] = []string{"over/under"}
			}
		} else if d.SpecialCode == "B2N" {
			if _, isExisted := selected["2ND HALF"]; !isExisted {
				selected["2ND HALF"] = append(selected["2ND HALF"], "2nd")
			}
		} else if d.SpecialCode == "BTS" {
			value := strings.Title(strings.Split(d.HomeName, homeName+" ")[1])
			value = util.TrimNonLetterNonNumber(value)
			selected["TEAM TO SCORE"] = append(selected["TEAM TO SCORE"], value)
		} else if d.SpecialCode == "BTR10Q" {
			value := strings.Split(d.HomeName, homeName+" to First 10 Points")[1]
			value = util.TrimNonLetterNonNumber(value)
			selected["TEAM RACE TO FIRST 10"] = append(selected["TEAM RACE TO FIRST 10"], value)
		} else if d.SpecialCode == "BTR15Q" {
			value := strings.Split(d.HomeName, homeName+" to First 15 Points")[1]
			value = util.TrimNonLetterNonNumber(value)
			selected["TEAM RACE TO FIRST 15"] = append(selected["TEAM RACE TO FIRST 15"], value)
		} else if d.SpecialCode == "BTR20Q" {
			value := strings.Split(d.HomeName, homeName+" to First 20 Points")[1]
			value = util.TrimNonLetterNonNumber(value)
			selected["TEAM RACE TO FIRST 20"] = append(selected["TEAM RACE TO FIRST 20"], value)
		} else {
			value := strings.Split(d.LeagueName, leagueName+" - Specials")[1]
			value = util.TrimNonLetterNonNumber(value)
			selected["SPECIALS"] = append(selected["SPECIALS"], value)
		}
	}
}
func (selected selectedSpecialMatch) getSpecialVolley(data []model.SelectedAddSpecial, leagueName, homeName, awayName string) {
	for _, d := range data {
		key := strings.Split(d.LeagueName, leagueName+" ")[1]
		key = util.TrimNonLetterNonNumber(key)

		value := ""
		if d.HomeName != homeName {
			value = strings.Split(d.HomeName, homeName+" ")[1]
		}
		selected["SPECIALS"] = append(selected["SPECIALS"], value+"|"+key)
	}
}
func (selected selectedSpecialMatch) getSpecialCricket(data []model.SelectedAddSpecial, leagueName, homeName, awayName string) {
	check := []string{
		"Innings Total Runs",
		"Group 1-6 Total Runs",
		"Over 1 Ball 1 Total Runs",
		"Fall of First Wicket Total Runs",
		"Innings Sixes",
		"Innings Fours",
	}

	for _, d := range data {
		value := strings.Split(d.LeagueName, leagueName+" - ")[1]

		if d.SpecialCode == "CR1INOTR" {
			selected["1st Innings Total Runs"] = append(selected["1st Innings Total Runs"], value)
		} else if d.SpecialCode == "CR2INOTR" {
			selected["2nd Innings Total Runs"] = append(selected["2nd Innings Total Runs"], value)
		} else if d.SpecialCode == "CROTR" {
			selected["Total Runs"] = append(selected["Total Runs"], value)
		} else {
			if isKembar := util.Contains(check, value); isKembar {
				value = "kembar|" + value
			} else {
				value = "cricket|" + value
			}
			selected["SPECIALS"] = append(selected["SPECIALS"], value)
		}
	}
}
func (selected selectedSpecialMatch) getSpecialBadminton(data []model.SelectedAddSpecial, leagueName, homeName, awayName string) {
	for _, d := range data {
		key := strings.Split(d.LeagueName, leagueName+" ")[1]
		key = util.TrimNonLetterNonNumber(key)
		value := strings.Split(d.HomeName, homeName)[1]
		value = util.TrimNonLetterNonNumber(value)
		if d.SpecialCode == "BDS" {
			selected["SPECIALS"] = append(selected["SPECIALS"], "("+value+")"+"|"+key)
		} else {
			value := strings.Split(d.HomeName, homeName+" ")[1]
			selected[key] = append(selected[key], value)
		}
	}
}
func (selected selectedSpecialMatch) getSpecialPool(data []model.SelectedAddSpecial, leagueName, homeName, awayName string) {
	for _, d := range data {
		key := strings.Split(d.LeagueName, leagueName+" ")[1]
		key = util.TrimNonLetterNonNumber(key)
		value := strings.Split(d.HomeName, homeName)[1]
		value = util.TrimNonLetterNonNumber(value)
		if d.SpecialCode == "PS" {
			selected["SPECIALS"] = append(selected["SPECIALS"], key)
		} else {
			selected["FRAMES WINNER"] = append(selected["FRAMES WINNER"], value)
		}
	}
}
func (selected selectedSpecialMatch) getSpecialEsport(data []model.SelectedAddSpecial, leagueName, homeName, awayName string) {
	for _, d := range data {
		key := strings.Split(d.LeagueName, leagueName+" ")[1]
		value := ""
		if d.HomeName != homeName {
			value = strings.Split(d.HomeName, homeName+" ")[1]
		}
		if key == "(Total Kills)" { // specific this league only
			selected["specials"] = append(selected["specials"], key+"|"+value)
		} else if key == value || value == "" {
			selected["specials"] = append(selected["specials"], key)
		} else {
			selected["specials"] = append(selected["specials"], key+"|"+value)
		}
	}
}
func updateMatchSpecial(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID      int                 `json:"sport_id"`
		MatchID      int                 `json:"match_id"`
		SpecialMatch map[string][]string `json:"special_match"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	sportList := []int{
		10, 11, 12, 16, 35, 22, 32, 38, 52,
	}

	if !util.Contains(sportList, p.SportID) {
		httpError(w, http.StatusBadRequest, "Invalid sportID")
		return
	}

	go func() {
		if p.SportID == 10 {
			addMatchSpecialSoccer(p.MatchID, p.SpecialMatch, stampUser)
		} else if p.SportID == 11 {
			addMatchSpecialTennis(p.MatchID, p.SpecialMatch, stampUser)
		} else if p.SportID == 12 {
			addMatchSpecialBasket(p.MatchID, p.SpecialMatch, stampUser)
		} else if p.SportID == 16 {
			addMatchSpecialVolley(p.MatchID, p.SpecialMatch, stampUser)
		} else if p.SportID == 35 {
			addMatchSpecialTableTennis(p.MatchID, p.SpecialMatch, stampUser)
		} else if p.SportID == 22 {
			addMatchSpecialCricket(p.MatchID, p.SpecialMatch, stampUser)
		} else if p.SportID == 32 {
			addMatchSpecialBadminton(p.MatchID, p.SpecialMatch, stampUser)
		} else if p.SportID == 38 {
			addMatchSpecialPool(p.MatchID, p.SpecialMatch, stampUser)
		} else if p.SportID == 52 {
			addMatchSpecialEsport(p.MatchID, p.SpecialMatch, stampUser)
		}
	}()

	writeJSON(w, statusSuccess, "OK")
}
func addMatchSpecialSoccer(matchID int, specialMatch map[string][]string, stampUser string) {
	if len(specialMatch["team_total_goals"]) > 0 {
		_ = database.InsertMatchSpecialKembar(matchID, "TEAM TOTAL GOALS", "- Over", "- Under", "STG", stampUser)
	}
	if len(specialMatch["single_team_over_under"]) > 0 {
		_ = database.InsertMatchSpecialKembar(matchID, "SINGLE TEAM OVER/UNDER", "- Over", "- Under", "SSTOU", stampUser)
	}
	if len(specialMatch["single_team_odd_even"]) > 0 {
		_ = database.InsertMatchSpecialKembar(matchID, "SINGLE TEAM ODD/EVEN", "- Odd", "- Even", "SSTOE", stampUser)
	}
	if len(specialMatch["specials"]) > 0 {
		_ = database.InsertMatchSpecialKembar(matchID, "SPECIALS", "Clean Sheet", "No Clean Sheet", "SS", stampUser)
	}
	for _, v := range specialMatch["specific_10_mins"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecial(matchID, "SPECIFIC 10 MINS", teamNamePrefix, "S10M", stampUser)
	}
	for _, v := range specialMatch["specific_15_mins"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecial(matchID, "SPECIFIC 15 MINS", teamNamePrefix, "S15M", stampUser)
	}
	for _, v := range specialMatch["specific_15_mins_number_of_corners"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecial(matchID, "SPECIFIC 15 MINS NUMBER OF CORNERS", teamNamePrefix, "S15C", stampUser)
	}
	for _, v := range specialMatch["specific_15_mins_total_bookings"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecial(matchID, "SPECIFIC 15 MINS TOTAL BOOKINGS", teamNamePrefix, "S15B", stampUser)
	}
	for _, v := range specialMatch["corners"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecial(matchID, "CORNERS", teamNamePrefix, "SC", stampUser)
	}
	for _, v := range specialMatch["specials_goal"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecial(matchID, "SPECIALS GOAL", teamNamePrefix, "SGO", stampUser)
	}
	for _, v := range specialMatch["bookings"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecial(matchID, "BOOKINGS", teamNamePrefix, "SB", stampUser)
	}
	for _, v := range specialMatch["goal_kick"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecial(matchID, "GOAL KICK", teamNamePrefix, "SGK", stampUser)
	}
	for _, v := range specialMatch["free_kick"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecial(matchID, "FREE KICK", teamNamePrefix, "SFK", stampUser)
	}
	for _, v := range specialMatch["offside"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecial(matchID, "OFFSIDE", teamNamePrefix, "SOFF", stampUser)
	}
	for _, v := range specialMatch["et_pen"] {
		if v == "et" {
			_ = database.InsertMatchET(matchID, "SET", stampUser)
		} else if v == "pen" {
			_ = database.InsertMatchPEN(matchID, "SET", stampUser)
		}
	}
	for _, v := range specialMatch["penalty_shootout"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecialKembar(matchID, "PENALTY SHOOT-OUT", teamNamePrefix+" Penalty - Goal", teamNamePrefix+" Penalty - No Goal", "SPSO", stampUser)
	}
}
func addMatchSpecialTennis(matchID int, specialMatch map[string][]string, stampUser string) {
	for _, v := range specialMatch["specials"] {
		d := strings.Split(v, "|")
		teamNamePrefix := d[0]
		leagueNamePrefix := d[1]
		_ = database.InsertMatchSpecialTennis(matchID, leagueNamePrefix, teamNamePrefix, "TS", "", stampUser)
	}

	for _, v := range specialMatch["first_set_game_winner"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecialTennis(matchID, "FIRST SET - GAME WINNER", teamNamePrefix, "TS1", "", stampUser)
	}
	for _, v := range specialMatch["second_set_game_winner"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecialTennis(matchID, "SECOND SET - GAME WINNER", teamNamePrefix, "TS2", "", stampUser)
	}
	for _, v := range specialMatch["third_set_game_winner"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecialTennis(matchID, "THIRD SET - GAME WINNER", teamNamePrefix, "TS3", "", stampUser)
	}
	for _, v := range specialMatch["fourth_set_game_winner"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecialTennis(matchID, "FOURTH SET - GAME WINNER", teamNamePrefix, "TS4", "", stampUser)
	}
	for _, v := range specialMatch["fifth_set_game_winner"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecialTennis(matchID, "FIFTH SET - GAME WINNER", teamNamePrefix, "TS5", "", stampUser)
	}
}
func addMatchSpecialBasket(matchID int, specialMatch map[string][]string, stampUser string) {
	for _, v := range specialMatch["specials"] {
		_ = database.InsertMatchSpecialBasket(matchID, v, "", "BS", "- ", stampUser)
	}
	for _, data := range specialMatch["quarter"] {
		leagueNamePrefix := "(" + data + "uarter)"
		teamNamePrefix := "(" + data + ")"
		_ = database.InsertMatchSpecialBasket(matchID, leagueNamePrefix, teamNamePrefix, "BQ", "", stampUser)
	}
	if len(specialMatch["team_total"]) > 0 {
		_ = database.InsertMatchSpecialKembar(matchID, "SPECIALS (Team Totals)", "- (Over)", "- (Under)", "BTT", stampUser)
	}
	if len(specialMatch["2nd_half"]) > 0 {
		_ = database.InsertMatchSpecialBasket(matchID, "2ND HALF", "(2nd)", "B2N", "- ", stampUser)
	}
	for _, data := range specialMatch["team_to_score"] {
		_ = database.InsertMatchSpecialBasket(matchID, data, data, "BTS", "- ", stampUser)
	}
	for _, data := range specialMatch["team_race_to_first_10"] {
		_ = database.InsertMatchSpecialBasket(matchID, "Team Race to First 10", "to First 10 Points ("+data+")", "BTR10Q", "- ", stampUser)
	}
	for _, data := range specialMatch["team_race_to_first_15"] {
		_ = database.InsertMatchSpecialBasket(matchID, "Team Race to First 15", "to First 15 Points ("+data+")", "BTR15Q", "- ", stampUser)
	}
	for _, data := range specialMatch["team_race_to_first_20"] {
		_ = database.InsertMatchSpecialBasket(matchID, "Team Race to First 20", "to First 20 Points ("+data+")", "BTR20Q", "- ", stampUser)
	}
}
func addMatchSpecialVolley(matchID int, specialMatch map[string][]string, stampUser string) {
	for _, v := range specialMatch["specials"] {
		splitString := strings.Split(v, "|")
		_ = database.InsertMatchSpecialVolley(matchID, splitString[1], splitString[0], "VS", stampUser)
	}
}
func addMatchSpecialTableTennis(matchID int, specialMatch map[string][]string, stampUser string) {
	for _, v := range specialMatch["specials"] {
		splitString := strings.Split(v, "|")
		_ = database.InsertMatchSpecialVolley(matchID, splitString[1], splitString[0], "TTS", stampUser)
	}
}
func addMatchSpecialCricket(matchID int, specialMatch map[string][]string, stampUser string) {
	for _, v := range specialMatch["specials"] {
		data := strings.Split(v, "|")
		typeSpecial := data[0] // kembar/cricket
		leagueNamePrefix := data[1]
		if strings.Contains(typeSpecial, "kembar") {
			_ = database.InsertMatchSpecialKembar(matchID, leagueNamePrefix, "- (Over)", "- (Under)", "CRS", stampUser)
		} else {
			_ = database.InsertMatchSpecialCricket(matchID, leagueNamePrefix, "", "CRS", "", stampUser)
		}
	}
	for _, v := range specialMatch["1st_innings_total_runs"] {
		leagueNamePrefix := v
		_ = database.InsertMatchSpecialKembar(matchID, leagueNamePrefix, "- (Over)", "- (Under)", "CR1INOTR", stampUser)
	}
	for _, v := range specialMatch["2nd_innings_total_runs"] {
		leagueNamePrefix := v
		_ = database.InsertMatchSpecialKembar(matchID, leagueNamePrefix, "- (Over)", "- (Under)", "CR2INOTR", stampUser)
	}
	for _, v := range specialMatch["total_runs"] {
		leagueNamePrefix := v
		_ = database.InsertMatchSpecialKembar(matchID, leagueNamePrefix, "- (Over)", "- (Under)", "CROTR", stampUser)
	}
}
func addMatchSpecialBadminton(matchID int, specialMatch map[string][]string, stampUser string) {
	for _, v := range specialMatch["specials"] {
		data := strings.Split(v, "|")
		_ = database.InsertMatchSpecialBadminton(matchID, data[1], data[0], "BDS", "", stampUser)
	}
	for _, v := range specialMatch["first_set_point_winner"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecialBadminton(matchID, "First Set - Point Winner", teamNamePrefix, "BDS1", "", stampUser)
	}
	for _, v := range specialMatch["second_set_point_winner"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecialBadminton(matchID, "Second Set - Point Winner", teamNamePrefix, "BDS2", "", stampUser)
	}
	for _, v := range specialMatch["third_set_point_winner"] {
		teamNamePrefix := v
		_ = database.InsertMatchSpecialBadminton(matchID, "Third Set - Point Winner", teamNamePrefix, "BDS3", "", stampUser)
	}
}
func addMatchSpecialPool(matchID int, specialMatch map[string][]string, stampUser string) {
	for _, v := range specialMatch["specials"] {
		_ = database.InsertMatchSpecialPool(matchID, v, "", "PS", "", stampUser)
	}
	for _, v := range specialMatch["frames_winner"] {
		teamNamePrefix := "(" + v + ")"
		_ = database.InsertMatchSpecialPool(matchID, "Frames Winner", teamNamePrefix, "PSFW", "", stampUser)
	}
}
func addMatchSpecialEsport(matchID int, specialMatch map[string][]string, stampUser string) {
	for _, v := range specialMatch["maps"] {
		leagueNamePrefix := v
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, leagueNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["first_blood"] {
		data := strings.Split(v, "|")
		leagueNamePrefix := data[0]
		teamNamePrefix := data[1]
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, teamNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["total_kills"] {
		data := strings.Split(v, "|")
		leagueNamePrefix := data[0]
		teamNamePrefix := data[1]
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, teamNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["first_barracks"] {
		data := strings.Split(v, "|")
		leagueNamePrefix := data[0]
		teamNamePrefix := data[1]
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, teamNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["first_baron"] {
		data := strings.Split(v, "|")
		leagueNamePrefix := data[0]
		teamNamePrefix := data[1]
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, teamNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["map_in_play"] {
		data := strings.Split(v, "|")
		leagueNamePrefix := data[0]
		teamNamePrefix := data[1]
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, teamNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["first_to_reach_5_kills"] {
		data := strings.Split(v, "|")
		leagueNamePrefix := data[0]
		teamNamePrefix := data[1]
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, teamNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["total_kills_in_play"] {
		data := strings.Split(v, "|")
		leagueNamePrefix := data[0]
		teamNamePrefix := data[1]
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, teamNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["first_roshan"] {
		data := strings.Split(v, "|")
		leagueNamePrefix := data[0]
		teamNamePrefix := data[1]
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, teamNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["first_to_reach_10_kills_in_play"] {
		data := strings.Split(v, "|")
		leagueNamePrefix := data[0]
		teamNamePrefix := data[1]
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, teamNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["match_winner"] {
		leagueNamePrefix := v
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, "", "ESS", "", stampUser)
	}
	for _, v := range specialMatch["first_to_win_5_round"] {
		data := strings.Split(v, "|")
		leagueNamePrefix := data[0]
		teamNamePrefix := data[1]
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, teamNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["first_to_reach_10_kills"] {
		data := strings.Split(v, "|")
		leagueNamePrefix := data[0]
		teamNamePrefix := data[1]
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, teamNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["duration"] {
		data := strings.Split(v, "|")
		leagueNamePrefix := data[0]
		teamNamePrefix := data[1]
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, teamNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["pistol_round"] {
		data := strings.Split(v, "|")
		leagueNamePrefix := data[0]
		teamNamePrefix := data[1]
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, teamNamePrefix, "ESS", "", stampUser)
	}
	for _, v := range specialMatch["tie_breaker"] {
		leagueNamePrefix := v
		_ = database.InsertMatchSpecialEsport(matchID, leagueNamePrefix, "", "ESS", "", stampUser)
	}
}

func getMatchSpecialMore(w http.ResponseWriter, r *http.Request) {
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

	specialMore, err := database.GetMatchSpecialMore(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, strings.Split(specialMore, ","))
}
func updateMatchSpecialMore(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID     int      `json:"sport_id"`
		MatchID     int      `json:"match_id"`
		SpecialMore []string `json:"special_more"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	if p.SportID == 10 {
		listErr = addMatchSpecialMoreSoccer(p.MatchID, p.SpecialMore, stampUser)
	} else if p.SportID == 11 {
		listErr = addMatchSpecialMoreTennis(p.MatchID, p.SpecialMore, stampUser)
	} else if p.SportID == 12 {
		listErr = addMatchSpecialMoreBasket(p.MatchID, p.SpecialMore, stampUser)
	} else if p.SportID == 32 {
		listErr = addMatchSpecialMoreBadminton(p.MatchID, p.SpecialMore, stampUser)
	} else {
		httpError(w, http.StatusBadRequest, "Invalid sportID")
		return
	}

	if len(listErr) > 0 {
		httpError(w, http.StatusBadRequest, strings.Join(listErr, "\n"))
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func addMatchSpecialMoreSoccer(matchID int, specialMore []string, stampUser string) (listErr []string) {
	for _, v := range specialMore {
		gameTypeSpecial, _ := strconv.Atoi(v)

		var err error
		if gameTypeSpecial == 60 {
			err = database.InsertMatchSpecialNCNG(matchID, gameTypeSpecial, stampUser)
		} else if gameTypeSpecial == 1001 || gameTypeSpecial == 1002 {
			err = database.InsertMatchSpecialCS(matchID, gameTypeSpecial, stampUser)
		} else {
			err = database.InsertMatchSpecialMoreSoccer(matchID, gameTypeSpecial, stampUser)
		}
		if err != nil {
			listErr = append(listErr, err.Error())
		}
	}
	return listErr
}
func addMatchSpecialMoreTennis(matchID int, specialMore []string, stampUser string) (listErr []string) {
	for _, v := range specialMore {
		gameTypeSpecial, _ := strconv.Atoi(v)
		err := database.InsertMatchSpecialMoreTennis(matchID, gameTypeSpecial, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())
		}
	}
	return listErr
}
func addMatchSpecialMoreBasket(matchID int, specialMore []string, stampUser string) (listErr []string) {
	basketSubpartai := []int{1241, 1242, 1243, 1244}
	basketSubpartaiOther := []int{1201, 1202, 1215, 1216, 1217, 1218, 1219, 1220, 1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270, 1271, 1272, 1273, 1274, 1275, 1276, 1282, 1283, 1284, 1285, 1286, 1287, 1288, 1289, 1290, 1291, 1292, 1293}
	basketSubpartai4 := []int{1203, 1204, 1205, 1206, 1207, 1208, 1209, 1210, 1211, 1212, 1213, 1214, 1221, 1222, 1223, 1224, 1225, 1226, 1227, 1228, 1229, 1230, 1231, 1232, 1233, 1234, 1235, 1236, 1237, 1238, 1239, 1240, 1257, 1258, 1259, 1260, 1277, 1278, 1279, 1280, 1281}

	var wg sync.WaitGroup
	wg.Add(len(specialMore))
	for _, v := range specialMore {
		gameTypeSpecial, _ := strconv.Atoi(v)

		go func(gameTypeSpecial int) {
			defer wg.Done()

			var err error
			if util.Contains(basketSubpartai, gameTypeSpecial) {
				err = database.InsSubMatchBasket(matchID, gameTypeSpecial, stampUser)
				if err != nil {
					listErr = append(listErr, err.Error())
				}
			} else if util.Contains(basketSubpartaiOther, gameTypeSpecial) {
				err = database.InsMatchSpecialNCNG(matchID, gameTypeSpecial, stampUser)
				if err != nil {
					listErr = append(listErr, err.Error())
				}
			} else if util.Contains(basketSubpartai4, gameTypeSpecial) {
				err = database.InsMatchSpecialMore(matchID, gameTypeSpecial, stampUser)
				if err != nil {
					listErr = append(listErr, err.Error())
				}
			}
		}(gameTypeSpecial)
	}
	wg.Wait()
	return listErr
}
func addMatchSpecialMoreBadminton(matchID int, specialMore []string, stampUser string) (listErr []string) {
	for _, v := range specialMore {
		gameTypeSpecial, _ := strconv.Atoi(v)
		err := database.InsertMatchSpecialMoreBadminton(matchID, gameTypeSpecial, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())
		}
	}
	return listErr
}
