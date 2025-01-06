package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListLotteryMatch(MatchID, LeagueID, SportID int, FromDate, ToDate, LeagueName, stampUser string) ([]model.MappingLotteryMatch, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SPORTSLOTTERY_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Lottery Match", "Mapping Lottery", stampUser)
	logManager.WriteParameters(
		sql.Named("FromEarlyDate", FromDate),
		sql.Named("ToEarlyDate", ToDate),
		sql.Named("SportID", SportID),
		sql.Named("LeagueID", LeagueID),
		sql.Named("LeagueName", LeagueName),
		sql.Named("MatchID", MatchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MappingLotteryMatch{}
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

func InsertLotteryMatch(MatchID, LeagueID, HomeID, AwayID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_SPORTSLOTTERY_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match to Lottery", "Mapping Lottery", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", MatchID),
		sql.Named("LeagueID", LeagueID),
		sql.Named("TeamIDHome", HomeID),
		sql.Named("TeamIDAway", AwayID),
		sql.Named("StampUser", stampUser),
	)
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
	return nil
}
