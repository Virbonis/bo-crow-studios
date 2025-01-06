package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListPayoutTracker(dateFrom, dateTo string, isSettlementDate bool, ticketID int, memberID, stampUser string) ([]model.GridPayoutTracker, error) {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_LIST_GRID_PAYOUT_DETAIL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Payout Tracker", "PAYOUT TRACKER", stampUser)
	logManager.WriteParameters(
		sql.Named("DateFrom", dateFrom),
		sql.Named("DateTo", dateTo),
		sql.Named("IsSettlementDate", isSettlementDate),
		sql.Named("TicketID", ticketID),
		sql.Named("MemberID", memberID),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.GridPayoutTracker{}

	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

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
