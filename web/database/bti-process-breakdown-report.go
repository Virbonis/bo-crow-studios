package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	log "github.com/sirupsen/logrus"
)

func ProcBTIProcessBreakdownReport(SportID int, GLDate, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_PROCESS_SUMMARYMATCH_TRADER_BTI"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("BTI Process Breakdown Report", "BTI Process Breakdown Report", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Sport", SportID),
		sql.Named("GL_Date", GLDate),
		sql.Named("StampUser", stampUser),
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return nil
}
