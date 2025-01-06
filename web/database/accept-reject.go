package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListAcceptReject(matchID int, FTHT, gameType, stampUser string) ([]model.AcceptReject, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_ACCEPT_REJECT_AHOU"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Accept Reject", "Accept Reject", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("FTHT", FTHT),
		sql.Named("GameType", gameType),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.AcceptReject{}
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

func UpdateTicketMOByMatch(matchID, voidID int, voidDesc, action, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_TICKET_ACCEPT_REJECT_AHOU_BY_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Ticket By Match", "Accept Reject", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("VoidID", voidID),
		sql.Named("VoidDesc", voidDesc),
		sql.Named("Action", action),
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
	return err
}

func UpdateTicketMO(betIDs string, voidID int, voidDesc, action, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_TICKET_ACCEPT_REJECT_AHOU_SEGAMBRENG"
	var err error
	var result string

	logManager := logger.LogManager{}
	logManager.StartTask("Update Ticket", "Accept Reject", stampUser)
	logManager.WriteParameters(
		sql.Named("BetIDs", betIDs),
		sql.Named("VoidID", voidID),
		sql.Named("VoidDesc", voidDesc),
		sql.Named("Action", action),
		sql.Named("StampUser", stampUser),
		sql.Named("Result", sql.Out{Dest: &result}),
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
	return err
}
func UpdateTicketInstantBet(betIDs string, voidID int, voidDesc, action, stampUser string) (*string, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TICKET_INSTANT_BET_2"
	var err error
	var result string

	logManager := logger.LogManager{}
	logManager.StartTask("Update Ticket Instant Bet", "Accept Reject", stampUser)
	logManager.WriteParameters(
		sql.Named("BetIDs", betIDs),
		sql.Named("VoidID", voidID),
		sql.Named("VoidDesc", voidDesc),
		sql.Named("Action", action),
		sql.Named("StampUser", stampUser),
		sql.Named("Result", sql.Out{Dest: &result}),
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
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return &result, err
}

func ListAcceptRejectView(matchID int, FTHT string, display int, pending, stampUser string) ([]model.AcceptRejectView, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MOV_ACCEPT_REJECT_AHOU"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Accept Reject", "Accept Reject", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("FTHT", FTHT),
		sql.Named("Display", display),
		sql.Named("Pending", pending),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.AcceptRejectView{}
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
