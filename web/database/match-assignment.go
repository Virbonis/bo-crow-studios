package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func GetCounterMatchAssignedToTrader(traderName, stampUser string) (model.CounterMatch, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_COUNTER_MATCH_ASSIGNED_TO_TRADER"
	var err error
	var result model.CounterMatch

	logManager := logger.LogManager{}
	logManager.StartTask("Get Counter Match Assigned To Trader", "Match Assignment", stampUser)
	logManager.WriteParameters(
		sql.Named("TraderName", traderName),
		sql.Named("TotalLive", sql.Out{Dest: &result.TotalLive}),
		sql.Named("TotalToday", sql.Out{Dest: &result.TotalToday}),
		sql.Named("TotalEarly", sql.Out{Dest: &result.TotalEarly}),
		sql.Named("TotalStarted", sql.Out{Dest: &result.TotalStarted}),
		sql.Named("TotalOutright", sql.Out{Dest: &result.TotalOutright}),
		sql.Named("TotalAll", sql.Out{Dest: &result.TotalAll}),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return result, err
	}
	defer rows.Close()

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return result, nil
}
func GetCounterMatchAssignedToUserTeam(teamID int, stampUser string) (model.CounterMatch, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_COUNTER_MATCH_ASSIGNED_TO_USERTEAM"
	var err error
	var result model.CounterMatch

	logManager := logger.LogManager{}
	logManager.StartTask("Get Counter Match Assigned To UserTeam", "Match Assignment", stampUser)
	logManager.WriteParameters(
		sql.Named("UserTeamID", teamID),
		sql.Named("TotalLive", sql.Out{Dest: &result.TotalLive}),
		sql.Named("TotalToday", sql.Out{Dest: &result.TotalToday}),
		sql.Named("TotalEarly", sql.Out{Dest: &result.TotalEarly}),
		sql.Named("TotalStarted", sql.Out{Dest: &result.TotalStarted}),
		sql.Named("TotalOutright", sql.Out{Dest: &result.TotalOutright}),
		sql.Named("TotalAll", sql.Out{Dest: &result.TotalAll}),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return result, err
	}
	defer rows.Close()

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return result, nil
}
func ListMyMatches(matchTimeSlot, stampUser string) ([]model.MyMatches, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MY_MATCHES"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List My Matches", "My Matches", stampUser)
	logManager.WriteParameters(
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

	list := []model.MyMatches{}
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
func ListUserTeamMatches(userTeamID int, matchTimeSlot, stampUser string) ([]model.UserTeamMatches, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_USERTEAM_MATCHES"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List User Team Matches", "User Team Matches", stampUser)
	logManager.WriteParameters(
		sql.Named("UserTeamID", userTeamID),
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

	list := []model.UserTeamMatches{}
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

func ListMatchAssignmentTrader(traderGroup, stampUser string) ([]model.MatchAssignmentTrader, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_TRADER_MATCH_ASSIGNMENT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Trader", "Trader Match Assignment", stampUser)
	logManager.WriteParameters(
		sql.Named("BorrowTeamID", 0),
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

	list := []model.MatchAssignmentTrader{}
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

	resultList := append([]model.MatchAssignmentTrader{{TraderName: stampUser, TraderDesc: stampUser}}, list...)

	return resultList, nil
}
func ListLeagueMatchAssignment(userTeamID int, traderName, stampUser string) ([]model.LeagueMatchAssignment, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_LEAGUE_MATCH_ASSIGNMENT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League", "League Match Assignment", stampUser)
	logManager.WriteParameters(
		sql.Named("TraderName", traderName),
		sql.Named("UserTeamID", userTeamID),
		sql.Named("FilterGame", "All"),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueMatchAssignment{}
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
func UpdateLeagueMatchAssignment(traderName, leagueIDs string, userTeamId int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_LEAGUE_MATCH_ASSIGNMENT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Assignment Detail", "Match Assignment", stampUser)
	logManager.WriteParameters(
		sql.Named("TraderName", traderName),
		sql.Named("LeagueIDs", leagueIDs),
		sql.Named("UserTeamID", userTeamId),
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
func ListMatchAssignment(userTeamID int, traderName, stampUser string) ([]model.MatchAssignment, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_ASSIGNMENT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match Assignment", "Match Assignment", stampUser)
	logManager.WriteParameters(
		sql.Named("TraderName", traderName),
		sql.Named("UserTeamID", userTeamID),
		sql.Named("FilterGame", "All"),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MatchAssignment{}
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
func UpdateMatchAssignment(traderName, matchIDs string, userTeamId int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MATCH_ASSIGNMENT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Assignment Detail", "Match Assignment", stampUser)
	logManager.WriteParameters(
		sql.Named("TraderName", traderName),
		sql.Named("MatchIDs", matchIDs),
		sql.Named("UserTeamID", userTeamId),
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

func ListMatchAssignmentDetail(leagueID, matchID int, stampUser string) (map[string][]model.MatchAssignmentDetail, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_ASSIGNMENT_DETAIL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match Assignment Detail", "Match Assignment", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueID),
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
	list := make(map[string][]model.MatchAssignmentDetail)
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	temp := []model.MatchAssignmentDetail{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	list["FTAH"] = temp

	rows.NextResultSet()
	temp = []model.MatchAssignmentDetail{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
	}
	list["FTOU"] = temp

	rows.NextResultSet()
	temp = []model.MatchAssignmentDetail{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
	}
	list["HTAH"] = temp

	rows.NextResultSet()
	temp = []model.MatchAssignmentDetail{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
	}
	list["HTOU"] = temp

	rows.NextResultSet()
	temp = []model.MatchAssignmentDetail{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
	}
	list["FT1X2"] = temp

	rows.NextResultSet()
	temp = []model.MatchAssignmentDetail{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
	}
	list["HT1X2"] = temp

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}
func ListMatchAssignmentDetailPick(leagueID, matchID int, matchStatusLive, stampUser string) (map[string][]model.MatchAssignmentDetail, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_ASSIGNMENT_DETAIL_PICK"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match Assignment Detail Pick", "Match Assignment", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueID),
		sql.Named("MatchID", matchID),
		sql.Named("ST_Live", matchStatusLive),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := make(map[string][]model.MatchAssignmentDetail)
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	temp := []model.MatchAssignmentDetail{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}
	list["FTAH"] = temp

	rows.NextResultSet()
	temp = []model.MatchAssignmentDetail{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
	}
	list["FTOU"] = temp

	rows.NextResultSet()
	temp = []model.MatchAssignmentDetail{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
	}
	list["HTAH"] = temp

	rows.NextResultSet()
	temp = []model.MatchAssignmentDetail{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
	}
	list["HTOU"] = temp

	rows.NextResultSet()
	temp = []model.MatchAssignmentDetail{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
	}
	list["FT1X2"] = temp

	rows.NextResultSet()
	temp = []model.MatchAssignmentDetail{}
	err = sqlx.StructScan(rows, &temp)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
	}
	list["HT1X2"] = temp

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}
func UpdateMatchAssignmentDetail(leagueID, matchID int,
	FTAHUserIDs, FTOUUserIDs, FT1X2UserIDs, HTAHUserIDs, HTOUUserIDs, HT1X2UserIDs, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH_ASSIGNMENT_DETAIL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Assignment Detail", "Match Assignment", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueID),
		sql.Named("MatchID", matchID),
		sql.Named("FTAHUserIDs", FTAHUserIDs),
		sql.Named("FTOUUserIDs", FTOUUserIDs),
		sql.Named("FT1X2UserIDs", FT1X2UserIDs),
		sql.Named("HTAHUserIDs", HTAHUserIDs),
		sql.Named("HTOUUserIDs", HTOUUserIDs),
		sql.Named("HT1X2UserIDs", HT1X2UserIDs),
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
func UpdateMatchAssignmentDetailPick(leagueID, matchID int, matchStatusLive string,
	FTAHUserIDs, FTOUUserIDs, FT1X2UserIDs, HTAHUserIDs, HTOUUserIDs, HT1X2UserIDs, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH_ASSIGNMENT_DETAIL_PICK"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Assignment Detail Pick", "Match Assignment", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueID),
		sql.Named("MatchID", matchID),
		sql.Named("ST_Live", matchStatusLive),
		sql.Named("FTAHUserIDs", FTAHUserIDs),
		sql.Named("FTOUUserIDs", FTOUUserIDs),
		sql.Named("FT1X2UserIDs", FT1X2UserIDs),
		sql.Named("HTAHUserIDs", HTAHUserIDs),
		sql.Named("HTOUUserIDs", HTOUUserIDs),
		sql.Named("HT1X2UserIDs", HT1X2UserIDs),
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

func ListMatchAssignmentLog(matchID int, traderName, orderBy, stampUser string) ([]model.MatchAssignmentLog, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_ASSIGNMENT_LOG"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Audit Trail Match Assignment", "Match Assignment", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("TraderName", traderName),
		sql.Named("OrderBy", orderBy),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MatchAssignmentLog{}
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

func ListLeagueMatchAssignmentPick(userTeamID int, traderName, stampUser string) ([]model.MatchAssignmentPick, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_ASSIGNMENT_PICK"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match Assignment Pick", "Match Assignment Pick", stampUser)
	logManager.WriteParameters(
		sql.Named("TraderName", traderName),
		sql.Named("UserTeamID", userTeamID),
		sql.Named("FilterGame", "All"),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MatchAssignmentPick{}
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

func UpdateMatchAssignmentPick(traderName, matchIDs string, userTeamId int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MATCH_ASSIGNMENT_PICK"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Assignment Pick", "Match Assignment Pick", stampUser)
	logManager.WriteParameters(
		sql.Named("TraderName", traderName),
		sql.Named("MatchIDs", matchIDs),
		sql.Named("UserTeamID", userTeamId),
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

func ListLeagueMatchAssignmentRO(stampUser string) ([]model.LeagueMatchAssignment, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_LEAGUE_MATCH_ASSIGNMENT_RO"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("League Match Assignment RO", "Match Assignment RO", stampUser)
	logManager.WriteParameters(
		sql.Named("FilterGame", "All"),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.LeagueMatchAssignment{}
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

func ListMatchAssignmentRO(leagueIDs string, stampUser string) ([]model.MatchAssignmentRO, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_ASSIGNMENT_RO"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match Assignment RO", "Match Assignment RO", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueIDs", leagueIDs),
		sql.Named("FilterGame", "All"),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MatchAssignmentRO{}
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
