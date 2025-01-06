package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListMixParlay(matchTimeSlot, fromEarlyDate, toEarlyDate, isShowNonParlay, popUpID, sessionID, stampUser, traderGroupInfo string) ([]model.MixParlay, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_PARLAY"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get List Trading Mix Parlay", "Trading Mix Parlay", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("IsShowNonParlay", isShowNonParlay),
		sql.Named("PopupID", popUpID),
		sql.Named("SessionID", sessionID),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroupInfo),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MixParlay{}
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

func UpdateOnOffParlayMatch(matchID int, subMatchParlayStatus, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_ONOFF_PARLAY_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update On Off Parlay Match", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchParlayStatus", subMatchParlayStatus),
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
func UpdateOnOffParlaySubMatch(matchID, subMatchID, gameType int, subMatchParlayStatus, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_ONOFF_PARLAY_SUB_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update On Off Parlay Sub Match", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("SubMatchParlayStatus", subMatchParlayStatus),
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
