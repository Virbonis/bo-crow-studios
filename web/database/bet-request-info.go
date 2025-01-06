package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func GetListBetRequestInfo(dateFrom, dateTo, isUsingDate string, userLogin, requestID string, matchID int, ticketID, betStatus, betConfirm, payoutStatus, payoutConfirm, unProcessStatus, unProcessConfirm, stampUser string) ([]model.ListBetRequestInfo, error) {

	dbName := Inetsoccer
	spName := "MGMTS_SBA_LIST_GRID_BETREQUEST_INFO"
	var err error

	list := []model.ListBetRequestInfo{}

	logManager := logger.LogManager{}
	logManager.StartTask("Get List Bet Request Info", "Bet Request Info", stampUser)
	logManager.WriteParameters(
		sql.Named("DateFrom", dateFrom),
		sql.Named("DateTo", dateTo),
		sql.Named("IsUsingDate", isUsingDate),
		sql.Named("UserLogin", userLogin),
		sql.Named("RequestID", requestID),
		sql.Named("MatchID", matchID),
		sql.Named("TicketID", ticketID),
		sql.Named("StampUser", stampUser),
		sql.Named("BetStatus", betStatus),
		sql.Named("BetConfirm", betConfirm),
		sql.Named("PayoutStatus", payoutStatus),
		sql.Named("PayoutConfirm", payoutConfirm),
		sql.Named("UnProcessStatus", unProcessStatus),
		sql.Named("UnProcessConfirm", unProcessConfirm),
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
