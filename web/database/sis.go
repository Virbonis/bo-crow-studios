package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListSISActionLog(matchId int, matchIdSIS, stampUser string) ([]model.SISActionLog, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SIS_ACTION_LOG"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List SIS Action Log", "SIS Action Log", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
		sql.Named("EventID_SIS", matchIdSIS),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.SISActionLog{}
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
func ListSISMarket(matchId int, matchIdSIS, stampUser string) ([]model.SISMarket, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SIS_MARKET"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List SIS Market", "SIS Market", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
		sql.Named("EventID_SIS", matchIdSIS),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.SISMarket{}
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
func ListSISMarketLog(matchId int, matchIdSIS string, gameType int, status, isDisplayed, id, stampUser string) ([]model.SISMarketLog, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SIS_MARKET_LOG"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List SIS Market Log", "SIS Market Log", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
		sql.Named("EventID_SIS", matchIdSIS),
		sql.Named("GameType", gameType),
		sql.Named("Status", status),
		sql.Named("IsDisplayed", isDisplayed),
		sql.Named("ID", id),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.SISMarketLog{}
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
func ListSISMatchList(fromDate, toDate string, matchID int, matchIDSIS string, leagueSIS, homeSIS, awaySIS, stampUser string) ([]model.SISMatchList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SIS_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List SIS Match List", "SIS Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("FromDate", fromDate),
		sql.Named("ToDate", toDate),
		sql.Named("No_Partai", matchID),
		sql.Named("EventID_SIS", matchIDSIS),
		sql.Named("League", leagueSIS),
		sql.Named("Home_Team", homeSIS),
		sql.Named("Away_Team", awaySIS),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.SISMatchList{}
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
