package logger

import (
	"github.com/jmoiron/sqlx"
)

var sqlConnections *sqlx.DB

func InitLogConnection(s *sqlx.DB) {
	sqlConnections = s
}
