package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListCancelGame(reportType int, dateFrom, dateTo, branchID, requestIDs, stampUser string) ([]model.GridCancelGame, error) {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_LIST_GRID_FAILED_CANCELLIST"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Cancel Game", "CANCEL GAME", stampUser)
	logManager.WriteParameters(
		sql.Named("ReportType", reportType),
		sql.Named("FromDate", dateFrom),
		sql.Named("ToDate", dateTo),
		sql.Named("BranchID", branchID),
		sql.Named("RequestID", requestIDs),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.GridCancelGame{}

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

func UpdateCancelGame(RowID, updateType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_PROC_UPD_FAILED_CANCELLIST"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Cancel Game", "CANCEL GAME", stampUser)
	logManager.WriteParameters(
		sql.Named("RowID", RowID),
		sql.Named("UpdateType", updateType),
		sql.Named("StampUser", stampUser),
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
