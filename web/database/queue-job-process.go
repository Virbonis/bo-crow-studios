package database

import (
	"database/sql"
	"errors"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	mssql "github.com/denisenkom/go-mssqldb"
	log "github.com/sirupsen/logrus"
)

func ValidateInsQueueJobProcess(matchID, processType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_PROC_VALIDATE_INS_QUEUE_JOB_PROCESS"
	var err error
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Validate Ins Queue Job Process", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("ProcessType", processType),
		sql.Named("StampUser", stampUser),
		&rs,
	)
	logManager.SetMatchIDorCustName(matchID)
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
	if rs != 0 {
		logManager.WriteStatusError("Failed to process match")
		return errors.New("Failed to process match")
	}
	return err
}
