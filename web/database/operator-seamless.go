package database

import (
	"database/sql"
	"errors"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListOperatorSeamless(stampUser string) ([]model.OperatorSeamless, error) {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_LIST_GRID_DOMAINID_OPERATOR"
	var err error
	list := []model.OperatorSeamless{}

	logManager := logger.LogManager{}
	logManager.StartTask("List Operator Seamless", "Operator Seamless", stampUser)
	logManager.WriteParameters(
		sql.Named("Stampuser", stampUser),
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
func CreateOperatorSeamless(BranchID, BranchName, Prefix, OperatorID, OperatorName, SecretKey string, IsActive bool, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_PROC_INS_DOMAINID_OPERATOR"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Create Operator Seamless", "Operator Seamless", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchID", BranchID),
		sql.Named("BranchName", BranchName),
		sql.Named("Prefix", Prefix),
		sql.Named("OperatorID", OperatorID),
		sql.Named("OperatorName", OperatorName),
		sql.Named("SecretKey", SecretKey),
		sql.Named("IsActive", IsActive),
		sql.Named("StampUser", stampUser),
		&rs,
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

	if int(rs) == -2 {
		logManager.WriteStatusError("Operator already exist")
		return errors.New("Operator already exist")
	}
	return nil
}

func ListOperatorConfig(OperatorID, stampUser string) ([]model.OperatorConfig, error) {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_LIST_GRID_OPERATORCONFIG"
	var err error
	list := []model.OperatorConfig{}

	logManager := logger.LogManager{}
	logManager.StartTask("List Operator Config", "Operator Seamless", stampUser)
	logManager.WriteParameters(
		sql.Named("OperatorID", OperatorID),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}

	for rows.Next() {
		var temp model.OperatorConfig
		err = rows.Scan(
			&temp.OperatorID,
			&temp.ConfigKey,
			&temp.ConfigValue,
			&temp.HttpTimeout,
			&temp.RequestTimeout,
		)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, temp)
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func InsUpdConfigOperator(OperatorID, ConfigKey, ConfigValue string, HTTPTimeout, RequestTimeout int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_PROC_INS_UPD_OPERATORCONFIG"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert or Update Operator Config", "Operator Seamless", stampUser)
	logManager.WriteParameters(
		sql.Named("OperatorID", OperatorID),
		sql.Named("ConfigKey", ConfigKey),
		sql.Named("ConfigValue", ConfigValue),
		sql.Named("HttpTimeout", HTTPTimeout),
		sql.Named("RequestTimeout", RequestTimeout),
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
func DeleteConfigOperator(OperatorID, ConfigKey, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_PROC_DEL_OPERATORCONFIG"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Operator Config", "Operator Seamless", stampUser)
	logManager.WriteParameters(
		sql.Named("OperatorID", OperatorID),
		sql.Named("ConfigKey", ConfigKey),
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
