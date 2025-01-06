package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListCustomerBuyback(customerId, customerLevel, username, currency string, companyId int, customerTreeGetDownline string, currentPage, pageSize int, stampUser string) ([]model.CustomerBuybackList, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_CUSTOMER_BUYBACK"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Customer", "CUSTOMER LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerId),
		sql.Named("CustomerLevel", customerLevel),
		sql.Named("CompanyID", companyId),
		sql.Named("Username", username),
		sql.Named("Currency", currency),
		sql.Named("CustomerTreeGetDownline", customerTreeGetDownline),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		sql.Named("StampUser", stampUser),
	)

	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.CustomerBuybackList{}
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
	return list, totalRecords, nil
}

func ListUplineCustomerBuyBack(stampUser string) ([]model.UplineCustomerBuyBack, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_UPLINE_CUSTOMER_BUYBACK"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Upline Customer ", "CUSTOMER BUYBACK", stampUser)
	logManager.WriteParameters(
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.UplineCustomerBuyBack{}
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

func UpdateCustomerBuyback(customerID int, commPct, commPctOthers, ptShare float64, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_CUSTOMER_BUYBACK"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Customer Buyback", "CUSTOMER BUYBACK", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerID),
		sql.Named("CommPct", commPct),
		sql.Named("CommPctOthers", commPctOthers),
		sql.Named("PTShare", ptShare),
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

func CreateCustomerBuyback(username string, customerUplineID int, commPct, commPctOthers, ptShare float64, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_CUSTOMER_BUYBACK"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Create Customer Buyback", "CUSTOMER BUYBACK", stampUser)
	logManager.WriteParameters(
		sql.Named("Username", username),
		sql.Named("CustomerUplineID", customerUplineID),
		sql.Named("CommPct", commPct),
		sql.Named("CommPctOthers", commPctOthers),
		sql.Named("PTShare", ptShare),
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

// func ListCustomerVIPLog(customerId, stampUser string) ([]model.CustomerVIPLog, error) {
// 	dbName := Inetsoccer_Log
// 	spName := "MGMT_SBA_LIST_GRID_CUSTOMER_VIP_LOG"
// 	var err error

// 	logManager := logger.LogManager{}
// 	logManager.StartTask("List Customer VIP Log", "CUSTOMER LIST", stampUser)
// 	logManager.WriteParameters(
// 		sql.Named("CustomerID", customerId),
// 		sql.Named("StampUser", stampUser),
// 	)
// 	defer func() {
// 		if err != nil {
// 			logManager.WriteStatusError(err.Error())
// 			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
// 		}
// 		go logManager.EndTask()
// 	}()

// 	list := []model.CustomerVIPLog{}
// 	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
// 	if err != nil {
// 		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	for rows.Next() {
// 		model := model.CustomerVIPLog{}
// 		err := rows.Scan(
// 			&model.VIPCode,
// 			&model.DefaultValue,
// 			&model.DefaultValue2,
// 			&model.Status,
// 			&model.StampDate,
// 			&model.StampUser,
// 		)
// 		if err != nil {
// 			log.Warnf("[mssql] Failed reading rows: %v", err)
// 			return nil, err
// 		}
// 		list = append(list, model)
// 	}

// 	if sqlConnections.Verbose {
// 		log.Debugf("[mssql] EXEC %v", spName)
// 	}
// 	return list, nil
// }

// func ListUplineCustomer(customerId, stampUser string) ([]model.UplineCustomer, error) {
// 	dbName := Inetsoccer
// 	spName := "MGMT_SBA_LIST_UPLINE_CUSTOMER"
// 	var err error

// 	logManager := logger.LogManager{}
// 	logManager.StartTask("List Upline Customer", "CUSTOMER LIST", stampUser)
// 	logManager.WriteParameters(
// 		sql.Named("CustomerID", customerId),
// 		sql.Named("StampUser", stampUser),
// 	)
// 	defer func() {
// 		if err != nil {
// 			logManager.WriteStatusError(err.Error())
// 			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
// 		}
// 		go logManager.EndTask()
// 	}()

// 	list := []model.UplineCustomer{}
// 	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
// 	if err != nil {
// 		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	for rows.Next() {
// 		model := model.UplineCustomer{}
// 		err := rows.Scan(
// 			&model.CustomerID,
// 			&model.CustomerTree,
// 			&model.Username,
// 		)
// 		if err != nil {
// 			log.Warnf("[mssql] Failed reading rows: %v", err)
// 			return nil, err
// 		}
// 		list = append(list, model)
// 	}

// 	if sqlConnections.Verbose {
// 		log.Debugf("[mssql] EXEC %v", spName)
// 	}
// 	return list, nil
// }

// func GetEditCustomer(customerId, stampUser string) (*model.EditCustomerMain, []model.EditCustomerVIP, []model.EditCustomerUpline, error) {
// 	dbName := Inetsoccer
// 	spName := "MGMT_SBA_GET_UPD_CUSTOMER"
// 	var err error

// 	logManager := logger.LogManager{}
// 	logManager.StartTask("Get Edit Customer", "EDIT CUSTOMER", stampUser)
// 	logManager.WriteParameters(
// 		sql.Named("CustomerID", customerId),
// 		sql.Named("StampUser", stampUser),
// 	)
// 	defer func() {
// 		if err != nil {
// 			logManager.WriteStatusError(err.Error())
// 			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
// 		}
// 		go logManager.EndTask()
// 	}()

// 	main := model.EditCustomerMain{}
// 	listVIP := []model.EditCustomerVIP{}
// 	listUpline := []model.EditCustomerUpline{}
// 	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
// 	if err != nil {
// 		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
// 		return nil, nil, nil, err
// 	}
// 	defer rows.Close()

// 	for rows.Next() {
// 		err = rows.Scan(
// 			&main.CustomerID,
// 			&main.Username,
// 			&main.AliasName,
// 			&main.Currency,
// 			&main.IsCustomerHasDownline,
// 			&main.CustomerType,
// 			&main.CustomerLevel,
// 			&main.CustomerSuspend_Status,
// 			&main.CustomerActive_Status,
// 			&main.CustomerBetLimitFactor,
// 			&main.CashCategoryID,
// 			&main.SmartPunterLevel,
// 			&main.OddsGroup,
// 			&main.MinBet,
// 			&main.MaxBet,
// 			&main.MatchLimit,
// 			&main.CreditLimit,
// 			&main.UsedCreditLimit,
// 		)
// 		if err != nil {
// 			log.Warnf("[mssql] Failed reading rows: %v", err)
// 			return nil, nil, nil, err
// 		}
// 	}

// 	rows.NextResultSet()
// 	for rows.Next() {
// 		model := model.EditCustomerVIP{}
// 		err := rows.Scan(
// 			&model.VIPCode,
// 			&model.VIPDescription,
// 			&model.OnVIP,
// 			&model.Value1,
// 			&model.IsShowValue,
// 			&model.Value2,
// 			&model.IsShowValue2,
// 		)
// 		if err != nil {
// 			log.Warnf("[mssql] Failed reading rows: %v", err)
// 			return nil, nil, nil, err
// 		}
// 		listVIP = append(listVIP, model)
// 	}

// 	rows.NextResultSet()
// 	for rows.Next() {
// 		model := model.EditCustomerUpline{}
// 		err := rows.Scan(
// 			&model.CustomerID,
// 			&model.Username,
// 			&model.CustomerLevel,
// 			&model.VIPCode,
// 			&model.Value1,
// 			&model.Value2,
// 		)
// 		if err != nil {
// 			log.Warnf("[mssql] Failed reading rows: %v", err)
// 			return nil, nil, nil, err
// 		}
// 		listUpline = append(listUpline, model)
// 	}

// 	if sqlConnections.Verbose {
// 		log.Debugf("[mssql] EXEC %v", spName)
// 	}

// 	return &main, listVIP, listUpline, nil
// }

// func UpdateCustomer(customerId, currency, customerActiveStatus string, customerBetLimitFactor float64, cashCategoryId string, smartPunterLevel, oddsGroup, minBet, maxBet, matchLimit, creditLimit int, vip, customerSuspendStatus string, stampUser string) error {
// 	dbName := Inetsoccer
// 	spName := "MGMT_SBA_PROC_UPD_CUSTOMER"
// 	var err error

// 	logManager := logger.LogManager{}
// 	logManager.StartTask("Update Customer", "EDIT CUSTOMER", stampUser)
// 	logManager.WriteParameters(
// 		sql.Named("CustomerID", customerId),
// 		sql.Named("Currency", currency),
// 		sql.Named("CustomerActiveStatus", customerActiveStatus),
// 		sql.Named("CustomerBetLimitFactor", customerBetLimitFactor),
// 		sql.Named("CashCategoryID", cashCategoryId),
// 		sql.Named("SmartPunterLevel", smartPunterLevel),
// 		sql.Named("OddsGroup", oddsGroup),
// 		sql.Named("MinBet", minBet),
// 		sql.Named("MaxBet", maxBet),
// 		sql.Named("MatchLimit", matchLimit),
// 		sql.Named("CreditLimit", creditLimit),
// 		sql.Named("VIP", vip),
// 		sql.Named("CustomerSuspendStatus", customerSuspendStatus),
// 		sql.Named("StampUser", stampUser),
// 	)
// 	defer func() {
// 		if err != nil {
// 			logManager.WriteStatusError(err.Error())
// 			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
// 		}
// 		go logManager.EndTask()
// 	}()

// 	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)
// 	if err != nil {
// 		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
// 		return err
// 	}

// 	if sqlConnections.Verbose {
// 		log.Debugf("[mssql] EXEC %v", spName)
// 	}
// 	return err
// }
