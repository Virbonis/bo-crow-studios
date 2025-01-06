package database

import (
	"database/sql"
	"errors"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	mssql "github.com/denisenkom/go-mssqldb"
	log "github.com/sirupsen/logrus"
)

func CreateShareholderBuyback(username string, companyId int, currency, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_SHAREHOLDER_BUYBACK"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Create Shareholder Buyback", "SHAREHOLDER BUYBACK", stampUser)
	logManager.WriteParameters(
		sql.Named("Username", username),
		sql.Named("CompanyID", companyId),
		sql.Named("Currency", currency),
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

	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}
	if rs == -1 {
		logManager.WriteStatusError("Unable Insert Shareholder Buyback - Username already exist")
		return errors.New("unable Insert Shareholder Buyback - Username already exist")
	}

	return nil
}
