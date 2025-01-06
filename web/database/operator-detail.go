package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func GetOperatorDetail(BranchID, BranchName, stampUser string) ([]model.OperatorConfig, []model.OperatorCurrency, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBOP_GET_OPERATOR_DETAIL"
	var err error
	listConfig := []model.OperatorConfig{}
	listCurrency := []model.OperatorCurrency{}

	logManager := logger.LogManager{}
	logManager.StartTask("Get Operator Detail", "Operator Detail", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchID", BranchID),
		sql.Named("BranchName", BranchName),
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
		return nil, nil, err
	}

	err = sqlx.StructScan(rows, &listConfig)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, err
	}

	rows.NextResultSet()

	err = sqlx.StructScan(rows, &listCurrency)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return listConfig, listCurrency, nil
}
func UpdateOperatorDetail(BranchID, BranchName, ConfigKeyAndValue, ListCurrency, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBOP_PROC_UPD_OPERATOR_DETAIL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Operator Detail", "Operator Detail", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchID", BranchID),
		sql.Named("BranchName", BranchName),
		sql.Named("ConfigKeyANDValue", ConfigKeyAndValue),
		sql.Named("ListCurrency", ListCurrency),
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
	return nil
}
