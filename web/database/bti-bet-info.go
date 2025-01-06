package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListBTIBetInfo(ReqDateFrom, ReqDateTo string, IsUsingDate int, RequestID string,
	BetID, UserLogin string, MatchID int, PurchaseID string, ReservationStatus, TransStatus int, stampUser string) ([]model.BTIBetInfo, error) {
	dbName := BTI
	spName := "MGMT_SBA_LIST_GRID_BET_INFO_BTI"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get list bet info BTI", "Bet List Info BTI", stampUser)
	logManager.WriteParameters(
		sql.Named("ReqDateFrom ", ReqDateFrom),
		sql.Named("ReqDateTo ", ReqDateTo),
		sql.Named("IsUsingDate ", IsUsingDate),
		sql.Named("RequestID ", RequestID),
		sql.Named("BetID ", BetID),
		sql.Named("UserLogin ", UserLogin),
		sql.Named("MatchID ", MatchID),
		sql.Named("PurchaseID", PurchaseID),
		sql.Named("ReserveStatus", ReservationStatus),
		sql.Named("TransStatus ", TransStatus),
		sql.Named("StampUser ", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.BTIBetInfo{}
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
