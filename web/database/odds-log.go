package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListOdds(matchID, line int, market string, gameType int, stampUser string) ([]model.OddsLog, error) {
	dbName := Inetsoccer_Log
	spName := "MGMT_SBA_RPT_ODDS_LOG"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Odds", "OddsLog", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("Line", line),
		sql.Named("Market", market),
		sql.Named("GameType", gameType),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.OddsLog{}
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
