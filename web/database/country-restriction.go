package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListCountryRestriction(CurrentPage, PageSize int, CustomerID, CustomerType, CustomerLevel, BranchCode, Username, Currency string,
	DateFrom, DateTo *string, Access, Active, customerTreeGetDownline, stampUser string) ([]model.ListCountryRestriction, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_COUNTRY_RESTRICTION"
	var err error
	var totalRecord int
	list := []model.ListCountryRestriction{}
	logManager := logger.LogManager{}
	logManager.StartTask("List Restriction Country", "Country Restriction", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", CustomerID),
		sql.Named("CustomerType", CustomerType),
		sql.Named("CustomerLevel", CustomerLevel),
		sql.Named("BranchID", BranchCode),
		sql.Named("Username", Username),
		sql.Named("Currency", Currency),
		sql.Named("JoinDateFrom", DateFrom),
		sql.Named("JoinDateTo", DateTo),
		sql.Named("CustomerAccessStatus", Access),
		sql.Named("CustomerActiveStatus", Active),
		sql.Named("CustomerTreeGetDownline", customerTreeGetDownline),
		sql.Named("CurrentPage", CurrentPage),
		sql.Named("PageSize", PageSize),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecord}),
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
	return list, totalRecord, nil
}

func ListEditCountryRestriction(customerID, accessStatus, stampUser string) ([]model.EditCountryRestriction, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_COUNTRIES_COUNTRY_RESTRICTION"
	var err error
	var list []model.EditCountryRestriction

	logManager := logger.LogManager{}
	logManager.StartTask("List Edit Country Restriction", "Country Restriction", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerID),
		sql.Named("AccessStatus", accessStatus),
		sql.Named("StampUser", stampUser),
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

func UpdateListEditCountryRestriction(customerID, access int, countryISO, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_COUNTRIES_COUNTRY_RESTRICTION"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Country Restriction", "EDIT COUNTRY RESTRICTION", stampUser)
	logManager.WriteParameters(
		sql.Named("CustomerID", customerID),
		sql.Named("CountriesISO", countryISO),
		sql.Named("AccessStatus", access),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Customer", customerID, []string{"CountryRes", "ResType", "User_ID"})
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
