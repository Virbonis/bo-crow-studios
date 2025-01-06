package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListSummaryTotalBetAccount(dateFrom, dateTo string, stampUser string) ([]model.SummaryBetAccount, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_SUMMARY_TOTAL_BET_ACCOUNT"
	var err error
	var totalPlayer int

	logManager := logger.LogManager{}
	logManager.StartTask("Report Total Bet Account", "REPORT TOTAL BET ACCOUNT", stampUser)
	logManager.WriteParameters(
		sql.Named("DateFrom", dateFrom),
		sql.Named("DateTo", dateTo),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalPlayer", sql.Out{Dest: &totalPlayer}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.SummaryBetAccount{}
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
	return list, totalPlayer, nil
}
