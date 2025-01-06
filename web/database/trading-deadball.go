package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListDeadballAHOU(matchTimeSlot, fromEarlyDate, toEarlyDate, isShowInActive, isMatchConfirmed, popupID, sessionID, traderGroupInfo, stampUser string) ([]model.Deadball1X2AHOUOE, []model.PausedMatches, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_DEAD_BALL"
	var err error
	var result int

	logManager := logger.LogManager{}
	logManager.StartTask("List Trading Dead Ball", "Trading Dead Ball", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("IsShowInActive", isShowInActive),
		sql.Named("IsMatchConfirmed", isMatchConfirmed),
		sql.Named("PopupID", popupID),
		sql.Named("SessionID", sessionID),
		sql.Named("TraderGroup", traderGroupInfo),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &result}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.Deadball1X2AHOUOE{}
	listPausedMatches := []model.PausedMatches{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, nil, 0, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &listPausedMatches)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, 0, err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, listPausedMatches, result, nil
}
func ListDeadballOE(matchTimeSlot, fromEarlyDate, toEarlyDate, isShowInActive, isMatchConfirmed, popupID, sessionID, traderGroupInfo, stampUser string) ([]model.Deadball1X2AHOUOE, []model.PausedMatches, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_DEAD_BALL_OE"
	var err error
	var result int

	logManager := logger.LogManager{}
	logManager.StartTask("List Trading Dead Ball Odd/Even, Win/Not Win (OE, HWNW, AWNW)", "Trading Dead Ball", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("IsShowInActive", isShowInActive),
		sql.Named("IsMatchConfirmed", isMatchConfirmed),
		sql.Named("PopupID", popupID),
		sql.Named("SessionID", sessionID),
		sql.Named("TraderGroup", traderGroupInfo),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &result}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.Deadball1X2AHOUOE{}
	listPausedMatches := []model.PausedMatches{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, nil, 0, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &listPausedMatches)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, 0, err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, listPausedMatches, result, nil
}
func ListDeadBallDCML(matchTimeSlot, fromEarlyDate, toEarlyDate, isShowInActive, isMatchConfirmed, popupID, sessionID, traderGroupInfo, stampUser string) ([]model.DeadballDCML, []model.PausedMatches, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_DEAD_BALL_DCML"
	var err error
	var result int

	logManager := logger.LogManager{}
	logManager.StartTask("List Trading Dead Ball Double Chance, Money Line", "Trading Dead Ball", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("IsShowInActive", isShowInActive),
		sql.Named("IsMatchConfirmed", isMatchConfirmed),
		sql.Named("PopupID", popupID),
		sql.Named("SessionID", sessionID),
		sql.Named("TraderGroup", traderGroupInfo),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &result}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.DeadballDCML{}
	listPausedMatches := []model.PausedMatches{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, nil, 0, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &listPausedMatches)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, 0, err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, listPausedMatches, result, nil
}
func ListDeadBallTG(matchTimeSlot, fromEarlyDate, toEarlyDate, isShowInActive, isMatchConfirmed, popupID, sessionID, traderGroupInfo, stampUser string) ([]model.DeadballTG, []model.PausedMatches, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_DEAD_BALL_TG"
	var err error
	var result int

	logManager := logger.LogManager{}
	logManager.StartTask("List Trading Dead Ball Total Goal", "Trading Dead Ball", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("IsShowInActive", isShowInActive),
		sql.Named("IsMatchConfirmed", isMatchConfirmed),
		sql.Named("PopupID", popupID),
		sql.Named("SessionID", sessionID),
		sql.Named("TraderGroup", traderGroupInfo),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &result}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.DeadballTG{}
	listPausedMatches := []model.PausedMatches{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, nil, 0, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &listPausedMatches)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, listPausedMatches, result, nil
}
func ListDeadBallCS(matchTimeSlot, fromEarlyDate, toEarlyDate, isShowInActive, isMatchConfirmed string, gameType int, sessionID, popupID, stampUser, traderGroupInfo string) ([]model.DeadballCS, []model.PausedMatches, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_DEAD_BALL_CS"
	var err error
	var result int

	logManager := logger.LogManager{}
	logManager.StartTask("List Trading Dead Ball Correct Score", "Trading Dead Ball", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("IsShowInActive", isShowInActive),
		sql.Named("IsMatchConfirmed", isMatchConfirmed),
		sql.Named("GameType", gameType),
		sql.Named("PopupID", popupID),
		sql.Named("SessionID", sessionID),
		sql.Named("TraderGroup", traderGroupInfo),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &result}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.DeadballCS{}
	listPausedMatches := []model.PausedMatches{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, nil, 0, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &listPausedMatches)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, listPausedMatches, result, nil
}
func ListDeadBallFGLG(matchTimeSlot, fromEarlyDate, toEarlyDate, isShowInActive, isMatchConfirmed, sessionID, popupID, stampUser, traderGroupInfo string) ([]model.DeadballFGLG, []model.PausedMatches, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_DEAD_BALL_FGLG"
	var err error
	var result int

	logManager := logger.LogManager{}
	logManager.StartTask("List Trading Dead Ball First Goal / Last Goal", "Trading Dead Ball", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("IsShowInActive", isShowInActive),
		sql.Named("IsMatchConfirmed", isMatchConfirmed),
		sql.Named("PopupID", popupID),
		sql.Named("SessionID", sessionID),
		sql.Named("TraderGroup", traderGroupInfo),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &result}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.DeadballFGLG{}
	listPausedMatches := []model.PausedMatches{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, nil, 0, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &listPausedMatches)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, listPausedMatches, result, nil
}
func ListDeadBallHTFT(matchTimeSlot, fromEarlyDate, toEarlyDate, isShowInActive, isMatchConfirmed, sessionID, popupID, stampUser, traderGroupInfo string) ([]model.DeadballHTFT, []model.PausedMatches, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_DEAD_BALL_HTFT"
	var err error
	var result int

	logManager := logger.LogManager{}
	logManager.StartTask("List Trading Dead Ball Half Time / Full Time", "Trading Dead Ball", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("IsShowInActive", isShowInActive),
		sql.Named("IsMatchConfirmed", isMatchConfirmed),
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroupInfo),
		sql.Named("PausedMatches", sql.Out{Dest: &result}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.DeadballHTFT{}
	listPausedMatches := []model.PausedMatches{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, nil, 0, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &listPausedMatches)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, listPausedMatches, result, nil
}
func ListDeadBallOutright(sportID int, fromOutrightDate, toOutrightDate, isShowInActive, sessionID, stampUser, traderGroupInfo string) ([]model.DeadballOutright, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_DEAD_BALL_OUTRIGHT"
	var err error
	var result int

	logManager := logger.LogManager{}
	logManager.StartTask("List Trading Dead Ball Outright", "Trading Dead Ball", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("FromOutrightDate", fromOutrightDate),
		sql.Named("ToOutrightDate", toOutrightDate),
		sql.Named("IsShowInActive", isShowInActive),
		sql.Named("SessionID", sessionID),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroupInfo),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.DeadballOutright{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, result, nil
}
