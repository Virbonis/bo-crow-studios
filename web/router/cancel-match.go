package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPICancelMatch() {
	Base.HandleFunc("/cancel-match", listCancelMatch).Methods(http.MethodGet)
	Base.HandleFunc("/cancel-match", updateCancelMatch).Methods(http.MethodPut)
	Base.HandleFunc("/cancel-match/special", listCancelMatchSpecial).Methods(http.MethodGet)
	Base.HandleFunc("/cancel-match/special", updateCancelMatchSpecial).Methods(http.MethodPut)
	Base.HandleFunc("/cancel-match/special-basket", updateCancelMatchSpecialBasket).Methods(http.MethodPut)
	Base.HandleFunc("/cancel-match/next-goal", listCancelMatchNextGoal).Methods(http.MethodGet)
	Base.HandleFunc("/cancel-match/next-goal", updateCancelMatchNextGoal).Methods(http.MethodPut)
}

func listCancelMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchIds    string `schema:"match_ids"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListCancelMatch(p.CurrentPage, p.PageSize, p.MatchIds, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func updateCancelMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		MatchId    int    `json:"match_id"`
		VoidID     int    `json:"void_id"`
		VoidReason string `json:"void_reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, v := range p {
		err := database.UpdateCancelMatch(v.MatchId, v.VoidID, v.VoidReason, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())
		}
	}
	if len(listErr) > 0 {
		errorMessage := fmt.Sprintf("Cancel Match for this match ids:\n%s", strings.Join(listErr, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listCancelMatchSpecial(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchId int `schema:"match_id"`
		SportId int `schema:"sport_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListCancelMatchSpecial(p.MatchId, p.SportId, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func updateCancelMatchSpecial(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		MatchId    int    `json:"match_id"`
		GameType   int    `json:"game_type"`
		HTHome     int    `json:"ht_home"`
		HTAway     int    `json:"ht_away"`
		FSHome     int    `json:"fs_home"`
		FSAway     int    `json:"fs_away"`
		VoidId     int    `json:"void_id"`
		VoidDesc   string `json:"void_desc,omitempty"`
		VoidChoice string `json:"void_choice"`
		CancelType string `json:"cancel_type"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var errMessage []string

	for _, v := range p {
		err := database.UpdateCancelMatchSpecial(v.MatchId, v.GameType, v.VoidId, v.HTHome, v.HTAway, v.FSHome, v.FSAway, v.VoidDesc, v.VoidChoice, v.CancelType, stampUser)
		if err != nil {
			errMessage = append(errMessage, err.Error())
		}
	}

	if len(errMessage) > 0 {
		errorMessage := fmt.Sprintf("Update Cancel Match Special for this match: %s is failed", strings.Join(errMessage, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listCancelMatchNextGoal(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchId int `schema:"match_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListCancelMatchNextGoal(p.MatchId, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
func updateCancelMatchNextGoal(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchId    int    `json:"match_id"`
		GameType   int    `json:"game_type"`
		Selection  int    `son:"selection"`
		VoidID     int    `json:"void_id"`
		VoidDesc   string `json:"void_desc"`
		CancelType string `json:"cancel_type"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateCancelMatchNextGoal(p.MatchId, p.GameType, p.Selection, p.VoidID, p.VoidDesc, p.CancelType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateCancelMatchSpecialBasket(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		MatchId    int    `json:"match_id"`
		GameType   int    `json:"game_type"`
		VoidId     int    `json:"void_id"`
		VoidDesc   string `json:"void_desc,omitempty"`
		CancelType string `json:"cancel_type"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var errMessage []string

	for _, v := range p {

		go func(MatchId, GameType, VoidId int, VoidDesc, CancelType string) {

			err := database.UpdateCancelMatchSpecialBasket(MatchId, GameType, VoidId, VoidDesc, CancelType, stampUser)
			if err != nil {
				errMessage = append(errMessage, err.Error())
			}
		}(v.MatchId, v.GameType, v.VoidId, v.VoidDesc, v.CancelType)
	}

	if len(errMessage) > 0 {
		errorMessage := fmt.Sprintf("Update Cancel Match Special for this match: %s is failed", strings.Join(errMessage, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
