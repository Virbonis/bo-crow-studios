package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListMappingBB(matchDateFrom, matchDateTo string, matchID, sportID, leagueID, currentPage, pageSize int, stampUser string) ([]model.MappingBB, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MAPPING_MATCH_BETBUILDER"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Mapping BB", "Mapping BB", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("MatchID", matchID),
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		sql.Named("StampUser", stampUser),
	)

	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MappingBB{}
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

func UpdateMappingBB(bbStatus string, matchID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_BETBUILDER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update", "Mapping BB", stampUser)
	logManager.WriteParameters(
		sql.Named("BB_Status", bbStatus),
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(matchID)
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
