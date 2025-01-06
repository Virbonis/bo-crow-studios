package database

import (
	"database/sql"
	"errors"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListCustomerList(customerId, customerType, customerLevel, branchId, username, currency string, cashBalance int,
	joinDateFrom, joinDateTo *string, customerActiveStatus, limitProfileId string, smartPunterLevel int, customerTreeGetDownline string, currentPage, pageSize int, stampUser string) ([]model.CustomerList, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_CUSTOMER"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Customer", "CUSTOMER LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerId),
		sql.Named("CustomerType", customerType),
		sql.Named("CustomerLevel", customerLevel),
		sql.Named("BranchID", branchId),
		sql.Named("Username", username),
		sql.Named("Currency", currency),
		sql.Named("CashBalance", cashBalance),
		sql.Named("JoinDateFrom", joinDateFrom),
		sql.Named("JoinDateTo", joinDateTo),
		sql.Named("CustomerActiveStatus", customerActiveStatus),
		sql.Named("LimitProfileID", limitProfileId),
		sql.Named("SmartPunterLevel", smartPunterLevel),
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

	list := []model.CustomerList{}
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

func ExportCustomerList(customerId, customerType, customerLevel, branchId, username, currency string, cashBalance int,
	joinDateFrom, joinDateTo *string, customerActiveStatus, limitProfileId string, smartPunterLevel int, customerTreeGetDownline string, stampUser string) ([]model.CustomerList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_CUSTOMER_EXPORT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Customer", "CUSTOMER LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerId),
		sql.Named("CustomerType", customerType),
		sql.Named("CustomerLevel", customerLevel),
		sql.Named("BranchID", branchId),
		sql.Named("Username", username),
		sql.Named("Currency", currency),
		sql.Named("CashBalance", cashBalance),
		sql.Named("JoinDateFrom", joinDateFrom),
		sql.Named("JoinDateTo", joinDateTo),
		sql.Named("CustomerActiveStatus", customerActiveStatus),
		sql.Named("LimitProfileID", limitProfileId),
		sql.Named("SmartPunterLevel", smartPunterLevel),
		sql.Named("CustomerTreeGetDownline", customerTreeGetDownline),
		sql.Named("StampUser", stampUser),
	)

	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.CustomerList{}
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

func ListCustomerBetLimitLog(customerId, stampUser string) ([]model.CustomerBetLimitLog, error) {
	dbName := Inetsoccer_Log
	spName := "MGMT_SBA_LIST_GRID_CUSTOMER_BET_LIMIT_LOG"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Customer Bet Limit Log", "CUSTOMER LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.CustomerBetLimitLog{}
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

func ListCustomerVIPLog(customerId, stampUser string) ([]model.CustomerVIPLog, error) {
	dbName := Inetsoccer_Log
	spName := "MGMT_SBA_LIST_GRID_CUSTOMER_VIP_LOG"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Customer VIP Log", "CUSTOMER LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.CustomerVIPLog{}
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

func ListUplineCustomer(customerId, stampUser string) ([]model.UplineCustomer, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_UPLINE_CUSTOMER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Upline Customer", "CUSTOMER LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.UplineCustomer{}
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

func UpdateResetPasswordCustomer(customerID, password, customerName, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_RESET_PASSWORD_CUSTOMER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Reset Password Customer", "CUSTOMER LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerID),
		sql.Named("Password", password),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[SecureUserID], "User_ID", customerName, []string{"Password", "Date_Expired", "Login_fail"})
	logManager.SetMatchIDorCustName(customerName) // alternative logging customer username
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

func GetEditCustomer(customerId, stampUser string) (*model.EditCustomerMain, []model.EditCustomerVIP, []model.EditCustomerUpline, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_UPD_CUSTOMER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Edit Customer", "EDIT CUSTOMER", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	main := model.EditCustomerMain{}
	listVIP := []model.EditCustomerVIP{}
	listUpline := []model.EditCustomerUpline{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, nil, err
	}
	defer rows.Close()

	for rows.Next() {
		err = rows.Scan(
			&main.CustomerID,
			&main.Username,
			&main.AliasName,
			&main.Currency,
			&main.IsCustomerHasDownline,
			&main.CustomerType,
			&main.CustomerLevel,
			&main.CustomerSuspend_Status,
			&main.CustomerActive_Status,
			&main.CustomerBetLimitFactor,
			&main.CashCategoryID,
			&main.SmartPunterLevel,
			&main.OddsGroup,
			&main.MinBet,
			&main.MaxBet,
			&main.MatchLimit,
			&main.CreditLimit,
			&main.UsedCreditLimit,
		)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, nil, nil, err
		}
	}

	rows.NextResultSet()
	err = sqlx.StructScan(rows, &listVIP)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, err
	}

	rows.NextResultSet()
	err = sqlx.StructScan(rows, &listUpline)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}

	return &main, listVIP, listUpline, nil
}

func UpdateCustomer(customerId, customerName, currency, customerActiveStatus string, customerBetLimitFactor float64, cashCategoryId string, smartPunterLevel, oddsGroup, minBet, maxBet, matchLimit, creditLimit int, vip, customerSuspendStatus string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_CUSTOMER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Customer", "EDIT CUSTOMER", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerId),
		sql.Named("Currency", currency),
		sql.Named("CustomerActiveStatus", customerActiveStatus),
		sql.Named("CustomerBetLimitFactor", customerBetLimitFactor),
		sql.Named("CashCategoryID", cashCategoryId),
		sql.Named("SmartPunterLevel", smartPunterLevel),
		sql.Named("OddsGroup", oddsGroup),
		sql.Named("MinBet", minBet),
		sql.Named("MaxBet", maxBet),
		sql.Named("MatchLimit", matchLimit),
		sql.Named("CreditLimit", creditLimit),
		sql.Named("VIP", vip),
		sql.Named("CustomerSuspendStatus", customerSuspendStatus),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(customerName) // alternative logging customer username
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

func ListCustomerLimitProfile(customerId, branchId, currency string, stampUser string) ([]model.CustomerLimitProfile, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LIMIT_PROFILE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Customer Limit Profile", "EDIT CUSTOMER BET LIMIT", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerId),
		sql.Named("BranchID", branchId),
		sql.Named("Currency", currency),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.CustomerLimitProfile{}
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
func GetCustomerBetLimit(customerId, stampUser string) (*model.EditCustomerBetLimit, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_UPD_CUSTOMER_BET_LIMIT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Bet Limit Customer", "EDIT CUSTOMER", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	model := model.EditCustomerBetLimit{}
	err = sqlConnections.conn[dbName].QueryRowx(spName, logManager.Parameters...).StructScan(&model)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return &model, nil
}
func UpdateCustomerBetLimit(customerId, customerName string, commissionAhouoePct float64, commissionOtherPct float64, limitProfileId, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_CUSTOMER_BET_LIMIT"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Update Customer Bet Limit", "EDIT CUSTOMER BET LIMIT", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerId),
		sql.Named("CommissionAHOUOEPct", commissionAhouoePct),
		sql.Named("CommissionOtherPct", commissionOtherPct),
		sql.Named("LimitProfileID", limitProfileId),
		sql.Named("StampUser", stampUser),
		&rs,
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Customer", customerId, []string{"LimitProfileID"})
	logManager.PrepareAudit(sqlConnections.conn[dbName], "MN_Comm", customerId, []string{"No_Customer", "CommPct", "CommPctOther"})
	logManager.SetMatchIDorCustName(customerName) // alternative logging customer username
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
	if rs == -1 {
		logManager.WriteStatusError("Default values 0, please update Master Profile first!")
		return errors.New("Default values 0, please update Master Profile first!")
	}
	return err
}

func ListCustomerBetLimitBySport(customerId, stampUser string) ([]model.EditCustomerBetLimitBySport, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_CUSTOMER_BET_LIMIT_BY_SPORT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Bet Limit By Sport Customer", "EDIT CUSTOMER", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.EditCustomerBetLimitBySport{}
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
func UpdateCustomerBetLimitBySport(customerId, customerName string, sportId int, minBet2, maxBet2, matchLimit2 float64, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_CUSTOMER_BET_LIMIT_BY_SPORT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Customer Bet Limit By Sport", "EDIT CUSTOMER BET LIMIT", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerId),
		sql.Named("SportID", sportId),
		sql.Named("MinBet2", minBet2),
		sql.Named("MaxBet2", maxBet2),
		sql.Named("MatchLimit2", matchLimit2),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(customerName) // alternative logging customer username
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

func ListCustomerDelayBet(noCustomer, stampUser string) ([]model.CustomerDelayBet, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_CUSTOMER_DELAYBET"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Customer Delay Bet", "Customer List", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Customer", noCustomer),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.CustomerDelayBet{}
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
func UpdateCustomerDelayBet(noCustomer, listDelayBet, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_CUSTOMER_DELAYBET"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Customer Delay Bet", "Customer List", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Customer", noCustomer),
		sql.Named("ListDelayBet", listDelayBet),
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
