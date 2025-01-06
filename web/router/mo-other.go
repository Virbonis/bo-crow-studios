package router

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/gorilla/mux"
)

func RegisterAPIMOMore() {
	Base.HandleFunc("/mo5/more/{match_id}/oe", listOtherOE).Methods(http.MethodGet)
	Base.HandleFunc("/mo5/more/{match_id}/wnw", listOtherWNW).Methods(http.MethodGet)
	Base.HandleFunc("/mo5/more/{match_id}/special", listOtherSpecial).Methods(http.MethodGet)
	Base.HandleFunc("/mo5/more/{match_id}/cs", listOtherCS).Methods(http.MethodGet)
	Base.HandleFunc("/mo5/more/{match_id}/basketball/{game_type}", listOtherBasket).Methods(http.MethodGet)

	Base.HandleFunc("/mo5/more/{match_id}", updateOtherGT).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/more/{match_id}/basketball", updateOtherGTBasketball).Methods(http.MethodPut)
	Base.HandleFunc("/mo5/more/{match_id}/bg/all", updateMoreStatusBGAll).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/more/{match_id}/open/all", updateMoreStatusOpenAll).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/more/{match_id}/pause/all", updateMoreStatusPauseAll).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/more/{match_id}/bg", updateMoreStatusBG).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/more/{match_id}/parlay", updateMoreStatusParlay).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/more/{match_id}/open", updateMoreStatusOpen).Methods(http.MethodPatch)
	Base.HandleFunc("/mo5/more/{match_id}/pause", updateMoreStatusPause).Methods(http.MethodPatch)
}

func listOtherOE(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	matchID, err := strconv.Atoi(vars["match_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListMoreOE(matchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func listOtherWNW(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	matchID, err := strconv.Atoi(vars["match_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListMoreWNW(matchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func listOtherSpecial(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	matchID, err := strconv.Atoi(vars["match_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListMoreSpecial(matchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func listOtherCS(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	matchID, err := strconv.Atoi(vars["match_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListMoreCS(matchID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listOtherBasket(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	matchID, err := strconv.Atoi(vars["match_id"])
	gameType := vars["game_type"]
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var res interface{}

	if gameType == "HT" || gameType == "FT" {
		type Result struct {
			Result1 interface{} `json:"result1"`
			Result2 interface{} `json:"result2"`
			Result3 interface{} `json:"result3"`
			Result4 interface{} `json:"result4"`
			Result5 interface{} `json:"result5"`
		}
		if gameType == "HT" {
			result1, result2, result3, result4, result5, err := database.ListMoreBasketHT(matchID, stampUser)
			if err != nil {
				httpError(w, http.StatusBadRequest, err.Error())
				return
			}
			res = Result{result1, result2, result3, result4, result5}
		} else {
			result1, result2, result3, result4, result5, err := database.ListMoreBasketFT(matchID, stampUser)
			if err != nil {
				httpError(w, http.StatusBadRequest, err.Error())
				return
			}
			res = Result{result1, result2, result3, result4, result5}
		}
	} else {
		var err error
		var result1 interface{}
		var result2 interface{}
		var result3 interface{}
		var result4 interface{}
		var result5 interface{}
		var result6 interface{}
		var result7 interface{}
		var result8 interface{}
		type Result struct {
			Result1 interface{} `json:"result1"`
			Result2 interface{} `json:"result2"`
			Result3 interface{} `json:"result3"`
			Result4 interface{} `json:"result4"`
			Result5 interface{} `json:"result5"`
			Result6 interface{} `json:"result6"`
			Result7 interface{} `json:"result7"`
			Result8 interface{} `json:"result8"`
		}
		if gameType == "QT" {
			result1, result2, result3, result4, result5, result6, result7, result8, err = database.ListMoreBasketMainQT(matchID, stampUser)
		} else if gameType == "QT1" {
			result1, result2, result3, result4, result5, result6, result7, result8, err = database.ListMoreBasketQT1(matchID, stampUser)
		} else if gameType == "QT2" {
			result1, result2, result3, result4, result5, result6, result7, result8, err = database.ListMoreBasketQT2(matchID, stampUser)
		} else if gameType == "QT3" {
			result1, result2, result3, result4, result5, result6, result7, result8, err = database.ListMoreBasketQT3(matchID, stampUser)
		} else if gameType == "QT4" {
			result1, result2, result3, result4, result5, result6, result7, result8, err = database.ListMoreBasketQT4(matchID, stampUser)
		}

		res = Result{result1, result2, result3, result4, result5, result6, result7, result8}
		if err != nil {
			httpError(w, http.StatusBadRequest, err.Error())
			return
		}
	}
	writeJSON(w, statusSuccess, res)
}
func updateOtherGT(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID       int     `json:"match_id"`
		GameType      int     `json:"game_type"`
		Odds1         float32 `json:"odds1"`
		Odds2         float32 `json:"odds2"`
		Odds3         float32 `json:"odds3"`
		Odds4         float32 `json:"odds4"`
		Odds5         float32 `json:"odds5"`
		Odds6         float32 `json:"odds6"`
		Odds7         float32 `json:"odds7"`
		Odds8         float32 `json:"odds8"`
		Odds9         float32 `json:"odds9"`
		Odds10        float32 `json:"odds10"`
		Odds11        float32 `json:"odds11"`
		Odds12        float32 `json:"odds12"`
		Odds13        float32 `json:"odds13"`
		Odds14        float32 `json:"odds14"`
		Odds15        float32 `json:"odds15"`
		Odds16        float32 `json:"odds16"`
		Odds17        float32 `json:"odds17"`
		Odds18        float32 `json:"odds18"`
		Odds19        float32 `json:"odds19"`
		Odds20        float32 `json:"odds20"`
		Odds21        float32 `json:"odds21"`
		Odds22        float32 `json:"odds22"`
		Odds23        float32 `json:"odds23"`
		Odds24        float32 `json:"odds24"`
		Odds25        float32 `json:"odds25"`
		Odds26        float32 `json:"odds26"`
		Odds27        float32 `json:"odds27"`
		STOddsMargin  string  `json:"st_odds_margin"`
		STOddsMargin2 string  `json:"st_odds_margin2"`
		OddsMargin    float32 `json:"odds_margin"`
		OddsMargin2   float32 `json:"odds_margin2"`
		Handicap      float32 `json:"handicap"` // for 3WH(39)
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var err error
	if p.GameType != 39 { // for 3WH(39)
		err = database.UpdateMoreGameType(p.MatchID, p.GameType, p.Odds1, p.Odds2, p.Odds3, p.Odds4, p.Odds5, p.Odds6, p.Odds7, p.Odds8, p.Odds9, p.Odds10, p.Odds11, p.Odds12, p.Odds13, p.Odds14, p.Odds15, p.Odds16, p.Odds17, p.Odds18, p.Odds19, p.Odds20, p.Odds21, p.Odds22, p.Odds23, p.Odds24, p.Odds25, p.Odds26, p.Odds27,
			p.STOddsMargin, p.STOddsMargin2, p.OddsMargin, p.OddsMargin2, stampUser)
	} else {
		err = database.UpdateMoreGameType3WH(p.MatchID, p.GameType, p.Handicap, p.Odds1, p.Odds2, p.Odds3, p.OddsMargin, p.STOddsMargin, stampUser)
	}
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateOtherGTBasketball(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID      int     `json:"match_id"`
		GameType     int     `json:"game_type"`
		STFav        int     `json:"st_fav"`
		Handicap     float32 `json:"handicap"`
		Odds1        float32 `json:"odds1"`
		Odds2        float32 `json:"odds2"`
		Odds3        float32 `json:"odds3"`
		Odds4        float32 `json:"odds4"`
		Odds5        float32 `json:"odds5"`
		Odds6        float32 `json:"odds6"`
		Odds7        float32 `json:"odds7"`
		Odds8        float32 `json:"odds8"`
		Odds9        float32 `json:"odds9"`
		Odds10       float32 `json:"odds10"`
		Odds11       float32 `json:"odds11"`
		Odds12       float32 `json:"odds12"`
		Odds13       float32 `json:"odds13"`
		Odds14       float32 `json:"odds14"`
		Odds15       float32 `json:"odds15"`
		Odds16       float32 `json:"odds16"`
		Odds17       float32 `json:"odds17"`
		Odds18       float32 `json:"odds18"`
		STOddsMargin string  `json:"st_odds_margin"`
		OddsMargin   float32 `json:"odds_margin"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateMoreGameTypeBasketball(p.MatchID, p.GameType, p.STFav, p.Handicap, p.Odds1, p.Odds2, p.Odds3, p.Odds4, p.Odds5, p.Odds6, p.Odds7, p.Odds8, p.Odds9, p.Odds10, p.Odds11, p.Odds12, p.Odds13, p.Odds14, p.Odds15, p.Odds16, p.Odds17, p.Odds18, p.STOddsMargin, p.OddsMargin, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateMoreStatusBGAll(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int    `json:"match_id"`
		Status  string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateMoreStatusBGAll(p.MatchID, p.Status, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateMoreStatusOpenAll(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int    `json:"match_id"`
		Status  string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateMoreStatusCloseOpenAll(p.MatchID, p.Status, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateMoreStatusPauseAll(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int `json:"match_id"`
		Status  int `json:"status"` // 3=pause,0=resume
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateMoreStatusPauseResumeAll(p.MatchID, p.Status, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateMoreStatusBG(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int    `json:"match_id"`
		SubMatchID int    `json:"sub_match_id"`
		GameType   int    `json:"game_type"`
		Status     string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateMoreStatusBG(p.MatchID, p.SubMatchID, p.GameType, p.Status, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateMoreStatusParlay(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int    `json:"match_id"`
		SportID    int    `json:"sport_id"`
		SubMatchID int    `json:"sub_match_id"`
		GameType   int    `json:"game_type"`
		Status     string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateMoreStatusParlay(p.MatchID, p.SportID, p.SubMatchID, p.GameType, p.Status, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateMoreStatusOpen(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int    `json:"match_id"`
		SportID    int    `json:"sport_id"`
		SubMatchID int    `json:"sub_match_id"`
		GameType   int    `json:"game_type"`
		Status     string `json:"status"`
		ChoiceCode string `json:"choice_code"` // CSLive(1001,1002)
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var err error
	if p.GameType == 1001 || p.GameType == 1002 { // CSLive(1001,1002)
		if p.ChoiceCode == "" { // allchoice cslive
			err = database.UpdateStatusOpenCSAll(p.MatchID, p.GameType, p.Status, stampUser)
		} else {
			err = database.UpdateStatusOpenCS(p.MatchID, p.GameType, p.ChoiceCode, p.Status, stampUser)
		}
	} else {
		err = database.UpdateMoreStatusOpen(p.MatchID, p.SportID, p.SubMatchID, p.GameType, p.Status, stampUser)
	}

	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateMoreStatusPause(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID    int    `json:"match_id"`
		SportID    int    `json:"sport_id"`
		SubMatchID int    `json:"sub_match_id"`
		GameType   int    `json:"game_type"`
		Status     int    `json:"status"`
		ChoiceCode string `json:"choice_code"` // CSLive(1001,1002)
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var err error
	if p.GameType == 1001 || p.GameType == 1002 { // CSLive(1001,1002)
		if p.ChoiceCode == "" { // allchoice cslive
			err = database.UpdateStatusPauseCSAll(p.MatchID, p.GameType, p.Status, stampUser)
		} else {
			err = database.UpdateStatusPauseCS(p.MatchID, p.GameType, p.ChoiceCode, p.Status, stampUser)
		}
	} else {
		err = database.UpdateMoreStatusPause(p.MatchID, p.SportID, p.SubMatchID, p.GameType, p.Status, stampUser)
	}

	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
