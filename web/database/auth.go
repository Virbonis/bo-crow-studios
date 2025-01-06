package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func GetUserInfo(stampUser string) (*model.UserInfo, error) {

	dbName := MgmtGames
	spName := "AdminBO_GetUserInfo"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get User Info", "Auth", stampUser)
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

	model := &model.UserInfo{}
	err = sqlConnections.conn[dbName].QueryRowx(spName, logManager.Parameters...).StructScan(model)
	if err == sql.ErrNoRows {
		model = nil
	} else if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return model, nil
}

func UpdateUserInfo(userID, loginFail int, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_ProcUpdUserInfo"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update User Info", "Auth", stampUser)
	logManager.WriteParameters(
		sql.Named("UserID", userID),
		sql.Named("LoginFail", loginFail),
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

func ProcUserLogin(userID int, sessionID, ipAddress, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_ProcLogin"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Proc User Login", "Auth", stampUser)
	logManager.WriteParameters(
		sql.Named("UserID", userID),
		sql.Named("Session", sessionID),
		sql.Named("IpAddr", ipAddress),
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

func ListAuthByUser(userID int, stampUser string) ([]model.UserAuth, error) {
	dbName := MgmtGames
	spName := "AdminBO_ListAuthIDByUser"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Auth ByUser", "Auth", stampUser)
	logManager.WriteParameters(
		sql.Named("UserID", userID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.UserAuth{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return list, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func GetUserTeamID(stampUser string) (int, error) {
	dbName := MgmtGames
	spName := "AdminBO_GetUserTeamID"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get User TeamID", "Auth", stampUser)
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

	var userTeamID int
	err = sqlConnections.conn[dbName].QueryRow(spName, logManager.Parameters...).Scan(
		&userTeamID,
	)
	if err == sql.ErrNoRows {
		userTeamID = 0
	} else if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return userTeamID, nil
}

func GetUserTeamSubID(stampUser string) (int, error) {
	dbName := MgmtGames
	spName := "AdminBO_GetUserTeamSubID"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get User TeamSubID", "Auth", stampUser)
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

	var userTeamSubID int
	err = sqlConnections.conn[dbName].QueryRow(spName, logManager.Parameters...).Scan(
		&userTeamSubID,
	)
	if err == sql.ErrNoRows {
		userTeamSubID = 0
	} else if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return userTeamSubID, nil
}

func UpdateUserProfile(userID int, name, password string, avatar string, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_UpdateUserProfile"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update User Profile", "Auth", stampUser)
	logManager.WriteParameters(
		sql.Named("UserID", userID),
		sql.Named("Name", name),
		sql.Named("Password", password),
		sql.Named("Avatar", avatar),
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
