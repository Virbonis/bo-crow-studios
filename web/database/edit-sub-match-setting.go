package database

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListSubMatchSetting(matchID, subMatchID, gameType int, matchTimeSlot, stampUser string) ([]model.SubMatchSetting, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SUB_MATCH_SETTING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get List Sub Match Setting", "EDIT SUB MATCH SETTING", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.SubMatchSetting{}
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
func UpdateSubMatchSetting(matchID, subMatchID, gameType, shiftLeeching, followLeeching, lockLeeching, autoPause, oddsSpread, subMatchPauseID, subMatchParlayStatus int, odds1, odds2, odds3, odds4, odds5, odds6, odds7, odds8, odds9, odds10, odds11, odds12, odds13, odds14, odds15, odds16, odds17, odds18, odds19, odds20, odds21, odds22, odds23, odds24, odds25, odds26, odds27, oddsMargin float64, stOddsMargin, traderGroupInfo, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SUB_MATCH_SETTING"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Update Sub Match Setting", "EDIT SUB MATCH SETTING", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("ShiftLeeching", shiftLeeching),
		sql.Named("FollowLeeching", followLeeching),
		sql.Named("LockLeeching", lockLeeching),
		sql.Named("AutoPause", autoPause),
		sql.Named("OddsSpread", oddsSpread),
		sql.Named("SubMatchPauseID", subMatchPauseID),
		sql.Named("SubMatchParlayStatus", subMatchParlayStatus),
		sql.Named("Odds1", odds1),
		sql.Named("Odds2", odds2),
		sql.Named("Odds3", odds3),
		sql.Named("Odds4", odds4),
		sql.Named("Odds5", odds5),
		sql.Named("Odds6", odds6),
		sql.Named("Odds7", odds7),
		sql.Named("Odds8", odds8),
		sql.Named("Odds9", odds9),
		sql.Named("Odds10", odds10),
		sql.Named("Odds11", odds11),
		sql.Named("Odds12", odds12),
		sql.Named("Odds13", odds13),
		sql.Named("Odds14", odds14),
		sql.Named("Odds15", odds15),
		sql.Named("Odds16", odds16),
		sql.Named("Odds17", odds17),
		sql.Named("Odds18", odds18),
		sql.Named("Odds19", odds19),
		sql.Named("Odds20", odds20),
		sql.Named("Odds21", odds21),
		sql.Named("Odds22", odds22),
		sql.Named("Odds23", odds23),
		sql.Named("Odds24", odds24),
		sql.Named("Odds25", odds25),
		sql.Named("Odds26", odds26),
		sql.Named("Odds27", odds27),
		sql.Named("OddsMargin", oddsMargin),
		sql.Named("ST_OddsMargin", stOddsMargin),
		sql.Named("TraderGroup", traderGroupInfo),
		sql.Named("StampUser", stampUser),
		&rs,
	)
	logManager.SetMatchIDorCustName(matchID)
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
	if rs == -10 {
		return errors.New("Failed to update Sub Match Setting. Please update it in MO!")
	}
	return err
}

func ListSubmatchOutrightSetting(OutrightID, stampUser string) ([]model.SubMatchOutrightSetting, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_OUT_SUB_MATCH_SETTING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Trading Dead Ball Half Time / Full Time", "Trading Dead Ball", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", OutrightID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.SubMatchOutrightSetting{}
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
func UpdateSubmatchOutrightSetting(OutrightID, SubMatchID int, Odds float64, TraderGroup string, AutoOdds, LockShift, AutoPause int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_OUT_SUB_MATCH_SETTING"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Out Sub Match Setting", "EDIT OUT SUBMATCH SETTING", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", OutrightID),
		sql.Named("SubMatch_Seq", SubMatchID),
		sql.Named("Odds", Odds),
		sql.Named("Trader_Group", TraderGroup),
		sql.Named("AutoOdds", AutoOdds),
		sql.Named("LockShift", LockShift),
		sql.Named("AutoPause", AutoPause),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(OutrightID)
	pk := fmt.Sprintf("%v,%v", OutrightID, SubMatchID)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "TourTeam", pk, []string{"No_Tour", "No_Sequence", "No_Club"})
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

func ListSubMatchSpecialSetting(matchID int, gameType string, stampUser string) ([]model.SubMatchSpecialSettingDesc, []model.SubMatchSpecialSetting, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_DBS_EDIT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get List Edit Deadball Special", "EDIT DEADBALL SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	listDesc := []model.SubMatchSpecialSettingDesc{}
	list := []model.SubMatchSpecialSetting{}

	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &listDesc)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, nil, err
	}

	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return listDesc, list, nil
}
func UpdateSubMatchSpecialSetting(matchID, gameType int, odds1, odds2, odds3, odds4, odds5, odds6, odds7, odds8, odds9, odds10, maxPayout, handicap, oddsMargin, oddsMargin2 float64, subMatchParlayStatus, stOddsMargin, stOddsMargin2, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_DBS_EDIT_ODDS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Odds", "DEAD BALL SPECIAL EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("Odds1", odds1),
		sql.Named("Odds2", odds2),
		sql.Named("Odds3", odds3),
		sql.Named("Odds4", odds4),
		sql.Named("Odds5", odds5),
		sql.Named("Odds6", odds6),
		sql.Named("Odds7", odds7),
		sql.Named("Odds8", odds8),
		sql.Named("Odds9", odds9),
		sql.Named("Odds10", odds10),
		sql.Named("MaxPayout", maxPayout),
		sql.Named("Handicap", handicap),
		sql.Named("OddsMargin", oddsMargin),
		sql.Named("OddsMargin2", oddsMargin2),
		sql.Named("SubMatchParlayStatus", subMatchParlayStatus),
		sql.Named("ST_OddsMargin", stOddsMargin),
		sql.Named("ST_OddsMargin2", stOddsMargin2),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(matchID)
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
