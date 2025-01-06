package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListMappingLeague(websiteName string, sportID int, ibcLeagueName, ourLeagueName, unmapped string, currentPage, pageSize int, stampUser string) ([]model.MappingLeague, int, error) {
	dbName := SoccerBot
	spName := "MGMT_SBA_LIST_GRID_MAPPING_IBC_LEAGUE"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Mapping League", "MAPPING LEAGUE", stampUser)
	logManager.WriteParameters(
		sql.Named("WebsiteName", websiteName),
		sql.Named("SportID", sportID),
		sql.Named("IBCLeagueName", ibcLeagueName),
		sql.Named("OurLeagueName", ourLeagueName),
		sql.Named("Unmapped", unmapped),
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

	list := []model.MappingLeague{}
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

func UpdateMappingLeague(ibcLeagueID, ourLeagueID int, stampUser string) error {
	dbName := SoccerBot
	spName := "MGMT_SBA_PROC_UPD_MAPPING_IBC_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Mapping League", "MAPPING LEAGUE", stampUser)
	logManager.WriteParameters(
		sql.Named("IBCLeagueID", ibcLeagueID),
		sql.Named("OurLeagueID", ourLeagueID),
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
		log.Warnf("[mssql] Failed executing stored procedure UpdateOutright : %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
