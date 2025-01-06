package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPINewsTicker() {
	Base.HandleFunc("/news-ticker/select", listSelectWebsite).Methods(http.MethodGet)
	Base.HandleFunc("/news-ticker", listNewsTicker).Methods(http.MethodGet)
	Base.HandleFunc("/news-ticker", createNewsTicker).Methods(http.MethodPost)
	Base.HandleFunc("/news-ticker", updateNewsTicker).Methods(http.MethodPut)
	Base.HandleFunc("/news-ticker", deleteNewsTicker).Methods(http.MethodDelete)
}

func listSelectWebsite(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListSelectWebsite(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func listNewsTicker(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		NewsID            int    `schema:"news_id"`
		WebsiteID         int    `schema:"website_id"`
		Lang              string `schema:"lang"`
		NewsSequence      int    `schema:"news_sequence"`
		NewsDisplayStatus string `schema:"news_display_status"`
		NewsType          string `schema:"news_type"`
		CurrentPage       int    `schema:"current_page"`
		PageSize          int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListNewsTicker(p.NewsID, p.WebsiteID, p.Lang, p.NewsSequence, p.NewsDisplayStatus, p.NewsType, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}
func createNewsTicker(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		NewsType          string   `json:"news_type"`
		NewsSequence      int      `json:"news_sequence"`
		NewsFromDateTime  string   `json:"news_from_date_time"`
		NewsToDateTime    string   `json:"news_to_date_time"`
		WebsiteIDs        int      `json:"website_id"`
		Lang              []string `json:"lang"`
		News              string   `json:"news"`
		Username          string   `json:"username"`
		NewsDisplayStatus string   `json:"news_display_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var errMessage []string
	for _, v := range p.Lang {
		err := database.CreateNewsTicker(p.NewsType, p.NewsSequence, p.NewsFromDateTime, p.NewsToDateTime, p.WebsiteIDs, v, p.News, p.Username, p.NewsDisplayStatus, stampUser)
		if err != nil {
			errMessage = append(errMessage, err.Error())
		}
	}

	if len(errMessage) > 0 {
		errorMessage := fmt.Sprintf("Delete News Ticker: %s is failed", strings.Join(errMessage, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func updateNewsTicker(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		NewsID            int    `json:"news_id"`
		NewsSequence      int    `json:"news_sequence"`
		NewsFromDateTime  string `json:"news_from_date_time"`
		NewsToDateTime    string `json:"news_to_date_time"`
		News              string `json:"news"`
		Username          string `json:"username"`
		NewsType          string `json:"news_type"`
		NewsDisplayStatus string `json:"news_display_status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.UpdateNewsTicker(p.NewsID, p.NewsSequence, p.NewsFromDateTime, p.NewsToDateTime, p.News, p.Username, p.NewsType, p.NewsDisplayStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
	}

	writeJSON(w, statusSuccess, "OK")
}
func deleteNewsTicker(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		NewsIDs []int `json:"news_ids"`
	}
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var errMessage []string
	for _, v := range p.NewsIDs {
		err := database.DeleteNewsTicker(v, stampUser)
		if err != nil {
			errMessage = append(errMessage, err.Error())
		}
	}

	if len(errMessage) > 0 {
		errorMessage := fmt.Sprintf("Delete News Ticker: %s is failed", strings.Join(errMessage, "\n"))
		httpError(w, http.StatusBadRequest, errorMessage)
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
