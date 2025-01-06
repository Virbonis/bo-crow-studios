package database

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	"github.com/shopspring/decimal"
	log "github.com/sirupsen/logrus"
)

func ListMOAHOU(sessionID, popupID, matchTimeSlot, matchID, displayAdmin, stampUser, traderGroupORI string) ([]model.MO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_AHOU" // sp baru belum uptodate
	var err error
	var pausedMatches int
	logManager := logger.LogManager{}
	logManager.StartTask("List MO AHOU", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroupORI),
		sql.Named("PausedMatches", sql.Out{Dest: &pausedMatches}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MO{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MO{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOAHOUSingle(sessionID, popupID, matchTimeSlot, matchID, displayAdmin, stampUser string) ([]model.MO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_AHOU_SINGLE"
	var err error
	var pausedMatches int
	logManager := logger.LogManager{}
	logManager.StartTask("List MO AHOU Single", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &pausedMatches}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MO{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MO{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOAHOUPartai(sessionID, popupID, matchTimeSlot, matchID, stampUser string) ([]model.MO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_AHOU_SEPARTAI"
	var err error
	var pausedMatches int
	logManager := logger.LogManager{}
	logManager.StartTask("List MO AHOU Partai", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &pausedMatches}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MO{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MO{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOEuroAHOU(sessionID, popupID, matchTimeSlot, matchID, displayAdmin, stampUser, traderGroupORI string) ([]model.MO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_EURO_AHOU"
	var err error
	var pausedMatches int
	logManager := logger.LogManager{}
	logManager.StartTask("List MO Euro AHOU", "MO EURO", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroupORI),
		sql.Named("PausedMatches", sql.Out{Dest: &pausedMatches}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MO{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MO{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOEuroAHOUSingle(sessionID, popupID, matchTimeSlot, matchID, displayAdmin, stampUser string) ([]model.MO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_EURO_AHOU_SINGLE"
	var err error
	var pausedMatches int
	logManager := logger.LogManager{}
	logManager.StartTask("List MO Euro AHOU Single", "MO EURO", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &pausedMatches}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MO{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MO{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOEuroAHOUPartai(sessionID, popupID, matchTimeSlot, matchID, stampUser string) ([]model.MO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_EURO_AHOU_SEPARTAI"
	var err error
	var pausedMatches int
	logManager := logger.LogManager{}
	logManager.StartTask("List MO Euro AHOU Partai", "MO EURO", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &pausedMatches}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MO{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MO{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOCS(sessionID, popupID, matchTimeSlot, matchID, FTHT, stampUser, traderGroupORI string) ([]model.MOCS, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_CS"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List MO CS", "MO CS", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("FTHT", FTHT),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroupORI),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MOCS{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MOCS{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOCSPartai(sessionID, popupID, matchTimeSlot, matchID, gameType, stampUser string) ([]model.MOCS, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_CS_SEPARTAI"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List MO CS Partai", "MO CS", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
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
	list := []model.MOCS{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MOCS{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOOE(sessionID, popupID, matchTimeSlot, matchID, displayAdmin, stampUser, traderGroupORI string) ([]model.MO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_OE"
	var err error
	var pausedMatches int
	logManager := logger.LogManager{}
	logManager.StartTask("List MO OE", "MO OE", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroupORI),
		sql.Named("PausedMatches", sql.Out{Dest: &pausedMatches}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MO{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MO{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOOS(sessionID, popupID, matchTimeSlot string, matchID, displayAdmin, stampUser, traderGroupORI string) ([]model.MO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_AHOUOE"
	var err error
	var pausedMatches int
	logManager := logger.LogManager{}
	logManager.StartTask("List MO OS", "MO OS", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroupORI),
		sql.Named("PausedMatches", sql.Out{Dest: &pausedMatches}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MO{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MO{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOOSSingle(sessionID, popupID, matchTimeSlot, matchID, displayAdmin, stampUser string) ([]model.MO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_AHOUOE_SINGLE"
	var err error
	var pausedMatches int
	logManager := logger.LogManager{}
	logManager.StartTask("List MO OS Single", "MO OS", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &pausedMatches}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MO{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MO{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOOSPartai(sessionID, popupID, matchTimeSlot, matchID, stampUser string) ([]model.MO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_AHOUOE_SEPARTAI"
	var err error
	var pausedMatches int
	logManager := logger.LogManager{}
	logManager.StartTask("List MO OS Partai", "MO OS", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &pausedMatches}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MO{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MO{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOTennis(sessionID, popupID, matchTimeSlot, matchID, displayAdmin, stampUser, traderGroupORI string) ([]model.MO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_AHOU_TENNIS"
	var err error
	var pausedMatches int
	logManager := logger.LogManager{}
	logManager.StartTask("List MO Tennis", "MO Tennis", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroupORI),
		sql.Named("PausedMatches", sql.Out{Dest: &pausedMatches}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MO{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MO{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOTennisSingle(sessionID, popupID, matchTimeSlot, matchID, displayAdmin, stampUser string) ([]model.MO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_AHOU_TENNIS_SINGLE"
	var err error
	var pausedMatches int
	logManager := logger.LogManager{}
	logManager.StartTask("List MO Tennis Single", "MO Tennis", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &pausedMatches}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MO{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MO{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMOTennisPartai(sessionID, popupID, matchTimeSlot, matchID, stampUser string) ([]model.MO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_AHOU_TENNIS_SEPARTAI"
	var err error
	var pausedMatches int
	logManager := logger.LogManager{}
	logManager.StartTask("List MO Tennis Partai", "MO Tennis", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &pausedMatches}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MO{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MO{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func SwapFavorite(matchID, subMatchID, statusFavorite int, popupID, stampUser, traderGroup string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_SWAP_FAVORITE"
	var err error
	var logParam sql.NullString
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Update Swap Favorite", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("STFav", statusFavorite),
		sql.Named("Popup_ID", popupID),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("LogParam", sql.Out{Dest: &logParam}),
		&rs,
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
	if rs == -110 {
		logManager.WriteStatusError("Duplicate Handicap")
		return errors.New("Duplicate Handicap")
	}
	return err
}
func UpdateZeroOdds(matchID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_ZERO_ODDS_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update MO Zero Odds", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
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
func UpdateGoal(matchID, home, away int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_GOAL_MATCH"
	var err error
	var retVal string
	logManager := logger.LogManager{}
	logManager.StartTask("Update Goal Match", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("HomePosisi", home),
		sql.Named("AwayPosisi", away),
		sql.Named("StampUser", stampUser),
		sql.Named("RetVal", sql.Out{Dest: &retVal}),
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
	if retVal != "" {
		return errors.New(retVal)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
func UpdateYellowCard(matchID, home, away int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_YELLOW_CARD_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Yellow Card Match", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("HomeYC", home),
		sql.Named("AwayYC", away),
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
func UpdateRedCard(matchID, home, away int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_RED_CARD_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Red Card Match", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("HomeRC", home),
		sql.Named("AwayRC", away),
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
func UpdatePenalty(matchID int, stPenalty, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_PENALTY_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Penalty Match", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StPenalty", stPenalty),
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
func MoveHandicap(matchID, subMatchID int, direction string, point float64, popupID, stampUser, traderGroup string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_MOVE_HANDICAP"
	var err error
	var logParam sql.NullString
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Update Move Handicap", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("MoveDirection", direction),
		sql.Named("MovePoint", point),
		sql.Named("Popup_ID", popupID),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("LogParam", sql.Out{Dest: &logParam}),
		&rs,
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
	if rs == -1 {
		logManager.WriteStatusError("Invalid Handicap")
		return errors.New("Invalid Handicap")
	}
	return err
}
func ChangeHandicap(matchID, subMatchID int, handicap float64, popupID, stampUser, traderGroup string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CHANGE_HANDICAP"
	var err error
	var logParam sql.NullString
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Update Change Handicap", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("Handicap", handicap),
		sql.Named("Popup_ID", popupID),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("LogParam", sql.Out{Dest: &logParam}),
		&rs,
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
	if rs == -120 {
		logManager.WriteStatusError("Duplicate Handicap")
		return errors.New("Duplicate Handicap")
	} else if rs == -121 {
		logManager.WriteStatusError("Invalid Handicap")
		return errors.New("Invalid Handicap")
	}
	return err
}
func ChangeOdds(matchID, subMatchID int, odds float32, popupID, stampUser, traderGroup string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CHANGE_ODDS"
	var err error
	var logParam sql.NullString
	var rs mssql.ReturnStatus // mo lightstreamer
	logManager := logger.LogManager{}
	logManager.StartTask("Update Change Odds", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("Odds", odds),
		sql.Named("Popup_ID", popupID),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("LogParam", sql.Out{Dest: &logParam}),
		&rs,
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
func ChangeOddsEuro(matchID, subMatchID int, odds float32, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CHANGE_ODDS_EURO"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Change Odds Euro", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("Odds", odds),
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
func ChangeOddsCSLive(matchID, gameType int, odds float32, choiceCode, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CS_CHANGE_ODDS"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Change Odds", "MO CS", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("Odds", odds),
		sql.Named("ChoiceCode", choiceCode),
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
func ChangeOdds1X2(matchID, subMatchID int, odds1, odds2, odds3 float32, spread int, profile, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CHANGE_ODDS_1X2"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Change Auto Odds 1X2", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("Odds1", odds1),
		sql.Named("Odds2", odds2),
		sql.Named("Odds3", odds3),
		sql.Named("Spread", spread),
		sql.Named("Profile1X2", profile),
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
func SwapOdds(matchID, subMatchID int, odds float64, popupID, stampUser, traderGroup string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_SWAP_ODDS"
	var err error
	var logParam sql.NullString
	logManager := logger.LogManager{}
	logManager.StartTask("Update Swap Odds", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("Odds", odds),
		sql.Named("Popup_ID", popupID),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroup),
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
func MoveOdds(matchID, subMatchID int, direction string, point float64, odds string, popupID, stampUser, traderGroup string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_MOVE_ODDS"
	var err error
	var logParam sql.NullString
	var rs mssql.ReturnStatus // mo lightstreamer
	logManager := logger.LogManager{}
	logManager.StartTask("Update Move Odds Point", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("MoveDirection", direction),
		sql.Named("MovePoint", point),
		sql.Named("OddsName", odds),
		sql.Named("Popup_ID", popupID),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("LogParam", sql.Out{Dest: &logParam}),
		&rs,
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
func PauseResumeSubMatch(matchID, subMatchID, gameType, status int, stampUser, traderGroup string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_PAUSE_RESUME_SUB_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Pause Resume Sub Match", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("SubMatchPauseID", status),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroup),
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
func SwapHandicap(matchID, subMatchID, gameType int, direction, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_SWAP_LINE_2"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Swap Line", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("Direction", direction),
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
func ChangeLOD(matchID, subMatchID, LOD int, stampUser, traderGroup string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CHANGE_LINK_ODDS"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Change LOD", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("LinkOddsDiff", LOD),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroup),
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
func ChangeSpread(matchID, subMatchID, spread int, popupID, stampUser, traderGroup string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CHANGE_SPREAD"
	var err error
	var logParam sql.NullString
	logManager := logger.LogManager{}
	logManager.StartTask("Update Change Spread", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("Spread", spread),
		sql.Named("Popup_ID", popupID),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroup),
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
func OpenCloseSubMatch(matchID, subMatchID, gameType int, status, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_OPEN_CLOSE_SUB_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Open Close SubMatch", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("SubMatchOpenStatus", status),
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
func PauseResumeMatch(matchID, status int, sessionID, popupID, matchTimeSlot, stampUser, traderGroup, MOPage string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_PAUSE_RESUME_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Pause Resume Match", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("MatchPauseID", status),
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", fmt.Sprintf("MO-%v", matchTimeSlot)),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("MOPage", MOPage),
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
func OpenCloseMatch(matchID int, status, stampUser, traderGroup, MOPage string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_OPEN_CLOSE_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Open Close Match", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("MatchOpenStatus", status),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("MOPage", MOPage),
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
func ChangeAutoCalcOdds1X2(matchID, subMatchID, gameType int, status, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CHANGE_AUTO_CALC_ODDS_1X2"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Change Auto Odds 1X2", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("StAutoCalcOdds", status),
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
func ChangeLDiff(matchID, subMatchID, ldiff int, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CHANGE_LDIFF"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Change LDiff", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("LDiff", ldiff),
		sql.Named("TraderGroup, ", traderGroup),
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
func GetScoreDetail(matchID, stampUser string) (*model.MOScoringDetail, error) {
	dbName := Inetsoccer_Post
	spName := "MGMT_SBA_LIST_SCORE_DETAIL_MO"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Get Score Detail", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	model := model.MOScoringDetail{}
	err = sqlConnections.conn[dbName].QueryRowx(spName, logManager.Parameters...).StructScan(&model)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return &model, nil
}
func UpdateScoreDetail(group string, matchID, sportID, set int, point string, homeAway, stampUser string) error {
	dbName := Inetsoccer_Post
	spName := "MGMT_SBA_PROC_UPD_MO_SCORE_DETAIL"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Score Detail", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("UpdGroup", group),
		sql.Named("MatchID", matchID),
		sql.Named("SportID", sportID),
		sql.Named("Set", set),
		sql.Named("Point", point),
		sql.Named("HomeAway", homeAway),
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
func ListEarlySettlement(matchID int, stampUser string) ([]model.MOEarlySettlement, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_EARLYSETTLEMENT"
	var err error
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("List Early Settlement", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
		&rs,
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MOEarlySettlement{}
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
	if rs == -1 {
		logManager.WriteStatusError("Soccer Only !")
		return nil, errors.New("Soccer Only !")
	} else if rs == -2 {
		logManager.WriteStatusError("Early settlement not active !")
		return nil, errors.New("Early settlement not active !")
	} else if rs == -3 {
		logManager.WriteStatusError("Match Canceled !")
		return nil, errors.New("Match Canceled !")
	} else if rs == -4 {
		logManager.WriteStatusError("No Goal !")
		return nil, errors.New("No Goal !")
	}
	return list, nil
}
func ListEarlySettlementBetList(matchID int, earlySettlementID, stampUser string) ([]model.MOEarlySettlementBetList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_EARLYSETTLEMENT_BET_LIST"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List Early Settlement BetList", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("EarlySettlementID", earlySettlementID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MOEarlySettlementBetList{}
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
func UpdateEarlySettlement(matchID, homePosisi, awayPosisi, stProcessType, stSettle int, earlySettlementID, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_EARLYSETTLEMENT"
	var err error
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Insert Early Settlement", "Early Settlement", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("Home_Posisi", homePosisi),
		sql.Named("Away_Posisi", awayPosisi),
		sql.Named("ST_ProcessType", stProcessType),
		sql.Named("ST_Settle", stSettle),
		sql.Named("EarlySettlementID", earlySettlementID),
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
	if rs == -200 {
		logManager.WriteStatusError("Not Authorized to Unsettle")
		return errors.New("Not Authorized to Unsettle")
	} else if rs < 0 {
		logManager.WriteStatusError("Error Insert Early Settlement")
		return errors.New("Error Insert Early Settlement")
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
func GetMOEditAHOU(matchID, displayAdmin int, stampUser string) (*model.MOEditAHOU, []model.MOEditAHOU2, *model.MOEditAHOU3, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_MO_EDIT_AHOU"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Get MO Edit AHOU", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	var res1 *model.MOEditAHOU
	res2 := []model.MOEditAHOU2{}
	var res3 *model.MOEditAHOU3
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, res2, nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := &model.MOEditAHOU{}
		err = rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
		}
		res1 = model
	}
	if rows.NextResultSet() {
		err = sqlx.StructScan(rows, &res2)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
		}
	}
	if rows.NextResultSet() {
		rows := NewRows{Rows: rows, started: false}
		for rows.Next() {
			model := &model.MOEditAHOU3{}
			err = rows.StructScan(&model)
			if err != nil {
				log.Warnf("[mssql] Failed reading rows: %v", err)
			}
			res3 = model
		}
	}
	return res1, res2, res3, nil
}
func UpdateMOMatchEdit(matchID int, matchDate, matchOpenStatus, matchLiveStatus, matchHasLiveStatus string,
	matchHiddenTimeStatus int, matchNeutralStatus, category string, weather int, specialCode, providerName, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Edit Match", "MO EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("MatchDate", matchDate),
		sql.Named("MatchOpenStatus", matchOpenStatus),
		sql.Named("MatchLiveStatus", matchLiveStatus),
		sql.Named("MatchHasLiveStatus", matchHasLiveStatus),
		sql.Named("MatchHiddenTimeStatus", matchHiddenTimeStatus),
		sql.Named("MatchNeutralStatus", matchNeutralStatus),
		sql.Named("Category", category),
		sql.Named("Weather", weather),
		sql.Named("SpecialCode", specialCode),
		sql.Named("ProviderName", providerName),
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

func UpdateMOMatchProfile(matchID int, profileID, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MATCH_PROFILE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Profile", "MO EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchIDs", matchID),
		sql.Named("ProfileID", profileID),
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

func UpdateSportsTicker(matchID int, sportsTickerStatus, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_SPORTSTICKER"

	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Status Sports Ticker", "MO EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("VendorSportsTicker", sportsTickerStatus),
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
func UpdateSportTickerCS(matchID int, sportsTickerStatus string, gameType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_SPORTSTICKER_CS"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Status Sports Ticker CS", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("VendorSportsTicker", sportsTickerStatus),
		sql.Named("GameType", gameType),
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
func UpdateSportTickerOE(matchID int, sportsTickerStatus string, gameType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_SPORTSTICKER_OE"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Status Sports Ticker OE", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("VendorSportsTicker", sportsTickerStatus),
		sql.Named("GameType", gameType),
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
func UpdateMatchParlay(matchID int, bbStatus string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_BETBUILDER"
	var err error
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Parlay", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("BB_Status", bbStatus),
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
	if rs == 1 {
		logManager.WriteStatusError("Failed update match parlay status")
		return errors.New("Failed update match parlay status")
	}
	return err
}
func UpdateOddsPointDiff(matchID, displayAdmin, oddsPointDiffAH, oddsPointDiffAHLive, oddsPointDiffOU, oddsPointDiffOULive int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_ODDS_POINT_DIFF"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Edit Odds Point Diff", "MO EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
		sql.Named("OddsPointDiffAH", oddsPointDiffAH),
		sql.Named("OddsPointDiffAHLive", oddsPointDiffAHLive),
		sql.Named("OddsPointDiffOU", oddsPointDiffOU),
		sql.Named("OddsPointDiffOULive", oddsPointDiffOULive),
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
func UpdateParlay(matchID, displayAdmin, parlayAH, parlayOU, parlayOE, parlay1X2,
	parlaySpreadAH, parlaySpreadOU, parlaySpreadOE,
	parlaySpreadAHLive, parlaySpreadOULive, parlaySpreadOELive,
	parlayML, parlaySpreadML, parlaySpreadMLLive,
	parlayHWNW, parlaySpreadHWNW, parlaySpreadHWNWLive, parlayAWNW, parlaySpreadAWNW, parlaySpreadAWNWLive int,
	stampUser string,
) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_PARLAY"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Edit Parlay", "MO EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
		sql.Named("ParlayAH", parlayAH),
		sql.Named("ParlayOU", parlayOU),
		sql.Named("ParlayOE", parlayOE),
		sql.Named("Parlay1X2", parlay1X2),
		sql.Named("ParlaySpreadAH", parlaySpreadAH),
		sql.Named("ParlaySpreadOU", parlaySpreadOU),
		sql.Named("ParlaySpreadOE", parlaySpreadOE),
		sql.Named("ParlaySpreadAHLive", parlaySpreadAHLive),
		sql.Named("ParlaySpreadOULive", parlaySpreadOULive),
		sql.Named("ParlaySpreadOELive", parlaySpreadOELive),
		sql.Named("ParlayML", parlayML),
		sql.Named("ParlaySpreadML", parlaySpreadML),
		sql.Named("ParlaySpreadMLLive", parlaySpreadMLLive),
		sql.Named("ParlayHWNW", parlayHWNW),
		sql.Named("ParlaySpreadHWNW", parlaySpreadHWNW),
		sql.Named("ParlaySpreadHWNWLive", parlaySpreadHWNWLive),
		sql.Named("ParlayAWNW", parlayAWNW),
		sql.Named("ParlaySpreadAWNW", parlaySpreadAWNW),
		sql.Named("ParlaySpreadAWNWLive", parlaySpreadAWNWLive),
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
func UpdateParlayTennis(matchID, displayAdmin,
	parlayAH, parlayGAH, parlayOU, parlayOE, parlay1X2,
	parlaySpreadAH, parlaySpreadGAH, parlaySpreadOU, parlaySpreadOE,
	parlaySpreadAHLive, parlaySpreadGAHLive, parlaySpreadOULive, parlaySpreadOELive,
	parlayML, parlaySpreadML, parlaySpreadMLLive int,
	stampUser string,
) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_PARLAY_TENNIS"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Edit Parlay", "MO TENNIS EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
		sql.Named("ParlayAH", parlayAH),
		sql.Named("ParlayGH", parlayGAH),
		sql.Named("ParlayGOU", parlayOU),
		sql.Named("ParlayGOE", parlayOE),
		sql.Named("ParlaySpreadAH", parlaySpreadAH),
		sql.Named("ParlaySpreadGH", parlaySpreadGAH),
		sql.Named("ParlaySpreadGOU", parlaySpreadOU),
		sql.Named("ParlaySpreadGOE", parlaySpreadOE),
		sql.Named("ParlaySpreadAHLive", parlaySpreadAHLive),
		sql.Named("ParlaySpreadGHLive", parlaySpreadGAHLive),
		sql.Named("ParlaySpreadGOULive", parlaySpreadOULive),
		sql.Named("ParlaySpreadGOELive", parlaySpreadOELive),
		sql.Named("ParlayML", parlayML),
		sql.Named("ParlaySpreadML", parlaySpreadML),
		sql.Named("ParlaySpreadMLLive", parlaySpreadMLLive),
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
func UpdateRBDelay(matchID, autoAcceptDelayHome, autoAcceptDelayAway, autoAcceptDelayOver, autoAcceptDelayUnder int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_RB_DELAY"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Edit RB Delay", "MO EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("AutoAcceptDelayHome", autoAcceptDelayHome),
		sql.Named("AutoAcceptDelayAway", autoAcceptDelayAway),
		sql.Named("AutoAcceptDelayOver", autoAcceptDelayOver),
		sql.Named("AutoAcceptDelayUnder", autoAcceptDelayUnder),
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
func UpdateLinkOdds(matchID, subMatchID, linkOddsDiff, linkOddsSpread, linkOddsDiffLock int, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_LINK_ODDS"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update MO Link Odds Diff", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("LinkOddsDiff", linkOddsDiff),
		sql.Named("LinkOddsSpread", linkOddsSpread),
		sql.Named("LinkOddsDiffLock", linkOddsDiffLock),
		sql.Named("traderGroup", traderGroup),
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
func UpdateMOTimedMaxBet(time, matchID, subMatchID, timedMaxBetDiffMinute, timedMaxBetDiff, timedMaxLimitDiff int, stampUser string) error {
	dbName := Inetsoccer
	var err error
	var spName string
	if time == 1 {
		spName = "MGMT_SBA_PROC_UPD_MO_EDIT_TIMED_MAXBET_1"
	} else {
		spName = "MGMT_SBA_PROC_UPD_MO_EDIT_TIMED_MAXBET_2"
	}
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Update Edit Timed MaxBet", "MO EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("TimedMaxBetDiffMinute", timedMaxBetDiffMinute),
		sql.Named("TimedMaxBetDiff", timedMaxBetDiff),
		sql.Named("TimedMaxLimitDiff", timedMaxLimitDiff),
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
	if rs == -90 {
		logManager.WriteStatusError("Unable Update Timed MaxBet & MaxLimit - Timer 1 have to be less than timer 2")
		return errors.New("Unable Update Timed MaxBet & MaxLimit - Timer 1 have to be less than timer 2")
	}
	return err
}
func UpdateMatchLiveStatus(matchID int, status, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TRADING_LIVE_FINALIZE"
	var err error
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Update Live Finalize Match", "MO EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("MatchLiveStatus", status),
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
	if rs == -99 {
		logManager.WriteStatusError("Unable Update Live Finalize Match - This Match Has Pending Bets")
		return errors.New("Unable Update Live Finalize Match - This Match Has Pending Bets")
	}
	return err
}
func UpdateFixMarket(matchID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_PATCH_SUBPARTAI"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Fix Market", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
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
func UpdateAutoProcessBetBazar(matchID int, status, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_AUTO_PROCESS_BETBAZAR"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Auto Process BetBazar", "MO EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("isAutoProcess_BetBazar", status),
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

func UpdateAutoProcessIM(MatchID int, isAutoProcess_IM, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_AUTO_PROCESS_IM"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Auto Process IM", "MO Edit", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", MatchID),
		sql.Named("isAutoProcess_IM", isAutoProcess_IM),
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
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)

	}
	return err
}

func UpdateProfileGameType(matchID, subMatchID, gameType,
	price_Step_1, price_Step_2, price_Step_3, price_Step_4 int,
	limit_Change_1, limit_Change_2, limit_Change_3, limit_Change_4,
	max_Limit_1, max_Limit_2, max_Limit_3, max_Limit_4,
	max_Bet_1, max_Bet_2, max_Bet_3, max_Bet_4 decimal.Decimal,
	stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_PROFILE"
	var err error
	var ErrMessage string
	logManager := logger.LogManager{}
	logManager.StartTask("Update Edit Profile", "MO EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("Price_Step_1", price_Step_1),
		sql.Named("Price_Step_2", price_Step_2),
		sql.Named("Price_Step_3", price_Step_3),
		sql.Named("Price_Step_4", price_Step_4),
		sql.Named("Limit_Change_1", limit_Change_1),
		sql.Named("Limit_Change_2", limit_Change_2),
		sql.Named("Limit_Change_3", limit_Change_3),
		sql.Named("Limit_Change_4", limit_Change_4),
		sql.Named("Max_Limit_1", max_Limit_1),
		sql.Named("Max_Limit_2", max_Limit_2),
		sql.Named("Max_Limit_3", max_Limit_3),
		sql.Named("Max_Limit_4", max_Limit_4),
		sql.Named("Max_Bet_1", max_Bet_1),
		sql.Named("Max_Bet_2", max_Bet_2),
		sql.Named("Max_Bet_3", max_Bet_3),
		sql.Named("Max_Bet_4", max_Bet_4),
		sql.Named("StampUser", stampUser),
		sql.Named("ErrMessage", sql.Out{Dest: &ErrMessage}),
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
	if ErrMessage != "" {
		return errors.New(ErrMessage)
	}
	return err
}
func UpdateProfileGameType1X2(matchID, subMatchID int, odds1, odds2, odds3, oddsDiff1, oddsDiff2, oddsDiff3, LAP, LAPLive decimal.Decimal, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_EDIT_1X2"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Edit 1X2", "MO EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("Odds1", odds1),
		sql.Named("Odds2", odds2),
		sql.Named("Odds3", odds3),
		sql.Named("OddsDiff1", oddsDiff1),
		sql.Named("OddsDiff2", oddsDiff2),
		sql.Named("OddsDiff3", oddsDiff3),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("LAP", LAP),
		sql.Named("LAPLive", LAPLive),
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
func AddSubMatch(matchID int, HTFT, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MO_EDIT_SUB_MATCH_AHOU"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Add SubMatch AHOU", "MO EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("HTFT", HTFT),
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
func DeleteSubMatch(matchID, displayAdmin int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_MO_EDIT_SUB_MATCH_AHOU"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Delete SubMatch AHOU", "MO EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("DisplayAdmin", displayAdmin),
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
func ListMoreOE(matchID int, stampUser string) ([]model.MOMoreOE, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_MORE_OE"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List More OE", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MOMoreOE{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MOMoreOE{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMoreWNW(matchID int, stampUser string) ([]model.MOMoreOE, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_MORE_WNW"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List More WNW", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.MOMoreOE{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		model := model.MOMoreOE{}
		err := rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMoreSpecial(matchID int, stampUser string) (map[string]interface{}, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_MORE_SPECIAL"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List More Special", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	listSpecial := make(map[string]interface{})
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	temp := []model.MOMoreSpecial{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	listSpecial["YN"] = temp
	rows.NextResultSet()
	temp = []model.MOMoreSpecial{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	listSpecial["HA"] = temp
	rows.NextResultSet()
	temp = []model.MOMoreSpecial{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	listSpecial["HNB"] = temp
	rows.NextResultSet()
	temp = []model.MOMoreSpecial{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	listSpecial["ANB"] = temp
	rows.NextResultSet()
	temp = []model.MOMoreSpecial{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	listSpecial["12HD"] = temp
	rows.NextResultSet()
	temp = []model.MOMoreSpecial{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	listSpecial["GT"] = temp
	rows.NextResultSet()
	temp = []model.MOMoreSpecial{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	listSpecial["3WH"] = temp
	rows.NextResultSet()
	temp = []model.MOMoreSpecial{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	listSpecial["CSH"] = temp
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return listSpecial, nil
}
func ListMoreCS(matchID int, stampUser string) (map[string]interface{}, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_MORE_CS"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List More CS", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := make(map[string]interface{})
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	defer rows.Close()
	temp := []model.MOMoreCS{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	list["CS"] = temp
	rows.NextResultSet()
	temp2 := []model.MOMoreCSLive{}
	err = sqlx.StructScan(rows, &temp2)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	list["CSLive"] = temp2
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListMoreBasketHT(matchID int, stampUser string) ([]model.MOMoreBasketHT1, []model.MOMoreBasketHT2, []model.MOMoreBasketHT3, []model.MOMoreBasketHT4, []model.MOMoreBasketHT5, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_MORE_BASKETBALL_HT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List More Basket HT", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list1 := []model.MOMoreBasketHT1{}
	list2 := []model.MOMoreBasketHT2{}
	list3 := []model.MOMoreBasketHT3{}
	list4 := []model.MOMoreBasketHT4{}
	list5 := []model.MOMoreBasketHT5{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, nil, nil, nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list1)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list2)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list3)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list4)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list5)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list1, list2, list3, list4, list5, nil
}
func ListMoreBasketFT(matchID int, stampUser string) ([]model.MOMoreBasketFT1, []model.MOMoreBasketFT2, []model.MOMoreBasketFT3, []model.MOMoreBasketFT4, []model.MOMoreBasketFT5, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_MORE_BASKETBALL_FT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List More Basket FT", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list1 := []model.MOMoreBasketFT1{}
	list2 := []model.MOMoreBasketFT2{}
	list3 := []model.MOMoreBasketFT3{}
	list4 := []model.MOMoreBasketFT4{}
	list5 := []model.MOMoreBasketFT5{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, nil, nil, nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list1)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list2)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list3)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list4)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list5)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list1, list2, list3, list4, list5, nil
}
func ListMoreBasketMainQT(matchID int, stampUser string) ([]model.MOMoreBasketMainQT1, []model.MOMoreBasketMainQT2, []model.MOMoreBasketMainQT3,
	[]model.MOMoreBasketMainQT4, []model.MOMoreBasketMainQT5, []model.MOMoreBasketMainQT6, []model.MOMoreBasketMainQT7, []model.MOMoreBasketMainQT8,
	error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_MORE_BASKETBALL_QUARTER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List More Basket QT", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list1 := []model.MOMoreBasketMainQT1{}
	list2 := []model.MOMoreBasketMainQT2{}
	list3 := []model.MOMoreBasketMainQT3{}
	list4 := []model.MOMoreBasketMainQT4{}
	list5 := []model.MOMoreBasketMainQT5{}
	list6 := []model.MOMoreBasketMainQT6{}
	list7 := []model.MOMoreBasketMainQT7{}
	list8 := []model.MOMoreBasketMainQT8{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list1)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list2)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list3)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list4)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list5)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list6)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list7)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list8)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list1, list2, list3, list4, list5, list6, list7, list8, nil
}

func ListMoreBasketQT1(matchID int, stampUser string) ([]model.MOMoreBasketSubQT1, []model.MOMoreBasketSubQT2, []model.MOMoreBasketSubQT3,
	[]model.MOMoreBasketSubQT4, []model.MOMoreBasketSubQT5, []model.MOMoreBasketSubQT6, []model.MOMoreBasketSubQT7, []model.MOMoreBasketSubQT8,
	error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_MORE_BASKETBALL_QUARTER_1"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List More Basket QT1", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list1 := []model.MOMoreBasketSubQT1{}
	list2 := []model.MOMoreBasketSubQT2{}
	list3 := []model.MOMoreBasketSubQT3{}
	list4 := []model.MOMoreBasketSubQT4{}
	list5 := []model.MOMoreBasketSubQT5{}
	list6 := []model.MOMoreBasketSubQT6{}
	list7 := []model.MOMoreBasketSubQT7{}
	list8 := []model.MOMoreBasketSubQT8{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list1)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list2)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list3)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list4)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list5)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list6)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list7)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list8)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list1, list2, list3, list4, list5, list6, list7, list8, nil
}

func ListMoreBasketQT2(matchID int, stampUser string) ([]model.MOMoreBasketSubQT1, []model.MOMoreBasketSubQT2, []model.MOMoreBasketSubQT3,
	[]model.MOMoreBasketSubQT4, []model.MOMoreBasketSubQT5, []model.MOMoreBasketSubQT6, []model.MOMoreBasketSubQT7, []model.MOMoreBasketSubQT8,
	error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_MORE_BASKETBALL_QUARTER_2"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List More Basket QT1", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list1 := []model.MOMoreBasketSubQT1{}
	list2 := []model.MOMoreBasketSubQT2{}
	list3 := []model.MOMoreBasketSubQT3{}
	list4 := []model.MOMoreBasketSubQT4{}
	list5 := []model.MOMoreBasketSubQT5{}
	list6 := []model.MOMoreBasketSubQT6{}
	list7 := []model.MOMoreBasketSubQT7{}
	list8 := []model.MOMoreBasketSubQT8{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list1)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list2)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list3)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list4)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list5)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list6)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list7)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list8)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list1, list2, list3, list4, list5, list6, list7, list8, nil
}

func ListMoreBasketQT3(matchID int, stampUser string) ([]model.MOMoreBasketSubQT1, []model.MOMoreBasketSubQT2, []model.MOMoreBasketSubQT3,
	[]model.MOMoreBasketSubQT4, []model.MOMoreBasketSubQT5, []model.MOMoreBasketSubQT6, []model.MOMoreBasketSubQT7, []model.MOMoreBasketSubQT8,
	error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_MORE_BASKETBALL_QUARTER_3"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List More Basket QT1", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list1 := []model.MOMoreBasketSubQT1{}
	list2 := []model.MOMoreBasketSubQT2{}
	list3 := []model.MOMoreBasketSubQT3{}
	list4 := []model.MOMoreBasketSubQT4{}
	list5 := []model.MOMoreBasketSubQT5{}
	list6 := []model.MOMoreBasketSubQT6{}
	list7 := []model.MOMoreBasketSubQT7{}
	list8 := []model.MOMoreBasketSubQT8{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list1)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list2)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list3)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list4)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list5)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list6)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list7)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list8)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list1, list2, list3, list4, list5, list6, list7, list8, nil
}

func ListMoreBasketQT4(matchID int, stampUser string) ([]model.MOMoreBasketSubQT1, []model.MOMoreBasketSubQT2, []model.MOMoreBasketSubQT3,
	[]model.MOMoreBasketSubQT4, []model.MOMoreBasketSubQT5, []model.MOMoreBasketSubQT6, []model.MOMoreBasketSubQT7, []model.MOMoreBasketSubQT8,
	error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MO_MORE_BASKETBALL_QUARTER_4"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List More Basket QT1", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list1 := []model.MOMoreBasketSubQT1{}
	list2 := []model.MOMoreBasketSubQT2{}
	list3 := []model.MOMoreBasketSubQT3{}
	list4 := []model.MOMoreBasketSubQT4{}
	list5 := []model.MOMoreBasketSubQT5{}
	list6 := []model.MOMoreBasketSubQT6{}
	list7 := []model.MOMoreBasketSubQT7{}
	list8 := []model.MOMoreBasketSubQT8{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list1)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list2)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list3)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list4)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list5)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list6)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list7)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list8)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, nil, nil, nil, nil, nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list1, list2, list3, list4, list5, list6, list7, list8, nil
}

func UpdateMoreGameType(matchID, gameType int, odds1, odds2, odds3, odds4, odds5, odds6, odds7, odds8, odds9, odds10,
	odds11, odds12, odds13, odds14, odds15, odds16, odds17, odds18, odds19, odds20, odds21, odds22, odds23, odds24, odds25, odds26, odds27 float32,
	sTOddsMargin, sTOddsMargin2 string, oddsMargin, oddsMargin2 float32, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_MORE"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update MO More Odds", "MO MORE", stampUser)
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
		sql.Named("ST_OddsMargin", sTOddsMargin),
		sql.Named("ST_OddsMargin2", sTOddsMargin2),
		sql.Named("OddsMargin", oddsMargin),
		sql.Named("OddsMargin2", oddsMargin2),
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
func UpdateMoreGameType3WH(matchID, gameType int, handicap, odds1, odds2, odds3, oddsMargin float32,
	sT_OddsMargin, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_MORE_3WH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update MO More Odds 3WH", "MO MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("Handicap", handicap),
		sql.Named("Odds1", odds1),
		sql.Named("Odds2", odds2),
		sql.Named("Odds3", odds3),
		sql.Named("ST_OddsMargin", sT_OddsMargin),
		sql.Named("OddsMargin", oddsMargin),
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
func UpdateMoreGameTypeBasketball(matchID, gameType, stFav int, handicap, odds1, odds2, odds3, odds4, odds5, odds6, odds7, odds8, odds9, odds10, odds11, odds12, odds13, odds14, odds15, odds16, odds17, odds18 float32, stOddsMargin string, oddsMargin float32, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_MORE_BASKETBALL"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update MO More Odds Basketball", "MO MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("ST_Fav", stFav),
		sql.Named("Handicap", handicap),
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
		sql.Named("ST_OddsMargin", stOddsMargin),
		sql.Named("OddsMargin", oddsMargin),
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
func UpdateMoreStatusBGAll(matchID int, status, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_MORE_SETTING_BG_STATUS_ALL"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update More Status BG All", "MO MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("BG_Status_Open", status),
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
func UpdateMoreStatusCloseOpenAll(matchID int, status, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_MORE_SETTING_CLOSE_OPEN_ALL"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update More Status CloseOpen All", "MO MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("Sub_Match_Status_Open", status),
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
func UpdateMoreStatusPauseResumeAll(matchID, status int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_MORE_SETTING_PAUSE_RESUME_ALL"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update More Status PauseResume All", "MO MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("Sub_Match_Status_Pause", status),
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
func UpdateMoreStatusBG(matchID, subMatchID, gameType int, status, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_MORE_BG_STATUS"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update More Status BG", "MO MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("BG_Status", status),
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
func UpdateMoreStatusParlay(matchID, sportID, subMatchID, gameType int, status, stampUser string) error {
	dbName := Inetsoccer
	var spName string
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update More Status Parlay", "MO MORE", stampUser)

	switch sportID {
	case 12:
		spName = "MGMT_SBA_PROC_UPD_MO_MORE_BASKETBALL_PARLAY_STATUS"
		break
	default:
		spName = "MGMT_SBA_PROC_UPD_MO_MORE_PARLAY_STATUS"
	}

	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("Sub_Match_Parlay_Status", status),
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
func UpdateMoreStatusPause(matchID, sportID, subMatchID, gameType, status int, stampUser string) error {
	dbName := Inetsoccer
	var spName string
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update More Status Pause", "MO MORE", stampUser)
	switch sportID {
	case 12:
		spName = "MGMT_SBA_PROC_UPD_MO_MORE_BASKETBALL_PAUSE_RESUME"
		break
	default:
		spName = "MGMT_SBA_PROC_UPD_MO_MORE_PAUSE_RESUME"
	}
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("Sub_Match_Status_Pause", status),
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
func UpdateMoreStatusOpen(matchID, sportID, subMatchID, gameType int, status, stampUser string) error {
	dbName := Inetsoccer
	var spName string
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update More Status Open", "MO MORE", stampUser)
	switch sportID {
	case 12:
		spName = "MGMT_SBA_PROC_UPD_MO_MORE_BASKETBALL_CLOSE_OPEN"
		break
	default:
		spName = "MGMT_SBA_PROC_UPD_MO_MORE_CLOSE_OPEN"
	}
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("Sub_Match_Status_Open", status),
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
func UpdateStatusPauseCS(matchID, gameType int, choiceCode string, status int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CS_PAUSE_RESUME_PER_CHOICE"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Pause Resume", "MO CS", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("ChoiceCode", choiceCode),
		sql.Named("ChoicePauseID", status),
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
func UpdateStatusPauseCSAll(matchID, gameType, status int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CS_PAUSE_RESUME_SUB_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Pause Resume All", "MO CS", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("SubMatchPauseID", status),
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
func UpdateMoreStatusPauseBasketball(matchID, subMatchID, gameType int, subMatchStatusPause, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_MORE_BASKETBALL_PAUSE_RESUME"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update More Status Pause Resume Basketball", "MO MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("Sub_Match_Status_Pause", subMatchStatusPause),
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
func UpdateStatusOpenCS(matchID, gameType int, choiceCode, status, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CS_OPEN_CLOSE_PER_CHOICE"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Open Close", "MO CS", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("ChoiceCode", choiceCode),
		sql.Named("ChoiceOpenStatus", status),
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
func UpdateStatusOpenCSAll(matchID, gameType int, status, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CS_OPEN_CLOSE_SUB_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Open Close All", "MO CS", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("SubMatchOpenStatus", status),
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
func UpdateFollowLeechSubMatch(matchID, subMatchID, gameType, status int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_FOLLOW_LEECHING_SUB_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update MO Follow Leech Sub Match", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SubMatchID", subMatchID),
		sql.Named("GameType", gameType),
		sql.Named("FollowLeeching", status),
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
func UpdateLeechAssign(matchID, status int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MATCH_LEECH_ASSIGN_AUTOODDS"
	var err error
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Update MO Leech Assign Auto Odds", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("Auto_Odds", status),
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
	if rs == -1 {
		logManager.WriteStatusError("Data is not exist")
		return errors.New("Data is not exist")
	}
	return err
}
func GetAutoCloseAutoTimer(matchID int, stampUser string) (*model.AutoCloseAutoTimer, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_MO_MATCH_AUTOCLOSE_AUTOTIMER"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Get Auto Close AutoTimer", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	model := model.AutoCloseAutoTimer{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		err = rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return &model, err
}
func UpdateAutoClose(matchID int, status, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_MATCH_AUTOCLOSE"
	var err error
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Update Match AutoClose", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("ST_AutoClose", status),
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
	if rs == 0 || rs == -1 {
		logManager.WriteStatusError("Failed to Update Auto Close")
		return errors.New("Failed to Update Auto Close")
	}
	return err
}
func UpdateAutoTimer(matchID int, status, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_MATCH_AUTOTIMER"
	var err error
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Update Match AutoTimer", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("ST_AutoTimer", status),
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
	if rs == 0 || rs == -1 {
		logManager.WriteStatusError("Failed to Update Speedy Timer")
		return errors.New("Failed to Update Speedy Timer")
	}
	return err
}
func UpdateMatchTime(matchID, round, minutes int, stInjuryHT, stInjuryFT string, matchInjuryHT, matchInjuryFT int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_MATCH_TIME"
	var err error
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Time", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("Round", round),
		sql.Named("Minutes", minutes),
		sql.Named("ST_InjuryTimeHT", stInjuryHT),
		sql.Named("ST_InjuryTimeFT", stInjuryFT),
		sql.Named("MatchInjuryTimeHT", matchInjuryHT),
		sql.Named("MatchInjuryTimeFT", matchInjuryFT),
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

	if rs == 0 || rs == -1 {
		logManager.WriteStatusError("Failed to Update Match Time")
		return errors.New("Failed to Update Match Time")
	}
	return err
}
func GetBasketTimer(matchID int, stampUser string) (*model.BasketTimer, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_MO_BASKET_TIMER"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Get Basket Timer", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	model := model.BasketTimer{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		err = rows.StructScan(&model)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return &model, err
}
func UpdateBasketTimer(matchID int, timerCode, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_BASKET_TIMER"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Basket Timer", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("TimerCode", timerCode),
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
func UpdateAdjustBasketTimer(matchID, round, minutes, seconds int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_ADJUST_BASKET_TIMER"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Basket Timer (Adjust)", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("Round", round),
		sql.Named("Minutes", minutes),
		sql.Named("Second", seconds),
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
func PauseResumeAll(status int, sessionID, popupID, matchTimeSlot, MOPage, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_PAUSE_RESUME_PAGE"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Pause Resume Page", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("SubMatchPauseID", status),
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", fmt.Sprintf("MO-%v", matchTimeSlot)),
		sql.Named("MOPage", MOPage),
		sql.Named("TraderGroup", traderGroup),
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
func PauseResumeAllCS(status int, sessionID, popupID, matchTimeSlot, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_CS_PAUSE_RESUME_PAGE"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Pause Resume Page", "MO CS", stampUser)
	logManager.WriteParameters(
		sql.Named("SubMatchPauseID", status),
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", fmt.Sprintf("MO-%v", matchTimeSlot)),
		sql.Named("TraderGroup", traderGroup),
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

func GetFinalScore(MatchID int, stampUser string) (model.MOScoring, error) {

	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_MO_FINAL_SCORE"
	var err error
	var list model.MOScoring
	logManager := logger.LogManager{}
	logManager.StartTask("Get Final Score", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", MatchID),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(MatchID)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return list, err
	}
	defer rows.Close()
	rows.Next()
	err = rows.StructScan(&list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return list, err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, err
}

func UpdMOChangeLock1X2(MatchID, SubMatchID, LinkOddsDiffLock int, stampUser string) error {

	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MO_LOCK_LINK_ODDS_1X2"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update Change Lock 1x2", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", MatchID),
		sql.Named("SubMatchID", SubMatchID),
		sql.Named("LinkOddsDiffLock", LinkOddsDiffLock),
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
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}

func GetOGTIsPauseStatus(matchID int, stampUser string) (int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_MO_MORE_ISPAUSE"
	var err error
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Get OGT Is Pause", "MO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
		&rs,
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
		return 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return int(rs), err
}
