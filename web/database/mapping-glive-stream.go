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

func ListLeagueMappingGLive(sportID int, matchDateFrom, matchDateTo, stampUser string) ([]model.MappingGLive_League, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_MAPPING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League", "MAPPING GLIVE STREAM", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MappingGLive_League{}
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
func ListLeagueGLMappingGLive(sportID int, matchDateFrom, matchDateTo, stampUser string) ([]model.MappingGLive_LeagueGL, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_MAPPING_GLIVESTREAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League GL", "MAPPING GLIVE STREAM", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MappingGLive_LeagueGL{}
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
func ListMatchMappingGLive(sportID, leagueID int, matchDateFrom, matchDateTo, stampUser string) ([]model.MappingGLive_Match, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_MAPPING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match", "MAPPING GLIVE STREAM", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MappingGLive_Match{}
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
func ListMatchGLMappingGLive(sportID int, gLeague, matchDateFrom, matchDateTo, stampUser string) ([]model.MappingGLive_MatchGL, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_GLIVESTREAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match GL", "MAPPING GLIVE STREAM", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("GLeague", gLeague),
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MappingGLive_MatchGL{}
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
func UpdateMappingGLive(matchID, gMatchID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MAPPING_GLIVESTREAM"
	var err error
	var message string
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Update", "MAPPING GLIVE STREAM", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GMatchID", gMatchID),
		sql.Named("StampUser", stampUser),
		sql.Named("Message", sql.Out{Dest: &message}),
		&rs,
	)
	logManager.SetMatchIDorCustName(matchID)
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
	if message != "" {
		return errors.New(message)
	}

	return err
}
