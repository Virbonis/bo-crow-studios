package cache

import (
	log "github.com/sirupsen/logrus"
)

const operatorKey = "sb:operators"
const maintainanceKey = "sb:maintainance"

func DeleteOperator(operatorID string) (err error) {
	err = redisConnection.HDel(operatorKey, operatorID).Err()
	if err != nil {
		log.Errorf("[cache] Unable to remove %s data:%s error: %q", operatorKey, operatorID, err)
		return err
	}
	return nil
}

func GetOperator(operatorID string) (data string, err error) {
	data, err = redisConnection.HGet(operatorKey, operatorID).Result()
	if err != nil {
		log.Errorf("[cache] Unable to get %s data:%s error: %q", operatorKey, operatorID, err)
		return "", err
	}
	return data, nil
}

func DeleteOperatorMaintenance() (err error) {
	err = redisConnection.Del(maintainanceKey).Err()
	if err != nil {
		log.Errorf("[cache] Unable to remove %s data: error: %q", maintainanceKey, err)
		return err
	}
	return nil
}
