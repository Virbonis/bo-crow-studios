package cache

import (
	log "github.com/sirupsen/logrus"
)

const popularPickKey = "sb:popular"

func DeletePopularPick() (err error) {
	err = redisConnection.Del(popularPickKey).Err()
	if err != nil {
		log.Errorf("[cache] Unable to remove %s data: error: %q", popularPickKey, err)
		return err
	}
	return nil
}
