package database

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListVoidTicket(fromBetDate, toBetDate string, fromBetID, toBetID string, gameType int, betStatus string, matchID, betAmt int, username, switchtoMatchDate, orderBy string, currentPage, pageSize, sportID int, branchID, voidUser, voidType, stampUser string) ([]model.VoidTicketList, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_VOID_TICKET"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Void Ticket", "VOID TICKET", stampUser)
	logManager.WriteParameters(
		sql.Named("FromBetDate", fromBetDate),
		sql.Named("ToBetDate", toBetDate),
		sql.Named("FromBetID", fromBetID),
		sql.Named("ToBetID", toBetID),
		sql.Named("GameType", gameType),
		sql.Named("BetStatus", betStatus),
		sql.Named("MatchID", matchID),
		sql.Named("BetAmt", betAmt),
		sql.Named("Username", username),
		sql.Named("SwitchtoMatchDate", switchtoMatchDate),
		sql.Named("OrderBy", orderBy),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("SportID", sportID),
		sql.Named("BranchID", branchID),
		sql.Named("VoidUser", voidUser),
		sql.Named("VoidType", voidType),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.VoidTicketList{}
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
	return list, totalRecords, nil
}

func UpdateVoidTicket(betIDs, cancelType string, voidID int, voidDesc, voidType, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TICKET_VOID_TICKET"
	var err error
	var result string

	logManager := logger.LogManager{}
	logManager.StartTask("Update Void Ticket", "VOID TICKET", stampUser)
	logManager.WriteParameters(
		sql.Named("BetIDs", betIDs),
		sql.Named("CancelType", cancelType),
		sql.Named("VoidID", voidID),
		sql.Named("VoidDesc", voidDesc),
		sql.Named("VoidType", voidType),
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
	if result != "" {
		var errMessage string
		for _, s := range strings.Split(result, ",") {
			val := strings.Split(s, "^")
			errMessage += val[0] + " - " + val[2] + "\n"
		}
		return errors.New(fmt.Sprintf("Ticket : \n%v", errMessage))
	}
	return err
}
