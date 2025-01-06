package database

import (
	"database/sql"
	"errors"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	mssql "github.com/denisenkom/go-mssqldb"
	log "github.com/sirupsen/logrus"
)

func UpdateMatchMoreGT(matchID, moreGT int, stampUser string) error {
	dbName := GoldenOdds
	spName := "MGMT_SBA_PROC_UPD_MATCH_MOREGT"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Status More GameType By League", "ADD SUB MATCH MORE GAMETYPE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("MoreGT", moreGT),
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

func UpdateOpenCloseMatch(matchID int, matchOpenStatus, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_OPEN_CLOSE_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Open Close Match", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("MatchOpenStatus", matchOpenStatus),
		sql.Named("TraderGroup", traderGroup),
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
func UpdatePauseResumeMatch(matchID, subMatchPauseID int, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_PAUSE_RESUME_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Pause Resume Match", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchPauseID", subMatchPauseID),
		sql.Named("TraderGroup", traderGroup),
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
func UpdateOpenCloseSubMatch(matchID, subMatchID, gameType int, subMatchOpenStatus, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_OPEN_CLOSE_SUB_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Open Close SubMatch", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("SubMatchOpenStatus", subMatchOpenStatus),
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
func UpdatePauseResumeSubMatch(matchID, subMatchID, gameType, subMatchPauseID int, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_PAUSE_RESUME_SUB_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Pause Resume SubMatch", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("SubMatchPauseID", subMatchPauseID),
		sql.Named("TraderGroup", traderGroup),
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

func UpdateLiveFinalize(matchID int, matchLiveStatus, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_LIVE_FINALIZE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Live Finalize", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("MatchLiveStatus", matchLiveStatus),
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
func UpdateOddsHDC(matchID, subMatchID, matchOddStep int, odds, handicap float64, stFav int, popupID, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_ODDS_HDC"
	var err error
	var logParam sql.NullString
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Update Odds HDC", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("MatchOddStep", matchOddStep),
		sql.Named("Odds", odds),
		sql.Named("Handicap", handicap),
		sql.Named("ST_Fav", stFav),
		sql.Named("Popup_ID", popupID),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("StampUser", stampUser),
		sql.Named("LogParam", sql.Out{Dest: &logParam}),
	)
	logManager.SetMatchIDorCustName(matchID)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
		go InsertLogOdds(&logParam.String)
	}()

	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	if int(rs) < -1 {
		return errors.New("Can't Change Handicap")
	}
	return err
}
func UpdateMoveOdds(matchID, subMatchID, gameType int, moveDirection, popupID, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_MOVE_ODDS"
	var err error
	var logParam sql.NullString
	logManager := logger.LogManager{}
	logManager.StartTask("Update Outright Setting", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("MoveDirection", moveDirection),
		sql.Named("Popup_ID", popupID),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("StampUser", stampUser),
		sql.Named("LogParam", sql.Out{Dest: &logParam}),
	)
	logManager.SetMatchIDorCustName(matchID)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
		go InsertLogOdds(&logParam.String)
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

func UpdateOpenCloseOutright(outrightID int, matchOpenStatus, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_OPEN_CLOSE_OUTRIGHT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Open Close Outright", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightID),
		sql.Named("MatchOpenStatus", matchOpenStatus),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightID)
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
func UpdatePauseResumeOutright(outrightID int, matchPauseStatus, traderGroup, stampUser string) error {
	// pake sp sama kyk sub outright
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_PAUSE_RESUME_OUT_SUB_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Pause Resume SubMatch Outright", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightID),
		sql.Named("SubMatchSeq", "0"),
		sql.Named("SubMatchOpenStatus", "Y"),
		sql.Named("SubMatchPauseStatus", matchPauseStatus),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightID)
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
func UpdateOpenCloseSubmatchOutright(outrightID, subMatchSeq int, subMatchOpenStatus, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_OPEN_CLOSE_OUT_SUB_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Open Close SubMatch Outright", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightID),
		sql.Named("SubMatchSeq", subMatchSeq),
		sql.Named("SubMatchOpenStatus", subMatchOpenStatus),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightID)
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
func UpdatePauseResumeSubmatchOutright(outrightID, subMatchSeq int, subMatchPauseStatus, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_PAUSE_RESUME_OUT_SUB_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Pause Resume SubMatch Outright", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightID),
		sql.Named("SubMatchSeq", subMatchSeq),
		sql.Named("SubMatchOpenStatus", "Y"),
		sql.Named("SubMatchPauseStatus", subMatchPauseStatus),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightID)
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

func UpdateOutrightSetting(outrightID int, maxPayout, priceStep, limitChange float64, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_OUTRIGHT_SETTING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Outright Setting", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightID),
		sql.Named("MaxPayout", maxPayout),
		sql.Named("PriceStep", priceStep),
		sql.Named("LimitChange", limitChange),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightID)
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
func UpdateConfirmOutright(outrightID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_CONFIRM_OUTRIGHT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Confirm Outright", "TRADING", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightID),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightID)
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
