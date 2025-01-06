package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListLastBet(matchId, homePosisi, awayPosisi, status, totalRow int, stampUser string) ([]model.LastBet, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_LAST_BET"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Last Bet", "Last Bet", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("HomePosisi", homePosisi),
		sql.Named("AwayPosisi", awayPosisi),
		sql.Named("Status", status),
		sql.Named("TotalRow", totalRow),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LastBet{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning data: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
