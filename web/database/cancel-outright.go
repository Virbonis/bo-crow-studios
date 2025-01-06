package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListCancelOutright(outrightId int, fromDate, toDate string, sportId int, outrightScoreStatus string, currentPage, pageSize int, stampUser string) ([]model.GridCancelOutright, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_CANCEL_OUTRIGHT"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Cancel Outright", "Cancel Outright", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightId),
		sql.Named("FromDate", fromDate),
		sql.Named("ToDate", toDate),
		sql.Named("SportID", sportId),
		sql.Named("OutrightScoreStatus", outrightScoreStatus),
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

	list := []model.GridCancelOutright{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return list, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, totalRecords, nil
}

func UpdateCancelOutright(outrightId, voidId int, voidReason, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_CANCEL_OUTRIGHT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update", "CANCEL OUTRIGHT", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightId),
		sql.Named("VoidID", voidId),
		sql.Named("VoidReason", voidReason),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightId)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "TourWinner", outrightId, []string{})
	logManager.PrepareAudit(sqlConnections.conn[dbName], "TourWinnerStatus", outrightId, []string{"Void_ID", "Void_User", "Void_Desc"})
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

func ListCancelOutrightTeam(outrightId int, stampUser string) ([]model.GridCancelOutrightTeam, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_TEAM_CANCEL_OUTRIGHT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Cancel Outright Team", "Cancel Outright", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.GridCancelOutrightTeam{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return list, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func UpdateCancelOutrightTeam(outrightId, noSequence, voidId int, voidReason, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_CANCEL_OUTRIGHT_TEAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update", "CANCEL OUTRIGHT TEAM", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightId),
		sql.Named("NoSequence", noSequence),
		sql.Named("Void_ID", voidId),
		sql.Named("VoidReason", voidReason),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightId)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "TourTeam", outrightId, []string{"Void_ID", "Void_User", "Void_Desc"})
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
