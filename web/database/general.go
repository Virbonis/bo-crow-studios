package database

import (
	"database/sql"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func InsertLogError(dbName, spName string, parameters []interface{}, errorMessage, stampUser string) {
	paramRF := helper.GenerateParamRF(dbName, spName, parameters)

	_, err := sqlConnections.conn["Inetsoccer"].Exec("MGMT_SBA_PROC_INS_LOG_ERROR",
		sql.Named("Database", ""),
		sql.Named("Name", spName),
		sql.Named("Param", paramRF),
		sql.Named("Error", errorMessage),
		sql.Named("StampUser", stampUser),
	)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC MGMT_SBA_PROC_INS_LOG_ERROR")
	}
}

func InsertLogOdds(logParam *string) {
	dbName := Inetsoccer_Log
	_, err := sqlConnections.conn[dbName].Exec("MGMT_SBA_PROC_INS_LOG_ODDS",
		sql.Named("LogParam", logParam))
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC MGMT_SBA_PROC_INS_LOG_ODDS")
	}
}

func GetDateTimeDBServer() time.Time {
	var result time.Time
	err := sqlConnections.conn["Inetsoccer"].QueryRow("MGMT_SBA_GET_DATETIME_DB_SERVER").Scan(&result)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return time.Now()
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC MGMT_SBA_GET_DATETIME_DB_SERVER")
	}
	return result
}
func GetDateTimeBusinessHour() time.Time {
	var result time.Time
	err := sqlConnections.conn["Inetsoccer"].QueryRow("MGMT_SBA_GET_DATETIME_BUSINESS_HOUR").Scan(&result)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return time.Now()
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC MGMT_SBA_GET_DATETIME_BUSINESS_HOUR")
	}
	return result
}
func GetLastGLDate() time.Time {
	var result time.Time
	err := sqlConnections.conn["Inetsoccer"].QueryRow("MGMT_SBA_GET_LAST_GLDATE").Scan(&result)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return time.Now()
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC MGMT_SBA_GET_LAST_GLDATE")
	}
	return result
}
func GetLastMemberTrackerDate() time.Time {
	var result time.Time
	err := sqlConnections.conn["Inetsoccer"].QueryRow("MGMT_SBA_GET_LAST_MEMBER_TRACKER_DATE").Scan(&result)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return time.Now()
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC MGMT_SBA_GET_LAST_MEMBER_TRACKER_DATE")
	}
	return result
}

func GetListBuyFrom(stampUser string) ([]model.CompanyBuyFrom, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_BUYFROM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Buy From", "Match List Grid Buy From", stampUser)
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

	list := []model.CompanyBuyFrom{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
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

func GetOddsSpread(stampUser string) ([]model.OddsSpread, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_ODDS_SPREAD"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Odds Spread", "Odds Spread", stampUser)
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

	list := []model.OddsSpread{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
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
