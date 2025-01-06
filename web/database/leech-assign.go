package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListLeagueLeechAssign(matchDateFrom, matchDateTo, isChecked string, sportID int, stampUser string, userTeamID int) ([]model.LeagueLeechAssign, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_LEAGUE_LEECH_ASSIGN"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Leech Assign", "LEECH ASSIGN", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("IsChecked", isChecked),
		sql.Named("SportID", sportID),
		sql.Named("StampUser", stampUser),
		sql.Named("UserTeamID", userTeamID),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueLeechAssign{}
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

func UpdateLeagueLeechAssign(leagueIDs string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_LEAGUE_LEECH_ASSIGN"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update League Leech Assign", "LEECH ASSIGN", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueIDs", leagueIDs),
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
	return err
}

func ListMatchLeechAssign(matchDateFrom, matchDateTo, isChecked string, sportID int, stampUser string) ([]model.MatchLeechAssign, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_LEECH_ASSIGN"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match Leech Assign", "LEECH ASSIGN", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("IsChecked", isChecked),
		sql.Named("SportID", sportID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MatchLeechAssign{}

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

func UpdateMatchLeechAssign(matchIDs string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MATCH_LEECH_ASSIGN"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Leech Assign", "LEECH ASSIGN", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchIDs", matchIDs),
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
	return err
}

func ListAuditTrailLeechAssignUpdateMatch(matchID int, stampUser string) ([]model.AuditTrailLeechAssignUpdateMatch, error) {
	dbName := Inetsoccer
	spName := "MGMT_AUDIT_TRAIL_LEECH_ASSIGN_UPDATE_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Audit Trail Leech Assin Update Match", "LEECH ASSIGN", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.AuditTrailLeechAssignUpdateMatch{}

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
