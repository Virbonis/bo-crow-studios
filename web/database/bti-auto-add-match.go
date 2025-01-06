package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListBTILeagueAutoAddMatch(MappingStatus, MSportID int, MatchDateFrom, MatchDateTo, stampUser string) ([]model.BTILeague, error) {
	dbName := BTI
	spName := "MGMT_SBA_LIST_LEAGUE_AUTO_ADD_MATCH_BTI"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get List League Auto Add Match BTI", "Add Match BTI", stampUser)
	logManager.WriteParameters(
		sql.Named("MappingStatus", MappingStatus),
		sql.Named("MSportID", MSportID),
		sql.Named("MatchDateFrom", MatchDateFrom),
		sql.Named("MatchDateTo", MatchDateTo),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BTILeague{}
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}
func ListBTIAutoAddMatch(MappingStatus, MSportID int, LeagueID string, MatchID int, MatchDateFrom, MatchDateTo, stampUser string) ([]model.BTIMatch, error) {
	dbName := BTI
	spName := "MGMT_SBA_LIST_GRID_AUTO_ADD_MATCH_BTI"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get List Auto Add Match BTI", "Add Match BTI", stampUser)
	logManager.WriteParameters(
		sql.Named("MappingStatus", MappingStatus),
		sql.Named("MSportID", MSportID),
		sql.Named("LeagueID", LeagueID),
		sql.Named("MatchID", MatchID),
		sql.Named("MatchDateFrom", MatchDateFrom),
		sql.Named("MatchDateTo", MatchDateTo),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BTIMatch{}
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}
func InsBTIAutoAddMatch(BTIMatchID string, stampUser string) error {
	dbName := BTI
	spName := "MGMT_SBA_PROC_AUTO_ADD_MATCH_BTI"
	var err error
	var resMatchID int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Auto Add Match", "Add Match BTI", stampUser)
	logManager.WriteParameters(
		sql.Named("BTIMatchID", BTIMatchID),
		sql.Named("MatchID", sql.Out{Dest: &resMatchID}),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		logManager.SetMatchIDorCustName(resMatchID)
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return nil
}
