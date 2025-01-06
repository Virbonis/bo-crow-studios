package router

import (
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/service"
)

func RegisterAPIResetEngine() {
	Base.HandleFunc("/reset-engine", resetEngine).Methods(http.MethodPost)
}

func resetEngine(w http.ResponseWriter, r *http.Request) {
	res, err := service.CallResetEngine()
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	data := strings.Split(*res, "~")
	if data[0] != "0" {
		httpError(w, http.StatusBadRequest, data[1])
		return
	}
	writeJSON(w, statusSuccess, res)
}
