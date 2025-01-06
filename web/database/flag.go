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

func ListSelectFlag(stampUser string) ([]model.ListFlag, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_LIST_FLAG"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get List Flag Master", "Flag", stampUser)
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

	list := []model.ListFlag{}
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

func ListFlag(FlagName string, CurrentPage, PageSize int, stampUser string) ([]model.ListFlag, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_FLAG"
	var err error
	var totalRecord int
	logManager := logger.LogManager{}
	logManager.StartTask("List Flag", "Flag", stampUser)
	logManager.WriteParameters(
		sql.Named("FlagName", FlagName),
		sql.Named("CurrentPage", CurrentPage),
		sql.Named("PageSize", PageSize),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecord}),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	var list []model.ListFlag

	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return list, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}

	return list, totalRecord, nil
}

func CreateFlag(flagName, flagSource, stampUser string) (int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MASTER_FLAG"
	var err error
	var flagID int
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Create Flag", "Flag", stampUser)
	logManager.WriteParameters(
		sql.Named("FlagName", flagName),
		sql.Named("FlagSource", flagSource),
		sql.Named("FlagID", sql.Out{Dest: &flagID}),
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
		return 0, errors.New("Flag Name and Flag must be inserted")
	} else if rs == -10 {
		return 0, errors.New("Flag Name already used")
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return flagID, nil
}

func UpdateFlag(flagID int, flagName, flagSource, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_FLAG"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Flag", "Flag", stampUser)
	logManager.WriteParameters(
		sql.Named("FlagID", flagID),
		sql.Named("FlagName", flagName),
		sql.Named("FlagSource", flagSource),
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
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return nil
}
