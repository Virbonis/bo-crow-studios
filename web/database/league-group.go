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

func ListLeagueGroup(stampUser string, sportId int) ([]model.MasterLeagueGroup, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_LEAGUE_GROUP"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Group", "Master League Group", stampUser)
	logManager.WriteParameters(
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

	list := []model.MasterLeagueGroup{}
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

func CreateLeagueGroup(sportId int, stampUser, leagueGroup string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MASTER_LEAGUE_GROUP"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Insert League Group", "Master League Group", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportId),
		sql.Named("LeagueGroup", leagueGroup),
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

	if int(rs) == -1 {
		logManager.WriteStatusError("League Group Already Exist !")
		return errors.New("League Group Already Exist !")
	}
	return err
}

func DeleteMasterLeagueGroup(sportId int, stampUser, leagueGroup string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_MASTER_LEAGUE_GROUP"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete League Group", "Master League Group", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportId),
		sql.Named("LeagueGroup", leagueGroup),
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
	return err
}
