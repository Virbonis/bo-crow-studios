package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListReportCashFlowTracker(dateFrom, dateTo, username string, refNo, affairID int, branchID string, histOrPost, stampUser string) ([]model.CashFlowTracker, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_CASH_FLOW_TRACKER"
	var err error
	list := []model.CashFlowTracker{}
	logManager := logger.LogManager{}
	logManager.StartTask("List Cash Flow Tracker", "Cash Flow Tracker", stampUser)
	logManager.WriteParameters(
		sql.Named("TrackDateFrom", dateFrom),
		sql.Named("TrackDateTo", dateTo),
		sql.Named("Username", username),
		sql.Named("RefNo", refNo),
		sql.Named("AffairID", affairID),
		sql.Named("BranchID", branchID),
		sql.Named("HistOrPost", histOrPost),
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
