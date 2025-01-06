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

func RegisterAPIProcUnprocMatch() {
	Base.HandleFunc("/process-match", listProcessMatch).Methods(http.MethodGet)
	Base.HandleFunc("/process-match", createQueueJobProcessMatch).Methods(http.MethodPost)
	Base.HandleFunc("/process-match", deleteQueueJobProcessMatch).Methods(http.MethodDelete)
	Base.HandleFunc("/process-match/special", listProcessMatchSpecial).Methods(http.MethodGet)
	Base.HandleFunc("/process-match/special", createQueueJobProcessMatchSpecial).Methods(http.MethodPost)

	Base.HandleFunc("/unprocess-match", listUnprocessMatch).Methods(http.MethodGet)
	Base.HandleFunc("/unprocess-match", createQueueJobUnprocessMatch).Methods(http.MethodPost)
	Base.HandleFunc("/unprocess-match", deleteQueueJobProcessMatch).Methods(http.MethodDelete) // same handler with process
	Base.HandleFunc("/unprocess-match/special", listUnprocessMatchSpecial).Methods(http.MethodGet)
	Base.HandleFunc("/unprocess-match/special", createQueueJobProcessMatchSpecial).Methods(http.MethodPost)
}

// Process Match
func listProcessMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID     int    `schema:"match_id"`
		SportID     int    `schema:"sport_id"`
		LeagueID    int    `schema:"league_id"`
		MatchDate   string `schema:"match_date"`
		MatchStatus string `schema:"match_status"`
		HTStatus    string `schema:"ht_status"`
		FTStatus    string `schema:"ft_status"`
		FGLGStatus  string `schema:"fglg_status"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListProcessMatch(p.MatchID, p.SportID, p.LeagueID, p.CurrentPage, p.PageSize, p.MatchDate, p.MatchStatus, p.HTStatus, p.FTStatus, p.FGLGStatus, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}
func createQueueJobProcessMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		MatchID     int  `json:"match_id"`
		ProcessHT   bool `json:"process_ht"`
		ProcessFT   bool `json:"process_ft"`
		ProcessFGLG bool `json:"process_fglg"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, v := range p {
		err := database.ValidateInsQueueJobProcess(v.MatchID, 1, stampUser)
		if err != nil {
			listErr = append(listErr, fmt.Sprintf("Process Match ID %d is not validated", v.MatchID))
			continue
		}

		if v.ProcessHT {
			err := database.CreateQueueJobProcessMatch(v.MatchID, 1, "", stampUser)
			if err != nil {
				listErr = append(listErr, fmt.Sprintf("Failed process HT %d", v.MatchID))
			}
		}
		if v.ProcessFT {
			err := database.CreateQueueJobProcessMatch(v.MatchID, 2, "", stampUser)
			if err != nil {
				listErr = append(listErr, fmt.Sprintf("Failed process FT %d", v.MatchID))
			}
		}
		if v.ProcessFGLG {
			err := database.CreateQueueJobProcessMatch(v.MatchID, 14, "", stampUser)
			if err != nil {
				listErr = append(listErr, fmt.Sprintf("Failed process FGLG %d", v.MatchID))
			}
		}
	}
	if len(listErr) > 0 {
		httpError(w, http.StatusBadRequest, strings.Join(listErr, "\n"))
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func deleteQueueJobProcessMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID     int `schema:"match_id"`
		ProcessType int `schema:"process_type"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	err := database.DeleteQueueJobProcessMatch(p.MatchID, p.ProcessType, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, "OK")
}
func listProcessMatchSpecial(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID int `schema:"match_id"`
		SportID int `schema:"sport_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListProcessMatchSpecial(p.MatchID, p.SportID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
func createQueueJobProcessMatchSpecial(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID int `json:"match_id"`
		SportID int `json:"sport_id"`
		Items   []struct {
			ProcessType         int    `json:"process_type"`
			GameTypeDescription string `json:"game_type_description"`
		} `json:"items"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	if len(p.Items) > 0 {
		err := database.ValidateInsQueueJobProcess(p.MatchID, 1, stampUser)
		if err != nil {
			httpError(w, http.StatusBadRequest, fmt.Sprintf("Process Match ID %d is not validated", p.MatchID))
			return
		}
	}

	var listErr []string
	for _, v := range p.Items {
		go func(GameTypeDescription string, ProcessType int) {

			err := database.CreateQueueJobProcessSpecial(p.MatchID, ProcessType, p.SportID, "", 0, stampUser)
			if err != nil {
				listErr = append(listErr, fmt.Sprintf("Failed process %v ", GameTypeDescription))
			}
		}(v.GameTypeDescription, v.ProcessType)
	}

	if len(listErr) > 0 {
		httpError(w, http.StatusBadRequest, strings.Join(listErr, "\n"))
		return
	}
	writeJSON(w, statusSuccess, "OK")
}

// Unprocess Match
func listUnprocessMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID     int    `schema:"match_id"`
		SportID     int    `schema:"sport_id"`
		LeagueID    int    `schema:"league_id"`
		MatchDate   string `schema:"match_date"`
		MatchStatus string `schema:"match_status"`
		HTStatus    string `schema:"ht_status"`
		FTStatus    string `schema:"ft_status"`
		FGLGStatus  string `schema:"fglg_status"`
		CurrentPage int    `schema:"current_page"`
		PageSize    int    `schema:"page_size"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, total, err := database.ListUnprocessMatch(p.MatchID, p.SportID, p.LeagueID, p.MatchDate, p.MatchStatus, p.HTStatus, p.FTStatus, p.FGLGStatus, p.CurrentPage, p.PageSize, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	resultWithTotal := model.ResultWithTotal{Result: res, Total: total}
	writeJSON(w, statusSuccess, resultWithTotal)
}
func createQueueJobUnprocessMatch(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p []struct {
		MatchID     int    `json:"match_id"`
		ProcessHT   bool   `json:"process_ht"`
		ProcessFT   bool   `json:"process_ft"`
		ProcessFGLG bool   `json:"process_fglg"`
		ReasonHT    string `json:"reason_ht"`
		ReasonFT    string `json:"reason_ft"`
		ReasonFGLG  string `json:"reason_fglg"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	var listErr []string
	for _, v := range p {
		err := database.ValidateInsQueueJobProcess(v.MatchID, -1, stampUser)
		if err != nil {
			listErr = append(listErr, fmt.Sprintf("Unprocess Match ID %d is not validated", v.MatchID))
			continue
		}

		if v.ProcessHT {
			err := database.CreateQueueJobProcessMatch(v.MatchID, -1, v.ReasonHT, stampUser)
			if err != nil {
				listErr = append(listErr, fmt.Sprintf("Failed unprocess HT %d", v.MatchID))
			}
		}
		if v.ProcessFT {
			err := database.CreateQueueJobProcessMatch(v.MatchID, -2, v.ReasonFT, stampUser)
			if err != nil {
				listErr = append(listErr, fmt.Sprintf("Failed unprocess FT %d", v.MatchID))
			}
		}
		if v.ProcessFGLG {
			err := database.CreateQueueJobProcessMatch(v.MatchID, -14, v.ReasonFGLG, stampUser)
			if err != nil {
				listErr = append(listErr, fmt.Sprintf("Failed unprocess FGLG %d", v.MatchID))
			}
		}
	}
	if len(listErr) > 0 {
		httpError(w, http.StatusBadRequest, strings.Join(listErr, "\n"))
		return
	}
	writeJSON(w, statusSuccess, "OK")
}
func listUnprocessMatchSpecial(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	var p struct {
		MatchID int `schema:"match_id"`
		SportID int `schema:"sport_id"`
	}
	if err := decoder.Decode(&p, r.URL.Query()); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := database.ListUnprocessMatchSpecial(p.MatchID, p.SportID, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, statusSuccess, res)
}

// func createQueueJobUnprocessMatchSpecial(w http.ResponseWriter, r *http.Request) {
// 	userSession, _ := session.GetRouterUserSession(r)
// 	userInfo := userSession.User
// 	stampUser := userInfo.UserName

// 	var p struct {
// 		MatchID int `json:"match_id"`
// 		Items   []struct {
// 			ProcessType         int    `json:"process_type"`
// 			GameTypeDescription string `json:"game_type_description"`
// 		} `json:"items"`
// 		Reason string `json:"reason"`
// 	}
// 	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
// 		httpError(w, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	if len(p.Items) > 0 {
// 		err := database.ValidateInsQueueJobProcess(p.MatchID, -1, stampUser)
// 		if err != nil {
// 			httpError(w, http.StatusBadRequest, fmt.Sprintf("Unprocess Match ID %d is not validated", p.MatchID))
// 			return
// 		}
// 	}

// 	var listErr []string
// 	for _, v := range p.Items {
// 		err := database.CreateQueueJobProcessSpecial(p.MatchID, v.ProcessType, p.Reason, 0, stampUser)
// 		if err != nil {
// 			listErr = append(listErr, fmt.Sprintf("Failed unprocess %v ", v.GameTypeDescription))
// 		}
// 	}

// 	if len(listErr) > 0 {
// 		httpError(w, http.StatusBadRequest, strings.Join(listErr, "\n"))
// 		return
// 	}
// 	writeJSON(w, statusSuccess, "OK")
// }
