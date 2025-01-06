package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListFailedPayout(stampUser string) ([]model.ListFailedPayout, error) {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_LIST_GRID_FAILED_PAYOUT"
	var err error
	list := []model.ListFailedPayout{}

	logManager := logger.LogManager{}
	logManager.StartTask("List Failed Payout", "Failed Payout", stampUser)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return list, err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func UpdateFailedPayout(processID, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_PROC_UPD_FAILED_PAYOUT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Failed Payout", "Failed Payout", stampUser)
	logManager.WriteParameters(
		sql.Named("ProcessID", processID),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return nil
}
