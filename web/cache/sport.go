package cache

import (
	log "github.com/sirupsen/logrus"
)

const topListSportKey = "sb:toplistsportnew"

func DeleteTopListSport() (err error) {
	err = redisConnection.Del(topListSportKey).Err()
	if err != nil {
		log.Errorf("[cache] Unable to remove sb:toplistsportnew data: error: %q", err)
		return err
	}
	return nil
}
