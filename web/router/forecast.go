package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIForecast() {
	Base.HandleFunc("/forecast", listForecast).Methods(http.MethodGet)
	Base.HandleFunc("/forecast-single", listForecastSingle).Methods(http.MethodGet)
	Base.HandleFunc("/forecast-post", listForecastPost).Methods(http.MethodGet)
}

func listForecast(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		PopupID        string `schema:"popup_id"`
		MatchTimeSlot  string `schema:"match_time_slot"`
		MatchType      string `schema:"match_type"`
		FTHT           string `schema:"ftht"`
		BranchID       string `schema:"branch_id"`
		Currency       string `schema:"currency"`
		IsUsingRoyalty string `schema:"is_using_royalty"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListForecast(p.PopupID, userSession.SessionID, p.MatchTimeSlot, p.MatchType, p.FTHT, p.BranchID, p.Currency, p.IsUsingRoyalty, userSession.User.TraderGroupORI, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func listForecastSingle(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID        int    `schema:"match_id"`
		MatchType      string `schema:"match_type"`
		FTHT           string `schema:"ftht"`
		BranchID       string `schema:"branch_id"`
		IsUsingRoyalty string `schema:"is_using_royalty"`
		Currency       string `schema:"currency"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListForecastSingle(p.MatchID, p.MatchType, p.FTHT, p.BranchID, p.IsUsingRoyalty, userSession.User.TraderGroupORI, p.Currency, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func listForecastPost(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		PopupID        string `schema:"popup_id"`
		MatchTimeSlot  string `schema:"match_time_slot"`
		MatchType      string `schema:"match_type"`
		FTHT           string `schema:"ftht"`
		BranchID       string `schema:"branch_id"`
		Currency       string `schema:"currency"`
		FromEarlyDate  string `schema:"from_early_date"`
		ToEarlyDate    string `schema:"to_early_date"`
		IsUsingRoyalty string `schema:"is_using_royalty"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListForecastPost(p.PopupID, userSession.SessionID, p.MatchTimeSlot, p.MatchType, p.FTHT, p.BranchID, p.Currency, p.FromEarlyDate, p.ToEarlyDate, p.IsUsingRoyalty, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
