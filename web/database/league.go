package database

import (
	"database/sql"
	"errors"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListSelectLeague(popupID, sessionID, groupName, fromEarlyDate, toEarlyDate, OS, leagueName, listSport, category string, userTeamID, userTeamSubID int, traderGroupORI, stampUser string) ([]model.League, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SELECT_LEAGUE"
	if strings.ToLower(groupName) == "forecast-post" {
		spName = "MGMT_SBA_LIST_GRID_SELECT_LEAGUE_FORECAST_POST"
	}
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Select League", "Trading", stampUser)
	params := []interface{}{
		sql.Named("PopupID", popupID),
		sql.Named("SessionID", sessionID),
		sql.Named("GroupName", groupName),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("LeagueName", leagueName),
		sql.Named("ListSport", listSport),
		sql.Named("Category", category),
		sql.Named("UserTeamID", userTeamID),
		sql.Named("UserTeamSub", userTeamSubID),
		sql.Named("StampUser", stampUser),
	}
	if strings.ToLower(groupName) != "forecast-post" {
		params = append(params, sql.Named("OS", OS))
		params = append(params, sql.Named("TraderGroup", traderGroupORI))
	}
	logManager.WriteParameters(params...)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.League{}
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

func UpdateSelectLeague(popupID, sessionID, groupName, fromEarlyDate, toEarlyDate, leagueIDs string, userTeamID, userTeamSubID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SELECT_LEAGUE"
	if strings.ToLower(groupName) == "forecast-post" {
		spName = "MGMT_SBA_PROC_UPD_SELECT_LEAGUE_POST"
	}
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Select League", "Trading", stampUser)
	logManager.WriteParameters(
		sql.Named("PopupID", popupID),
		sql.Named("SessionID", sessionID),
		sql.Named("GroupName", groupName),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("LeagueIDs", leagueIDs),
		sql.Named("UserTeamID", userTeamID),
		sql.Named("UserTeamSub", userTeamSubID),
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

func UpdateSelectLeagueRefresh(popupID, sessionID, groupName, fromEarlyDate, toEarlyDate string, userTeamID, userTeamSubID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SELECT_LEAGUE_REFRESH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Select League Refresh", "Trading", stampUser)
	logManager.WriteParameters(
		sql.Named("GroupName", groupName),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("StampUser", stampUser),
		sql.Named("UserTeamID", userTeamID),
		sql.Named("UserTeamSub", userTeamSubID),
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

func ListLeagueInstantBet(sportID int, sessionID, stampUser, traderGroupORI string, userTeamID, userTeamSubID int) ([]model.InstantBetLeague, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_INSTANT_BET_2"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Instant Bet", "Instant Bet", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("SessionID", sessionID),
		sql.Named("StampUser", stampUser),
		sql.Named("TraderGroup", traderGroupORI),
		sql.Named("UserTeamID", userTeamID),
		sql.Named("UserTeamSub", userTeamSubID),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.InstantBetLeague{}
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

func ListMasterLeague(sportId, currentPage, pageSize, leagueId, priceGroup *int, active, leagueNameEN, shortName, profileId, profile1x2, category, sort, by, stampUser string) ([]model.MasterLeague, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_LEAGUE"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Master League", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportId),
		sql.Named("LeagueNameEnUS", leagueNameEN),
		sql.Named("ShortName", shortName),
		sql.Named("ProfileID", profileId),
		sql.Named("Profile1X2", profile1x2),
		sql.Named("PriceGroup", priceGroup),
		sql.Named("Category", category),
		sql.Named("Active", active),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		sql.Named("PageOrder", sort+" "+by),
		sql.Named("LeagueID", leagueId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MasterLeague{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, totalRecords, nil
}

func ListLeagueExportXLS(sportId int, stampUser string) ([]model.MasterLeagueExport, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_LEAGUE_DELETE_XLS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Export XLS", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("StampUser", stampUser),
		sql.Named("SportID", sportId),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MasterLeagueExport{}
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

func GetMasterLeagueDetail(leagueId int, stampUser string) (*model.MasterLeagueDetail, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_MASTER_LEAGUE_DETAIL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Master League Detail", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	model := model.MasterLeagueDetail{}
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

func CreateMasterLeague(
	leagueSequence, sportId int,
	profileID string, priceGroup int, category, competition, active string,
	shortName, leagueNameEN, leagueNameCN, leagueNameTW, leagueNameTH, leagueNameJP, leagueNameKR, leagueNameVN, leagueNameID,
	stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MASTER_LEAGUE"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Insert League", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueSequence", leagueSequence),
		sql.Named("SportID", sportId),
		sql.Named("ProfileID", profileID),
		sql.Named("PriceGroup", priceGroup),
		sql.Named("Category", category),
		sql.Named("Competition", competition),
		sql.Named("Active", active),
		sql.Named("LeagueNameShortName", shortName),
		sql.Named("LeagueNameEnUS", leagueNameEN),
		sql.Named("LeagueNameZhCN", leagueNameCN),
		sql.Named("LeagueNameZhTW", leagueNameTW),
		sql.Named("LeagueNameThTH", leagueNameTH),
		sql.Named("LeagueNameJaJP", leagueNameJP),
		sql.Named("LeagueNameKoKR", leagueNameKR),
		sql.Named("LeagueNameViVN", leagueNameVN),
		sql.Named("LeagueNameIdID", leagueNameID),
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
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	if rs > 0 {
		logManager.WriteStatusError("League Name already exist")
		return errors.New("League Name already exist")
	}
	return err
}

func UpdateMasterLeague(
	leagueID, leagueSequence, leagueSequenceLive int,
	profileID string, priceGroup int, category, competition, active string,
	shortName, leagueNameEN, leagueNameCN, leagueNameTW, leagueNameTH, leagueNameJP, leagueNameKR, leagueNameVN, leagueNameID,
	stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_LEAGUE"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Update League", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueID),
		sql.Named("LeagueSequence", leagueSequence),
		sql.Named("LeagueSequenceLive", leagueSequenceLive),
		sql.Named("ProfileID", profileID),
		sql.Named("PriceGroup", priceGroup),
		sql.Named("Category", category),
		sql.Named("Competition", competition),
		sql.Named("Active", active),
		sql.Named("ShortName", shortName),
		sql.Named("LeagueNameEnUS", leagueNameEN),
		sql.Named("LeagueNameZhCN", leagueNameCN),
		sql.Named("LeagueNameZhTW", leagueNameTW),
		sql.Named("LeagueNameThTH", leagueNameTH),
		sql.Named("LeagueNameJaJP", leagueNameJP),
		sql.Named("LeagueNameKoKR", leagueNameKR),
		sql.Named("LeagueNameViVN", leagueNameVN),
		sql.Named("LeagueNameIdID", leagueNameID),
		sql.Named("StampUser", stampUser),
		&rs,
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Events", leagueID, []string{"Nama_Events, Nama_Events1, PriceGroup, LimitID, ST_Active, Category"})
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	res, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}
	defer res.Close()

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	if rs == -1 {
		logManager.WriteStatusError("Duplicate Seq Not Live")
		return errors.New("Duplicate Seq Not Live")
	} else if rs == -2 {
		logManager.WriteStatusError("Duplicate Seq Live")
		return errors.New("Duplicate Seq Live")
	} else if rs == -3 {
		logManager.WriteStatusError("Seq (Not) Live must between 1 and 200")
		return errors.New("Seq (Not) Live must between 1 and 200")
	} else if rs == -4 {
		logManager.WriteStatusError("Seq (Not) Live must bigger than 200")
		return errors.New("Seq (Not) Live must bigger than 200")
	}
	return err
}

func UpdateLeagueName(leagueID int, leagueNameEN, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_LEAGUE_NAME"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Update League Name", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueID),
		sql.Named("LeagueNameEnUS", leagueNameEN),
		sql.Named("StampUser", stampUser),
		&rs,
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Events", leagueID, []string{"Nama_Events, Nama_Events1, PriceGroup, LimitID, ST_Active, Category"})
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
	if rs != 1 {
		logManager.WriteStatusError("League Name already in used")
		return errors.New("League Name already in used")
	}
	return err
}

func UpdateParentLeague(leagueId, parentLeagueId int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SPECIAL_MASTER_LEAGUE"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Update Parent League", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("ParentLeagueID", parentLeagueId),
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
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	if rs == -100 {
		logManager.WriteStatusError("Parent League doesn't exist")
		return errors.New("Parent League doesn't exist")
	}
	return err
}

func UpdateOddsStep(leagueId, evOddsStep, evOddsStepOU, evOddsStepTimerHT, evOddsStepTimerFT int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_ODDS_STEP_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Odds Step", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("EvOddsStep", evOddsStep),
		sql.Named("EvOddsStepOU", evOddsStepOU),
		sql.Named("EvOddsStepTimerHT", evOddsStepTimerHT),
		sql.Named("EvOddsStepTimerFT", evOddsStepTimerFT),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Events", leagueId, []string{"EvOddsStep, EvOddsStepOU, EvOddsStepTimerHT, EvOddsStepTimerFT"})
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

func UpdateSpreadParlay(leagueId, oddsSpreadParlayAH, oddsSpreadParlayAHLive, oddsSpreadParlayOU, oddsSpreadParlayOULive int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SPREAD_PARLAY_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Spread Parlay", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("OddsSpreadParlayAH", oddsSpreadParlayAH),
		sql.Named("OddsSpreadParlayAHLive", oddsSpreadParlayAHLive),
		sql.Named("OddsSpreadParlayOU", oddsSpreadParlayOU),
		sql.Named("OddsSpreadParlayOULive", oddsSpreadParlayOULive),
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

func UpdateOddsDiff(leagueId, oddsPointDiffAH, oddsPointDiffOU, oddsPointDiffAHLive, oddsPointDiffOULive int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_POINT_DIFF_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Odds Diff", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("OddsPointDiffAH", oddsPointDiffAH),
		sql.Named("OddsPointDiffOU", oddsPointDiffOU),
		sql.Named("OddsPointDiffAHLive", oddsPointDiffAHLive),
		sql.Named("OddsPointDiffOULive", oddsPointDiffOULive),
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

func Update1X2Diff(leagueId, odds1Diff, odds2Diff, odds3Diff, odds1DiffHT, odds2DiffHT, odds3DiffHT int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_1X2_LDIFF_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update 1X2 LDiff", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("Odds1Diff", odds1Diff),
		sql.Named("Odds2Diff", odds2Diff),
		sql.Named("Odds3Diff", odds3Diff),
		sql.Named("Odds1DiffHT", odds1DiffHT),
		sql.Named("Odds2DiffHT", odds2DiffHT),
		sql.Named("Odds3DiffHT", odds3DiffHT),
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

func UpdateLimitAutoPauseShort(leagueId, totalPauseToday, totalPauseEarly, totalPauseLive int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_LIMIT_AUTO_PAUSE_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Limit Auto Pause", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("TotalPauseEarly", totalPauseEarly),
		sql.Named("TotalPauseToday", totalPauseToday),
		sql.Named("TotalPauseLive", totalPauseLive),
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

func UpdateAutoCloseLeague(leagueId int, autoClose, autoCloseInterval string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_AUTO_CLOSE_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Auto Close", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("AutoClose", autoClose),
		sql.Named("AutoCloseInterval", autoCloseInterval),
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

func UpdateAutoFeedingtoBG(leagueId int, STBookingBG string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_BOOKING_BG_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Auto Feeding to BG", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("STBookingBG", STBookingBG),
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

func UpdateTimedMaxBet(leagueId, maxBetPercentAHFT, maxBetPercentAHFT2, maxBetPercentAHHT, maxBetPercentOUFT, maxBetPercentOUFT2, maxBetPercentOUHT, maxLimitPercentAHFT, maxLimitPercentAHFT2, maxLimitPercentAHHT, maxLimitPercentOUFT, maxLimitPercentOUFT2, maxLimitPercentOUHT, maxBetTimerAHFT, maxBetTimerAHFT2, maxBetTimerAHHT, maxBetTimerOUFT, maxBetTimerOUFT2, maxBetTimerOUHT int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TIMED_MAXBET_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Timed MaxBet", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("MaxBetTimerAH_FT", maxBetTimerAHFT),
		sql.Named("MaxBetPercentAH_FT", maxBetPercentAHFT),
		sql.Named("MaxBetTimerOU_FT", maxBetTimerOUFT),
		sql.Named("MaxBetPercentOU_FT", maxBetPercentOUFT),
		sql.Named("MaxBetTimerAH_HT", maxBetTimerAHHT),
		sql.Named("MaxBetPercentAH_HT", maxBetPercentAHHT),
		sql.Named("MaxBetTimerOU_HT", maxBetTimerOUHT),
		sql.Named("MaxBetPercentOU_HT", maxBetPercentOUHT),
		sql.Named("MaxBetTimerAH_FT_2", maxBetTimerAHFT2),
		sql.Named("MaxBetPercentAH_FT_2", maxBetPercentAHFT2),
		sql.Named("MaxBetTimerOU_FT_2", maxBetTimerOUFT2),
		sql.Named("MaxBetPercentOU_FT_2", maxBetPercentOUFT2),
		sql.Named("MaxLimitPercentAH_HT", maxLimitPercentAHHT),
		sql.Named("MaxLimitPercentAH_FT", maxLimitPercentAHFT),
		sql.Named("MaxLimitPercentOU_HT", maxLimitPercentOUHT),
		sql.Named("MaxLimitPercentOU_FT", maxLimitPercentOUFT),
		sql.Named("MaxLimitPercentAH_FT_2", maxLimitPercentAHFT2),
		sql.Named("MaxLimitPercentOU_FT_2", maxLimitPercentOUFT2),
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

func UpdateLeagueProfileID(leagueId int, profileID string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_PROFILE_ID_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update ProfileID", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("ProfileID", profileID),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Events", leagueId, []string{"No_Events, LimitID"})
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

func UpdateLeagueProfile1X2(leagueId int, profile1X2 string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_PROFILE_1X2_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Profile1X2", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("Profile1X2", profile1X2),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Events", leagueId, []string{"No_Events, LimitID1x2"})
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

func UpdateSpecialCode(leagueId int, specialCode string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SPECIAL_CODE_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Special Code", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("SpecialCode", specialCode),
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

func Update1X2LAP(leagueId, lap1X2HT, lapLive1X2HT, lap1X2FT, lapLive1X2FT int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_1X2_LAP_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update 1X2 LAP", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("LAP1X2_HT", lap1X2HT),
		sql.Named("LAPLive1X2_HT", lapLive1X2HT),
		sql.Named("LAP1X2_FT", lap1X2FT),
		sql.Named("LAPLive1X2_FT", lapLive1X2FT),
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

func UpdateLeagueGroup(leagueId int, leagueGroup string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_LEAGUE_GROUP_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update League Group", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("LeagueGroup", leagueGroup),
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

func UpdateRegion(leagueId int, regionId int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_REGION_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Region", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("RegionID", regionId),
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
func UpdateLinkOddsMasterLeague(leagueId, gameType, linkOddsDiff, linkOddsSpread int, linkOddsDiffLock bool, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_LINK_ODDS_MASTER_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Link Odds Diff", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
		sql.Named("GameType", gameType),
		sql.Named("LinkOddsDiff", linkOddsDiff),
		sql.Named("LinkOddsSpread", linkOddsSpread),
		sql.Named("LinkOddsDiffLock", linkOddsDiffLock),
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

func CopyToLottery(leagueId int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_SPORTSLOTTERY_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Copy to Lottery", "Master League", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueId),
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

func ListLeagueAutoAddMatch(sportId int, stampUser string) ([]model.LeagueSelect, error) {
	dbName := GoldenOdds
	spName := "MGMT_SBA_LIST_LEAGUE_AUTO_ADD_MATCH_IBC_2"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Auto Add Match", "Auto Add Match", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueSelect{}
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
func ListLeagueAddMatch(website, leagueName, stampUser string, sportID int) ([]model.LeagueAddMatch, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_SEARCH_ADD_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Add Match", "Add Match", stampUser)
	logManager.WriteParameters(
		sql.Named("Website", website),
		sql.Named("LeagueName", leagueName),
		sql.Named("StampUser", stampUser),
		sql.Named("SportID", sportID),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.LeagueAddMatch{}
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
func ListLeagueMatchList(matchDateFrom, matchDateTo, sportIDs string, matchID int, category, openStatus,
	liveStatus, hasLiveStatus, hasParlayStatus, stampUser string) ([]model.LeagueSelectMatchList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Matchlist", "League", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("MatchID", matchID),
		sql.Named("SportID", sportIDs),
		sql.Named("Category", category),
		sql.Named("MatchOpenStatus", openStatus),
		sql.Named("MatchLiveStatus", liveStatus),
		sql.Named("MatchHasLiveStatus", hasLiveStatus),
		sql.Named("IsMatchHasParlay", hasParlayStatus),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueSelectMatchList{}
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
func ListLeagueMappingLottery(SportID int, FromDate, ToDate, stampUser string) ([]model.LeagueSelectMappingLottery, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_SPORTSLOTTERY_MATCH"

	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Mapping Lottery", "Mapping Lottery", stampUser)
	logManager.WriteParameters(
		sql.Named("FromEarlyDate", FromDate),
		sql.Named("ToEarlyDate", ToDate),
		sql.Named("SportID", SportID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueSelectMappingLottery{}
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
func ListLeagueMatchProfile(dateFrom, dateTo string, matchId, sportId int, profileId, teamName string, stampUser string) ([]model.LeagueSelectMatchList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_MATCH_PROFILE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Match Profile", "Match Profile", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", dateFrom),
		sql.Named("MatchDateTo", dateTo),
		sql.Named("MatchID", matchId),
		sql.Named("SportID", sportId),
		sql.Named("ProfileID", profileId),
		sql.Named("TeamName", teamName),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueSelectMatchList{}
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
func ListLeagueMatchStatistic(dateFrom, dateTo string, matchId, sportId int, profileId, teamName string, stampUser string) ([]model.LeagueSelectMatchList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_MATCH_STATISTIC"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Match Statistic", "Match Statistic", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", dateFrom),
		sql.Named("MatchDateTo", dateTo),
		sql.Named("MatchID", matchId),
		sql.Named("SportID", sportId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueSelectMatchList{}
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

func ListLeagueScoringMatch(matchId, sportId int, matchDate, htScoreStatus, ftScoreStatus, fglgScoreStatus, includeProcessed, stampUser string) ([]model.LeagueSelectMatchList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_SCORING_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Scoring Match", "Scoring Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("SportID", sportId),
		sql.Named("MatchDate", matchDate),
		sql.Named("HTScoreStatus", htScoreStatus),
		sql.Named("FTScoreStatus", ftScoreStatus),
		sql.Named("FGLGScoreStatus", fglgScoreStatus),
		sql.Named("IncludeProcessed", includeProcessed),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueSelectMatchList{}
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

func ListLeagueProcessMatch(sportID int, matchDate, statusProcess, htStatus, ftStatus, fglgStatus, stampUser string) ([]model.LeagueSelectMatchList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_PROCESS_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Process Match", "Process Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDate", matchDate),
		sql.Named("SportID", sportID),
		sql.Named("MatchScoreStatus", statusProcess),
		sql.Named("HTProcessStatus", htStatus),
		sql.Named("FTProcessStatus", ftStatus),
		sql.Named("FGLGProcessStatus", fglgStatus),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueSelectMatchList{}
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
func ListLeagueUnprocessMatch(sportID int, matchDate, statusProcess, htStatus, ftStatus, fglgStatus, stampUser string) ([]model.LeagueSelectMatchList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_UNPROCESS_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Unprocess Match", "Unprocess Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDate", matchDate),
		sql.Named("SportID", sportID),
		sql.Named("MatchScoreStatus", statusProcess),
		sql.Named("HTProcessStatus", htStatus),
		sql.Named("FTProcessStatus", ftStatus),
		sql.Named("FGLGProcessStatus", fglgStatus),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueSelectMatchList{}
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

func ListLeagueAddOutright(sportId int, leagueName, stampUser string) ([]model.LeagueSelectAddOutright, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_SEARCH_ADD_OUTRIGHT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League ADD OUTRIGHT", "ADD OUTRIGHT", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportId),
		sql.Named("LeagueName", leagueName),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueSelectAddOutright{}
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

func ListLeagueMappingLeague(sportID int, leagueName, stampUser string) ([]model.LeagueMappingLeague, error) {
	dbName := SoccerBot
	spName := "MGMT_SBA_LIST_LEAGUE_SEARCH_MAPPING_IBC_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Mapping League", "MAPPING LEAGUE", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueName", leagueName),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueMappingLeague{}
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

func ListLeagueMappingLeagueRBall(sportID int, rbLeagueName, stampUser string) ([]model.LeagueMappingLeagueRBall, error) {
	dbName := RunningBall
	spName := "MGMT_SBA_LIST_LEAGUE_SEARCH_MAPPING_RB_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Mapping League RBall", "MAPPING LEAGUE RBall", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("RBLeagueName", rbLeagueName),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueMappingLeagueRBall{}
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

func ListLeagueMappingBuilder(matchDateFrom, matchDateTo string, matchID, sportID int, stampUser string) ([]model.LeagueSelectMappingBuilder, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_MAPPING_BUILDER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League MAPPING BUILDER", "MAPPING BUILDER", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("MatchID", matchID),
		sql.Named("SportID", sportID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueSelectMappingBuilder{}
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

func ListLeagueOnlineList(MatchDate string, SportID int, stampUser string) ([]model.LeagueOnlineList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_ONLINE_LIST"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Online List", "Online List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDate", MatchDate),
		sql.Named("SportID", SportID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueOnlineList{}
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
