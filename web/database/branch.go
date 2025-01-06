package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListSelectBranch(stampUser string) ([]model.Branch, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_BRANCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Branch", "Branch", stampUser)
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

	list := []model.Branch{}
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

func ListGridBranch(stampUser string) ([]model.GridBranch, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_BRANCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Grid Branch", "Branch", stampUser)
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

	list := []model.GridBranch{}
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

func UpdateGridBranch(hostID, branchId, branchName string, maxBetMultiplier, oddsTriggerMultiplier, pauseMultiplier float64, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_BRANCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Grid Branch", "Branch", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchID", branchId),
		sql.Named("BranchName", branchName),
		sql.Named("MaxBetMultiplier", maxBetMultiplier),
		sql.Named("OddsTriggerMultiplier", oddsTriggerMultiplier),
		sql.Named("PauseMultiplier", pauseMultiplier),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "DomainID", hostID, []string{
		"ShortName", "DomainName", "Max_Bet_Multiplier", "Limit_Change_Multiplier", "Pause_Multiplier"})
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

func UpdateBranchLiveStream(branchID, st_livestream, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_BRANCH_ST_LIVESTREAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Branch Live Stream", "Branch", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchID", branchID),
		sql.Named("ST_OperatorLiveStream", st_livestream),
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

func ListBranchLimit(branchID, currencyID string, stampUser string) ([]model.BranchLimit, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_BRANCH_LIMIT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Branch Limit", "Branch", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchCode", branchID),
		sql.Named("Currency", currencyID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BranchLimit{}
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

func UpdateBranchLimit(branchCode string, currencyID string, minBet float64, minBetParlay float64, maxPayoutParlay float64, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_BRANCH_LIMIT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Branch Limit", "Branch", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchCode", branchCode),
		sql.Named("Currency", currencyID),
		sql.Named("MinBet", minBet),
		sql.Named("MinBet_Parlay", minBetParlay),
		sql.Named("MaxPayout_Parlay", maxPayoutParlay),
		sql.Named("StampUser", stampUser),
	)
	// logManager.PrepareAudit(sqlConnections.conn[dbName], "DomainIDLimit", currencyID, []string{"MinBet", "MinBet_Parlay", "MaxPayout_Parlay"})
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

func ListBranchSportLimit(branchCode, currency, stampUser string) ([]model.BranchSportLimit, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_DOMAINIDSPORTLIMIT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Branch Sport Limit", "Branch", stampUser)
	logManager.WriteParameters(
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

	list := []model.BranchSportLimit{}
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

func UpdateBranchSportLimit(branchCode string, currency, sportID string, minBet float64, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_UPD_MASTER_DOMAINIDSPORTLIMIT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Branch Sport Limit", "Branch", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchCode", branchCode),
		sql.Named("Currency", currency),
		sql.Named("SportID", sportID),
		sql.Named("MinBet_LiveStream", minBet),
		sql.Named("StampUser", stampUser),
	)
	// logManager.PrepareAudit(sqlConnections.conn[dbName], "Sport", sportID, []string{"Nama_Sport"})
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

func DeleteBranchSportLimit(branchCode, sportID, currency, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_MASTER_DOMAINIDSPORTLIMIT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Branch Sport Limit", "Branch", stampUser)
	logManager.WriteParameters(
		sql.Named("BranchCode", branchCode),
		sql.Named("SportID", sportID),
		sql.Named("Currency", currency),
		sql.Named("StampUser", stampUser),
	)
	// logManager.PrepareAudit(sqlConnections.conn[dbName], "BranchSportLimit", branchCode, []string{"SportID", "SportName", "MinBet_LiveStream", "No_Display"})
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
