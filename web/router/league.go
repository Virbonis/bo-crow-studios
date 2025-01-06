package router

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/gorilla/mux"
)

func RegisterAPILeague() {
	Base.HandleFunc("/league/select", listSelectLeague).Methods(http.MethodGet)
	Base.HandleFunc("/league/select", updateSelectLeague).Methods(http.MethodPut)
	Base.HandleFunc("/league/select/refresh", updateSelectLeagueRefresh).Methods(http.MethodPut)

	Base.HandleFunc("/league/select/instantbet", listLeagueInstantBet).Methods(http.MethodGet)
	Base.HandleFunc("/league", listMasterLeague).Methods(http.MethodGet)
	Base.HandleFunc("/league/export", listLeagueExportXLS).Methods(http.MethodGet)
	Base.HandleFunc("/league", createMasterLeague).Methods(http.MethodPost)
	Base.HandleFunc("/league", updateMasterLeague).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}", getMasterLeagueDetail).Methods(http.MethodGet)
	Base.HandleFunc("/league/{league_id}/parent-league", editParentLeague).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/odds-step", editOddsStep).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/spread-parlay", editSpreadParlay).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/odds-diff", editOddsDiff).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/1x2-diff", edit1X2Diff).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/lap-short", editLAPShort).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/auto-close", editAutoClose).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/bet-genius", editBetGenius).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/timed-diff", editTimedDiff).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/profile-id", editProfileID).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/profile-1x2", editProfile1X2).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/special-code", editSpecialCode).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/1x2-lap", edit1X2LAP).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/league-group", editLeagueGroup).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/region", editRegion).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/linkoddsdiff", editLinkOddsDiff).Methods(http.MethodPut)
	Base.HandleFunc("/league/{league_id}/copy-lottery", copyToLottery).Methods(http.MethodPut)

	Base.HandleFunc("/league/select/hidden-league", listLeagueSearch).Methods(http.MethodGet)
	Base.HandleFunc("/league/select/auto-add-match", listLeagueAutoAddMatch).Methods(http.MethodGet)
	Base.HandleFunc("/league/select/add-match", listLeagueAddMatch).Methods(http.MethodGet)
	Base.HandleFunc("/league/select/match-list", listLeagueMatchList).Methods(http.MethodGet)
	Base.HandleFunc("/league/select/mapping-lottery", listLeagueMappingLottery).Methods(http.MethodGet)
	Base.HandleFunc("/league/select/match-profile", listLeagueMatchProfile).Methods(http.MethodGet)
	Base.HandleFunc("/league/select/match-statistic", listLeagueMatchStatistic).Methods(http.MethodGet)
	Base.HandleFunc("/league/select/scoring-match", listLeagueScoringMatch).Methods(http.MethodGet)
	Base.HandleFunc("/league/select/process-match", listLeagueProcessMatch).Methods(http.MethodGet)
	Base.HandleFunc("/league/select/unprocess-match", listLeagueUnprocessMatch).Methods(http.MethodGet)

	Base.HandleFunc("/league/select/add-outright", listLeagueAddOutright).Methods(http.MethodGet)
	Base.HandleFunc("/league/select/mapping-league", listLeagueMappingLeague).Methods(http.MethodGet)
	Base.HandleFunc("/league/select/mapping-league-rball", listLeagueMappingLeagueRBall).Methods(http.MethodGet)
	Base.HandleFunc("/league/select/mapping-bb", listLeagueMappingBuilder).Methods(http.MethodGet)
	Base.HandleFunc("/league/select/online-list", listLeagueOnlineList).Methods(http.MethodGet)
}

func listSelectLeague(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID string `schema:"popup_id"`
		Group   string `schema:"group"` // nilai dari match_time_slot/Forecast-Post
		OS      string `schema:"os"`
		// early_date: deadball, runningball, moquick, moquickeuro, movquick, mixparlay
		FromEarlyDate string `schema:"from_early_date"`
		ToEarlyDate   string `schema:"to_early_date"`
		LeagueName    string `schema:"league_name"`
		SportIDs      string `schema:"sport_ids"`
		Category      string `schema:"category"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListSelectLeague(p.PopupID, userSession.SessionID, p.Group, p.FromEarlyDate, p.ToEarlyDate, p.OS, p.LeagueName, p.SportIDs, p.Category, userInfo.UserTeamID, userInfo.UserTeamSubID, userInfo.TraderGroupORI, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func updateSelectLeague(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID   string `json:"popup_id"`
		Group     string `json:"group"` // nilai dari match_time_slot/Forecast-Post
		LeagueIDs string `json:"league_ids"`
		// early_date: deadball, runningball, moquick, moquickeuro, movquick, mixparlay
		FromEarlyDate string `json:"from_early_date"`
		ToEarlyDate   string `json:"to_early_date"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	if err := database.UpdateSelectLeague(p.PopupID, userSession.SessionID, p.Group, p.FromEarlyDate, p.ToEarlyDate, p.LeagueIDs, userInfo.UserTeamID, userInfo.UserTeamSubID, stampUser); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateSelectLeagueRefresh(w http.ResponseWriter, r *http.Request) {
	var p struct {
		PopupID       string `json:"popup_id"`
		Group         string `json:"group"`
		FromEarlyDate string `json:"from_early_date"`
		ToEarlyDate   string `json:"to_early_date"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	if err := database.UpdateSelectLeagueRefresh(p.PopupID, userSession.SessionID, p.Group, p.FromEarlyDate, p.ToEarlyDate, userInfo.UserTeamID, userInfo.UserTeamSubID, stampUser); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listLeagueInstantBet(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	sessionID := userSession.SessionID
	userInfo := userSession.User
	stampUser := userInfo.Username
	traderGroupORI := userInfo.TraderGroupORI
	userTeamID := userInfo.UserTeamID
	userTeamSubID := userInfo.UserTeamSubID
	var p struct {
		SportID int `schema:"sport_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListLeagueInstantBet(p.SportID, sessionID, stampUser, traderGroupORI, userTeamID, userTeamSubID)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listMasterLeague(w http.ResponseWriter, r *http.Request) {
	var p struct {
		SportID      int    `schema:"sport_id"`
		LeagueNameEN string `schema:"league_name_en"`
		ShortName    string `schema:"short_name"`
		ProfileID    string `schema:"profile_id"`
		Profile1X2   string `schema:"profile1x2"`
		PriceGroup   int    `schema:"price_group"`
		Category     string `schema:"category"`
		Active       string `schema:"active"`
		CurrentPage  int    `schema:"current_page"`
		PageSize     int    `schema:"page_size"`
		TotalRecords int    `schema:"total_records"`
		PageOrder    string `schema:"page_order"`
		Sort         string `schema:"sort"`
		By           string `schema:"by"`
		LeagueID     int    `schema:"league_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	res, total, err := database.ListMasterLeague(&p.SportID, &p.CurrentPage, &p.PageSize, &p.LeagueID, &p.PriceGroup, p.Active, p.LeagueNameEN, p.ShortName, p.ProfileID, p.Profile1X2, p.Category, p.Sort, p.By, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}

func listLeagueExportXLS(w http.ResponseWriter, r *http.Request) {
	var p struct {
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
	res, err := database.ListLeagueExportXLS(p.SportID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func getMasterLeagueDetail(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	res, err := database.GetMasterLeagueDetail(leagueId, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func createMasterLeague(w http.ResponseWriter, r *http.Request) {
	var p struct {
		LeagueSequence int    `json:"league_sequence"`
		SportID        int    `json:"sport_id"`
		ProfileID      string `json:"profile_id"`
		PriceGroup     int    `json:"price_group"`
		Category       string `json:"category"`
		Competition    string `json:"competition"`
		Active         string `json:"active"`
		ShortName      string `json:"short_name"`
		LeagueNameEN   string `json:"league_name_en"`
		LeagueNameCN   string `json:"league_name_cn"`
		LeagueNameTW   string `json:"league_name_tw"`
		LeagueNameTH   string `json:"league_name_th"`
		LeagueNameJP   string `json:"league_name_jp"`
		LeagueNameKR   string `json:"league_name_kr"`
		LeagueNameVN   string `json:"league_name_vn"`
		LeagueNameID   string `json:"league_name_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err := database.CreateMasterLeague(
		p.LeagueSequence, p.SportID,
		p.ProfileID, p.PriceGroup, p.Category, p.Competition, p.Active,
		p.ShortName, p.LeagueNameEN, p.LeagueNameCN, p.LeagueNameTW, p.LeagueNameTH, p.LeagueNameJP, p.LeagueNameKR, p.LeagueNameVN, p.LeagueNameID,
		stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateMasterLeague(w http.ResponseWriter, r *http.Request) {
	type List struct {
		LeagueID       int    `json:"league_id"`
		LeagueSequence int    `json:"league_sequence"`
		NoDisplayLive  int    `json:"no_display_live"`
		ProfileID      string `json:"profile_id"`
		PriceGroup     int    `json:"price_group"`
		Category       string `json:"category"`
		Competition    string `json:"competition"`
		Active         string `json:"active"`
		ShortName      string `json:"short_name"`
		LeagueNameEN   string `json:"league_name_en"`
		LeagueNameCN   string `json:"league_name_cn"`
		LeagueNameTW   string `json:"league_name_tw"`
		LeagueNameTH   string `json:"league_name_th"`
		LeagueNameJP   string `json:"league_name_jp"`
		LeagueNameKR   string `json:"league_name_kr"`
		LeagueNameVN   string `json:"league_name_vn"`
		LeagueNameID   string `json:"league_name_id"`
	}

	var p []List
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	var tempErr []string

	for _, data := range p {
		err := database.UpdateMasterLeague(
			data.LeagueID, data.LeagueSequence, data.NoDisplayLive,
			data.ProfileID, data.PriceGroup, data.Category, data.Competition, data.Active,
			data.ShortName, data.LeagueNameEN, data.LeagueNameCN, data.LeagueNameTW, data.LeagueNameTH, data.LeagueNameJP, data.LeagueNameKR, data.LeagueNameVN, data.LeagueNameID,
			stampUser)
		if err != nil {
			tempErr = append(tempErr, err.Error())
		}

		userAuthIDs := userSession.User.UserAuthIDs
		CanEditLeagueName := !helper.IsAuthInclude(userAuthIDs, helper.ALLOWED_UPDATE_MASTER_LEAGUE_NAME)
		if CanEditLeagueName {
			err = database.UpdateLeagueName(data.LeagueID, data.LeagueNameEN, stampUser)
			if err != nil {
				tempErr = append(tempErr, err.Error())
			}
		}
	}

	if len(tempErr) > 0 {
		httpError(w, http.StatusBadRequest, strings.Join(tempErr, "\n"))
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func editParentLeague(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var p struct {
		ParentLeagueID int `json:"parent_league_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateParentLeague(leagueId, p.ParentLeagueID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func editOddsStep(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var p struct {
		EvOddsStep        int `json:"ev_odds_step"`
		EvOddsStepOU      int `json:"ev_odds_step_ou"`
		EvOddsStepTimerHT int `json:"ev_odds_step_timer_ht"`
		EvOddsStepTimerFT int `json:"ev_odds_step_timer_ft"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateOddsStep(leagueId, p.EvOddsStep, p.EvOddsStepOU, p.EvOddsStepTimerHT, p.EvOddsStepTimerFT, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func editSpreadParlay(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		OddsSpreadParlayAH     int `json:"odds_spread_parlay_ah"`
		OddsSpreadParlayAHLive int `json:"odds_spread_parlay_ah_live"`
		OddsSpreadParlayOU     int `json:"odds_spread_parlay_ou"`
		OddsSpreadParlayOULive int `json:"odds_spread_parlay_ou_live"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateSpreadParlay(leagueId, p.OddsSpreadParlayAH, p.OddsSpreadParlayAHLive, p.OddsSpreadParlayOU, p.OddsSpreadParlayOULive, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func editOddsDiff(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		OddsPointDiffAH     int `json:"odds_point_diff_ah"`
		OddsPointDiffAHLive int `json:"odds_point_diff_ah_live"`
		OddsPointDiffOU     int `json:"odds_point_diff_ou"`
		OddsPointDiffOULive int `json:"odds_point_diff_ou_live"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateOddsDiff(leagueId, p.OddsPointDiffAH, p.OddsPointDiffOU, p.OddsPointDiffAHLive, p.OddsPointDiffOULive, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func edit1X2Diff(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var p struct {
		Odds1DiffHT int `json:"odds_1_diff_ht"`
		Odds1Diff   int `json:"odds_1_diff"`
		Odds2DiffHT int `json:"odds_2_diff_ht"`
		Odds2Diff   int `json:"odds_2_diff"`
		Odds3DiffHT int `json:"odds_3_diff_ht"`
		Odds3Diff   int `json:"odds_3_diff"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.Update1X2Diff(leagueId, p.Odds1Diff, p.Odds2Diff, p.Odds3Diff, p.Odds1DiffHT, p.Odds2DiffHT, p.Odds3DiffHT, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func editLAPShort(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		TotalPauseToday int `json:"total_pause_today"`
		TotalPauseEarly int `json:"total_pause_early"`
		TotalPauseLive  int `json:"total_pause_live"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateLimitAutoPauseShort(leagueId, p.TotalPauseToday, p.TotalPauseEarly, p.TotalPauseLive, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func editAutoClose(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		AutoClose         string `json:"st_auto_close"`
		AutoCloseInterval string `json:"auto_close_interval"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateAutoCloseLeague(leagueId, p.AutoClose, p.AutoCloseInterval, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func editBetGenius(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		STBookingBG string `json:"st_booking_bg"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateAutoFeedingtoBG(leagueId, p.STBookingBG, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func editTimedDiff(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var p struct {
		MaxBetPercentAHFT    int `json:"max_bet_percent_ah_ft"`
		MaxBetPercentAHFT2   int `json:"max_bet_percent_ah_ft_2"`
		MaxBetPercentAHHT    int `json:"max_bet_percent_ah_ht"`
		MaxBetPercentOUFT    int `json:"max_bet_percent_ou_ft"`
		MaxBetPercentOUFT2   int `json:"max_bet_percent_ou_ft_2"`
		MaxBetPercentOUHT    int `json:"max_bet_percent_ou_ht"`
		MaxLimitPercentAHFT  int `json:"max_limit_percent_ah_ft"`
		MaxLimitPercentAHFT2 int `json:"max_limit_percent_ah_ft_2"`
		MaxLimitPercentAHHT  int `json:"max_limit_percent_ah_ht"`
		MaxLimitPercentOUFT  int `json:"max_limit_percent_ou_ft"`
		MaxLimitPercentOUFT2 int `json:"max_limit_percent_ou_ft_2"`
		MaxLimitPercentOUHT  int `json:"max_limit_percent_ou_ht"`
		MaxBetTimerAHFT      int `json:"max_bet_timer_ah_ft"`
		MaxBetTimerAHFT2     int `json:"max_bet_timer_ah_ft_2"`
		MaxBetTimerAHHT      int `json:"max_bet_timer_ah_ht"`
		MaxBetTimerOUFT      int `json:"max_bet_timer_ou_ft"`
		MaxBetTimerOUFT2     int `json:"max_bet_timer_ou_ft_2"`
		MaxBetTimerOUHT      int `json:"max_bet_timer_ou_ht"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateTimedMaxBet(leagueId, p.MaxBetPercentAHFT, p.MaxBetPercentAHFT2, p.MaxBetPercentAHHT, p.MaxBetPercentOUFT, p.MaxBetPercentOUFT2, p.MaxBetPercentOUHT, p.MaxLimitPercentAHFT, p.MaxLimitPercentAHFT2, p.MaxLimitPercentAHHT, p.MaxLimitPercentOUFT, p.MaxLimitPercentOUFT2, p.MaxLimitPercentOUHT, p.MaxBetTimerAHFT, p.MaxBetTimerAHFT2, p.MaxBetTimerAHHT, p.MaxBetTimerOUFT, p.MaxBetTimerOUFT2, p.MaxBetTimerOUHT, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func editProfileID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		ProfileID string `json:"limit_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateLeagueProfileID(leagueId, p.ProfileID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func editProfile1X2(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		Profile1X2 string `json:"limit_id1x2"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateLeagueProfile1X2(leagueId, p.Profile1X2, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func editSpecialCode(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		SpecialCode string `json:"special_code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateSpecialCode(leagueId, p.SpecialCode, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func edit1X2LAP(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		Lap1X2HT     int `json:"lap1x2_ht"`
		LapLive1X2HT int `json:"lap_live1x2_ht"`
		Lap1X2FT     int `json:"lap1x2_ft"`
		LapLive1X2FT int `json:"lap_live1x2_ft"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.Update1X2LAP(leagueId, p.Lap1X2HT, p.LapLive1X2HT, p.Lap1X2FT, p.LapLive1X2FT, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func editLeagueGroup(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		LeagueGroup string `json:"league_group"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateLeagueGroup(leagueId, p.LeagueGroup, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func editRegion(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		RegionID int `json:"region_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateRegion(leagueId, p.RegionID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func editLinkOddsDiff(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	var p struct {
		GameType         int  `json:"game_type"`
		LinkOddsDiff     int  `json:"link_odds_diff"`
		LinkOddsSpread   int  `json:"link_odds_spread"`
		LinkOddsDiffLock bool `json:"link_odds_diff_lock"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.UpdateLinkOddsMasterLeague(leagueId, p.GameType, p.LinkOddsDiff, p.LinkOddsSpread, p.LinkOddsDiffLock, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func copyToLottery(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	leagueId, err := strconv.Atoi(vars["league_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	err = database.CopyToLottery(leagueId, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func listLeagueSearch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		LeagueName string `schema:"league_name"`
		SportID    int    `schema:"sport_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	res, err := database.ListLeagueHiddenSearch(p.LeagueName, p.SportID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listLeagueAutoAddMatch(w http.ResponseWriter, r *http.Request) {
	var p struct {
		SportId int `schema:"sport_id"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListLeagueAutoAddMatch(p.SportId, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func listLeagueAddMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Website    string `schema:"website"`
		LeagueName string `schema:"league_name"`
		SportID    int    `schema:"sport_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListLeagueAddMatch(p.Website, p.LeagueName, stampUser, p.SportID)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func listLeagueMatchList(w http.ResponseWriter, r *http.Request) {
	var p struct {
		DateStart            string `schema:"date_start"`
		DateEnd              string `schema:"date_end"`
		MatchID              int    `schema:"match_id"`
		SportIDs             string `schema:"sport_ids"`
		Category             string `schema:"category"`
		MatchOpenStatus      string `schema:"match_open_status"`
		MatchLiveStatus      string `schema:"match_live_status"`
		MatchHasLiveStatus   string `schema:"match_has_live_status"`
		MatchHasParlayStatus string `schema:"match_has_parlay_status"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListLeagueMatchList(p.DateStart, p.DateEnd, p.SportIDs, p.MatchID, p.Category, p.MatchOpenStatus,
		p.MatchLiveStatus, p.MatchHasLiveStatus, p.MatchHasParlayStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func listLeagueMappingLottery(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateStart string `schema:"date_start"`
		DateEnd   string `schema:"date_end"`
		SportID   int    `schema:"sport_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListLeagueMappingLottery(p.SportID, p.DateStart, p.DateEnd, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
func listLeagueMatchProfile(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateStart string `schema:"date_start"`
		DateEnd   string `schema:"date_end"`
		MatchID   int    `schema:"match_id"`
		SportID   int    `schema:"sport_id"`
		ProfileID string `schema:"profile_id"`
		TeamName  string `schema:"team_name"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListLeagueMatchProfile(p.DateStart, p.DateEnd, p.MatchID, p.SportID, p.ProfileID, p.TeamName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func listLeagueMatchStatistic(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateStart string `schema:"date_start"`
		DateEnd   string `schema:"date_end"`
		MatchID   int    `schema:"match_id"`
		SportID   int    `schema:"sport_id"`
		ProfileID string `schema:"profile_id"`
		TeamName  string `schema:"team_name"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListLeagueMatchStatistic(p.DateStart, p.DateEnd, p.MatchID, p.SportID, p.ProfileID, p.TeamName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func listLeagueScoringMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID          int    `schema:"match_id"`
		SportID          int    `schema:"sport_id"`
		MatchDate        string `schema:"match_date"`
		HTScoreStatus    string `schema:"ht_score_status"`
		FTScoreStatus    string `schema:"ft_score_status"`
		FGLGScoreStatus  string `schema:"fglg_score_status"`
		IncludeProcessed string `schema:"include_processed"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListLeagueScoringMatch(p.MatchID, p.SportID, p.MatchDate, p.HTScoreStatus, p.FTScoreStatus, p.FGLGScoreStatus, p.IncludeProcessed, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listLeagueProcessMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchDate   string `schema:"match_date"`
		SportID     int    `schema:"sport_id"`
		MatchStatus string `schema:"match_status"`
		HTStatus    string `schema:"ht_status"`
		FTStatus    string `schema:"ft_status"`
		FGLGStatus  string `schema:"fglg_status"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListLeagueProcessMatch(p.SportID, p.MatchDate, p.MatchStatus, p.HTStatus, p.FTStatus, p.FGLGStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func listLeagueUnprocessMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchDate   string `schema:"match_date"`
		SportID     int    `schema:"sport_id"`
		MatchStatus string `schema:"match_status"`
		HTStatus    string `schema:"ht_status"`
		FTStatus    string `schema:"ft_status"`
		FGLGStatus  string `schema:"fglg_status"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListLeagueUnprocessMatch(p.SportID, p.MatchDate, p.MatchStatus, p.HTStatus, p.FTStatus, p.FGLGStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listLeagueAddOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID    int    `schema:"sport_id"`
		LeagueName string `schema:"league_name"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListLeagueAddOutright(p.SportID, p.LeagueName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listLeagueMappingLeague(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID    int    `schema:"sport_id"`
		LeagueName string `schema:"league_name"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListLeagueMappingLeague(p.SportID, p.LeagueName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listLeagueMappingLeagueRBall(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID    int    `schema:"sport_id"`
		LeagueName string `schema:"league_name"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListLeagueMappingLeagueRBall(p.SportID, p.LeagueName, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listLeagueMappingBuilder(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchDateFrom string `schema:"match_date_from"`
		MatchDateTo   string `schema:"match_date_to"`
		MatchID       int    `schema:"match_id"`
		SportID       int    `schema:"sport_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListLeagueMappingBuilder(p.MatchDateFrom, p.MatchDateTo, p.MatchID, p.SportID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func listLeagueOnlineList(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchDate string `schema:"match_date"`
		SportID   int    `schema:"sport_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListLeagueOnlineList(p.MatchDate, p.SportID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
