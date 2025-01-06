package cache

import (
	log "github.com/sirupsen/logrus"
)

const flagKey = "sb:flag"

// field can be flagID or Nama_RegionEN
func DeleteFlag(field string) (err error) {
	err = redisConnection.HDel(flagKey, field).Err()
	if err != nil {
		log.Warnf("[cache] Unable to remove %s data:%s error: %v", flagKey, field, err)
		return err
	}
	return nil
}
