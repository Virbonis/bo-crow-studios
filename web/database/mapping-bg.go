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

func ListLeagueMappingBGMatch(matchDateFrom, matchDateTo string, sportID int, isFinishedMatch, stampUser string) ([]model.MappingBGMatch_League, error) {
	dbName := BetGenius
	spName := "MGMT_SBA_LIST_LEAGUE_MAPPING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League", "MAPPING BG MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("SportID", sportID),
		sql.Named("IsFinishedMatch", isFinishedMatch),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MappingBGMatch_League{}
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
func ListLeagueBGMappingBGMatch(sportId int, matchDate, stampUser string) ([]model.MappingBGMatch_LeagueBG, error) {
	dbName := BetGenius
	spName := "MGMT_SBA_LIST_MAP_MATCH_BG_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League BG", "MAPPING BG MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportId),
		sql.Named("MatchDate", matchDate),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MappingBGMatch_LeagueBG{}
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
func ListMatchMappingBGMatch(sportID, leagueID int, matchDateFrom, matchDateTo, isFinishedMatch, stampUser string) ([]model.MappingBGMatch_Match, error) {
	dbName := BetGenius
	spName := "MGMT_SBA_LIST_GRID_MATCH_MAPPING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match", "MAPPING BG MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("IsFinishedMatch", isFinishedMatch),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MappingBGMatch_Match{}
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
func ListMatchBGMappingBGMatch(leagueID int, timeStamp, stampUser string) ([]model.MappingBGMatch_MatchBG, error) {
	dbName := BetGenius
	spName := "MGMT_SBA_LIST_GRID_MATCH_GAMEFIXTURE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match BG", "MAPPING BG MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueID),
		sql.Named("TimeStamp", timeStamp),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MappingBGMatch_MatchBG{}
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

func UpdateMappingBGMatch(matchID, sportsTickerID int, stampUser string) error {
	dbName := BetGenius
	spName := "MGMT_SBA_PROC_UPD_MAPPING"
	var err error
	var message string
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Update", "MAPPING BG MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("IDSportsTicker", sportsTickerID),
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

func ListBGGameEvent(matchID, sportsTickerID int, stampUser string) ([]model.BGGameEvent, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_BG_GAMEEVENTS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List BG GAME EVENT", "BG GAME EVENT", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchID),
		sql.Named("idSportsTicker", sportsTickerID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BGGameEvent{}
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
