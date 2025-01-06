package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func GetSportsbookSetting(stampUser string) (*model.SportsbookSetting, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_SPORTSBOOK_SETTING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Sportsbook Setting", "Sportsbook Setting", stampUser)
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

	model := model.SportsbookSetting{}
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
func GetDefaultMatchOutright(stampUser string) ([]model.DefaultMatchOutright, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_SWITCH_DEFAULT_MATCH_OUTRIGHT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Default Match Outright", "Sportsbook Setting", stampUser)
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

	list := []model.DefaultMatchOutright{}
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

func UpdateSportsbookSetting(ibPayoutTriggerAmt int, ibMaxbetTriggerPct, maxbetPauseTriggerPct, lapShortTriggerPct float64, autoAcceptDelayHome, autoAcceptDelayAway, autoAcceptDelayOver, autoAcceptDelayUnder, autoAcceptDelayReject, dayLightSaving, autoEarlySettlement int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SPORTSBOOK_SETTING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Sportsbook Setting", "Sportsbook Setting", stampUser)
	logManager.WriteParameters(
		sql.Named("IBPayoutTriggerAmt", ibPayoutTriggerAmt),
		sql.Named("IBMaxbetTriggerPct", ibMaxbetTriggerPct),
		sql.Named("MaxbetPauseTriggerPct", maxbetPauseTriggerPct),
		sql.Named("LAPShortTriggerPct", lapShortTriggerPct),
		sql.Named("AutoAcceptDelayHome", autoAcceptDelayHome),
		sql.Named("AutoAcceptDelayAway", autoAcceptDelayAway),
		sql.Named("AutoAcceptDelayOver", autoAcceptDelayOver),
		sql.Named("AutoAcceptDelayUnder", autoAcceptDelayUnder),
		sql.Named("AutoAcceptDelayReject", autoAcceptDelayReject),
		sql.Named("DayLightSaving", dayLightSaving),
		sql.Named("AutoEarlySettlement", autoEarlySettlement),
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
	return nil
}
func UpdateDefaultMatchOutright(noSport int, autoCreateMatch, autoCreateOutright, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SWITCH_DEFAULT_MATCH_OUTRIGHT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Default Match Outright", "Sportsbook Setting", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Sport", noSport),
		sql.Named("AutoCreateMatch", autoCreateMatch),
		sql.Named("AutoCreateOutright", autoCreateOutright),
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
	return nil
}
func UpdateMaintenanceStatus(isMaintenance string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_STATUS_MAINTENANCE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Maintenance", "Sportsbook Setting", stampUser)
	logManager.WriteParameters(
		sql.Named("IsMaintenance", isMaintenance),
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
	return nil
}
func UpdateSeamlessMaintenanceStatus(isMaintenance string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMTS_SBA_PROC_UPD_STATUS_MAINTENANCE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Maintenance", "Sportsbook Setting", stampUser)
	logManager.WriteParameters(
		sql.Named("IsMaintenance", isMaintenance),
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
	return nil
}
func UpdateCloseFundTransferStatus(closeFundTransfer int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_CLOSE_FUNDTRANSFER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Close Fund Transfer Status", "Sportsbook Setting", stampUser)
	logManager.WriteParameters(
		sql.Named("CloseFundTransfer", closeFundTransfer),
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
	return nil
}
func UpdateBetBazarStatus(status bool, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_BETBAZAR_STATUS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Bet Bazar Status", "Sportsbook Setting", stampUser)
	logManager.WriteParameters(
		sql.Named("BetBazar_Status", status),
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
	return nil
}
func UpdateIMStatus(status bool, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_IM_STATUS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update IM Status", "Sportsbook Setting", stampUser)
	logManager.WriteParameters(
		sql.Named("IM_Status", status),
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
	return nil
}
func UpdateSISStatus(status bool, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SIS_STATUS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update SIS Status", "Sportsbook Setting", stampUser)
	logManager.WriteParameters(
		sql.Named("SIS_Status ", status),
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
	return nil
}
func UpdateBTIAutoAddMatch(status bool, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_BTI_AutoAddMatch"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update BTI Auto Add Match", "Sportsbook Setting", stampUser)
	logManager.WriteParameters(
		sql.Named("BTI_AutoAddMatch", status),
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
	return nil
}
