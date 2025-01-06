package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListPayoutInfo(TicketID, ProcessID, stampUser string) ([]model.GridPayoutInfo, error) {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_LIST_GRID_PAYOUT_INFO"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Payout Info", "Payout Info", stampUser)
	logManager.WriteParameters(
		sql.Named("TicketID", TicketID),
		sql.Named("ProcessID", ProcessID),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.GridPayoutInfo{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func UpdatePayoutInfo(logId string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_PROC_UPD_PAYOUT_INFO"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Payout Info", "PAYOUT INFO", stampUser)
	logManager.WriteParameters(
		sql.Named("LogID", logId),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
