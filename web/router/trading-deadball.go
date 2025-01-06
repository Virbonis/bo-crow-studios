package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPITradingDeadball() {
	Base.HandleFunc("/trading-deadball", listDeadball).Methods(http.MethodGet)
}

func listDeadball(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchTimeSlot    string `schema:"match_time_slot"`
		FromEarlyDate    string `schema:"from_early_date"`
		ToEarlyDate      string `schema:"to_early_date"`
		IsShowInActive   string `schema:"is_show_in_active"`
		IsMatchConfirmed string `schema:"is_match_confirmed"`
		PopupID          string `schema:"popup_id"`
		GameTypeDeadball string `schema:"game_type_deadball"`
		SportID          int    `schema:"sport_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var result interface{}
	var resultPausedMatches interface{}
	var resultPaused int
	var err error
	if p.GameTypeDeadball == "DBAHOU" {
		result, resultPausedMatches, resultPaused, err = database.ListDeadballAHOU(p.MatchTimeSlot, p.FromEarlyDate, p.ToEarlyDate, p.IsShowInActive, p.IsMatchConfirmed, p.PopupID, userSession.SessionID, userInfo.TraderGroupORI, stampUser)
	} else if p.GameTypeDeadball == "DBOE" {
		result, resultPausedMatches, resultPaused, err = database.ListDeadballOE(p.MatchTimeSlot, p.FromEarlyDate, p.ToEarlyDate, p.IsShowInActive, p.IsMatchConfirmed, p.PopupID, userSession.SessionID, userInfo.TraderGroupORI, stampUser)
	} else if p.GameTypeDeadball == "DBDCML" {
		result, resultPausedMatches, resultPaused, err = database.ListDeadBallDCML(p.MatchTimeSlot, p.FromEarlyDate, p.ToEarlyDate, p.IsShowInActive, p.IsMatchConfirmed, p.PopupID, userSession.SessionID, userInfo.TraderGroupORI, stampUser)
	} else if p.GameTypeDeadball == "DBTG" {
		result, resultPausedMatches, resultPaused, err = database.ListDeadBallTG(p.MatchTimeSlot, p.FromEarlyDate, p.ToEarlyDate, p.IsShowInActive, p.IsMatchConfirmed, p.PopupID, userSession.SessionID, userInfo.TraderGroupORI, stampUser)
	} else if p.GameTypeDeadball == "DBCS" {
		result, resultPausedMatches, resultPaused, err = database.ListDeadBallCS(p.MatchTimeSlot, p.FromEarlyDate, p.ToEarlyDate, p.IsShowInActive, p.IsMatchConfirmed, 10, userSession.SessionID, p.PopupID, stampUser, userInfo.TraderGroupORI)
	} else if p.GameTypeDeadball == "DBFHCS" {
		result, resultPausedMatches, resultPaused, err = database.ListDeadBallCS(p.MatchTimeSlot, p.FromEarlyDate, p.ToEarlyDate, p.IsShowInActive, p.IsMatchConfirmed, 13, userSession.SessionID, p.PopupID, stampUser, userInfo.TraderGroupORI)
	} else if p.GameTypeDeadball == "DBFGLG" {
		result, resultPausedMatches, resultPaused, err = database.ListDeadBallFGLG(p.MatchTimeSlot, p.FromEarlyDate, p.ToEarlyDate, p.IsShowInActive, p.IsMatchConfirmed, userSession.SessionID, p.PopupID, stampUser, userInfo.TraderGroupORI)
	} else if p.GameTypeDeadball == "DBHTFT" {
		result, resultPausedMatches, resultPaused, err = database.ListDeadBallHTFT(p.MatchTimeSlot, p.FromEarlyDate, p.ToEarlyDate, p.IsShowInActive, p.IsMatchConfirmed, userSession.SessionID, p.PopupID, stampUser, userInfo.TraderGroupORI)
	} else if p.GameTypeDeadball == "DBOUT" {
		result, resultPaused, err = database.ListDeadBallOutright(p.SportID, p.FromEarlyDate, p.ToEarlyDate, p.IsShowInActive, userSession.SessionID, stampUser, userInfo.TraderGroupORI)
	}
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	type ResultWithMember struct {
		Result              interface{} `json:"result"`
		ResultPausedMatches interface{} `json:"result_paused_matches"`
		TotalPausedMatches  interface{} `json:"total_paused_matches"`
	}
	var res = ResultWithMember{Result: result, ResultPausedMatches: resultPausedMatches, TotalPausedMatches: resultPaused}
	writeJSON(w, statusSuccess, res)
}
