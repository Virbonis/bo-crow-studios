package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListLeagueDuplicateMatch(sportID int, stampUser string) ([]model.LeagueDuplicateMatch, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_LEAGUE_DUPLICATE_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List League Duplicate Match", "Master League Duplicate Match", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueDuplicateMatch{}
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

func SearchLeagueDuplicateMatch(sportID, leagueID int, leagueName, stampUser string) ([]model.LeagueDuplicateMatch, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_SEARCH_ADD_DUPLICATE_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List Search League Duplicate Match", "Master League Duplicate Match", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("LeagueName", leagueName),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueDuplicateMatch{}
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

func InsertLeagueDuplicateMatch(leagueIDs, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_LEAGUE_DUPLICATE_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert League Duplicate Match", "Master League Duplicate Match", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueList", leagueIDs),
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

func DeleteLeagueDuplicateMatch(leagueID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_LEAGUE_DUPLICATE_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete League Duplicate Match", "Master League Duplicate Match", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueID),
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
