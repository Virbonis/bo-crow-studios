package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListLeechingAssignmentSport(stampUser string) ([]model.ListLeechingAssignmentSport, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SPORT_LEECHING_ASSIGNMENT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Assignment Sport", "LEECHING ASSIGNMENT", stampUser)
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

	list := []model.ListLeechingAssignmentSport{}
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

func ListLeechingAssignmentLeague(sportID int, leagueName string, priceGroup, currentPage, pageSize int, stampUser string) ([]model.ListLeechingAssignmentLeague, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_LEAGUE_LEECHING_ASSIGNMENT"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Assignment League", "LEECHING ASSIGNMENT", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueName", leagueName),
		sql.Named("PriceGroup", priceGroup),
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

	list := []model.ListLeechingAssignmentLeague{}
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

func UpdateLeechingAssignmentSport(sportID, dbAutoOdds, rbAutoOdds int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SPORT_LEECHING_ASSIGNMENT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Leeching Assignment Sport", "LEECHING ASSIGNMENT", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("DBAutoOdds", dbAutoOdds),
		sql.Named("RBAutoOdds", rbAutoOdds),
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

func UpdateLeechingAssignmentLeague(leagueID, dbAutoOdds, rbAutoOdds int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_LEAGUE_LEECHING_ASSIGNMENT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Leeching Assignment Sport", "LEECHING ASSIGNMENT", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueID),
		sql.Named("DBAutoOdds", dbAutoOdds),
		sql.Named("RBAutoOdds", rbAutoOdds),
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
