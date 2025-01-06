package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListMappingTeam(websiteName string, sportID int, ibcTeamName, ourTeamName, unmapped string, currentPage, pageSize int, stampUser string) ([]model.GridMappingTeam, int, error) {
	dbName := SoccerBot
	spName := "MGMT_SBA_LIST_GRID_MAPPING_IBC_TEAM"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Mapping Team", "MAPPING TEAM", stampUser)
	logManager.WriteParameters(
		sql.Named("WebsiteName", websiteName),
		sql.Named("SportID", sportID),
		sql.Named("IBCTeamName", ibcTeamName),
		sql.Named("OurTeamName", ourTeamName),
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

	list := []model.GridMappingTeam{}
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

func UpdateMappingTeam(ibcTeamID, ourTeamID int, stampUser string) error {
	dbName := SoccerBot
	spName := "MGMT_SBA_PROC_UPD_MAPPING_IBC_TEAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Mapping Team", "MAPPING TEAM LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("IBCTeamID", ibcTeamID),
		sql.Named("OurTeamID", ourTeamID),
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
		log.Warnf("[mssql] Failed executing stored procedure UpdateMappingTeam : %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
