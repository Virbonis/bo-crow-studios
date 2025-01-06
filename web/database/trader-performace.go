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

func ListTraderTraderPerformance(fromDate, toDate, section string, leagueID int, histOrPost, stampUser string) ([]model.TraderOptions, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_TRADER_TRADER_PERFORMANCE"
	var err error
	list := []model.TraderOptions{}

	logManager := logger.LogManager{}
	logManager.StartTask("List Trader Options", "Trader Performance", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", fromDate),
		sql.Named("MatchDateTo", toDate),
		sql.Named("MarketTime", section),
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

	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}

func ListLeagueTraderPerformance(fromDate, toDate, section, trader, histOrPost, stampUser string) ([]model.LeagueOptions, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_TRADER_PERFORMANCE"
	var err error
	list := []model.LeagueOptions{}

	logManager := logger.LogManager{}
	logManager.StartTask("List League Options", "Trader Performance", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", fromDate),
		sql.Named("MatchDateTo", toDate),
		sql.Named("MarketTime", section),
		sql.Named("TraderName", trader),
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

	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}

func ListTraderPerformance(dateFrom, dateTo, section, trader string, leagueID int, histOrPost, stampUser string) ([]model.RptTraderPerformance, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_TRADER_PERFORMANCE"

	var err error
	var rs mssql.ReturnStatus
	list := []model.RptTraderPerformance{}
	logManager := logger.LogManager{}
	logManager.StartTask("List Trader Performance", "Trader Performance", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", dateFrom),
		sql.Named("MatchDateTo", dateTo),
		sql.Named("MarketTime", section),
		sql.Named("TraderName", trader),
		sql.Named("LeagueID", leagueID),
		sql.Named("HistOrPost", histOrPost),
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

	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}

	if rs == -1 {
		return nil, errors.New("Please select either a trader or a league")
	}
	return list, nil
}
