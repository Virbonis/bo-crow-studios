package database

import (
	"database/sql"
	"errors"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListMatchList(startDate, endDate, sort string, matchID, sportID, leagueID int,
	autoOdds, category, openStatus, liveStatus, hasLiveStatus, hasParlayStatus string,
	currentPage, pageSize int, stampUser string) ([]model.MatchList, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH"
	var err error
	var totalRecords int
	logManager := logger.LogManager{}
	logManager.StartTask("List Match List", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", startDate),
		sql.Named("MatchDateTo", endDate),
		sql.Named("OrderBy", sort),
		sql.Named("MatchID", matchID),
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("AutoOdds", autoOdds),
		sql.Named("Category", category),
		sql.Named("MatchOpenStatus", openStatus),
		sql.Named("MatchLiveStatus", liveStatus),
		sql.Named("MatchHasLiveStatus", hasLiveStatus),
		sql.Named("IsMatchHasParlay", hasParlayStatus),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MatchList{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
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
	return list, totalRecords, err
}
func GetMatchList(matchId int, stampUser string) (*model.MatchEdit, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_UPD_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Get Match", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := model.MatchEdit{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		err = rows.StructScan(&list)
		if err != nil {
			log.Warnf("[mssql] Failed scanning row: %v", err)
			return nil, err
		}
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return &list, err
}
func UpdateMatchList(autoAcceptDelayAway, autoAcceptDelayHome, autoAcceptDelayOver, autoAcceptDelayUnder, matchHiddenTimeStatus, evOddsStep, evOddsStepOU, matchID, matchIdParent, matchIdACRJ int, category, matchDate, matchOpenStatus, matchHasLiveStatus, matchLiveStatus, matchNeutralStatus, stShowToday, sTEarlySettlement string, parentUnnormalStatus int, specialCode, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match", "MATCH LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("ParentMatchID", matchIdParent),
		sql.Named("ACRJMatchID", matchIdACRJ),
		sql.Named("MatchDate", matchDate),
		sql.Named("AutoAcceptDelayHome", autoAcceptDelayHome),
		sql.Named("AutoAcceptDelayAway", autoAcceptDelayAway),
		sql.Named("AutoAcceptDelayOver", autoAcceptDelayOver),
		sql.Named("AutoAcceptDelayUnder", autoAcceptDelayUnder),
		sql.Named("EvOddsStep", evOddsStep),
		sql.Named("EvOddsStepOU", evOddsStepOU),
		sql.Named("MatchOpenStatus", matchOpenStatus),
		sql.Named("MatchLiveStatus", matchLiveStatus),
		sql.Named("MatchHasLiveStatus", matchHasLiveStatus),
		sql.Named("MatchHiddenTimeStatus", matchHiddenTimeStatus),
		sql.Named("MatchNeutralStatus", matchNeutralStatus),
		sql.Named("Category", category),
		sql.Named("ST_ShowToday", stShowToday),
		sql.Named("ST_EarlySettlement", sTEarlySettlement),
		sql.Named("UnNormal", parentUnnormalStatus),
		sql.Named("SpecialCode", specialCode),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Partai", matchID, []string{
		"No_Display", "OddsStep", "Delay_Home", "Delay_Away", "Delay_Over", "Delay_Under", "EvOddsStep", "EvOddsStepOU", "ST_HasLive", "ST_Live", "ST_Display", "No_Periode", "Tgl_Tanding"})
	logManager.SetMatchIDorCustName(matchID)
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return err
}
func DeleteMatchList(matchId int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Match", "MATCH LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Partai", matchId, []string{
		"Auto_Accept", "createdate", "endprocess", "flag_trf_fglg", "flag_trf_hs", "is_everlive", "IsNewPartai", "IsProfileChange", "Last_Accept", "Last_Update", "Last_Update_Mapping", "LastAssignTrader", "LimitID", "msrepl_tran_version", "No_Comment", "No_Display", "No_Group", "No_Periode", "postmatch_id", "process_fglg_date", "process_fglg_user", "process_hs_date", "process_hs_user", "process_user", "processdate", "ShowTime", "SortIndex", "st_fglg", "ST_HS", "startprocess", "StatisticID", "unprocess_date", "unprocess_desc", "unprocess_fglg_date", "unprocess_fglg_desc", "unprocess_fglg_user", "unprocess_hs_date", "unprocess_hs_desc", "unprocess_hs_user", "unprocess_user", "User_ID", "void_date", "void_desc", "void_id", "void_user"})
	logManager.SetMatchIDorCustName(matchId)
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
	return nil
}

func GetMatchListInfo(MatchId int, stampUser string) (*model.MatchInfo, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_UPD_MATCH_INFO"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Match List Info", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", MatchId),
		sql.Named("StampUser", stampUser),
	)

	list := model.MatchInfo{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		err = rows.StructScan(&list)
		if err != nil {
			log.Warnf("[mssql] Failed scanning row: %v", err)
			return nil, err
		}
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return &list, err
}
func UpdateMatchListInfo(matchID int, stInfo, informationEN, informationCH, informationTH, informationJP, informationKR, informationVN, informationID, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MATCH_INFO"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match List Info", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("ST_Information", stInfo),
		sql.Named("InformationDescEN", informationEN),
		sql.Named("InformationDescCH", informationCH),
		sql.Named("InformationDescTH", informationTH),
		sql.Named("InformationDescJP", informationJP),
		sql.Named("InformationDescKR", informationKR),
		sql.Named("InformationDescVN", informationVN),
		sql.Named("InformationDescID", informationID),
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

	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return err
}

func ListSubMatchSpecial(matchId int, stampUser string) ([]model.SubMatchSpecial, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SPECIAL_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Sub Match", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.SubMatchSpecial{}
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
func ListSubMatchAHOU(matchId int, stampUser string) ([]model.ListGridAHOU, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SUB_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Sub Match", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("GameType", "AHOU"),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListGridAHOU{}
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
func ListSubMatch1X2(matchId int, stampUser string) ([]model.ListGrid1X2, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SUB_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Sub Match", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("GameType", "1X2"),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListGrid1X2{}
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
func ListSubMatchHTFT(matchId int, stampUser string) ([]model.ListGridHTFT, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SUB_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Sub Match", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("GameType", "HTFT"),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListGridHTFT{}
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
func ListSubMatchTG(matchId int, stampUser string) ([]model.ListGridTG, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SUB_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Sub Match", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("GameType", "TG"),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListGridTG{}
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
func ListSubMatchFGLG(matchId int, stampUser string) ([]model.ListGridFGLG, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SUB_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Sub Match", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("GameType", "FGLG"),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListGridFGLG{}
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
func ListSubMatchCS(matchId int, stampUser string) ([]model.ListGridCS, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SUB_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Sub Match", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("GameType", "CS"),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListGridCS{}
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
func ListSubMatchCSL(matchId int, stampUser string) ([]model.ListGridCSLive, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SUB_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Sub Match", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("GameType", "CSL"),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListGridCSLive{}
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

func ListMatchSpecial(matchId int, stampUser string) ([]model.MatchSpecial, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_SPECIAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match Special", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("StampUser", stampUser),
	)

	list := []model.MatchSpecial{}
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
func DeleteMatchSpecial(matchID, gameType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_MATCH_SPECIAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Match Special", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(matchID)
	// logManager.PrepareAudit(sqlConnections.conn[dbName], "Partai", matchID, []string{})
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		return err
	}
	return nil
}
func DelMatchSpecialNextGoal(matchID, gameType, selection int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_MATCH_SPECIAL_NEXTGOAL"
	var err error
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Delete Match Special Next Goal", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("Selection", selection),
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

	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	if rs == -1 {
		log.Errorf("[mssql] Failed Delete Special Match : Already Got Ticket")
		return errors.New("Failed Delete Special Match : Already Got Ticket")
	} else if rs == -2 {
		log.Errorf("[mssql] Failed Delete Special Match : Already Scoring")
		return errors.New("Failed Delete Special Match : Already Scoring")
	}
	return nil
}

func GetMatchSpecialMore(matchID int, stampUser string) (string, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_MATCH_GAMETYPE_SPECIAL"
	var err error

	var result string

	logManager := logger.LogManager{}
	logManager.StartTask("Get Match Special More", "Match List", stampUser)
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
	err = sqlConnections.conn[dbName].QueryRow(spName, logManager.Parameters...).Scan(
		&result,
	)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return result, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return result, err
}
func InsertMatchSpecial(matchID int, leagueNamePrefix, teamNamePrefix, specialCode, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH_SPECIAL"
	var err error
	var matchIDSpecial int
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special", "ADD MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("LeagueNamePrefix", leagueNamePrefix),
		sql.Named("TeamNamePrefix", teamNamePrefix),
		sql.Named("SpecialCode", specialCode),
		sql.Named("StampUser", stampUser),
		sql.Named("MatchIDSpecial", sql.Out{Dest: &matchIDSpecial}),
		&rs,
	)
	defer func() {
		logManager.SetMatchIDorCustName(matchIDSpecial)
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	if rs == -2 {
		log.Errorf("Match Special Already Exist")
		return errors.New("Match Special Already Exist")
	}
	return nil
}
func InsertMatchSpecialKembar(matchID int, leagueNamePrefix, teamNamePrefixAtas, teamNamePrefixBawah, specialCode, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH_SPECIAL_KEMBAR"
	var err error
	var matchIDSpecial int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special", "ADD MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("LeagueNamePrefix", leagueNamePrefix),
		sql.Named("TeamNamePrefixAtas", teamNamePrefixAtas),
		sql.Named("TeamNamePrefixBawah", teamNamePrefixBawah),
		sql.Named("SpecialCode", specialCode),
		sql.Named("StampUser", stampUser),
		sql.Named("MatchIDSpecial", sql.Out{Dest: &matchIDSpecial}),
	)
	defer func() {
		logManager.SetMatchIDorCustName(matchIDSpecial)
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
func InsertMatchET(matchID int, specialCode, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH_ET"
	var err error
	var matchIDSpecial int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match ET", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SpecialCode", specialCode),
		sql.Named("StampUser", stampUser),
		sql.Named("MatchIDSpecial", sql.Out{Dest: &matchIDSpecial}),
	)
	defer func() {
		logManager.SetMatchIDorCustName(matchIDSpecial)
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
func InsertMatchPEN(matchID int, specialCode, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH_PEN"
	var err error
	var matchIDSpecial int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match PEN", "Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("SpecialCode", specialCode),
		sql.Named("StampUser", stampUser),
		sql.Named("MatchIDSpecial", sql.Out{Dest: &matchIDSpecial}),
	)
	defer func() {
		logManager.SetMatchIDorCustName(matchIDSpecial)
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

func InsertMatchSpecialNCNG(matchID, gameType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_SUB_MATCH_NEXTGOAL"
	var err error
	var subMatchID int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special More Next Corner/Goal", "ADD MATCH SPECIAL MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("StampUser", stampUser),
		sql.Named("SubMatchID", sql.Out{Dest: &subMatchID}), // unused
	)
	logManager.SetMatchIDorCustName(matchID)
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
	return nil
}
func InsertMatchSpecialCS(matchID, gameType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_SUB_MATCH_CS"
	var err error
	var subMatchID int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special More CS Live", "ADD MATCH SPECIAL MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("StampUser", stampUser),
		sql.Named("SubMatchID", sql.Out{Dest: &subMatchID}), // unused
	)
	logManager.SetMatchIDorCustName(matchID)
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
	return nil
}

func InsertMatchSpecialTennis(matchId int, leagueNamePrefix, TeamNamePrefix, SpecialCode, dashInLeagueName, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH_SPECIAL_TENNIS"
	var err error
	var matchIDSpecial int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special", "ADD MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("LeagueNamePrefix", leagueNamePrefix),
		sql.Named("TeamNamePrefix", TeamNamePrefix),
		sql.Named("SpecialCode", SpecialCode),
		sql.Named("DashInLeagueName", dashInLeagueName),
		sql.Named("StampUser", stampUser),
		sql.Named("MatchIDSpecial", sql.Out{Dest: &matchIDSpecial}),
	)
	defer func() {
		logManager.SetMatchIDorCustName(matchIDSpecial)
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
	return nil
}
func InsertMatchSpecialBasket(matchID int, leagueNamePrefix, teamNamePrefix, specialCode, dashInLeagueName, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH_SPECIAL_BASKET"
	var err error
	var matchIDSpecial int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special", "ADD MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("LeagueNamePrefix", leagueNamePrefix),
		sql.Named("TeamNamePrefix", teamNamePrefix),
		sql.Named("SpecialCode", specialCode),
		sql.Named("DashInLeagueName", dashInLeagueName),
		sql.Named("StampUser", stampUser),
		sql.Named("MatchIDSpecial", sql.Out{Dest: &matchIDSpecial}),
	)
	defer func() {
		logManager.SetMatchIDorCustName(matchIDSpecial)
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
	return nil
}
func InsertMatchSpecialVolley(matchID int, leagueNamePrefix, teamNamePrefix, specialCode, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH_SPECIAL_VOLLEYBALL"
	var err error
	var matchIDSpecial int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special", "ADD MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("LeagueNamePrefix", leagueNamePrefix),
		sql.Named("TeamNamePrefix", teamNamePrefix),
		sql.Named("SpecialCode", specialCode),
		sql.Named("DashInLeagueName", ""),
		sql.Named("StampUser", stampUser),
		sql.Named("MatchIDSpecial", sql.Out{Dest: &matchIDSpecial}),
	)
	defer func() {
		logManager.SetMatchIDorCustName(matchIDSpecial)
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
	return nil
}
func InsertMatchSpecialBadminton(matchID int, leagueNamePrefix, teamNamePrefix, specialCode, dashInLeageName, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH_SPECIAL_BADMINTON"
	var err error
	var matchIDSpecial int
	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special", "ADD MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("LeagueNamePrefix", leagueNamePrefix),
		sql.Named("TeamNamePrefix", teamNamePrefix),
		sql.Named("SpecialCode", specialCode),
		sql.Named("DashInLeagueName", dashInLeageName),
		sql.Named("StampUser", stampUser),
		sql.Named("MatchIDSpecial", sql.Out{Dest: &matchIDSpecial}),
	)
	defer func() {
		logManager.SetMatchIDorCustName(matchIDSpecial)
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
	return nil
}
func InsertMatchSpecialPool(matchID int, leagueNamePrefix, teamNamePrefix, specialCode, dashInLeagueName string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH_SPECIAL_VOLLEYBALL"
	var err error
	var matchIDSpecial int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special", "ADD MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("LeagueNamePrefix", leagueNamePrefix),
		sql.Named("TeamNamePrefix", teamNamePrefix),
		sql.Named("SpecialCode", specialCode),
		sql.Named("DashInLeagueName", dashInLeagueName),
		sql.Named("StampUser", stampUser),
		sql.Named("MatchIDSpecial", sql.Out{Dest: &matchIDSpecial}),
	)
	defer func() {
		logManager.SetMatchIDorCustName(matchIDSpecial)
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
	return nil
}
func InsertMatchSpecialEsport(matchID int, leagueNamePrefix, teamNamePrefix, specialCode, dashInLeagueName, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH_SPECIAL_ESPORTS"
	var err error
	var matchIDSpecial int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special", "ADD MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("LeagueNamePrefix", leagueNamePrefix),
		sql.Named("TeamNamePrefix", teamNamePrefix),
		sql.Named("SpecialCode", specialCode),
		sql.Named("DashInLeagueName", dashInLeagueName),
		sql.Named("StampUser", stampUser),
		sql.Named("MatchIDSpecial", sql.Out{Dest: &matchIDSpecial}),
	)
	defer func() {
		logManager.SetMatchIDorCustName(matchIDSpecial)
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
	return nil
}
func InsertMatchSpecialCricket(matchID int, leagueNamePrefix, teamNamePrefix, specialCode, dashInLeagueName, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MATCH_SPECIAL_CRICKET"
	var err error
	var matchIDSpecial int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special", "ADD MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("LeagueNamePrefix", leagueNamePrefix),
		sql.Named("TeamNamePrefix", teamNamePrefix),
		sql.Named("SpecialCode", specialCode),
		sql.Named("DashInLeagueName", dashInLeagueName),
		sql.Named("stampUser", stampUser),
		sql.Named("MatchIDSpecial", sql.Out{Dest: &matchIDSpecial}),
	)
	defer func() {
		logManager.SetMatchIDorCustName(matchIDSpecial)
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
	return nil
}

func InsertMatchSpecialMoreSoccer(matchID, gameType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_SUB_MATCH_4"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special More", "ADD MATCH SPECIAL MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", 10),
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("Odds1", 0),
		sql.Named("Odds2", 0),
		sql.Named("Odds3", 0),
		sql.Named("Odds4", 0),
		sql.Named("Odds5", 0),
		sql.Named("Odds6", 0),
		sql.Named("Odds7", 0),
		sql.Named("Odds8", 0),
		sql.Named("Odds9", 0),
		sql.Named("Odds10", 0),
		sql.Named("Handicap", 0),
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
	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}
	return nil
}
func InsertMatchSpecialMoreTennis(matchID, gameType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_SUB_MATCH_TENNIS"
	var err error
	var subMatchID int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special More Tennis", "ADD MATCH SPECIAL MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("StampUser", stampUser),
		sql.Named("SubMatchID", sql.Out{Dest: &subMatchID}), // unused
	)
	logManager.SetMatchIDorCustName(matchID)
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
	return nil
}
func InsertMatchSpecialMoreBadminton(matchID, gameType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_SUB_MATCH_BADMINTON"
	var err error
	var subMatchID int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special More Badminton", "ADD MATCH SPECIAL MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("StampUser", stampUser),
		sql.Named("SubMatchID", sql.Out{Dest: &subMatchID}), // unused
	)
	logManager.SetMatchIDorCustName(matchID)
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
	return nil
}

func InsSubMatchBasket(MatchID, GameType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_SUB_MATCH_BASKETBALL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special More", "ADD MATCH SPECIAL MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", MatchID),
		sql.Named("GameType", GameType),
		sql.Named("SubMatchID", 0),
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
	return nil
}
func InsMatchSpecialNCNG(MatchID, GameType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_SUB_MATCH_NEXTGOAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special More", "ADD MATCH SPECIAL MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", MatchID),
		sql.Named("GameType", GameType),
		sql.Named("SubMatchID", 0),
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
	return nil
}
func InsMatchSpecialMore(MatchID, GameType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_SUB_MATCH_4"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Match Special More", "ADD MATCH SPECIAL MORE", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", 12),
		sql.Named("MatchID", MatchID),
		sql.Named("GameType", GameType),
		sql.Named("Odds1", 0),
		sql.Named("Odds2", 0),
		sql.Named("Odds3", 0),
		sql.Named("Odds4", 0),
		sql.Named("Odds5", 0),
		sql.Named("Odds6", 0),
		sql.Named("Odds7", 0),
		sql.Named("Odds8", 0),
		sql.Named("Odds9", 0),
		sql.Named("Odds10", 0),
		sql.Named("Handicap", 0),
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
	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}
	return nil
}

func GetSelectedAddSpecial(MatchID int, stampUser string) ([]model.SelectedAddSpecial, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_LIST_MATCH_SPECIAL_BY_MATCH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List Selected Add Special", "Match List", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", MatchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.SelectedAddSpecial{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
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
	return list, err
}
