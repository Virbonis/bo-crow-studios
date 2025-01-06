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

func ListKnockoutsCategory(stampUser string) ([]model.KnockoutsCategory, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_KNOCKOUTS_CATEGORY"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List Knockouts Category", "Knockouts", stampUser)
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

	list := []model.KnockoutsCategory{}
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

func ListKnockouts(Category, stampUser string) ([]model.ListKnockouts, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_KNOCKOUTS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Knockouts", "Knockouts", stampUser)
	logManager.WriteParameters(
		sql.Named("KnockoutsCategory", Category),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListKnockouts{}
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
func CreateKnockouts(KnockoutsID, KnockoutsRound, TeamID1, TeamID2 int, MatchDate, Category, result, resultState, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_KNOCKOUTS"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Create Knockouts", "Knockouts", stampUser)
	logManager.WriteParameters(
		sql.Named("KnockoutsCategory", Category),
		sql.Named("KnockoutsID", KnockoutsID),
		sql.Named("KnockoutsRound", KnockoutsRound),
		sql.Named("TeamID1", TeamID1),
		sql.Named("TeamID2", TeamID2),
		sql.Named("MatchDate", MatchDate),
		sql.Named("Results", result),
		sql.Named("Results_State", resultState),
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
		logManager.WriteStatusError("KnockoutID already exist in the same Category")
		return errors.New("KnockoutID already exist in same the Category")
	}
	return nil
}
func UpdateKnockouts(RowID, KnockoutsID, KnockoutsRound, TeamID1, TeamID2 int, Category, MatchDate, result, resultState, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_KNOCKOUTS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("UpdateKnockouts", "Knockouts", stampUser)
	logManager.WriteParameters(
		sql.Named("RowID", RowID),
		sql.Named("KnockoutsCategory", Category),
		sql.Named("KnockoutsID", KnockoutsID),
		sql.Named("KnockoutsRound", KnockoutsRound),
		sql.Named("TeamID1", TeamID1),
		sql.Named("TeamID2", TeamID2),
		sql.Named("MatchDate", MatchDate),
		sql.Named("Results", result),
		sql.Named("Results_State", resultState),
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
func DeleteKnockouts(RowID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_KNOCKOUTS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Knockouts", "Knockouts", stampUser)
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
