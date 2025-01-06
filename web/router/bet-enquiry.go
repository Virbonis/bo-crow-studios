package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIBetEnquiry() {
	Base.HandleFunc("/bet-enquiry", listBetEnquiry).Methods(http.MethodGet)
	Base.HandleFunc("/bet-enquiry", updateBetEnquiry).Methods(http.MethodPut)
	Base.HandleFunc("/bet-enquiry/parlay", listBetEnquiryParlay).Methods(http.MethodGet)
	Base.HandleFunc("/bet-enquiry/lottery", listBetEnquiryLottery).Methods(http.MethodGet)
	Base.HandleFunc("/bet-enquiry/result", listBetEnquiryResult).Methods(http.MethodGet)
	Base.HandleFunc("/bet-enquiry/result-bet-builder", getBetEnquiryResultBetBuilder).Methods(http.MethodGet)
}

func listBetEnquiry(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromBetDate       string `schema:"from_bet_date"`
		ToBetDate         string `schema:"to_bet_date"`
		SwitchToMatchDate string `schema:"switch_to_match_date"`
		FromBetID         string `schema:"from_bet_id"`
		ToBetID           string `schema:"to_bet_id"`
		MatchID           int    `schema:"match_id"`
		Username          string `schema:"username"`
		VoidUser          string `schema:"void_user"`
		GameTypes         string `schema:"game_types"`
		BetStatus         string `schema:"bet_status"`
		BranchID          string `schema:"branch_id"`
		BetAmtFrom        int    `schema:"bet_amt_from"`
		BetAmtTo          int    `schema:"bet_amt_to"`
		SportIDs          string `schema:"sport_ids"`
		Product           string `schema:"product"`
		Buyback           string `schema:"buyback"`
		TxnType           string `schema:"txn_type"`
		VIPFilter         int    `schema:"vip_filter"`
		Currency          string `schema:"currency"`

		JackpotID        int64  `schema:"jackpot_id"`
		LotteryID        int64  `schema:"lottery_id"`
		FromBetIDLottery string `schema:"from_bet_id_lottery"`
		ToBetIDLottery   string `schema:"to_bet_id_lottery"`

		OrderBy     string `schema:"order_by"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
		HistOrPost  string `schema:"hist_or_post"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListBetEnquiry(p.FromBetDate, p.ToBetDate, p.FromBetID, p.ToBetID, p.GameTypes, p.BetStatus, p.SportIDs, p.MatchID, p.BranchID, p.BetAmtFrom, p.BetAmtTo, p.Username, p.SwitchToMatchDate, p.VoidUser, p.OrderBy, p.CurrentPage, p.PageSize, p.HistOrPost, p.Buyback, p.TxnType, p.VIPFilter, p.Currency, p.Product, p.JackpotID, p.LotteryID, p.FromBetIDLottery, p.ToBetIDLottery, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}

func listBetEnquiryParlay(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		NoTxn int `schema:"bet_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListBetEnquiryParlayCombo(p.NoTxn, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}
func listBetEnquiryLottery(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		NoTxn int `schema:"bet_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListBetEnquiryLottery(p.NoTxn, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func listBetEnquiryResult(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BetID    int `schema:"bet_id"`
		GameType int `schema:"game_type"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListBetEnquiryResult(p.BetID, p.GameType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func getBetEnquiryResultBetBuilder(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BetID int `schema:"bet_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.GetBetEnquiryResultBetBuilder(p.BetID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

func updateBetEnquiry(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		BetIDs     string `json:"bet_ids"`
		CancelType string `json:"cancel_type"`
		VoidID     int    `json:"void_id"`
		VoidDesc   string `json:"void_desc"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateBetEnquiry(p.BetIDs, p.CancelType, p.VoidID, p.VoidDesc, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
