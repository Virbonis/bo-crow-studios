package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListMappingRBLeague(sportID int, rbLeagueName, ourLeagueName, unmapped string, currentPage, pageSize int, stampUser string) ([]model.MappingRBallLeague, int, error) {
	dbName := RunningBall
	spName := "MGMT_SBA_LIST_GRID_MAPPING_RB_LEAGUE"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Mapping League RBall", "MAPPING RB LEAGUE", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("RBLeagueName", rbLeagueName),
		sql.Named("OurLeagueName", ourLeagueName),
		sql.Named("Unmapped", unmapped),
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

	list := []model.MappingRBallLeague{}
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
func UpdateMappingRBLeague(rbLeagueID, ourLeagueID int, stampUser string) error {
	dbName := RunningBall
	spName := "MGMT_SBA_PROC_UPD_MAPPING_RB_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update", "MAPPING RB LEAGUE", stampUser)
	logManager.WriteParameters(
		sql.Named("RBLeagueID", rbLeagueID),
		sql.Named("OurLeagueID", ourLeagueID),
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
		log.Warnf("[mssql] Failed executing stored procedure UpdateOutright : %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}

func ListMappingRBTeam(sportID int, rbTeamName, ourTeamName, unmapped string, currentPage, pageSize int, stampUser string) ([]model.MappingRBallTeam, int, error) {
	dbName := RunningBall
	spName := "MGMT_SBA_LIST_GRID_MAPPING_RB_TEAM"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Mapping RB Team", "MAPPING RB TEAM", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("RBTeamName", rbTeamName),
		sql.Named("OurTeamName", ourTeamName),
		sql.Named("Unmapped", unmapped),
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

	list := []model.MappingRBallTeam{}
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

func UpdateMappingRBTeam(rbTeamID, ourTeamID int, stampUser string) error {
	dbName := RunningBall
	spName := "MGMT_SBA_PROC_UPD_MAPPING_RB_TEAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update", "MAPPING RB TEAM", stampUser)
	logManager.WriteParameters(
		sql.Named("RBTeamID", rbTeamID),
		sql.Named("OurTeamID", ourTeamID),
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
		log.Warnf("[mssql] Failed executing stored procedure UpdateMappingTeam : %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}

func ListLeagueMappingRBMatch(matchDateFrom, matchDateTo string, sportID int, stampUser string) ([]model.MappingRBallMatch_League, error) {
	dbName := RunningBall
	spName := "MGMT_SBA_LIST_LEAGUE_MAPPING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League", "MAPPING RB MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
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

	list := []model.MappingRBallMatch_League{}
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
func ListLeagueRBMappingRBMatch(sportId int, matchDate, stampUser string) ([]model.MappingRBallMatch_LeagueRB, error) {
	dbName := RunningBall
	spName := "MGMT_SBA_LIST_MAP_MATCH_RB_LEAGUE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List League RB", "MAPPING RB MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportId),
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
	list := []model.MappingRBallMatch_LeagueRB{}
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
func ListMatchMappingRBMatch(sportID, leagueID int, matchDateFrom, matchDateTo, stampUser string) ([]model.MappingRBallMatch_Match, error) {
	dbName := RunningBall
	spName := "MGMT_SBA_LIST_GRID_MATCH_MAPPING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match", "MAPPING RB MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("MatchDateFrom", matchDateFrom),
		sql.Named("MatchDateTo", matchDateTo),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MappingRBallMatch_Match{}
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
func ListMatchRBMappingRBMatch(leagueID int, timeStamp, stampUser string) ([]model.MappingRBallMatch_MatchRB, error) {
	dbName := RunningBall
	spName := "MGMT_SBA_LIST_GRID_MATCH_GAMEFIXTURE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match RB", "MAPPING RB MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("LeagueID", leagueID),
		sql.Named("TimeStamp", timeStamp),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MappingRBallMatch_MatchRB{}
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
func UpdateMappingRBMatch(matchID, sportsTickerID int, stampUser string) error {
	dbName := RunningBall
	spName := "MGMT_SBA_PROC_UPD_MAPPING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update", "MAPPING RB MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("IDSportsTicker", sportsTickerID),
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

func ListMatchMappingRBMatchByID(gameID int, stampUser string) (*model.MappingRBallMatch_MatchRB, error) {
	dbName := RunningBall
	spName := "MGMT_SBA_GET_GAMEFIXTUREBYID"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Match RB by ID", "MAPPING RB MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("GameId", gameID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := model.MappingRBallMatch_MatchRB{}
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
	return &list, nil
}
