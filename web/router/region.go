package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIRegion() {
	Base.HandleFunc("/region/select", listSelectRegion).Methods(http.MethodGet)
	Base.HandleFunc("/region", listMasterRegion).Methods(http.MethodGet)
	Base.HandleFunc("/region", createMasterRegion).Methods(http.MethodPost)
	Base.HandleFunc("/region", updateMasterRegion).Methods(http.MethodPut)
}

func listSelectRegion(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	res, err := database.ListSelectRegion(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func listMasterRegion(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	res, err := database.ListMasterRegion(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}

func createMasterRegion(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		English    string `json:"english"`
		Mandarin   string `json:"mandarin"`
		Taiwan     string `json:"taiwan"`
		Thailand   string `json:"thailand"`
		Japanese   string `json:"japanese"`
		Korean     string `json:"korean"`
		Vietnamese string `json:"vietnamese"`
		Indonesia  string `json:"indonesia"`
		SortNumber int    `json:"sort_number"`
		FlagID     int    `json:"flag_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.CreateMasterRegion(p.English, p.Mandarin, p.Taiwan, p.Thailand, p.Japanese, p.Korean, p.Vietnamese, p.Indonesia, p.SortNumber, p.FlagID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	cache.DeleteFlag(p.English) // for delete redis Flag using region EN
	writeJSON(w, statusSuccess, "OK")
}

func updateMasterRegion(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		RegionId   int    `json:"region_id"`
		English    string `json:"english"`
		Mandarin   string `json:"mandarin"`
		Taiwan     string `json:"taiwan"`
		Thailand   string `json:"thailand"`
		Japanese   string `json:"japanese"`
		Korean     string `json:"korean"`
		Vietnamese string `json:"vietnamese"`
		Indonesia  string `json:"indonesia"`
		SortNumber int    `json:"sort_number"`
		FlagID     int    `json:"flag_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	err := database.UpdateMasterRegion(p.RegionId, p.English, p.Mandarin, p.Taiwan, p.Thailand, p.Japanese, p.Korean, p.Vietnamese, p.Indonesia, p.SortNumber, p.FlagID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	cache.DeleteFlag(p.English) // for delete redis Flag using region EN

	writeJSON(w, statusSuccess, "OK")
}
