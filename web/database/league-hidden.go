package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListLeagueHidden(branchCode, currency string, sportID int, leagueName string, currentPage, pageSize int, stampUser string) ([]model.LeagueHidden, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_LEAGUE_HIDDEN"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List League Hidden", "Master League Hidden", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchCode", branchCode),
		sql.Named("Currency", currency),
		sql.Named("SportID", sportID),
		sql.Named("LeagueName", leagueName),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueHidden{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, totalRecords, nil
}

func CreateLeagueHidden(branchCode, currency string, sportID int, leagueIDs, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MASTER_LEAGUE_HIDDEN"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert League Hidden", "Master League Hidden", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchCode", branchCode),
		sql.Named("Currency", currency),
		sql.Named("SportID", sportID),
		sql.Named("ListLeagueID", leagueIDs),
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

func DeleteLeagueHidden(rowId int, branchName, currency, sportName, leagueName, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_MASTER_LEAGUE_HIDDEN"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete League Hidden", "Master League Hidden", stampUser)
	logManager.WriteParameters(
		sql.Named("RowID", rowId),
		sql.Named("BranchName", branchName),
		sql.Named("Currency", currency),
		sql.Named("SportName", sportName),
		sql.Named("LeagueName", leagueName),
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

func ListLeagueHiddenSearch(leagueName string, sportId int, stampUser string) ([]model.LeagueSelect, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_LEAGUE_HIDDEN_SEARCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Hidden Search", "Master League Hidden", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueName", leagueName),
		sql.Named("SportID", sportId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueSelect{}
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
