package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPITradingDeadballSpecial() {
	Base.HandleFunc("/trading-deadball-special", getListTradingDeadballSpecial).Methods(http.MethodGet)
}

func getListTradingDeadballSpecial(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchTimeSlot  string `schema:"match_time_slot"`
		FromEarlyDate  string `schema:"from_early_date"`
		ToEarlyDate    string `schema:"to_early_date"`
		IsShowInActive string `schema:"is_show_in_active"`
		PopupID        string `schema:"popup_id"`
		InGameType     string `schema:"in_game_type"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.GetListTradingDeadballSpecial(p.MatchTimeSlot, p.FromEarlyDate, p.ToEarlyDate, p.IsShowInActive, p.PopupID, p.InGameType, userSession.SessionID, userInfo.TraderGroupORI, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
