package database

import (
	"database/sql"
	"fmt"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListSelectProfile1X2(stampUser string) ([]string, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_1X2PROFILE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Select Profile1X2", "Master 1X2PROFILE", stampUser)
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

	list := []string{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var profileID string
		err := rows.Scan(
			&profileID,
		)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, profileID)
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func ListProfile1X2HDP(stampUser string) ([]string, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_HDP_MASTER_1X2PROFILE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Profile 1X2HDP", "Master 1X2PROFILE", stampUser)
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
	var list []string
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var profileID string
		err := rows.Scan(
			&profileID,
		)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, profileID)
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func ListProfile1X2(profileID string, gameType int, hdp float32, stampUser string) ([]model.Profile1x2, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_1X2PROFILE"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Profile1X2", "Master 1X2PROFILE", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
		sql.Named("GameType", gameType),
		sql.Named("HDP", hdp),
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

	list := []model.Profile1x2{}
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

func CreateProfile1X2(profileID, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MASTER_1X2PROFILE"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Insert 1X2 Profile", "Master 1X2PROFILE", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
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

	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if rs <= 0 {
		logManager.WriteStatusError("Unable Insert 1X2 Profile already exist")
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}

func UpdateProfile1X2(rowId, gameType int, profileID, stampUser string, hdp, oddsHdp, oddsFav, oddsDraw, odds5, odds6, odds7, odds8, odds9, odds10, odds12, odds15, odds18, odds20, odds24 float32) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_1X2Profile"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update 1X2 Profile", "Master 1X2PROFILE", stampUser)
	logManager.WriteParameters(
		sql.Named("RowID", rowId),
		sql.Named("ProfileID", profileID),
		sql.Named("GameType", gameType),
		sql.Named("HDP", hdp),
		sql.Named("OddsHDP", oddsHdp),
		sql.Named("OddsFav", oddsFav),
		sql.Named("OddsDraw", oddsDraw),
		sql.Named("Odds5", odds5),
		sql.Named("Odds8", odds8),
		sql.Named("Odds10", odds10),
		sql.Named("Odds12", odds12),
		sql.Named("Odds15", odds15),
		sql.Named("Odds18", odds18),
		sql.Named("Odds20", odds20),
		sql.Named("Odds24", odds24),
		sql.Named("Odds6", odds6),
		sql.Named("Odds7", odds7),
		sql.Named("Odds9", odds9),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Ms1x2Profile",
		fmt.Sprintf("%v,%v,%v,%v", profileID, gameType, hdp, oddsHdp),
		[]string{"RowID", "LimitID1x2", "GameType", "HDP", "OddsHDP", "OddsFav", "OddsDraw", "Odds5", "Odds6", "Odds7", "Odds8", "Odds9", "Odds10", "Odds12", "Odds15", "Odds18", "Odds20", "Odds24"})
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
