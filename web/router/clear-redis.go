package router

import (
	"encoding/json"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/config"
)

func RegisterAPIClearRedis() {
	Base.HandleFunc("/clear-redis", listClearRedisKey).Methods(http.MethodGet)
	Base.HandleFunc("/clear-redis", clearRedisKey).Methods(http.MethodPost)
}

func listClearRedisKey(w http.ResponseWriter, r *http.Request) {
	result := config.AppConfig.ListClearRedisKey
	if result == nil {
		result = []string{}
	}

	writeJSON(w, statusSuccess, result)
}
func clearRedisKey(w http.ResponseWriter, r *http.Request) {
	var p struct {
		RedisKey string `json:"redis_key"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	res, err := cache.Del(p.RedisKey)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, res)
}
