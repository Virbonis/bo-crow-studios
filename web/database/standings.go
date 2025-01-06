package database

import (
	"database/sql"
	"errors"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListStandingsCategory(stampUser string) ([]model.StandingCategory, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_STANDINGS_CATEGORY"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Standings Category", "Standings", stampUser)
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

	list := []model.StandingCategory{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return list, err
	}

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
func ListStandings(Category, stampUser string) ([]model.Standings, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_STANDINGS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Standings", "Standings", stampUser)
	logManager.WriteParameters(
		sql.Named("StandingsCategory", Category),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.Standings{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return list, err
	}

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
func CreateStandings(NoTeam, Play, Win, Draw, Lose, Goal, Conceded, Points, SortNumber int, Category, GroupName, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_STANDINGS"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Create Standings", "Standings", stampUser)
	logManager.WriteParameters(
		sql.Named("StandingsCategory", Category),
		sql.Named("GroupName", GroupName),
		sql.Named("No_Team", NoTeam),
		sql.Named("Play", Play),
		sql.Named("Win", Win),
		sql.Named("Draw", Draw),
		sql.Named("Lose", Lose),
		sql.Named("Goal", Goal),
		sql.Named("Conceded", Conceded),
		sql.Named("Points", Points),
		sql.Named("SortNumber", SortNumber),
		sql.Named("StampUser", stampUser),
		&rs,
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}

	if rs == 0 {
		logManager.WriteStatusError("Standing Team already exist in the same Group and Category")
		return errors.New("Standing Team already exist in the same Group and Category")
	}
	return nil
}
func UpdateStandings(RowID, NoTeam, Play, Win, Draw, Lose, Goal, Conceded, Points, SortNumber int, Category, GroupName, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_STANDINGS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Standings", "Standings", stampUser)
	logManager.WriteParameters(
		sql.Named("RowID", RowID),
		sql.Named("StandingsCategory", Category),
		sql.Named("GroupName", GroupName),
		sql.Named("No_Team", NoTeam),
		sql.Named("Play", Play),
		sql.Named("Win", Win),
		sql.Named("Draw", Draw),
		sql.Named("Lose", Lose),
		sql.Named("Goal", Goal),
		sql.Named("Conceded", Conceded),
		sql.Named("Points", Points),
		sql.Named("SortNumber", SortNumber),
		sql.Named("stampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return nil
}
func DeleteStandings(RowID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_STANDINGS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Standings", "Standings", stampUser)
	logManager.WriteParameters(
		sql.Named("RowID", RowID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return nil
}
