package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	log "github.com/sirupsen/logrus"
)

func ListSelectCompetition(stampUser string) ([]string, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_COMPETITION"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Select Competition", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []string{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var res string
		err := rows.Scan(
			&res,
		)
		if err != nil {
			log.Warnf("[mssql] Failed scanning row: %v", err)
			return nil, err
		}
		list = append(list, res)
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
