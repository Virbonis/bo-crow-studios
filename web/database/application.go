package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListApplication(stampUser string) ([]model.Application, error) {
	dbName := MgmtGames
	spName := "AdminBO_GetApplicationList"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Application", "Application", stampUser)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.Application{}
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

func CreateApplication(name string, isActive bool, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_CreateApplication"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Create Application", "Application", stampUser)
	logManager.WriteParameters(
		sql.Named("Name", name),
		sql.Named("IsActive", isActive),
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

func UpdateApplication(applicationID int, name string, isActive bool, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_UpdateApplication"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Application", "Application", stampUser)
	logManager.WriteParameters(
		sql.Named("ApplicationID", applicationID),
		sql.Named("Name", name),
		sql.Named("IsActive", isActive),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "AdminApplication", applicationID, []string{"Name", "IsActive"})
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

func ListApplicationMenu(applicationID int, stampUser string) ([]model.ApplicationMenu, error) {
	dbName := MgmtGames
	spName := "AdminBO_GetApplicationMenuList"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Application Menu", "Application", stampUser)
	logManager.WriteParameters(
		sql.Named("ApplicationID", applicationID),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ApplicationMenu{}
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

func UpdateApplicationMenu(applicationID int, menuIDs, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_UpdateApplicationMenu"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Application Menu", "Application", stampUser)
	logManager.WriteParameters(
		sql.Named("ApplicationID", applicationID),
		sql.Named("MenuIDs", menuIDs),
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
