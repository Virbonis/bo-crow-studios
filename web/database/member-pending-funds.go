package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListMemberPendingFunds(branch, currency, lang, baseCurr string, page, display int, stampUser string) ([]model.PendingFund, *model.PendingFund, int, error) {
	dbName := Inetsoccer_Post
	spName := "MGMT_SBA_RPT_TOTAL_PENDING"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Member Pending Funds", "MEMBER PENDING FUNDS", stampUser)
	logManager.WriteParameters(
		sql.Named("Branch", branch),
		sql.Named("Currency", currency),
		sql.Named("Lang", lang),
		sql.Named("BaseCurr", baseCurr),
		sql.Named("Page", page),
		sql.Named("Display", display),
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

	list := []model.PendingFund{}
	summary := model.PendingFund{}
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

func ListPFDailyStatement(from, to, userName, stampUser string) ([]model.PFDailyStatement, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_CUST_DAILY_STATEMENT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List PF Daily Statement", "MEMBER PENDING FUNDS", stampUser)
	logManager.WriteParameters(
		sql.Named("From", from),
		sql.Named("To", to),
		sql.Named("UserName", userName),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.PFDailyStatement{}

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
func ListPFBetSummary(from, to, userName, branch, currency, lang, baseCurr, stampUser string) ([]model.PFBetSummary, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_TRANS_CUST_BET_SUMMARY"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List PF Bet Summary", "MEMBER PENDING FUNDS", stampUser)
	logManager.WriteParameters(
		sql.Named("From", from),
		sql.Named("To", to),
		sql.Named("UserName", userName),
		sql.Named("Branch", branch),
		sql.Named("Currency", currency),
		sql.Named("Lang ", lang),
		sql.Named("BaseCurr", baseCurr),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.PFBetSummary{}

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
func ListPFBetList(from, to, userName, branch, currency, lang, baseCurr string, reportType int, stampUser string) ([]model.PFBetList, error) {
	dbName := Inetsoccer_Post
	spName := "MGMT_SBA_RPT_TRANS_CUST_BET_LIST"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List PF BetList", "MEMBER PENDING FUNDS", stampUser)
	logManager.WriteParameters(
		sql.Named("From", from),
		sql.Named("To", to),
		sql.Named("UserName", userName),
		sql.Named("Branch", branch),
		sql.Named("Currency", currency),
		sql.Named("Lang ", lang),
		sql.Named("BaseCurr", baseCurr),
		sql.Named("ReportType", reportType),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.PFBetList{}

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
func ListPFBetListRunning(username, branch, currency, lang, baseCurr, stampUser string) ([]model.PFBetListRunning, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_TRANS_CUST_OUTSTANDING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List PF BetList Running", "MEMBER PENDING FUNDS", stampUser)
	logManager.WriteParameters(
		sql.Named("UserName", username),
		sql.Named("Branch", branch),
		sql.Named("Currency", currency),
		sql.Named("Lang ", lang),
		sql.Named("BaseCurr", baseCurr),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.PFBetListRunning{}

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
