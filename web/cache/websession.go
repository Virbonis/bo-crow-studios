package cache

import (
	log "github.com/sirupsen/logrus"
)

const adminSessionKey = "admin:sessions"

func GetWebUserSession(userID string) (string, error) {
	val, err := redisConnection.HGet(adminSessionKey, userID).Result()
	if err != nil {
		log.Warnf("[cache] Unable to get %s data:%s error: %v", adminSessionKey, userID, err)
		return "", err
	}
	return val, nil
}
func CreateWebUserSession(userID string, jsonData string) (err error) {
	session := map[string]interface{}{
		userID: jsonData,
	}
	err = redisConnection.HSet(adminSessionKey, session).Err()
	if err != nil {
		log.Warnf("[cache] Unable to create %s data:%s error: %v", adminSessionKey, userID, err)
		return
	}
	return nil
}
func DeleteWebUserSession(userID string) (err error) {
	err = redisConnection.HDel(adminSessionKey, userID).Err()
	if err != nil {
		log.Warnf("[cache] Unable to remove %s data:%s error: %v", adminSessionKey, userID, err)
		return
	}
	return nil
}
