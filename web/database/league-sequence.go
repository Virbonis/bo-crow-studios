package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListLeagueSequence(isShowAll, matchTimeSlot string, sportId int, stampUser string) ([]model.LeagueSequence, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_LEAGUE_SEQUENCE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Sequence", "Master League Sequence", stampUser)
	logManager.WriteParameters(
		sql.Named("IsShowAll", isShowAll),
		sql.Named("SportID", sportId),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueSequence{}
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

func UpdateLeagueSequenceSwap(matchTimeSlot string, noEvents1, noEvents2 int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_LEAGUE_SEQUENCE_SWAP"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update League Sequence", "Master League Sequence", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Events1", noEvents1),
		sql.Named("No_Events2", noEvents2),
		sql.Named("MatchTimeSlot", matchTimeSlot),
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

func UpdateLeagueSequenceSwapSpecial(matchTimeSlot string, noEvents1, noEvents2, parentLeagueId int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_LEAGUE_SEQUENCE_SWAP_SPECIAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update League Sequence Swap Special", "Master League Sequence", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Events1", noEvents1),
		sql.Named("No_Events2", noEvents2),
		sql.Named("ParentLeagueID", parentLeagueId),
		sql.Named("MatchTimeSlot", matchTimeSlot),
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

func ListLeagueSequenceSpecial(matchTimeSlot string, parentLeagueId int, stampUser string) ([]model.LeagueSequence, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_LEAGUE_SEQUENCE_SPECIAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Sequence Special", "Master League Sequence", stampUser)
	logManager.WriteParameters(
		sql.Named("ParentLeagueID", parentLeagueId),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueSequence{}
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
