package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIScoringMatch() {
	Base.HandleFunc("/scoring-match", listScoringMatch).Methods(http.MethodGet)
	Base.HandleFunc("/scoring-match", updateScoringMatch).Methods(http.MethodPut)
	Base.HandleFunc("/scoring-match/detail", listScoringDetailMatch).Methods(http.MethodGet)
	Base.HandleFunc("/scoring-match/detail", updateScoringDetailMatch).Methods(http.MethodPut)
	Base.HandleFunc("/scoring-match/detail", deleteScoringDetailMatch).Methods(http.MethodDelete)
	Base.HandleFunc("/scoring-match/home-away", updateHomeAwayPosisi).Methods(http.MethodPut)
	Base.HandleFunc("/scoring-match/reset", updateScoringResetMatch).Methods(http.MethodPut)
	Base.HandleFunc("/scoring-match/special", listScoringMatchSpecial).Methods(http.MethodGet)
	Base.HandleFunc("/scoring-match/special", updateScoringMatchSpecial).Methods(http.MethodPut)
	Base.HandleFunc("/scoring-match/special-basket", listScoringMatchSpecialbasketScore).Methods(http.MethodGet)
	Base.HandleFunc("/scoring-match/special-basket", updateScoringMatchSpecialBasket).Methods(http.MethodPut)
	Base.HandleFunc("/scoring-match/special-basket/main-round", updateScoringMatchSpecialBasketMainRound).Methods(http.MethodPut)
	Base.HandleFunc("/scoring-match/next-corner-goal", listGridScoringMatchNCNG).Methods(http.MethodGet)
	Base.HandleFunc("/scoring-match/next-corner-goal", updateScoringMatchNextGoal).Methods(http.MethodPut)
}

func listScoringMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID          int    `schema:"match_id"`
		SportID          int    `schema:"sport_id"`
		LeagueID         int    `schema:"league_id"`
		MatchDate        string `schema:"match_date"`
		HTScoreStatus    string `schema:"ht_score_status"`
		FTScoreStatus    string `schema:"ft_score_status"`
		FGLGScoreStatus  string `schema:"fglg_score_status"`
		IncludeProcessed string `schema:"include_processed"`
		CurrentPage      int    `schema:"current_page"`
		PageSize         int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListScoringMatch(p.MatchID, p.SportID, p.LeagueID, p.MatchDate, p.HTScoreStatus, p.FTScoreStatus, p.FGLGScoreStatus, p.IncludeProcessed, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}
func updateScoringMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		MatchID       int    `json:"match_id"`
		HTHomeScore   int    `json:"ht_home"`
		HTAwayScore   int    `json:"ht_away"`
		FSHomeScore   int    `json:"fs_home"`
		FSAwayScore   int    `json:"fs_away"`
		FGLGFirstGoal int    `json:"fg_team"`
		FGLGLastGoal  int    `json:"lg_team"`
		ScoringType   string `json:"scoring_type"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, v := range p {
		totalPending, err := database.UpdateScoringMatch(v.MatchID, v.ScoringType, v.HTHomeScore, v.HTAwayScore, v.FSHomeScore, v.FSAwayScore, v.FGLGFirstGoal, v.FGLGLastGoal, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())
		}
		if totalPending > 0 {
			listErr = append(listErr, fmt.Sprint("You still have pending bets on : ", v.MatchID))
		}
	}

	if len(listErr) > 0 {
		ErrorMessage := fmt.Sprintf("Update Scoring Match Special for this match: %s is failed", strings.Join(listErr, "\n"))
		httpError(w, http.StatusBadRequest, ErrorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listScoringDetailMatch(w http.ResponseWriter, r *http.Request) {
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

	res, resLive, err := database.ListScoringDetailMatch(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	type ResultWithLive struct {
		Result     interface{} `json:"result"`
		ResultLive interface{} `json:"result_live"`
	}
	result := ResultWithLive{Result: res, ResultLive: resLive}

	writeJSON(w, statusSuccess, result)
}
func updateScoringDetailMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID    int    `json:"match_id"`
		CurrentSet int    `json:"current_set"`
		Home1      int    `json:"home_1"`
		Away1      int    `json:"away_1"`
		Home2      int    `json:"home_2"`
		Away2      int    `json:"away_2"`
		Home3      int    `json:"home_3"`
		Away3      int    `json:"away_3"`
		Home4      int    `json:"home_4"`
		Away4      int    `json:"away_4"`
		Home5      int    `json:"home_5"`
		Away5      int    `json:"away_5"`
		Home6      int    `json:"home_6"`
		Away6      int    `json:"away_6"`
		Home7      int    `json:"home_7"`
		Away7      int    `json:"away_7"`
		Home8      int    `json:"home_8"`
		Away8      int    `json:"away_8"`
		Home9      int    `json:"home_9"`
		Away9      int    `json:"away_9"`
		Home10     int    `json:"home_10"`
		Away10     int    `json:"away_10"`
		Home11     int    `json:"home_11"`
		Away11     int    `json:"away_11"`
		Home12     int    `json:"home_12"`
		Away12     int    `json:"away_12"`
		Home13     int    `json:"home_13"`
		Away13     int    `json:"away_13"`
		Home14     int    `json:"home_14"`
		Away14     int    `json:"away_14"`
		Home15     int    `json:"home_15"`
		Away15     int    `json:"away_15"`
		STGeneral  string `json:"st_general"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateScoringDetailMatch(p.MatchID, p.CurrentSet, p.Home1, p.Away1, p.Home2, p.Away2, p.Home3, p.Away3, p.Home4, p.Away4, p.Home5, p.Away5, p.Home6, p.Away6, p.Home7, p.Away7, p.Home8, p.Away8, p.Home9, p.Away9, p.Home10, p.Away10, p.Home11, p.Away11, p.Home12, p.Away12, p.Home13, p.Away13, p.Home14, p.Away14, p.Home15, p.Away15, p.STGeneral, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func deleteScoringDetailMatch(w http.ResponseWriter, r *http.Request) {
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
	err := database.DeleteScoringDetailMatch(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

func updateHomeAwayPosisi(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID    int `json:"match_id"`
		HomePosisi int `json:"home_posisi"`
		AwayPosisi int `json:"away_posisi"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	betIDs, err := database.UpdateHomeAwayPosisi(p.MatchID, p.HomePosisi, p.AwayPosisi, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, betIDs)
}
func updateScoringResetMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID     int    `json:"match_id"`
		ScoringType string `json:"scoring_type"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateScoringResetMatch(p.MatchID, p.ScoringType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listGridScoringMatchNCNG(w http.ResponseWriter, r *http.Request) {
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

	res, err := database.ListGridScoringMatchNCNG(p.MatchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func updateScoringMatchNextGoal(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID   int    `json:"match_id"`
		GameType  int    `json:"game_type"`
		Selection int    `json:"selection"`
		FSHome    int    `json:"fs_home"`
		FSAway    int    `json:"fs_away"`
		STFS      string `json:"st_fs"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateScoringMatchNextGoal(p.MatchID, p.GameType, p.Selection, p.FSHome, p.FSAway, p.STFS, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listScoringMatchSpecial(w http.ResponseWriter, r *http.Request) {
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

	res, err := database.ListGridScoringMatchSpecial(p.MatchID, 0, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func updateScoringMatchSpecial(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		MatchID  int    `json:"match_id"`
		GameType int    `json:"game_type"`
		HTHome   int    `json:"ht_home"`
		HTAway   int    `json:"ht_away"`
		FSHome   int    `json:"fs_home"`
		FSAway   int    `json:"fs_away"`
		STFS     string `json:"st_fs"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, v := range p {
		err := database.UpdateScoringMatchSpecial(v.MatchID, v.GameType, v.HTHome, v.HTAway, v.FSHome, v.FSAway, v.STFS, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())
		}
	}

	if len(listErr) > 0 {
		ErrorMessage := fmt.Sprintf("Update Scoring Match Special for this match: %s is failed", strings.Join(listErr, "\n"))
		httpError(w, http.StatusBadRequest, ErrorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listScoringMatchSpecialbasketScore(w http.ResponseWriter, r *http.Request) {
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

	score, livescore, err := database.ListGridScoringMatchSpecialBasketScore(p.MatchID, stampUser)
	type ResultMatchSpeciaBasket struct {
		Detail    interface{} `json:"detail"`
		Score     interface{} `json:"score"`
		LiveScore interface{} `json:"livescore"`
	}
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListGridScoringMatchSpecial(p.MatchID, 12, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	retVal := ResultMatchSpeciaBasket{
		Score: score, LiveScore: livescore,
		Detail: res,
	}
	writeJSON(w, statusSuccess, retVal)
}
func updateScoringMatchSpecialBasket(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		MatchID  int     `json:"match_id"`
		GameType int     `json:"game_type"`
		FSHome   *string `json:"fs_home"`
		FSAway   *string `json:"fs_away"`
		STFS     string  `json:"st_fs"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, v := range p {
		go func(MatchID, GameType int, FSHome, FSAway *string, STFS string) {
			err := database.UpdateScoringMatchSpecialBasket(MatchID, GameType, FSHome, FSAway, STFS, stampUser)
			if err != nil {
				listErr = append(listErr, err.Error())
			}
		}(v.MatchID, v.GameType, v.FSHome, v.FSAway, v.STFS)
	}

	if len(listErr) > 0 {
		ErrorMessage := fmt.Sprintf("Update Scoring Match Special for this match: %s is failed", strings.Join(listErr, "\n"))
		httpError(w, http.StatusBadRequest, ErrorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateScoringMatchSpecialBasketMainRound(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID int    `json:"match_id"`
		Q1Home  *int   `json:"q1_home"`
		Q1Away  *int   `json:"q1_away"`
		Q1Check string `json:"q1_check"`
		Q2Home  *int   `json:"q2_home"`
		Q2Away  *int   `json:"q2_away"`
		Q2Check string `json:"q2_check"`
		Q3Home  *int   `json:"q3_home"`
		Q3Away  *int   `json:"q3_away"`
		Q3Check string `json:"q3_check"`
		Q4Home  *int   `json:"q4_home"`
		Q4Away  *int   `json:"q4_away"`
		Q4Check string `json:"q4_check"`
		OTHome  *int   `json:"ot_home"`
		OTAway  *int   `json:"ot_away"`
		OTCheck string `json:"ot_check"`
		HTHome  *int   `json:"ht_home"`
		HTAway  *int   `json:"ht_away"`
		HTCheck string `json:"ht_check"`
		FTHome  *int   `json:"ft_home"`
		FTAway  *int   `json:"ft_away"`
		FTCheck string `json:"ft_check"`
		IsHalf  string `json:"is_half"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateScoringMatchSpecialBasketMainRound(p.MatchID,
		p.Q1Home, p.Q1Away, p.Q1Check,
		p.Q2Home, p.Q2Away, p.Q2Check,
		p.Q3Home, p.Q3Away, p.Q3Check,
		p.Q4Home, p.Q4Away, p.Q4Check,
		p.OTHome, p.OTAway, p.OTCheck,
		p.HTHome, p.HTAway, p.HTCheck,
		p.FTHome, p.FTAway, p.FTCheck,
		p.IsHalf, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
