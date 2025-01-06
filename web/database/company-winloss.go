package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListCompanyWinloss(dateFrom, dateTo, username, branchID string, currentPageCash, pageSizeCash, currentPageCredit, pageSizeCredit int, histOrPost, stampUser string) ([]model.CompanyWinloss, []model.CompanyWinloss, int, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_COMPANY_WINLOSS"
	var err error
	listCash := []model.CompanyWinloss{}
	listCredit := []model.CompanyWinloss{}
	var totalCash int
	var totalCredit int

	logManager := logger.LogManager{}
	logManager.StartTask("List Company Winloss", "Company Winloss", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", dateFrom),
		sql.Named("GLDateTo", dateTo),
		sql.Named("Username", username),
		sql.Named("BranchID", branchID),
		sql.Named("CurrentPageCash", currentPageCash),
		sql.Named("PageSizeCash", pageSizeCash),
		sql.Named("CurrentPageCredit", currentPageCredit),
		sql.Named("PageSizeCredit", pageSizeCredit),
		sql.Named("HistOrPost", histOrPost),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalRecordsCash", sql.Out{Dest: &totalCash}),
		sql.Named("TotalRecordsCredit", sql.Out{Dest: &totalCredit}),
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
		return nil, nil, 0, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &listCredit)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return listCredit, listCash, 0, 0, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &listCash)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return listCredit, listCash, 0, 0, err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return listCash, listCredit, totalCash, totalCredit, nil
}
func ListCompanyWinlossForeign(dateFrom, dateTo, username, branchID string, currentPageCash, pageSizeCash, currentPageCredit, pageSizeCredit int, histOrPost, stampUser string) ([]model.CompanyWinlossForeign, []model.CompanyWinlossForeign, int, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_COMPANY_WINLOSS_FOREIGN"
	var err error
	listCash := []model.CompanyWinlossForeign{}
	listCredit := []model.CompanyWinlossForeign{}
	var totalCash int
	var totalCredit int

	logManager := logger.LogManager{}
	logManager.StartTask("List Company Winloss Foreign", "Company Winloss", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", dateFrom),
		sql.Named("GLDateTo", dateTo),
		sql.Named("Username", username),
		sql.Named("BranchID", branchID),
		sql.Named("CurrentPageCash", currentPageCash),
		sql.Named("PageSizeCash", pageSizeCash),
		sql.Named("CurrentPageCredit", currentPageCredit),
		sql.Named("PageSizeCredit", pageSizeCredit),
		sql.Named("HistOrPost", histOrPost),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalRecordsCash", sql.Out{Dest: &totalCash}),
		sql.Named("TotalRecordsCredit", sql.Out{Dest: &totalCredit}),
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
		return nil, nil, 0, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &listCredit)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return listCredit, listCash, 0, 0, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &listCash)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return listCredit, listCash, 0, 0, err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return listCash, listCredit, totalCash, totalCredit, nil
}

// detail is shared w/in foreign
func ListCompanyWinlossDetail(dateFrom, dateTo, username, orderBy string, currentPage, pageSize int, histOrPost, stampUser string) ([]model.CompanyWinlossDetail, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_COMPANY_WINLOSS_BET_DETAIL"
	var err error
	list := []model.CompanyWinlossDetail{}
	var total int

	logManager := logger.LogManager{}
	logManager.StartTask("List Company Winloss Detail", "Company Winloss", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", dateFrom),
		sql.Named("GLDateTo", dateTo),
		sql.Named("Username", username),
		sql.Named("OrderBy", orderBy),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("HistOrPost", histOrPost),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalRecords", sql.Out{Dest: &total}),
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
	return list, total, nil
}
