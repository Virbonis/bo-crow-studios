package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListFundTransfer(fromDate, toDate, username, branchId, currency string, currentPage, pageSize int, sortBy, ascDesc, stampUser string) ([]model.FundTransfer, *model.FundTransferSummary, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_FUNDTRANSFER"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Fund Transfer", "FUND TRANSFER", stampUser)
	logManager.WriteParameters(
		sql.Named("FromDate", fromDate),
		sql.Named("ToDate", toDate),
		sql.Named("Username", username),
		sql.Named("BranchID", branchId),
		sql.Named("Currency", currency),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("SortBy", sortBy),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		sql.Named("AscDesc", ascDesc),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.FundTransfer{}
	summary := model.FundTransferSummary{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, 0, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, 0, err
	}

	rows.NextResultSet()
	for rows.Next() {
		err = rows.StructScan(&summary)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, nil, 0, err
		}
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, &summary, totalRecords, nil
}

func ListFundTransferDetail(fromDate, toDate, username, stampUser string) ([]model.FundTransferDetail, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_FUNDTRANSFER_DETAIL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Fund Transfer", "FUND TRANSFER", stampUser)
	logManager.WriteParameters(
		sql.Named("FromDate", fromDate),
		sql.Named("ToDate", toDate),
		sql.Named("Username", username),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.FundTransferDetail{}
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
