package router

import (
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func RegisterAPIGeneral() {
	Base.HandleFunc("/general/datetime/server", getDateTimeDBServer).Methods(http.MethodGet)
	Base.HandleFunc("/general/datetime/businesshour", getDateTimeBusinessHour).Methods(http.MethodGet)
	Base.HandleFunc("/general/datetime/lastgldate", getLastGLDate).Methods(http.MethodGet)
	Base.HandleFunc("/general/datetime/lastmembertrackerdate", getLastMemberTrackerDate).Methods(http.MethodGet)
	Base.HandleFunc("/general/buy-from", getListBuyFrom).Methods(http.MethodGet)
	Base.HandleFunc("/general/odds-spread", getOddsSpread).Methods(http.MethodGet)
}

func getDateTimeDBServer(w http.ResponseWriter, r *http.Request) {
	result := database.GetDateTimeDBServer()
	writeJSON(w, statusSuccess, result)
}

func getDateTimeBusinessHour(w http.ResponseWriter, r *http.Request) {
	result := database.GetDateTimeBusinessHour()
	writeJSON(w, statusSuccess, result)
}

func getLastGLDate(w http.ResponseWriter, r *http.Request) {
	result := database.GetLastGLDate()
	writeJSON(w, statusSuccess, result)
}
func getLastMemberTrackerDate(w http.ResponseWriter, r *http.Request) {
	result := database.GetLastMemberTrackerDate()
	writeJSON(w, statusSuccess, result)
}

func getListBuyFrom(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.GetListBuyFrom(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func getOddsSpread(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username

	result, err := database.GetOddsSpread(stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}
