package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListProcessOutright(fromDate, toDate string, sportID int, outrightStatus string, currentPage, pageSize int, stampUser string) ([]model.ProcessOutright, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_PROCESS_OUTRIGHT"
	var err error
	var totalResult int

	list := []model.ProcessOutright{}
	logManager := logger.LogManager{}
	logManager.StartTask("List Process Outright", "Process Outright", stampUser)
	logManager.WriteParameters(
		sql.Named("FromDate", fromDate),
		sql.Named("ToDate", toDate),
		sql.Named("SportID", sportID),
		sql.Named("OutrightScoreStatus", outrightStatus),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("TotalRecords", sql.Out{Dest: &totalResult}),
		sql.Named("StampUser", stampUser),
	)
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
		return nil, 0, err
	}

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, totalResult, nil
}
func ListUnprocessOutright(fromDate, toDate string, sportID int, outrightStatus string, currentPage, pageSize int, stampUser string) ([]model.ProcessOutright, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_UNPROCESS_OUTRIGHT"
	var err error
	var totalResult int

	list := []model.ProcessOutright{}
	logManager := logger.LogManager{}
	logManager.StartTask("List Unprocess Outright", "Unprocess Outright", stampUser)
	logManager.WriteParameters(
		sql.Named("FromDate", fromDate),
		sql.Named("ToDate", toDate),
		sql.Named("SportID", sportID),
		sql.Named("OutrightScoreStatus", outrightStatus),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("TotalRecords", sql.Out{Dest: &totalResult}),
		sql.Named("StampUser", stampUser),
	)
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
		return nil, 0, err
	}

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, totalResult, nil
}

func InsertQueueJobProcessOutright(outrightID, processType int, processReason, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_QUEUE_JOB_PROCESS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Queue Process Outright", "Process Outright", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", outrightID),
		sql.Named("ProcessType", processType),
		sql.Named("ProcessReason", processReason),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightID)
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
	return nil
}
func DeleteQueueJobProcessOutright(outrightID, processType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_QUEUE_JOB_PROCESS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Queue Process Outright", "Process Outright", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", outrightID),
		sql.Named("ProcessType", processType),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightID)
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
	return nil
}
