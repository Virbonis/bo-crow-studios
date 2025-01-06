package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func GetListScoringOutmatch(dateFrom, dateTo string, sportID int, scoringStatus string, currentPage, pageSize int, stampUser string) ([]model.ListScoringOutright, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SCORING_OUTRIGHT"
	var err error
	var total int
	logManager := logger.LogManager{}
	logManager.StartTask("Get List Scoring Outright", "Scoring Outright", stampUser)
	logManager.WriteParameters(
		sql.Named("FromDate", dateFrom),
		sql.Named("ToDate", dateTo),
		sql.Named("SportID", sportID),
		sql.Named("OutrightScoreStatus", scoringStatus),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("TotalRecords", sql.Out{Dest: &total}),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListScoringOutright{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, total, nil
}

func GetListScoringOutmatchTeam(outrightID, leagueID int, stampUser string) ([]model.ListScoringOutrightTeam, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SCORING_OUTRIGHT_TEAM"
	var err error
	list := []model.ListScoringOutrightTeam{}
	logManager := logger.LogManager{}
	logManager.StartTask("Get List Team Scoring Outright", "Scoring Outright", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightID),
		sql.Named("LeagueID", leagueID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
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

func UpateListScoringOutmatchTeam(outrightID, leagueID int, clubID, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_SCORING_OUTRIGHT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Score", "SCORING OUTRIGHT", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightID),
		sql.Named("LeagueID", leagueID),
		sql.Named("ClubsID", clubID),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightID)
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

func DeleteListScoringOutmatchTeam(outrightID, leagueID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_SCORING_OUTRIGHT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Reset Score", "SCORING OUTRIGHT", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightID),
		sql.Named("LeagueID", leagueID),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightID)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "TourWinner", outrightID, []string{"No_Partai"})
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
