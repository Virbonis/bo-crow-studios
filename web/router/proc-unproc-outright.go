package router

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIProcUnprocOutright() {
	Base.HandleFunc("/process-outright", listProcessOutright).Methods(http.MethodGet)
	Base.HandleFunc("/process-outright", insertQueueJobProcessOutright).Methods(http.MethodPost)
	Base.HandleFunc("/process-outright", deleteQueueJobProcessOutright).Methods(http.MethodDelete)
	Base.HandleFunc("/unprocess-outright", listUnprocessOutright).Methods(http.MethodGet)
	Base.HandleFunc("/unprocess-outright", insertQueueJobUnprocessOutright).Methods(http.MethodPost)
	Base.HandleFunc("/unprocess-outright", deleteQueueJobUnprocessOutright).Methods(http.MethodDelete)
}

func listProcessOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate       string `schema:"from_date"`
		ToDate         string `schema:"to_date"`
		SportID        int    `schema:"sport_id"`
		OutrightStatus string `schema:"outright_status"`
		CurrentPage    int    `schema:"current_page"`
		PageSize       int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListProcessOutright(p.FromDate, p.ToDate, p.SportID, p.OutrightStatus, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, result)
}
func insertQueueJobProcessOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		OutrightID int `json:"outright_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, data := range p {
		err := database.ValidateInsQueueJobProcess(data.OutrightID, 1, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())
			continue
		}
		err = database.InsertQueueJobProcessOutright(data.OutrightID, 11, "", stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())
		}
	}

	if len(listErr) > 0 {
		httpError(w, http.StatusBadRequest, strings.Join(listErr, "\n"))
		return
	}
	writeJSON(w, statusSuccess, 0)
}
func deleteQueueJobProcessOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		OutrightID int `schema:"outright_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.DeleteQueueJobProcessOutright(p.OutrightID, 11, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, 0)
}

func listUnprocessOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		FromDate       string `schema:"from_date"`
		ToDate         string `schema:"to_date"`
		SportID        int    `schema:"sport_id"`
		OutrightStatus string `schema:"outright_status"`
		CurrentPage    int    `schema:"current_page"`
		PageSize       int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, total, err := database.ListUnprocessOutright(p.FromDate, p.ToDate, p.SportID, p.OutrightStatus, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	result := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, result)
}
func insertQueueJobUnprocessOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		OutrightID    int    `json:"outright_id"`
		ProcessReason string `json:"reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, data := range p {
		err := database.ValidateInsQueueJobProcess(data.OutrightID, -1, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())
			continue
		}
		err = database.InsertQueueJobProcessOutright(data.OutrightID, -11, data.ProcessReason, stampUser)
		if err != nil {
			listErr = append(listErr, err.Error())
		}
	}

	if len(listErr) > 0 {
		httpError(w, http.StatusBadRequest, strings.Join(listErr, "\n"))
		return
	}

	writeJSON(w, statusSuccess, 0)
}
func deleteQueueJobUnprocessOutright(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		OutrightID int `schema:"outright_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.DeleteQueueJobProcessOutright(p.OutrightID, -11, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, 0)
}
