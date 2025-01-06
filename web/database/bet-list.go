package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListBetListAHOU(matchID, subMatchID int, listGameType, stLive, fTHT, handicap, stampUser string) ([]model.BetList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_BET_LIST_AHOU"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List BetList AHOU", "BetList", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("ListGameType", listGameType),
		sql.Named("STLive", stLive),
		sql.Named("FTHT", fTHT),
		sql.Named("Handicap", handicap),
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
		return list, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListBetListOE(matchID, subMatchID int, stLive, fTHT, stampUser string) ([]model.BetList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_BET_LIST_OE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List BetList OE", "BetList", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("STLive", stLive),
		sql.Named("FTHT", fTHT),
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
		return list, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListBetList1X2(matchID, subMatchID int, listGameType, stLive, fTHT, handicap, stampUser string) ([]model.BetList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_BET_LIST_1X2"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List BetList 1X2", "BetList", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("STLive", stLive),
		sql.Named("FTHT", fTHT),
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
		return list, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListBetListCS(matchID, gameType int, choiceCode, stampUser string) ([]model.BetListCS, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_CS_BET_LIST"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List BetList CS", "BetList", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("ChoiceCode", choiceCode),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BetListCS{}
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
func ListBetListTrading(matchID, subMatchID, gameType int, betChoice, stampUser string) ([]model.BetListTrading, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_BET_LIST"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Bet List Trading Mix Parlay", "Trading Mix Parlay", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("BetChoice", betChoice),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BetListTrading{}
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

func GetBetListAverageOdds(matchID, subMatchID int, stLive, fTHT, handicap, stampUser string) (*model.BetListAverageOdds, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_BET_LIST_AVG_ODDS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get BetList Average Odds", "BetList", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("STLive", stLive),
		sql.Named("FTHT", fTHT),
		sql.Named("Handicap", handicap),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := model.BetListAverageOdds{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		err = rows.StructScan(&list)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return &list, err
		}
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return &list, nil
}
func GetBetListAverageOddsOE(matchID, subMatchID int, stLive, fTHT, stampUser string) (*model.BetListAverageOdds, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_BET_LIST_OE_AVG_ODDS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get BetList Average Odds OE", "BetList", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("STLive", stLive),
		sql.Named("FTHT", fTHT),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := model.BetListAverageOdds{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		err = rows.StructScan(&list)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return &list, err
		}
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return &list, nil
}

func ListBetListForecast(matchID int, listGameType, stLive, fTHT, stampUser string) ([]model.BetListForecast, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_BET_LIST_FORECAST"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List BetList Forecast", "BetList", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("ListGameType", listGameType),
		sql.Named("STLive", stLive),
		sql.Named("FTHT", fTHT),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BetListForecast{}
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
