package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListBTIPayoutTracker(BetID int, PurchaseID string, stampUser string) ([]model.BTIPayoutTracker, error) {
	dbName := BTI
	spName := "MGMT_SBA_LIST_GRID_PAYOUT_TRACKER_BTI"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get List Payout Tracker BTI", "Payout Tracker BTI", stampUser)
	logManager.WriteParameters(
		sql.Named("BetID", BetID),
		sql.Named("PurchaseID", PurchaseID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BTIPayoutTracker{}
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
