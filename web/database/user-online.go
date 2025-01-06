package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListUserOnline(stampUser string) ([]model.UserOnline, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_USER_ONLINE"
	var err error
	var totalUserOnline mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Get User Online", "USER ONLINE", stampUser)
	logManager.WriteParameters(
		sql.Named("StampUser", stampUser),
		&totalUserOnline,
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.UserOnline{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, int(totalUserOnline), nil
}
