package database

import (
	"database/sql"
	"errors"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListUser(username, isActive, isSysAdmin, isLOB, prefix string, page, display int, traderGroup, stampUser string) ([]model.User, int, error) {
	dbName := MgmtGames
	spName := "AdminBO_GetUserList"
	var err error
	var totalRow int

	logManager := logger.LogManager{}
	logManager.StartTask("List User", "User", stampUser)
	logManager.WriteParameters(
		sql.Named("Username", username),
		sql.Named("IsActive", isActive),
		sql.Named("IsSysAdmin", isSysAdmin),
		sql.Named("IsLOB", isLOB),
		sql.Named("Prefix", prefix),
		sql.Named("CurrentPage", page),
		sql.Named("PageSize", display),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRow}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.User{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, totalRow, nil
}

func CreateUser(username, password, name, email string, isActive, isSysAdmin, isLOB bool, prefix, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_CreateUser"
	var err error
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Create User", "User", stampUser)
	logManager.WriteParameters(
		sql.Named("Username", username),
		sql.Named("Password", password),
		sql.Named("Name", name),
		sql.Named("Email", email),
		sql.Named("IsActive", isActive),
		sql.Named("IsSysAdmin", isSysAdmin),
		sql.Named("IsLOB", isLOB),
		sql.Named("Prefix", prefix),
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

	if rs == -1 {
		return errors.New("User Already Exist")
	}

	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}

func UpdateUser(userID int, name, email string, isActive, isSysAdmin, isLOB bool, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_UpdateUser"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update User", "User", stampUser)
	logManager.WriteParameters(
		sql.Named("UserID", userID),
		sql.Named("Name", name),
		sql.Named("Email", email),
		sql.Named("IsActive", isActive),
		sql.Named("IsSysAdmin", isSysAdmin),
		sql.Named("IsLOB", isLOB),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Users", userID, []string{"NAME", "EMAIL", "IS_ACTIVE", "IS_SYSADMIN", "IS_LOGIN_ON_BEHALF"})
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

func DeleteUser(userID int, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_DeleteUser"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete User", "User", stampUser)
	logManager.WriteParameters(
		sql.Named("UserID", userID),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Users", userID, []string{"LEVEL", "DT_EDITED", "DT_INACTIVE", "DT_PASSWORD_EXPIRED", "DT_RETRY_LOGIN", "IP_CREATOR", "NM_CREATOR", "NM_EDITOR", "TS"})
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

func UpdateUserPassword(userID int, password, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_UpdateUserPassword"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update User Password", "User", stampUser)
	logManager.WriteParameters(
		sql.Named("UserID", userID),
		sql.Named("Password", password),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Users", userID, []string{"Password", "Date_Expired", "Login_fail"})
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

func ListUserSession(userID int, dateStart time.Time, dateEnd time.Time, stampUser string) ([]model.UserSession, error) {
	dbName := MgmtGames
	spName := "AdminBO_GetUserSessionList"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List User Session", "User", stampUser)
	logManager.WriteParameters(
		sql.Named("UserID", userID),
		sql.Named("DateFrom", dateStart),
		sql.Named("DateTo", dateEnd),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.UserSession{}
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
