package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListOperatorSetting(stampUser string) ([]model.OperatorSetting, error) {

	dbName := Inetsoccer
	spName := "MGMTS_SBA_LIST_GRID_OPERATOR_SETTING"
	var err error
	list := []model.OperatorSetting{}
	logManager := logger.LogManager{}
	logManager.StartTask("List Operator Setting", "Operator Setting", stampUser)

	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	rows, err := sqlConnections.conn[dbName].Queryx(spName)

	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}

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

func UpdateOperatorSetting(OperatorID string, OddsType int, DefaultLanguage, SupportedLanguage, PortalURL string, IsSubDomain bool, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_PROC_UPD_OPERATOR_SETTING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Operator Setting", "Operator Setting", stampUser)
	logManager.WriteParameters(
		sql.Named("OperatorID", OperatorID),
		sql.Named("OddsType", OddsType),
		sql.Named("DefaultLanguage", DefaultLanguage),
		sql.Named("SupportedLanguage", SupportedLanguage),
		sql.Named("PortalURL", PortalURL),
		sql.Named("IsSubDomain", IsSubDomain),
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
