package cache

import (
	"github.com/go-redis/redis/v7"
	log "github.com/sirupsen/logrus"
)

// RedisConfiguration - Redis server configuration
type RedisConfiguration struct {
	Enabled     bool   `yaml:"enabled"`
	RedisServer string `yaml:"redis_server"`
	Password    string `yaml:"password"`
	DB          int    `yaml:"db"`
}

var redisConnection *redis.Client

// InitCacheEngine -- init redis cache engine
func InitCacheEngine(config RedisConfiguration) {
	log.Infof("Initialize cache module. Redis server: %s db: %d", config.RedisServer, config.DB)

	client := redis.NewClient(&redis.Options{
		Addr:     config.RedisServer,
		Password: config.Password,
		DB:       config.DB,
	})

	if config.Enabled {
		pong, err := client.Ping().Result()
		log.Infof("[redis] ping: %q err: %v", pong, err)

		if err != nil {
			log.Fatalf("[redis] %q", err)
		}
	}

	redisConnection = client
}

// Close closes redis connection
func Close() {
	log.Info("Closing redis connection...")
	err := redisConnection.Close()
	if err != nil {
		if redisConnection != nil {
			redisConnection = nil
		}
	}
}

func set(key string, value string) error {
	log.Debugf("[redis] SET: [%s] value: [%s]", key, value)
	err := redisConnection.Set(key, value, 0).Err()
	if err != nil {
		log.Errorf("[redis] %q", err)
		return err
	}
	return nil
}

func get(key string) (string, error) {
	log.Debugf("[redis] GET: [%s]", key)
	val, err := redisConnection.Get(key).Result()
	if err == redis.Nil {
		log.Debugf("[redis] key: %s does not exist", key)
		return "", err
	} else if err != nil {
		log.Errorf("[redis] %q", err)
		return "", err
	}
	return val, nil
}

func Del(key string) (int64, error) {
	log.Debugf("[redis] DEL: [%s]", key)
	val, err := redisConnection.Del(key).Result()
	if err != nil {
		return -1, err
	}
	return val, nil
}
