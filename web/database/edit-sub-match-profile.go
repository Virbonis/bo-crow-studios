package database

import (
	"database/sql"
	"strconv"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListSubMatchProfile(matchID, subMatchID int, stampUser string) ([]model.SubMatchProfile, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SUB_MATCH_PROFILE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get List Sub Match Profile", "EDIT SUB MATCH PROFILE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.SubMatchProfile{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func UpdateSubMatchProfile(matchID, subMatchID, gameType int, priceStep1, priceStep2, priceStep3, priceStep4, limitChange1, limitChange2, limitChange3, limitChange4, maxLimit1, maxLimit2, maxLimit3, maxLimit4, maxBet1, maxBet2, maxBet3, maxBet4, lap1, lap2, lap3, lap4, autoPauseLimit float64, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SUB_MATCH_PROFILE"
	var err error
	var errMessage string

	logManager := logger.LogManager{}
	logManager.StartTask("Update Sub Match Setting", "EDIT SUB MATCH PROFILE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("Price_Step_1", priceStep1),
		sql.Named("Price_Step_2", priceStep2),
		sql.Named("Price_Step_3", priceStep3),
		sql.Named("Price_Step_4", priceStep4),
		sql.Named("Limit_Change_1", limitChange1),
		sql.Named("Limit_Change_2", limitChange2),
		sql.Named("Limit_Change_3", limitChange3),
		sql.Named("Limit_Change_4", limitChange4),
		sql.Named("max_limit_1", maxLimit1),
		sql.Named("max_limit_2", maxLimit2),
		sql.Named("max_limit_3", maxLimit3),
		sql.Named("max_limit_4", maxLimit4),
		sql.Named("max_bet_1", maxBet1),
		sql.Named("max_bet_2", maxBet2),
		sql.Named("max_bet_3", maxBet3),
		sql.Named("max_bet_4", maxBet4),
		sql.Named("lap_1", lap1),
		sql.Named("lap_2", lap2),
		sql.Named("lap_3", lap3),
		sql.Named("lap_4", lap4),
		sql.Named("autoPauseLimit", autoPauseLimit),
		sql.Named("StampUser", stampUser),
		sql.Named("ErrMessage", sql.Out{Dest: &errMessage}),
	)
	pkValue := strconv.Itoa(matchID) + "," + strconv.Itoa(subMatchID)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "SubPartai", pkValue, []string{"No_Partai", "Sub_Partai", "GameType"})
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
