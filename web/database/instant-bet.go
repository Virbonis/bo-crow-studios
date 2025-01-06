package database

import (
	"database/sql"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListInstantBet(
	branchID, username string, display int,
	matchTimeSlot, currency string,
	sportID int, leagueIDs, matchIDs string, matchID int,

	VIPFilter, gameTypeSpecial, pending, fTHT, gameTypes string,
	txnType, newMember string,

	betAmt, betAmtComp, maxPayout, maxBet int,

	sTLive string, lastBetID int,
	sessionID, stampUser, traderGroupORI string,
	userTeamID, userTeamSubID int,
) ([]model.InstantBet, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_INSTANT_BET_2"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Instant Bet", "Instant Bet", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchID", branchID),
		sql.Named("Username", username),
		sql.Named("Display", display),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("Currency", currency),
		sql.Named("SportID", sportID),
		sql.Named("LeagueIDs", leagueIDs),
		sql.Named("MatchIDs", matchIDs),
		sql.Named("MatchID", matchID),

		sql.Named("VIPFilter", VIPFilter),
		sql.Named("GTSpecialFilter", gameTypeSpecial),
		sql.Named("Pending", pending),
		sql.Named("FTHT", fTHT),
		sql.Named("GameType", gameTypes),
		sql.Named("TxnType", txnType),
		sql.Named("NewMember", newMember),

		sql.Named("BetAmt", betAmt),
		sql.Named("BetAmtComp", betAmtComp),
		sql.Named("MaxPayout", maxPayout),
		sql.Named("MaxBet", maxBet),

		sql.Named("STLive", sTLive),
		sql.Named("LastBetID", lastBetID),
		sql.Named("SessionID", sessionID),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroupORI),
		sql.Named("UserTeamID", userTeamID),
		sql.Named("UserTeamSub", userTeamSubID),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.InstantBet{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning rows: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}

	return list, nil
}

func ListInstantBetParlay(parlaySequence int, stampUser string) ([]model.InstantBetParlay, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_PARLAY_INSTANT_BET_2"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Instant Bet Parlay", "Instant Bet", stampUser)
	logManager.WriteParameters(
		sql.Named("ParlaySequence", parlaySequence),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.InstantBetParlay{}
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

func ListInstantBetMatchParlay(betID int, stampUser string) ([]string, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_BET_BUILDER_INSTANT_BET_2"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Instant Bet Match Parlay", "Instant Bet", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Txn", betID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []string{}
	var betBuilderMarket string
	sqlConnections.conn[dbName].QueryRow(spName, logManager.Parameters...).Scan(
		&betBuilderMarket,
	)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	if betBuilderMarket != "" {
		list = strings.Split(betBuilderMarket, " And ")
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListInstantBetLottery(betID int, stampUser string) ([]model.InstantBetLottery, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LOTTERY_MATCH_INSTANT_BET_2"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Instant Bet Lottery", "Instant Bet", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Txn", betID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.InstantBetLottery{}
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
