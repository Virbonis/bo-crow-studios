package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIMatchLiveStream() {
	Base.HandleFunc("/match-live-stream", listMatchLiveStream).Methods(http.MethodGet)
	Base.HandleFunc("/match-live-stream", updateMatchLiveStream).Methods(http.MethodPut)
}

func listMatchLiveStream(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID     int     `schema:"sport_id"`
		DateStart   *string `schema:"date_start"`
		DateEnd     *string `schema:"date_end"`
		CurrentPage int     `schema:"current_page"`
		PageSize    int     `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, total, err := database.ListMatchLiveStream(p.SportID, p.DateStart, p.DateEnd, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}

func updateMatchLiveStream(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID      int    `json:"match_id"`
		STLiveStream string `json:"st_live_stream"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateMatchLiveStream(p.MatchID, p.STLiveStream, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
