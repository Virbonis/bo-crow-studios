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

func ListOperator(currentPage, pageSize int, stampUser string) ([]model.OperatorList, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_OPERATOR_SBOP"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Operator", "Operator List", stampUser)
	logManager.WriteParameters(
		sql.Named("Page", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.OperatorList{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, totalRecords, nil
}

func CreateOperator(branchID, branchName, operatorID, secretKey, prefix, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_OPERATOR_SBOP"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Operator", "Operator List", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchID", branchID),
		sql.Named("BranchName", branchName),
		sql.Named("Prefix", prefix),
		sql.Named("OperatorID", operatorID),
		sql.Named("SecretKey", secretKey),
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	if rs == -2 {
		logManager.WriteStatusError("Operator already exist !")
		return errors.New("Operator already exist !")
	}

	return err
}

func UpdateOperator(operatorID, secretKey, validateURL, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_DOMAINID_KEY"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Operator", "Operator List", stampUser)
	logManager.WriteParameters(
		sql.Named("OperatorID", operatorID),
		sql.Named("SecretKey", secretKey),
		sql.Named("ValidateUrl", validateURL),
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

	return err
}
