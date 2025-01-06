package database

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	"github.com/shopspring/decimal"
	log "github.com/sirupsen/logrus"
)

func ListSelectMatch(popupID, sessionID, groupName, fromEarlyDate, toEarlyDate string, userTeamID, userTeamSubID int, traderGroupORI, stampUser string) ([]model.Match, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SELECT_MATCH"
	if strings.ToLower(groupName) == "forecast-post" {
		spName = "MGMT_SBA_LIST_GRID_SELECT_MATCH_FORECAST_POST"
	}
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Select Match", "Trading", stampUser)
	logManager.WriteParameters(
		sql.Named("PopupID", popupID),
		sql.Named("SessionID", sessionID),
		sql.Named("GroupName", groupName),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("UserTeamID", userTeamID),
		sql.Named("UserTeamSub", userTeamSubID),
		sql.Named("TraderGroup", traderGroupORI),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.Match{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		model := model.Match{}
		err := rows.Scan(
			&model.SportName,
			&model.LeagueName,
			&model.MatchID,
			&model.HomeName,
			&model.AwayName,
			&model.IsSelected,
			&model.NoDisplay,
			&model.MatchDate,
			&model.NoDisplayMatch,
			&model.DBGame,
			&model.RBGame,
			&model.DBGameAvailable,
			&model.RBGameAvailable,
		)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, err
		}
		list = append(list, model)
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}
func UpdateSelectMatch(popupID, sessionID, groupName, matchIDs, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SELECT_MATCH"
	if strings.ToLower(groupName) == "forecast-post" {
		spName = "MGMT_SBA_PROC_UPD_SELECT_MATCH_POST"
	}
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Select Match", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("PopupID", popupID),
		sql.Named("SessionID", sessionID),
		sql.Named("GroupName", groupName),
		sql.Named("MatchIDs", matchIDs),
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return err
}

func ListSelectMatchMO(sessionID, popupID, stampUser, traderGroupORI string) ([]model.MatchMO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_MATCH_MO"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Select Match MO", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
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

	list := []model.MatchMO{}
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
func ListMatchBetList(matchDate, sessionID, popupID, matchTimeSlot, traderGroupORI, stampUser string) ([]model.MatchBetList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_MO_MATCH_BET_LIST_AHOU"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match BetList", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDate", matchDate),
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("TraderGroup", traderGroupORI),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MatchBetList{}
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}

func ListMatchInstantBet(sportID int, leagueIDs, sessionID, stampUser, traderGroupORI string, userTeamID, userTeamSubID int) ([]model.InstantBetMatch, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_MATCH_INSTANT_BET_2"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League Instant Bet", "Instant Bet", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueIDs", leagueIDs),
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

	list := []model.InstantBetMatch{}
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

func GetMaxLine(matchID int, stampUser string) (int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_AUTO_ADD_MATCH_BY_DISPLAY_LINE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Max Line", "Match", stampUser)
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
	maxLine := 0
	err = sqlConnections.conn[dbName].QueryRow(spName, logManager.Parameters...).Scan(&maxLine)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return maxLine, nil
}

func GetAutoAddMatchIBCMatchDate(sportID, leagueID, homeID, awayID int, matchDate, stampUser string) (*string, error) {
	dbName := GoldenOdds
	spName := "MGMT_SBA_GET_AUTO_ADD_MATCH_IBC_MATCHDATE"
	var err error
	var matchDateIBC string

	logManager := logger.LogManager{}
	logManager.StartTask("Get Auto Add Match IBC MatchDate", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("HomeID", homeID),
		sql.Named("AwayID", awayID),
		sql.Named("MatchDate", matchDate),
		sql.Named("StampUser", stampUser),
		sql.Named("Result", sql.Out{Dest: &matchDateIBC}),
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
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return &matchDateIBC, nil
}
func GetAutoAddMatchIBCMatchDateGLive(sportID, leagueID, homeID, awayID int, matchDate, bookmakerName, stampUser string) (*string, error) {
	dbName := GoldenOdds
	spName := "MGMT_SBA_GET_AUTO_ADD_MATCH_GLIVE_MATCHDATE"
	var err error
	var matchDateGlive string

	logManager := logger.LogManager{}
	logManager.StartTask("Get Auto Add Match IBC MatchDate GLive", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("HomeID", homeID),
		sql.Named("AwayID", awayID),
		sql.Named("MatchDate", matchDate),
		sql.Named("BookmakerName", bookmakerName),
		sql.Named("StampUser", stampUser),
		sql.Named("Result", sql.Out{Dest: &matchDateGlive}),
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
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return &matchDateGlive, nil
}

func ListAutoAddMatchIBC(sportID, leagueID, homeID, awayID int, matchDate, stampUser string) ([]model.AutoAddSubMatch, error) {
	dbName := GoldenOdds
	spName := "MGMT_SBA_GET_AUTO_ADD_MATCH_IBC_2"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Auto Add Match IBC", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("HomeID", homeID),
		sql.Named("AwayID", awayID),
		sql.Named("MatchDate", matchDate),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.AutoAddSubMatch{}
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}
func ListAutoAddMatchGLive(sportID, leagueID, homeID, awayID int, matchDate, bookmakerName, stampUser string) ([]model.AutoAddSubMatch, error) {
	dbName := GoldenOdds
	spName := "MGMT_SBA_GET_AUTO_ADD_MATCH_GLIVE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Auto Add Match GLive", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("HomeID", homeID),
		sql.Named("AwayID", awayID),
		sql.Named("MatchDate", matchDate),
		sql.Named("BookmakerName", bookmakerName),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.AutoAddSubMatch{}
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}
func UpdateAutoAddMatchSubMatch(matchID, displayLine, gameType int, handicap, oddsHome, oddsAway decimal.Decimal, popup_ID, bookmakerName, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SUB_MATCH_AUTO_ADD_MATCH"
	var err error
	var logParam sql.NullString
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Update Auto Add Match SubMatch", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("DisplayLine", displayLine),
		sql.Named("GameType", gameType),
		sql.Named("Handicap", handicap),
		sql.Named("OddsHome", oddsHome),
		sql.Named("OddsAway", oddsAway),
		sql.Named("Popup_ID", popup_ID),
		sql.Named("BookmakerName", bookmakerName),
		sql.Named("TraderGroup", traderGroup),
		sql.Named("StampUser", stampUser),
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	if rs == -10 {
		logManager.WriteStatusError("Sync Market for this match is disabled")
		return errors.New("Sync Market for this match is disabled")
	}
	return err
}

func GetAutoAddMatchOddsString(sportID, leagueID, homeID, awayID int, matchDate, stampUser string) (*string, error) {
	dbName := GoldenOdds
	spName := "MGMT_SBA_GET_AUTO_ADD_MATCH_IBC_STR"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Auto Add Match OddsString", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("HomeID", homeID),
		sql.Named("AwayID", awayID),
		sql.Named("MatchDate", matchDate),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	var oddsString string
	err = sqlConnections.conn[dbName].QueryRow(spName, logManager.Parameters...).Scan(&oddsString)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}

	return &oddsString, nil
}
func GetAutoAddMatchOddsStringGLive(sportID, leagueID, homeID, awayID int, matchDate, bookmakerName, stampUser string) (*string, error) {
	dbName := GoldenOdds
	spName := "MGMT_SBA_GET_AUTO_ADD_MATCH_GLIVE_STR"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Auto Add Match OddsString GLive", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("HomeID", homeID),
		sql.Named("AwayID", awayID),
		sql.Named("MatchDate", matchDate),
		sql.Named("BookmakerName", bookmakerName),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	var oddsString string
	err = sqlConnections.conn[dbName].QueryRow(spName, logManager.Parameters...).Scan(&oddsString)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return &oddsString, nil
}

func UpdateSubMatchSyncMarket(sportID, matchID int, oddsString, bookmakerName, traderGroupORI, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SUB_MATCH_AUTO_ADD_MATCH_SYNC"
	var err error
	var ErrMessage sql.NullString
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Update SubMatch Sync Market", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("MatchID", matchID),
		sql.Named("OddsString", oddsString),
		sql.Named("BookmakerName", bookmakerName),
		sql.Named("TraderGroup", traderGroupORI),
		sql.Named("StampUser", stampUser),
		sql.Named("ErrMessage", sql.Out{Dest: &ErrMessage}),
		&rs,
	)
	logManager.SetMatchIDorCustName(matchID)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
		if &ErrMessage.String != nil {
			go InsertLogOdds(&ErrMessage.String)
		}
	}()

	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	if ErrMessage.String != "" {
		ErrMessage.String = strings.ReplaceAll(ErrMessage.String, "^ ", "\n")
		return fmt.Errorf("%v:\n%v", matchID, ErrMessage.String)
	}
	if rs == -10 {
		logManager.WriteStatusError("Sync Market for this match is disabled")
		return errors.New("Sync Market for this match is disabled")
	}
	return err
}

func ListAutoAddMatchSyncLeague(matchID int, matchTimeSlot, MOPage, sessionID, popupID, traderGroupORI, stampUser string) ([]model.AutoAddMatchSyncLeague, []model.AutoAddMatchSyncLeague, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_AUTO_ADD_MATCH_SYNC_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Auto Add Match Sync League", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("MOPage", MOPage),
		sql.Named("SessionID", sessionID),
		sql.Named("PopupID", popupID),
		sql.Named("TraderGroup", traderGroupORI),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list1 := []model.AutoAddMatchSyncLeague{}
	list2 := []model.AutoAddMatchSyncLeague{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list1)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, err
	}
	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list2)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list1, list2, nil
}

func GetStatusSubMatchMoreGT(matchID int, stampUser string) (int, error) {
	dbName := GoldenOdds
	spName := "MGMT_SBA_GET_STATUS_MATCH_MOREGT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Status SubMatch MoreGT", "Match", stampUser)
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

	var result int
	err = sqlConnections.conn[dbName].QueryRow(spName, logManager.Parameters...).Scan(&result)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return result, nil
}

func RequestSubMatchMoreGT(matchID int, stampUser string) error {
	dbName := GoldenOdds
	spName := "MGMT_SBA_PROC_UPD_MATCH_MOREGT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Status More GameType", "ADD SUB MATCH MORE GAMETYPE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("MoreGT", 1),
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return err
}
func ResetSubMatchMoreGT(matchID int, stampUser string) error {
	dbName := GoldenOdds
	spName := "MGMT_SBA_PROC_UPD_MATCH_MOREGT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Reset More GameType", "ADD SUB MATCH MORE GAMETYPE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("MoreGT", 3),
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return err
}
func ListAutoAddSubMatchMore(matchID, sportID int, stampUser string) ([]model.AutoAddSubMatchMore, error) {
	dbName := GoldenOdds
	spName := "MGMT_SBA_GET_AUTO_ADD_MATCH_IBC_MORE_GT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Auto Add SubMatch More", "UPDATE SUB MATCH MORE GAMETYPE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", -99),
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

	list := []model.AutoAddSubMatchMore{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}

func UpdateAutoAddSubMatchMore(matchID, gameType int, handicap decimal.Decimal, oddsString, popup_ID, traderGroup, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SUB_MATCH_AUTO_ADD_MATCH_MORE"
	var err error
	var logParam sql.NullString

	logManager := logger.LogManager{}
	logManager.StartTask("Update Sub Match More GameType", "UPDATE SUB MATCH MORE GAMETYPE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("Handicap", handicap),
		sql.Named("OddsString", oddsString),
		sql.Named("Popup_ID", popup_ID),
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return err
}

func ListMatchInAutoAddMatch(sportId, leagueId int, stampUser string) ([]model.ListMatchAutoAdd, error) {
	dbName := GoldenOdds
	spName := "MGMT_SBA_LIST_GRID_AUTO_ADD_MATCH_IBC_2"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Grid Auto Add Match", "Auto Add Match", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportId),
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

	list := []model.ListMatchAutoAdd{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}

func ProcInsAutoAddMatch(sportId, leagueId, homeId, awayId int, matchStart, odds, leagueName, homeName, awayName, isCreateMainQuarter, stampUser string) (int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_AUTO_ADD_MATCH"
	var err error
	var MatchId int
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Auto Add Match", "ADD MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportId),
		sql.Named("LeagueID", leagueId),
		sql.Named("TeamIDHome", homeId),
		sql.Named("TeamIDAway", awayId),
		sql.Named("MatchDate", matchStart),
		sql.Named("OddsString", odds),
		sql.Named("CreateMainQuarter", isCreateMainQuarter),
		sql.Named("MatchID", sql.Out{Dest: &MatchId}),
		sql.Named("StampUser", stampUser),
		&rs,
	)
	defer func() {
		logManager.SetMatchIDorCustName(MatchId)
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)

	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return MatchId, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	if rs != 0 {
		switch rs {
		case -99:
			return MatchId, fmt.Errorf("%v [ %v - %v ] Oddstring (empty), Please Refer to SpeedyOdds", leagueName, homeName, awayName)
		case -10:
			return MatchId, fmt.Errorf("%v [ %v - %v ] Auto Add Match Failed, Please Try Again", leagueName, homeName, awayName)
		case -5:
			return MatchId, fmt.Errorf("%v [ %v - %v ] League Profile Not Found", leagueName, homeName, awayName)
		case -3:
			return MatchId, fmt.Errorf("%v [ %v - %v ] Home / Away Team Not Found", leagueName, homeName, awayName)
		case -2:
			return MatchId, fmt.Errorf("%v [ %v - %v ] League Not Found", leagueName, homeName, awayName)
		case -1:
			return MatchId, fmt.Errorf("%v [ %v - %v ] Match Already Exists, Please Check Match List", leagueName, homeName, awayName)
		}
	}
	return MatchId, err
}

func ProcInsPartai(matchId, SportId, LeagueId, HomeId, AwayId int, matchStart, stampUser string) error {
	dbName := GoldenOdds
	spName := "MGMT_SBA_PROC_INS_PARTAI"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Partai", "ADD MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("MatchDate", matchStart),
		sql.Named("SportID", SportId),
		sql.Named("LeagueID", LeagueId),
		sql.Named("HomeID", HomeId),
		sql.Named("AwayID", AwayId),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(matchId)
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return err
}

func CreateMatch(sportID, leagueID, teamIDHome, teamIDAway, matchIDParent, matchHiddenTimeStatus, autoAcceptDelayHome, autoAcceptDelayAway, autoAcceptDelayOver, autoAcceptDelayUnder int, matchDate, matchOpenStatus, matchLiveStatus, matchHasLiveStatus, matchNeutralStatus, category, forceCreateMatch, specialCode, stampUser string) (int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH"
	// return result
	var rs mssql.ReturnStatus
	var matchID int
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match", "Add Match", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("TeamIDHome", teamIDHome),
		sql.Named("TeamIDAway", teamIDAway),
		sql.Named("ParentMatchID", matchIDParent),
		sql.Named("MatchDate", matchDate),
		sql.Named("AutoAcceptDelayHome", autoAcceptDelayHome),
		sql.Named("AutoAcceptDelayAway", autoAcceptDelayAway),
		sql.Named("AutoAcceptDelayOver", autoAcceptDelayOver),
		sql.Named("AutoAcceptDelayUnder", autoAcceptDelayUnder),
		sql.Named("MatchOpenStatus", matchOpenStatus),
		sql.Named("MatchLiveStatus", matchLiveStatus),
		sql.Named("MatchHasLiveStatus", matchHasLiveStatus),
		sql.Named("MatchHiddenTimeStatus", matchHiddenTimeStatus),
		sql.Named("MatchNeutralStatus", matchNeutralStatus),
		sql.Named("Category", category),
		sql.Named("ForceCreateMatch", forceCreateMatch),
		sql.Named("SpecialCode", specialCode),
		sql.Named("StampUser", stampUser),
		sql.Named("MatchID", sql.Out{Dest: &matchID}),
		&rs,
	)
	defer func() {
		logManager.SetMatchIDorCustName(matchID)
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return int(rs), err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}

	if int(rs) == -1 && sportID == 10 {
		return int(rs), errors.New("Match already exist !")
	} else if int(rs) == -1 && sportID != 10 {
		return int(rs), errors.New("Match already exist ! Are you sure want to create?")
	} else if int(rs) == -2 {
		return int(rs), errors.New("League ID not exist !")
	} else if int(rs) == -3 {
		return int(rs), errors.New("Home ID or Away ID not exist !")
	} else if int(rs) == -5 {
		return int(rs), errors.New("League Profile ID not exist !")
	}

	return int(rs), err
}

func ListMatchSequence(dateFrom, dateTo time.Time, sportID int, leagueName, stampUser string) ([]model.MatchSequence, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_SEQUENCE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Select Match", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", dateFrom),
		sql.Named("MatchDateTo", dateTo),
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

	list := []model.MatchSequence{}
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

func UpdateMatchSequence(matchID int, specialSeq, sequence, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MATCH_SEQUENCE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Sequence", "Match Sequence", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SpecialSeq", specialSeq),
		sql.Named("Sequence", sequence),
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return err
}

func SwapMatchSequence(matchID, matchIDSwap int, stampUser string) error {

	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MATCH_SEQUENCE_SWAP"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Sequence", "Match Sequence", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID1 ", matchID),
		sql.Named("MatchID2", matchIDSwap),
		sql.Named("StampUser ", stampUser),
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return err
}
