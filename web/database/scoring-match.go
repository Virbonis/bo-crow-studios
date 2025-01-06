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

func ListScoringMatch(matchId, sportId, leagueId int, matchDate, htScoreStatus, ftScoreStatus, fglgScoreStatus, includeProcessed string, currentPage, pageSize int, stampUser string) ([]model.ScoringMatch, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SCORING_MATCH"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Scoring Match", "Match List Grid Scoring Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("SportID", sportId),
		sql.Named("LeagueID", leagueId),
		sql.Named("MatchDate", matchDate),
		sql.Named("HTScoreStatus", htScoreStatus),
		sql.Named("FTScoreStatus", ftScoreStatus),
		sql.Named("FGLGScoreStatus", fglgScoreStatus),
		sql.Named("IncludeProcessed", includeProcessed),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ScoringMatch{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return list, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, totalRecords, nil
}
func UpdateScoringMatch(matchID int, scoringType string, HTHome, HTAway, FSHome, FSAway int, FGTeam, LGTeam int, stampUser string) (int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SCORING_MATCH"
	var err error
	var totalPending int
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Update Score", "SCORING MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("ScoringType", scoringType),
		sql.Named("HT_Home", HTHome),
		sql.Named("HT_Away", HTAway),
		sql.Named("FS_Home", FSHome),
		sql.Named("FS_Away", FSAway),
		sql.Named("FG_Team", FGTeam),
		sql.Named("LG_Team", LGTeam),
		sql.Named("IsSuspendParlay", ""),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalPending", sql.Out{Dest: &totalPending}),
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
		return totalPending, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	if rs == -1 {
		logManager.WriteStatusError("Match in Queue to Process")
		return totalPending, errors.New("Match in Queue to Process")
	} else if rs == -2 {
		logManager.WriteStatusError("Match already processed")
		return totalPending, errors.New("Match already processed")
	} else if rs == -3 {
		logManager.WriteStatusError("Score smaller than Running Ball Score")
		return totalPending, errors.New("Score smaller than Running Ball Score")
	}
	return totalPending, err
}

func ListScoringDetailMatch(matchID int, stampUser string) ([]model.ScoringDetailMatch, []model.ScoringDetailMatch, error) {
	dbName := Inetsoccer_Post
	spName := "MGMT_SBA_LIST_GRID_SCORING_DETAIL_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Scoring Detail Match", "Match List Grid Scoring Detail Match", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ScoringDetailMatch{}
	listLive := []model.ScoringDetailMatch{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, err
	}

	rows.NextResultSet()

	err = sqlx.StructScan(rows, &listLive)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, listLive, nil
}
func UpdateScoringDetailMatch(matchId, currentSet, home1, away1, home2, away2, home3, away3, home4, away4, home5, away5, home6, away6, home7, away7, home8, away8, home9, away9, home10, away10, home11, away11, home12, away12, home13, away13, home14, away14, home15, away15 int, stGeneral, stampUser string) error {
	dbName := Inetsoccer_Post
	spName := "MGMT_SBA_PROC_UPD_SCORING_DETAIL_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Score Detail", "SCORING MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
		sql.Named("CurrentSet", currentSet),
		sql.Named("Home1", home1),
		sql.Named("Away1", away1),
		sql.Named("Home2", home2),
		sql.Named("Away2", away2),
		sql.Named("Home3", home3),
		sql.Named("Away3", away3),
		sql.Named("Home4", home4),
		sql.Named("Away4", away4),
		sql.Named("Home5", home5),
		sql.Named("Away5", away5),
		sql.Named("Home6", home6),
		sql.Named("Away6", away6),
		sql.Named("Home7", home7),
		sql.Named("Away7", away7),
		sql.Named("Home8", home8),
		sql.Named("Away8", away8),
		sql.Named("Home9", home9),
		sql.Named("Away9", away9),
		sql.Named("Home10", home10),
		sql.Named("Away10", away10),
		sql.Named("Home11", home11),
		sql.Named("Away11", away11),
		sql.Named("Home12", home12),
		sql.Named("Away12", away12),
		sql.Named("Home13", home13),
		sql.Named("Away13", away13),
		sql.Named("Home14", home14),
		sql.Named("Away14", away14),
		sql.Named("Home15", home15),
		sql.Named("Away15", away15),
		sql.Named("ST_General", stGeneral),
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
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
func DeleteScoringDetailMatch(matchId int, stampUser string) error {
	dbName := Inetsoccer_Post
	spName := "MGMT_SBA_PROC_DEL_SCORING_DETAIL_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Score Detail", "SCORING MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
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

	_, err = sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}

func UpdateHomeAwayPosisi(matchId, homePosisi, awayPosisi int, stampUser string) (string, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_HOME_AWAY_POSISI"
	var err error
	var betIds string

	logManager := logger.LogManager{}
	logManager.StartTask("Update Running Ball Score", "SCORING MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("Home_Posisi", homePosisi),
		sql.Named("Away_Posisi", awayPosisi),
		sql.Named("StampUser", stampUser),
		sql.Named("BetIDs", sql.Out{Dest: &betIds}),
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
		return betIds, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return betIds, err
}
func UpdateScoringResetMatch(matchId int, scoringType, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SCORING_RESET_MATCH"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Reset Score", "SCORING MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("ScoringType", scoringType),
		sql.Named("StampUser", stampUser),
		&rs,
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
		log.Debugf("[mssql] EXEC %v", spName)
	}

	if rs == -1 {
		logManager.WriteStatusError("Match already processed")
		return errors.New("Match already processed")
	}
	return err
}

func ListGridScoringMatchSpecial(matchId, sportId int, stampUser string) ([]model.ScoringMatchSpecial, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SCORING_MATCH_SPECIAL"
	if sportId == 12 || sportId == 58 {
		spName = "MGMT_SBA_LIST_GRID_SCORING_MATCH_SPECIAL_BASKETBALL"
	}
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Grid Scoring Match Special", "SCORING MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ScoringMatchSpecial{}
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
func UpdateScoringMatchSpecial(matchId, gameType, htHome, htAway, fsHome, fsAway int, stfs, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SCORING_MATCH_SPECIAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Score", "SCORING MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
		sql.Named("GameType", gameType),
		sql.Named("HT_Home", htHome),
		sql.Named("HT_Away", htAway),
		sql.Named("FS_Home", fsHome),
		sql.Named("FS_Away", fsAway),
		sql.Named("ST_FS", stfs),
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
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}

func ListGridScoringMatchNCNG(matchId int, stampUser string) ([]model.ScoringMatchNCNG, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SCORING_MATCH_NEXTGOAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Scoring Detail Match", "Match List Grid Scoring Detail Match", stampUser)
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

	list := []model.ScoringMatchNCNG{}
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
func UpdateScoringMatchNextGoal(matchId, gameType, selection, fsHome, fsAway int, stfs, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SCORING_MATCH_NEXTGOAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Score Next Corner/Goal", "SCORING MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
		sql.Named("GameType", gameType),
		sql.Named("FS_Home", fsHome),
		sql.Named("FS_Away", fsAway),
		sql.Named("ST_FS", stfs),
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
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}

func ListGridScoringMatchSpecialBasketScore(matchId int, stampUser string) ([]model.ScoringMatchSpecialBasketScore, []model.ScoringDetailMatch, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SCORING_MATCH_SPECIAL_BASKETBALL_SCORE"
	var err error
	var res1 []model.ScoringMatchSpecialBasketScore
	var res2 []model.ScoringDetailMatch
	logManager := logger.LogManager{}
	logManager.StartTask("List Grid Scoring Match Special Basket Score", "SCORING MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &res1)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, err
	}

	rows.NextResultSet()

	err = sqlx.StructScan(rows, &res2)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return res1, res2, nil
}
func UpdateScoringMatchSpecialBasket(matchId, gameType int, fsHome, fsAway *string, stfs, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SCORING_MATCH_SPECIAL_BASKETBALL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Score", "SCORING MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
		sql.Named("GameType", gameType),
		sql.Named("FS_Home", fsHome),
		sql.Named("FS_Away", fsAway),
		sql.Named("ST_FS", stfs),
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
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
func UpdateScoringMatchSpecialBasketMainRound(MatchID int,
	Q1Home, Q1Away *int, Q1Check string,
	Q2Home, Q2Away *int, Q2Check string,
	Q3Home, Q3Away *int, Q3Check string,
	Q4Home, Q4Away *int, Q4Check string,
	OTHome, OTAway *int, OTCheck string,
	HTHome, HTAway *int, HTCheck string,
	FTHome, FTAway *int, FTCheck,
	IsHalf, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SCORING_MATCH_SPECIAL_BASKETBALL_SCORE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Score", "SCORING MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", MatchID),
		sql.Named("Home_Q1", Q1Home),
		sql.Named("Away_Q1", Q1Away),
		sql.Named("Chk_Q1", Q1Check),
		sql.Named("Home_Q2", Q2Home),
		sql.Named("Away_Q2", Q2Away),
		sql.Named("Chk_Q2", Q2Check),
		sql.Named("Home_Q3", Q3Home),
		sql.Named("Away_Q3", Q3Away),
		sql.Named("Chk_Q3", Q3Check),
		sql.Named("Home_Q4", Q4Home),
		sql.Named("Away_Q4", Q4Away),
		sql.Named("Chk_Q4", Q4Check),
		sql.Named("Home_OT", OTHome),
		sql.Named("Away_OT", OTAway),
		sql.Named("Chk_OT", OTCheck),
		sql.Named("Home_HT", HTHome),
		sql.Named("Away_HT", HTAway),
		sql.Named("Chk_HT", HTCheck),
		sql.Named("Home_FT", FTHome),
		sql.Named("Away_FT", FTAway),
		sql.Named("Chk_FT", FTCheck),
		sql.Named("IsHalf", IsHalf),
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
