package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ResetIMService(stampUser string) error {
	dbName := IM
	spName := "IMUpdResetStatus"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Reset Service ", "IM", stampUser)
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
func ListIMMatch(fromDate, toDate string, matchID int, matchIDIM string, league, homeTeam, awayTeam, stampUser string) ([]model.IMMatchList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_IM_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List IM Match List", "IM", stampUser)
	logManager.WriteParameters(
		sql.Named("FromDate", fromDate),
		sql.Named("ToDate", toDate),
		sql.Named("No_Partai", matchID),
		sql.Named("MatchID_IM", matchIDIM),
		sql.Named("League", league),
		sql.Named("Home_Team", homeTeam),
		sql.Named("Away_Team", awayTeam),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.IMMatchList{}
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
func ListIMActionLog(matchID int, matchIDIM string, stampUser string) ([]model.IMActionLog, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_IM_ACTION_LOG"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List IM Action Log", "IM ACTION LOG", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchID),
		sql.Named("MatchID_IM", matchIDIM),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.IMActionLog{}
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

func ListIMMarket(matchID int, matchIDIM string, stampUser string) ([]model.IMMarket, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_IM_MARKET"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List IM Market", "IM", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchID),
		sql.Named("MatchID_IM", matchIDIM),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.IMMarket{}
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
