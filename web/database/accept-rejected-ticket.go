package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListAcceptRejectedTicket(FromBetDate, ToBetDate, FromBetID, ToBetID, MatchID string, CurrentPage, PageSize int, stampUser string) ([]model.AcceptRejectedTicket, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_ACCEPT_REJECTED_TICKET"
	var err error
	var totalRec int
	list := []model.AcceptRejectedTicket{}

	logManager := logger.LogManager{}
	logManager.StartTask("List Accept Rejected Ticket", "Accept Rejected Ticket", stampUser)
	logManager.WriteParameters(
		sql.Named("FromBetDate", FromBetDate),
		sql.Named("ToBetDate", ToBetDate),
		sql.Named("FromBetID", FromBetID),
		sql.Named("ToBetID", ToBetID),
		sql.Named("MatchID", MatchID),
		sql.Named("CurrentPage", CurrentPage),
		sql.Named("PageSize", PageSize),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRec}),
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
	return list, totalRec, nil
}

func UpdAcceptRejectedTicket(BetID, MatchID, ReasonID int, Reason, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_REJECTED_TICKET"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Rejected Ticket", "Accept Rejected Ticket", stampUser)
	logManager.WriteParameters(
		sql.Named("BetID", BetID),
		sql.Named("MatchID", MatchID),
		sql.Named("ReasonID", ReasonID),
		sql.Named("Reason", Reason),
		sql.Named("StampUser", stampUser),
	)
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
	return nil
}
