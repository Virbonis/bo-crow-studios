package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIExport() {
	Base.HandleFunc("/export/bet-enquiry", listExportBetEnquiry).Methods(http.MethodGet)
	Base.HandleFunc("/export/match-list", listExportMatchList).Methods(http.MethodGet)
}

func listExportBetEnquiry(w http.ResponseWriter, r *http.Request) {
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

		// JackpotID        int64  `schema:"jackpot_id"`
		// LotteryID        int64  `schema:"lottery_id"`
		// FromBetIDLottery string `schema:"from_bet_id_lottery"`
		// ToBetIDLottery   string `schema:"to_bet_id_lottery"`

		OrderBy string `schema:"order_by"`
		// CurrentPage int    `schema:"current_page"` // 0
		// PageSize    int    `schema:"page_size"` // 0
		// HistOrPost  string `schema:"hist_or_post"` // _Post
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListExportBetEnquiry(p.FromBetDate, p.ToBetDate, p.FromBetID, p.ToBetID, p.GameTypes, p.BetStatus, p.SportIDs, p.MatchID, p.BranchID, p.BetAmtFrom, p.BetAmtTo, p.Username, p.SwitchToMatchDate, p.VoidUser, p.OrderBy, 0, 0, "_Post", p.Buyback, p.TxnType, p.VIPFilter, p.Currency, p.Product, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}

func listExportMatchList(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		DateFrom   string `schema:"date_from"`
		DateTo     string `schema:"date_to"`
		MatchID    int    `schema:"match_id"`
		SportIDs   string `schema:"sport_ids"`
		LeagueID   int    `schema:"league_id"`
		Category   string `schema:"category"`
		AutoOdds   string `schema:"auto_odds"`
		Status     string `schema:"status"`
		OpenStatus string `schema:"match_open_status"`
		LiveStatus string `schema:"match_live_status"`
		HasLive    string `schema:"match_has_live_status"`
		HasParlay  string `schema:"match_has_parlay_status"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListExportMatchList(p.DateFrom, p.DateTo, p.SportIDs, p.MatchID, p.LeagueID, p.Category, p.AutoOdds, p.Status, p.OpenStatus, p.LiveStatus, p.HasLive, p.HasParlay, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
