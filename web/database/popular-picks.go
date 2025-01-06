package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListPopularPicksCategory(stampUser string) ([]model.PickCategories, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_PICK_CATEGORY"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Popular Picks Category", "Popular Picks", stampUser)
	logManager.WriteParameters(
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.PickCategories{}
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

func ListPopularPicks(pickCategory, sortBy, stampUser string) ([]model.PopularPicks, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_POPULAR_PICKS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Popular Picks", "Popular Picks", stampUser)
	logManager.WriteParameters(
		sql.Named("PickCategory", pickCategory),
		sql.Named("SortBy", sortBy),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.PopularPicks{}
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
func InsertPopularPicks(pickCategory, listMatchId, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_POPULAR_PICKS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Popular Picks", "Popular Picks", stampUser)
	logManager.WriteParameters(
		sql.Named("PickCategory", pickCategory),
		sql.Named("ListMatchID", listMatchId),
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
func DeletePopularPicks(pickCategory, listMatchId, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_POPULAR_PICKS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Popular Picks", "Popular Picks", stampUser)
	logManager.WriteParameters(
		sql.Named("PickCategory", pickCategory),
		sql.Named("ListMatchID", listMatchId),
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
func DeleteFinishedPopularPicks(pickCategory, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_FINISHED_POPULAR_PICKS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Finished Popular Picks", "Popular Picks", stampUser)
	logManager.WriteParameters(
		sql.Named("PickCategory", pickCategory),
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
