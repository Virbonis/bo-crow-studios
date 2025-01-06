package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIVoidTicket() {
	Base.HandleFunc("/void-ticket", listVoidTicket).Methods(http.MethodGet)
	Base.HandleFunc("/void-ticket", updateVoidTicket).Methods(http.MethodPut)
}

func listVoidTicket(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromBetDate       string `schema:"from_bet_date"`
		ToBetDate         string `schema:"to_bet_date"`
		FromBetID         string `schema:"from_bet_id"`
		ToBetID           string `schema:"to_bet_id"`
		GameType          int    `schema:"game_type"`
		BetStatus         string `schema:"bet_status"`
		MatchID           int    `schema:"match_id"`
		BetAmt            int    `schema:"bet_amt"`
		Username          string `schema:"username"`
		SwitchToMatchDate string `schema:"switch_to_match_date"`
		OrderBy           string `schema:"order_by"`
		CurrentPage       int    `schema:"current_page"`
		PageSize          int    `schema:"page_size"`
		SportID           int    `schema:"sport_id"`
		BranchID          string `schema:"branch_id"`
		VoidUser          string `schema:"void_user"`
		VoidType          string `schema:"void_type"`
	}

	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, total, err := database.ListVoidTicket(p.FromBetDate, p.ToBetDate, p.FromBetID, p.ToBetID, p.GameType, p.BetStatus, p.MatchID, p.BetAmt, p.Username, p.SwitchToMatchDate, p.OrderBy, p.CurrentPage, p.PageSize, p.SportID, p.BranchID, p.VoidUser, p.VoidType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}

	writeJSON(w, statusSuccess, resultWithTotal)
}

func updateVoidTicket(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BetIDs     string `json:"bet_ids"`
		CancelType string `json:"cancel_type"`
		VoidID     int    `json:"void_id"`
		VoidDesc   string `json:"void_desc"`
		VoidType   string `json:"void_type"`
	}

	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateVoidTicket(p.BetIDs, p.CancelType, p.VoidID, p.VoidDesc, p.VoidType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
