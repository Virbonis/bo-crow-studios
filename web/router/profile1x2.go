package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/gorilla/mux"
)

func RegisterAPIProfile1x2() {
	Base.HandleFunc("/profile1x2/select", listSelectProfile1x2).Methods(http.MethodGet)
	Base.HandleFunc("/profile1x2/hdp", listProfile1x2HDP).Methods(http.MethodGet)
	Base.HandleFunc("/profile1x2", listProfile1X2).Methods(http.MethodGet)
	Base.HandleFunc("/profile1x2", createProfile1x2).Methods(http.MethodPost)
	Base.HandleFunc("/profile1x2/{profile_id}", updateProfile1X2).Methods(http.MethodPut)

}

func listSelectProfile1x2(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListSelectProfile1X2(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listProfile1x2HDP(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.ListProfile1X2HDP(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listProfile1X2(w http.ResponseWriter, r *http.Request) {
	type Params struct {
		ProfileID string  `schema:"profile_id" json:"profile_id"`
		GameType  int     `schema:"game_type" json:"game_type,string"`
		HDP       float32 `schema:"hdp" json:"hdp,string"`
	}
	var p Params
	err := decoder.Decode(&p, r.URL.Query())
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, _, err := database.ListProfile1X2(p.ProfileID, p.GameType, p.HDP, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func createProfile1x2(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	var p struct {
		ProfileID string `json:"profile_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.CreateProfile1X2(p.ProfileID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func updateProfile1X2(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	vars := mux.Vars(r)
	profileID := vars["profile_id"]

	var p struct {
		RowID    int     `schema:"row_id" json:"row_id"`
		GameType int     `schema:"game_type" json:"game_type"`
		HDP      float32 `schema:"hdp" json:"hdp"`
		OddsHDP  float32 `schema:"odds_hdp" json:"odds_hdp"`
		OddsFav  float32 `schema:"odds_fav" json:"odds_fav"`
		OddsDraw float32 `schema:"odds_draw" json:"odds_draw"`
		Odds5    float32 `schema:"odds_5" json:"odds_5"`
		Odds6    float32 `schema:"odds_6" json:"odds_6"`
		Odds7    float32 `schema:"odds_7" json:"odds_7"`
		Odds8    float32 `schema:"odds_8" json:"odds_8"`
		Odds9    float32 `schema:"odds_9" json:"odds_9"`
		Odds10   float32 `schema:"odds_10" json:"odds_10"`
		Odds12   float32 `schema:"odds_12" json:"odds_12"`
		Odds15   float32 `schema:"odds_15" json:"odds_15"`
		Odds18   float32 `schema:"odds_18" json:"odds_18"`
		Odds20   float32 `schema:"odds_20" json:"odds_20"`
		Odds24   float32 `schema:"odds_24" json:"odds_24"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateProfile1X2(p.RowID, p.GameType, profileID, stampUser, p.HDP, p.OddsHDP, p.OddsFav, p.OddsDraw, p.Odds5, p.Odds6, p.Odds7, p.Odds8, p.Odds9, p.Odds10, p.Odds12, p.Odds15, p.Odds18, p.Odds20, p.Odds24)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
