package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIPopularPicks() {
	Base.HandleFunc("/popular-pick/category", listPopularPicksCategory).Methods(http.MethodGet)
	Base.HandleFunc("/popular-pick", listPopularPicks).Methods(http.MethodGet)
	Base.HandleFunc("/popular-pick", insertPopularPicks).Methods(http.MethodPost)
	Base.HandleFunc("/popular-pick", deletePopularPicks).Methods(http.MethodDelete)
	Base.HandleFunc("/popular-pick/finished", deleteFinishedPopularPicks).Methods(http.MethodDelete)
}

func listPopularPicksCategory(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	res, err := database.ListPopularPicksCategory(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func listPopularPicks(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		PickCategory string `schema:"pick_category"`
		OrderBy      string `schema:"order_by"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := database.ListPopularPicks(p.PickCategory, p.OrderBy, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func insertPopularPicks(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		PickCategory string `json:"category"`
		MatchIDs     string `json:"match_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.InsertPopularPicks(p.PickCategory, p.MatchIDs, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	cache.DeletePopularPick()
	writeJSON(w, statusSuccess, "OK")
}

func deletePopularPicks(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		PickCategory string `schema:"category"`
		MatchIDs     string `schema:"match_ids"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.DeletePopularPicks(p.PickCategory, p.MatchIDs, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	cache.DeletePopularPick()
	writeJSON(w, statusSuccess, "OK")
}
func deleteFinishedPopularPicks(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		PickCategory string `schema:"category"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.DeleteFinishedPopularPicks(p.PickCategory, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	cache.DeletePopularPick()

	writeJSON(w, statusSuccess, "OK")
}
