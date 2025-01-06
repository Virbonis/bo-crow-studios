package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListWinlossForCash(glDateFrom, glDateTo, username, branchId string, gameType, sport int, isGetDownline string, currentPage, pageSize int, histOrPost, stampUser string) ([]model.WinlossForCash, *model.WinlossForCashSummary, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_WINLOSS_FOR_CASH"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Winloss For Cash", "Winloss For Cash", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", glDateFrom),
		sql.Named("GLDateTo", glDateTo),
		sql.Named("Username", username),
		sql.Named("BranchID", branchId),
		sql.Named("GameType", gameType),
		sql.Named("Sport", sport),
		sql.Named("IsGetDownline", isGetDownline),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("HistOrPost", histOrPost),
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

	list := []model.WinlossForCash{}
	summary := model.WinlossForCashSummary{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, 0, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, nil, 0, err
	}
	rows.NextResultSet()
	for rows.Next() {
		err = rows.StructScan(&summary)
		if err != nil {
			log.Warnf("[mssql] Failed scanning row: %v", err)
			return nil, nil, 0, err
		}
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, &summary, totalRecords, nil
}
func ListWinlossForCashBetDetail(glDateFrom, glDateTo, username, branchId string, gameType, sport int, orderBy string, currentPage, pageSize int, histOrPost, stampUser string) ([]model.WinlossForCashBetDetail, *model.WinlossForCashBetDetailSummary, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_WINLOSS_FOR_CASH_BET_DETAIL"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Winloss For Cash Detail", "Winloss For Cash", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", glDateFrom),
		sql.Named("GLDateTo", glDateTo),
		sql.Named("Username", username),
		sql.Named("BranchID", branchId),
		sql.Named("GameType", gameType),
		sql.Named("Sport", sport),
		sql.Named("OrderBy", orderBy),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("HistOrPost", histOrPost),
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

	list := []model.WinlossForCashBetDetail{}
	summary := model.WinlossForCashBetDetailSummary{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, 0, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, nil, 0, err
	}
	rows.NextResultSet()
	for rows.Next() {
		err = rows.StructScan(&summary)
		if err != nil {
			log.Warnf("[mssql] Failed scanning row: %v", err)
			return nil, nil, 0, err
		}
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, &summary, totalRecords, nil
}
