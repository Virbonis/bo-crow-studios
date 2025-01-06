package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIAcceptRejectedTicket() {
	Base.HandleFunc("/accept-rejected-ticket", listAcceptRejectedTicket).Methods(http.MethodGet)
	Base.HandleFunc("/accept-rejected-ticket", updAcceptRejectedTicket).Methods(http.MethodPut)
}

func listAcceptRejectedTicket(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromBetDate string `schema:"from_bet_date"`
		ToBetDate   string `schema:"to_bet_date"`
		FromBetID   string `schema:"from_bet_id"`
		ToBetID     string `schema:"to_bet_id"`
		MatchID     string `schema:"match_id"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListAcceptRejectedTicket(p.FromBetDate, p.ToBetDate, p.FromBetID, p.ToBetID, p.MatchID, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, result)
}

func updAcceptRejectedTicket(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BetID    int    `json:"bet_id"`
		MatchID  int    `json:"match_id"`
		ReasonID int    `json:"reason_id"`
		Reason   string `json:"reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdAcceptRejectedTicket(p.BetID, p.MatchID, p.ReasonID, p.Reason, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
