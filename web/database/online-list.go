package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListOnlineList(MatchDate string, SportID int, League, stampUser string) ([]model.ListOnlineList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_ONLINE_LIST"
	var err error
	list := []model.ListOnlineList{}
	logManager := logger.LogManager{}
	logManager.StartTask("List Online List", "Online List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDate", MatchDate),
		sql.Named("LeagueIDs", League),
		sql.Named("SportID", SportID),
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
		return nil, err
	}

	err = sqlx.StructScan(rows, &list)
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func ListOnlineListDetail(MatchIDs, GameType_Dead, GameType_Run, stampUser string) ([]model.OnlineListDetail, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_ONLINE_LIST_DETAIL"
	var err error
	list := []model.OnlineListDetail{}
	logManager := logger.LogManager{}
	logManager.StartTask("List Multi 3", "Online List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchIDs", MatchIDs),
		sql.Named("GameType_Dead", GameType_Dead),
		sql.Named("GameType_Run", GameType_Run),
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
		return nil, err
	}

	err = sqlx.StructScan(rows, &list)

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}

	return list, nil
}

func ListBetDetailOnlineList(MatchID, MatchLiveStatus, BetChoice, HomeScore, AwayScore, Handicap, stampUser string) ([]model.OnlineListBetList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_ONLINE_LIST_BET_LIST"
	var err error
	list := []model.OnlineListBetList{}
	logManager := logger.LogManager{}
	logManager.StartTask("List Bet Detail", "Online List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", MatchID),
		sql.Named("MatchLiveStatus", MatchLiveStatus),
		sql.Named("BetChoice", BetChoice),
		sql.Named("HomeScore", HomeScore),
		sql.Named("AwayScore", AwayScore),
		sql.Named("Handicap", Handicap),
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
		return nil, err
	}

	err = sqlx.StructScan(rows, &list)
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
