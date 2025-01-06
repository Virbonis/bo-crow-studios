package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListMatchProfile(dateFrom, dateTo string, matchId, sportId, leagueId int, profileId, teamName, orderBy string, currentPage, pageSize int, stampUser string) ([]model.MatchProfile, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_PROFILE"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Scoring Match", "Match List Grid Scoring Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", dateFrom),
		sql.Named("MatchDateTo", dateTo),
		sql.Named("MatchID", matchId),
		sql.Named("SportID", sportId),
		sql.Named("LeagueID", leagueId),
		sql.Named("ProfileID", profileId),
		sql.Named("TeamName", teamName),
		sql.Named("OrderBy", orderBy),
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

	list := []model.MatchProfile{}
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
func UpdateMatchProfile(matchIDs string, profileID, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MATCH_PROFILE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Profile", "MATCH PROFILE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchIDs", matchIDs),
		sql.Named("ProfileID", profileID),
		sql.Named("StampUser", stampUser),
	)
	// logManager.PrepareAudit(sqlConnections.conn[dbName], "Partai", "No_Partai in (" + matchIDs + ")", []string{"LimitID"}) // TODO: Audit where clause
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
