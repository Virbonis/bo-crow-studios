package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func GetMOBetListSummary(matchID int, stampUser string) ([]model.ListBetSummaryFT, []model.ListBetSummaryHT, []model.ListMatrix, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_BET_LIST_SUMMARY"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Get MO Bet List Forecast", "Forecast", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	listFT := []model.ListBetSummaryFT{}
	listHT := []model.ListBetSummaryHT{}
	listMatrix := []model.ListMatrix{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, nil, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &listFT)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &listHT)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &listMatrix)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return listFT, listHT, listMatrix, nil
}

func ResetFTHTScore(matchId, processType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_ONLINELIST_RECALCULATE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Recalculate Forecast", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("ProcessType", processType),
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
