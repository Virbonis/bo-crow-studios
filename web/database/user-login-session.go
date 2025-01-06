package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListUserLoginSession(userteam, stampUser string) ([]model.ListUserLoginSession, error) {
	dbName := MgmtGames
	spName := "MGMT_SBA_LIST_GRID_USER_LOGINSESSION"
	var err error
	list := []model.ListUserLoginSession{}

	logManager := logger.LogManager{}
	logManager.StartTask("List User Login Session", "User Login Session", stampUser)
	logManager.WriteParameters(
		sql.Named("UserTeam", userteam),
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
		return list, err
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

func ListPopUpUserLoginSession(trader, stampUser string) ([]model.ListUserLoginSessionPopUp, error) {
	dbName := MgmtGames
	spName := "MGMT_SBA_LIST_GRID_USER_LOGIN_HISTORY"
	var err error
	list := []model.ListUserLoginSessionPopUp{}

	logManager := logger.LogManager{}
	logManager.StartTask("List User Login Session Pop Up", "User Login Session", stampUser)
	logManager.WriteParameters(
		sql.Named("Trader", trader),
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
		return list, err
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

func UpdateUserLoginSession(userLoginIDs, stampUser string) error {
	dbName := MgmtGames
	spName := "MGMT_SBA_PROC_UPD_USER_LOGINSESSION"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update User Login Session", "User Login Session", stampUser)
	logManager.WriteParameters(
		sql.Named("UserLoginIDs", userLoginIDs),
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
