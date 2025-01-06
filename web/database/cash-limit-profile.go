package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListCashLimitProfile(profileID, branchCode, currency, stampUser string) ([]model.CashLimitProfile, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_CASH_LIMIT_PROFILE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Cash Limit Profile", "MASTER CASH LIMIT PROFILE", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
		sql.Named("BranchCode", branchCode),
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

	list := []model.CashLimitProfile{}
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
func CreateCashLimitProfile(profileID, branchCode, currency string, priceGroup int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MASTER_CASH_LIMIT_PROFILE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Master Cash Limit Profile", "MASTER CASH LIMIT PROFILE", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
		sql.Named("BranchCode", branchCode),
		sql.Named("Currency", currency),
		sql.Named("PriceGroup", priceGroup),
		sql.Named("StampUser", stampUser),
	)

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
func DeleteCashLimitProfile(profileID, branchCode, currency, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_MASTER_CASH_LIMIT_PROFILE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Master Cash Match Limit", "MASTER CASH MATCH LIMIT", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
		sql.Named("BranchCode", branchCode),
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

	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
func ListCashLimitProfileLog(profileID, branchCode, currency, stampUser string) ([]model.CashLimitProfileLog, error) {
	dbName := Inetsoccer_Log
	spName := "MGMT_SBA_LIST_GRID_CASH_LIMIT_PROFILE_LOG"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Cash Limit Profile Log", "MASTER CASH MATCH LIMIT", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
		sql.Named("BranchCode", branchCode),
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

	list := []model.CashLimitProfileLog{}
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

	return list, nil
}

func GetCountCashLimitProfileDetail(profileID, branchCode, currency, stampUser string) ([]int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_COUNT_MASTER_CASH_LIMIT_PROFILE_DETAIL"

	logManager := logger.LogManager{}
	logManager.StartTask("Get Count Cash Limit Profile Detail", "MASTER CASH LIMIT PROFILE", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
		sql.Named("BranchCode", branchCode),
		sql.Named("Currency", currency),
		sql.Named("StampUser", stampUser),
	)

	list := []int{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var temp int
		err := rows.Scan(&temp)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, temp)
	}
	return list, err
}
func GetCashLimitProfileDetail(profileID, branchCode, currency string, priceGroup int, stampUser string) ([]model.CashLimitProfileDetail, []model.CashLimitProfileDetail, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_CASH_LIMIT_PROFILE_DETAIL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Cash Limit Profile Detail ", "MASTER CASH LIMIT PROFILE", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
		sql.Named("BranchCode", branchCode),
		sql.Named("Currency", currency),
		sql.Named("PriceGroup", priceGroup),
		sql.Named("StampUser", stampUser),
	)
	listMain := []model.CashLimitProfileDetail{}

	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &listMain)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, err
	}

	rows.NextResultSet()
	listParlay := []model.CashLimitProfileDetail{}
	err = sqlx.StructScan(rows, &listParlay)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, err
	}

	return listMain, listParlay, nil
}
func UpdateCashLimitProfileDetail(profileID, branchCode, currency, sportID string, priceGroup, minBet, maxBet, matchLimit int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_UPD_MASTER_CASH_LIMIT_PROFILE_DETAIL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Update Cash Limit Profile Detail", "MASTER CASH LIMIT PROFILE", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
		sql.Named("BranchCode", branchCode),
		sql.Named("Currency", currency),
		sql.Named("SportID", sportID),
		sql.Named("PriceGroup", priceGroup),
		sql.Named("MinBet", minBet),
		sql.Named("MaxBet", maxBet),
		sql.Named("MatchLimit", matchLimit),
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
func DeleteCashLimitProfileDetail(profileId, branchCode, currency, sportId string, priceGroup int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_MASTER_CASH_LIMIT_PROFILE_DETAIL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Cash Limit Profile Detail", "MASTER CASH LIMIT PROFILE", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileId),
		sql.Named("BranchCode", branchCode),
		sql.Named("Currency", currency),
		sql.Named("SportID", sportId),
		sql.Named("PriceGroup", priceGroup),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
