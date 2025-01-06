package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPISport() {
	Base.HandleFunc("/sport/select", listSelectSport).Methods(http.MethodGet)
	Base.HandleFunc("/sport", listSport).Methods(http.MethodGet)
	Base.HandleFunc("/sport", updateSport).Methods(http.MethodPut)

	Base.HandleFunc("/sport/sorting", listSportSorting).Methods(http.MethodGet)
	Base.HandleFunc("/sport/sorting", updateSportSorting).Methods(http.MethodPut)
	Base.HandleFunc("/sport/sorting", sportSortingCopy).Methods(http.MethodPost)
	Base.HandleFunc("/sport/delay-bet", listSportDelayBet).Methods(http.MethodGet)
}

func listSelectSport(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListSelectSport(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listSport(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListSport(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateSport(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		SportID     int    `json:"sport_id"`
		SportNameEn string `json:"sport_name_en"`
		SportNameZh string `json:"sport_name_cn"`
		SportNameTh string `json:"sport_name_th"`
		SportNameJa string `json:"sport_name_jp"`
		SportNameKo string `json:"sport_name_kr"`
		SportNameVi string `json:"sport_name_vn"`
		SportNameId string `json:"sport_name_id"`
		NoDisplay   int    `json:"no_display"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateSport(p.SportID, p.SportNameEn, p.SportNameZh, p.SportNameTh, p.SportNameJa, p.SportNameKo, p.SportNameVi, p.SportNameId, p.NoDisplay, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	cache.DeleteTopListSport()
	writeJSON(w, statusSuccess, "OK")
}

func listSportSorting(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Currency string `schema:"currency"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListSportSorting(stampUser, p.Currency)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func updateSportSorting(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Currency  string `json:"currency"`
		SportID   int    `json:"sport_id"`
		NoDisplay int    `json:"no_display"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateSportSorting(p.SportID, p.NoDisplay, p.Currency, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func sportSortingCopy(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		Currency string `json:"currency"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.SportSortingCopy(p.Currency, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}

func listSportDelayBet(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		NoSport int `schema:"sport_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	result, err := database.ListSportDelayBet(p.NoSport, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
