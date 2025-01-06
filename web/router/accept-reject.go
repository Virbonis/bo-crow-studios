package router

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/gorilla/mux"
)

func RegisterAPIAcceptReject() {
	Base.HandleFunc("/acceptreject", listAcceptReject).Methods(http.MethodGet)
	Base.HandleFunc("/acceptreject/mo/{match_id}", updateAcceptRejectByMatch).Methods(http.MethodPut)
	Base.HandleFunc("/acceptreject/mo", updateAcceptRejectMO).Methods(http.MethodPut)
	Base.HandleFunc("/acceptreject/instantbet", updateAcceptRejectInstantBet).Methods(http.MethodPut)
	Base.HandleFunc("/acceptrejectview", listAcceptRejectView).Methods(http.MethodGet)
}

func listAcceptReject(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID  int    `schema:"match_id"`
		FTHT     string `schema:"ftht"`
		GameType string `schema:"game_type"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListAcceptReject(p.MatchID, p.FTHT, p.GameType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}

func updateAcceptRejectByMatch(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	matchID, err := strconv.Atoi(vars["match_id"])
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var p struct {
		VoidID          int    `json:"void_id"`
		VoidDescription string `json:"void_description"`
		Action          string `json:"action"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err = database.UpdateTicketMOByMatch(matchID, p.VoidID, p.VoidDescription, p.Action, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateAcceptRejectMO(w http.ResponseWriter, r *http.Request) {
	var p struct {
		BetIDs          string `json:"bet_ids"`
		VoidID          int    `json:"void_id"`
		VoidDescription string `json:"void_description"`
		Action          string `json:"action"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	err := database.UpdateTicketMO(p.BetIDs, p.VoidID, p.VoidDescription, p.Action, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateAcceptRejectInstantBet(w http.ResponseWriter, r *http.Request) {
	var p struct {
		BetIDs          string `json:"bet_ids"`
		VoidID          int    `json:"void_id"`
		VoidDescription string `json:"void_description"`
		Action          string `json:"action"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.UpdateTicketInstantBet(p.BetIDs, p.VoidID, p.VoidDescription, p.Action, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	if result != nil {
		errMessage := []string{}
		if strings.Contains(*result, "^") {
			arr := strings.Split(*result, ";")
			cols := []string{}

			for i := 0; i < len(arr); i++ {
				cols = strings.Split(arr[i], "^")
				errMessage = append(errMessage, "Bet ID ["+cols[0]+"] already "+cols[1])
				// message += "Bet ID [" + cols[0] + "] already " + cols[1] + "\n"
			}
		}
		if len(errMessage) > 0 {
			httpError(w, http.StatusBadRequest, strings.Join(errMessage, "\n"))
			return
		}
	}

	writeJSON(w, statusSuccess, "OK")
}
func listAcceptRejectView(w http.ResponseWriter, r *http.Request) {
	var p struct {
		MatchID int    `schema:"match_id"`
		FTHT    string `schema:"ftht"`
		Display int    `schema:"display"`
		Pending string `schema:"pending"`
	}
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListAcceptRejectView(p.MatchID, p.FTHT, p.Display, p.Pending, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, result)
}
