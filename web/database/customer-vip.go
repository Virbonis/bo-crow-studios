package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListCustomerVIP(branchId string, vipCode int, orderBy string, currentPage, pageSize int, logDate, stampUser string) ([]model.CustomerVIP, []model.CustomerVIPSummary, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_CUSTOMER_VIP"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Customer VIP", "Customer VIP", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchID", branchId),
		sql.Named("VIPCode", vipCode),
		sql.Named("OrderBy", orderBy),
		sql.Named("LogDate", logDate),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
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

	list := []model.CustomerVIP{}
	listVIP := []model.CustomerVIPSummary{}
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
	err = sqlx.StructScan(rows, &listVIP)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, listVIP, totalRecords, nil
}

func ListCustomerVIPCompliance(fromDate, toDate, branchId string, vipCode int, orderBy string, currentPage, pageSize int, stampUser string) ([]model.CustomerVIPCompliance, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_CUSTOMER_VIP_COMPLI"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Customer VIP Compliance", "Customer VIP Compliance", stampUser)
	logManager.WriteParameters(
		sql.Named("FromDate", fromDate),
		sql.Named("ToDate", toDate),
		sql.Named("BranchID", branchId),
		sql.Named("VIPCode", vipCode),
		sql.Named("OrderBy", orderBy),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
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

	list := []model.CustomerVIPCompliance{}
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

// func ListVIPCode(stampUser string) []int {
// 	result := []int{}
// 	dbName := Inetsoccer
// 	spName := "MGMT_SBA_LIST_CUSTOMER_VIP_CODE"
// 	var err error

// 	logManager := logger.LogManager{}
// 	logManager.StartTask("List VIP Code", "Customer VIP", stampUser)
// 	logManager.WriteParameters(
// 		sql.Named("StampUser", stampUser),
// 	)
// 	defer func() {
// 		if err != nil {
// 			logManager.WriteStatusError(err.Error())
// 			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
// 		}
// 		go logManager.EndTask()
// 	}()
// 	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
// 	if err != nil {
// 		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
// 		return nil
// 	}

// 	for rows.Next() {
// 		var temp int

// 		err = rows.Scan(&temp)
// 		if err != nil {
// 			log.Warnf("[mssql] Failed reading rows: %v", err)
// 			return nil
// 		}
// 		result = append(result, temp)
// 	}

// 	if sqlConnections.Verbose {
// 		log.Debugf("[mssql] EXEC %v", spName)
// 	}
// 	return result
// }
