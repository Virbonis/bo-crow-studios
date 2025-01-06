package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListForecast(PopupID, SessionID, MatchTimeSlot, MatchType, FTHT, BranchID, Currency, IsUsingRoyalty, TraderGroupORI, stampUser string) ([]model.Forecast, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_FORECAST"
	var err error
	list := []model.Forecast{}
	logManager := logger.LogManager{}
	logManager.StartTask("List Forecast", "Forecast", stampUser)
	logManager.WriteParameters(
		sql.Named("PopupID", PopupID),
		sql.Named("SessionID", SessionID),
		sql.Named("MatchTimeSlot", MatchTimeSlot),
		sql.Named("MatchType", MatchType),
		sql.Named("FTHT", FTHT),
		sql.Named("BranchID", BranchID),
		sql.Named("Currency", Currency),
		sql.Named("IsUsingRoyalty", IsUsingRoyalty),
		sql.Named("TraderGroup", TraderGroupORI),
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

func ListForecastSingle(matchID int, matchType, ftht, branchID, IsUsingRoyalty, traderGroupORI, currency, stampUser string) ([]model.ForecastSingle, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_FORECAST_SINGLE"
	var err error
	list := []model.ForecastSingle{}
	logManager := logger.LogManager{}
	logManager.StartTask("List Forecast Single", "Forecast", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("MatchType", matchType),
		sql.Named("FTHT", ftht),
		sql.Named("BranchID", branchID),
		sql.Named("IsUsingRoyalty", IsUsingRoyalty),
		sql.Named("TraderGroup", traderGroupORI),
		sql.Named("Currency", currency),
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

func ListForecastPost(PopupID, SessionID, MatchTimeSlot, MatchType, FTHT, BranchID, Currency, FromDate, ToDate, IsUsingRoyalty, stampUser string) ([]model.Forecast, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_FORECAST_POST"
	var err error
	list := []model.Forecast{}
	logManager := logger.LogManager{}
	logManager.StartTask("List Forecast", "Forecast", stampUser)
	logManager.WriteParameters(
		sql.Named("PopupID", PopupID),
		sql.Named("SessionID", SessionID),
		sql.Named("MatchTimeSlot", MatchTimeSlot),
		sql.Named("MatchType", MatchType),
		sql.Named("FTHT", FTHT),
		sql.Named("BranchID", BranchID),
		sql.Named("Currency", Currency),
		sql.Named("FromEarlyDate", FromDate),
		sql.Named("ToEarlyDate", ToDate),
		sql.Named("IsUsingRoyalty", IsUsingRoyalty),
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
