package database

import (
	"database/sql"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListSelectCurrency(stampUser string) ([]model.CurrencySelect, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_CURRENCY"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Select Currency", "Master Currency", stampUser)
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

	list := []model.CurrencySelect{}
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

func ListGridCurrency(stampUser string) ([]model.Currency, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_CURRENCY"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Grid Currency", "Master Currency", stampUser)
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

	list := []model.Currency{}
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

func UpdateCurrency(currencyid string, description string, currencyrate float64, minbet float64, maxpayoutcs float64, maxpayoutparlay float64, effectivedate time.Time, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_CURRENCY"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Currency", "MASTER CURRENCY", stampUser)
	logManager.WriteParameters(
		sql.Named("Currency", currencyid),
		sql.Named("CurrencyName", description),
		sql.Named("Rate", currencyrate),
		sql.Named("MinBet", minbet),
		sql.Named("MaxPayoutCS", maxpayoutcs),
		sql.Named("MaxPayoutParlay", maxpayoutparlay),
		sql.Named("EffectiveDate", effectivedate),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Currency", currencyid, []string{"Mata_Uang", "Nama_MU", "Kurs", "MinBet_1", "CS_Max_Payout", "Mix_Parlay_Max_Payout", "EffDate"})
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
