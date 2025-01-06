package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListMatchLiveStream(sportId int, dateFrom, dateTo *string, currentPage, pageSize int, stampUser string) ([]model.GridMatchLiveStream, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_LIVESTREAM"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Scoring Match", "Match Live Stream", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportId),
		sql.Named("DateFrom", dateFrom),
		sql.Named("DateTo", dateTo),
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

	list := []model.GridMatchLiveStream{}
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

func UpdateMatchLiveStream(matchId int, stLiveStream, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MATCH_LIVESTREAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Live Stream", "Match Live Stream", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("ST_LiveStream", stLiveStream),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(matchId)
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
