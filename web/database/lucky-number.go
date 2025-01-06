package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListLuckyNumber(dateFrom, dateTo, betId string, stampUser string) ([]model.LuckyNumber, error) {
	dbName := Inetsoccer_Post
	spName := "MGMT_SBA_RPT_LUCKYDRAW"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Lucky Number", "Lucky Number", stampUser)
	logManager.WriteParameters(
		sql.Named("FromDateTime", dateFrom),
		sql.Named("ToDateTime", dateTo),
		sql.Named("BetID", betId),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LuckyNumber{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
