package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	log "github.com/sirupsen/logrus"
)

func UpdateForceLogoutPlayerSession(branchCodes, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_FORCE_LOGOUT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Force Logout Player Session", "Force Logout Player Session", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchCode", branchCodes),
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
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
