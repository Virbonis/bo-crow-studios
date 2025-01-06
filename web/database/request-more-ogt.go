package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func GetListGridRequestMoreOGT(popupID, matchTimeSlot, fromEarlyDate, toEarlyDate, sessionID, stampUser string) ([]model.ListGridRequestMoreOGT, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_REQ_MOREGT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get List Grid Request More OGT", "Request More OGT", stampUser)
	logManager.WriteParameters(
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("SessionID", sessionID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListGridRequestMoreOGT{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func GetStatusMatchRequestMoreOGT(noPartai, leagueID, homeID, awayID int, matchDate, stampUser string) (model.GetStatusMatchRequestMoreOGT, error) {
	dbName := GoldenOdds
	spName := "MGMT_SBA_GET_STATUS_MATCH_REQ_MOREGT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Status Match Request More OGT", "Request More OGT", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", noPartai),
		sql.Named("League_ID", leagueID),
		sql.Named("Home_ID", homeID),
		sql.Named("Away_ID", awayID),
		sql.Named("Match_Date", matchDate),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.GetStatusMatchRequestMoreOGT{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return model.GetStatusMatchRequestMoreOGT{}, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return model.GetStatusMatchRequestMoreOGT{}, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list[0], nil
}
