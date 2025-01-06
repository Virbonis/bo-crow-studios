package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ResetBBZService(stampUser string) error {
	dbName := BetBazar
	spName := "BetBazarUpdResetStatus"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Reset Service ", "BBZ", stampUser)
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
	return err
}

func ListBBZChannelMonitoring(stampUser string) ([]model.BBZChannelMonitoring, error) {
	dbName := BetBazar
	spName := "MGMT_SBA_LIST_BETBAZAR_CHANNEL"
	var err error
	list := []model.BBZChannelMonitoring{}

	logManager := logger.LogManager{}
	logManager.StartTask("List BBZ Channel Monitoring", "BBZ", stampUser)
	logManager.WriteParameters()
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
	return list, err
}
func ListBBZMatchList(FromDate, ToDate string, NoPartai int, MatchIDBetBazar, League, HomeTeam, AwayTeam, stampUser string) ([]model.BBZMatchList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_BETBAZAR_MATCH"
	var err error
	list := []model.BBZMatchList{}

	logManager := logger.LogManager{}
	logManager.StartTask("List BBZ Match List", "BBZ", stampUser)
	logManager.WriteParameters(
		sql.Named("FromDate", FromDate),
		sql.Named("ToDate", ToDate),
		sql.Named("No_Partai", NoPartai),
		sql.Named("MatchID_BetBazar", MatchIDBetBazar),
		sql.Named("League", League),
		sql.Named("Home_Team", HomeTeam),
		sql.Named("Away_Team", AwayTeam),
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
	return list, err
}
func ListBBZActionLog(MatchID int, MatchIDBBZ, stampUser string) ([]model.BBZActionLog, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_BETBAZAR_ACTION_LOG"
	var err error
	list := []model.BBZActionLog{}

	logManager := logger.LogManager{}
	logManager.StartTask("List BBZ Action Log", "BBZ", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", MatchID),
		sql.Named("MatchID_BetBazar", MatchIDBBZ),
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
	return list, err
}
func ListBBZMarket(MatchID int, MatchIDBBZ, stampUser string) ([]model.BBZMarket, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_BETBAZAR_MARKET"
	var err error
	list := []model.BBZMarket{}
	logManager := logger.LogManager{}
	logManager.StartTask("List BBZ Market", "BBZ", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", MatchID),
		sql.Named("MatchID_BetBazar", MatchIDBBZ),
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

	return list, err
}
func ListBBZMarketLog(MatchID int, MatchIDBBZ string, GameType int, Status, stampUser string) ([]model.BBZMarketLog, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_BETBAZAR_MARKET_LOG"
	var err error
	list := []model.BBZMarketLog{}
	logManager := logger.LogManager{}
	logManager.StartTask("List BBZ Market", "BBZ", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", MatchID),
		sql.Named("MatchID_BetBazar", MatchIDBBZ),
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

	return list, err
}
func ListBBZIncident(MatchID int, MatchIDBBZ, FromDate, ToDate, stampUser string) ([]model.BBZIncident, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_BETBAZAR_INCIDENT"
	var err error
	list := []model.BBZIncident{}
	logManager := logger.LogManager{}
	logManager.StartTask("List BBZ Incident", "BBZ", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", MatchID),
		sql.Named("MatchID_BetBazar", MatchIDBBZ),
		sql.Named("FromDate", FromDate),
		sql.Named("ToDate", ToDate),
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

	return list, err
}
