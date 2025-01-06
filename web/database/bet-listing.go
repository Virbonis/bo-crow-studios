package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListBetListing(matchID int, listGameType, stLive, ftht, handicap, histOrPost, buyback, stampUser string) ([]model.BetList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_BET_LIST_AHOUOE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List MO Bet List AHOUOE", "Bet Listing", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("ListGameType", listGameType),
		sql.Named("STLive", stLive),
		sql.Named("FTHT", ftht),
		sql.Named("Handicap", handicap),
		sql.Named("HistOrPost", histOrPost),
		sql.Named("Buyback", buyback),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BetList{}
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

func ListBetListingLeague(matchDateFrom, matchDateTo, histOrPost string, userTeamID int, stampUser string) ([]model.BetListingLeague, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_MO_LEAGUE_BET_LIST_AHOUOE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List MO League Bet List AHOUOE", "Bet Listing", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("HistOrPost", histOrPost),
		sql.Named("UserTeamID", userTeamID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BetListingLeague{}
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

func ListBetListingMatch(matchDateFrom, matchDateTo string, leagueID int, histOrPost, stampUser string) ([]model.BetListingMatch, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_MO_MATCH_BET_LIST_AHOUOE_BY_LEAGUEID"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List MO By League ID Bet List AHOUOE", "Bet Listing", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("LeagueID", leagueID),
		sql.Named("HistOrPost", histOrPost),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BetListingMatch{}
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
