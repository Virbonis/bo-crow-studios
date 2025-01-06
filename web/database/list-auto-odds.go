package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListAutoOddsMatch(MatchID, SportID int, LeagueIBC, HomeTeamIBC, AwayTeamIBC, stampUser string) ([]model.ListAutoOdds, error) {
	dbName := SoccerBot
	spName := "MGMT_SBA_LIST_GRID_AUTO_ODDS_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Auto Odds Match", "Auto Odds", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", SportID),
		sql.Named("LeagueIBC", LeagueIBC),
		sql.Named("HomeName_IBC", HomeTeamIBC),
		sql.Named("AwayName_IBC", AwayTeamIBC),
		sql.Named("MatchID", MatchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.ListAutoOdds{}
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

func UpdateAutoOddsMatch(MatchIDIBC int, MatchDateIBC, stampUser string) error {
	dbName := SoccerBot
	spName := "MGMT_SBA_PROC_UPD_AUTO_ODDS_MATCH_DATE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Auto Odds Match", "Auto Odds", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID_IBC", MatchIDIBC),
		sql.Named("MatchDate_IBC", MatchDateIBC),
		sql.Named("StampUser", stampUser),
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
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return nil
}

func DeleteAutoOddsMatch(MatchIDIBC int, stampUser string) error {
	dbName := SoccerBot
	spName := "MGMT_SBA_PROC_DEL_AUTO_ODDS_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Auto Odds Match", "Auto Odds", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID_IBC", MatchIDIBC),
		sql.Named("StampUser", stampUser),
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
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return nil
}
