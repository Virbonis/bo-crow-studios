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

func ListMasterTeam(TeamId, SportId int, TeamName string, ShortName string, Active string, CurrentPage int, PageSize int, stampUser string) ([]model.Team, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_TEAM"
	var err error
	var totalRecords int
	logManager := logger.LogManager{}
	logManager.StartTask("List Team", "Master Team", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamID", TeamId),
		sql.Named("SportID", SportId),
		sql.Named("TeamNameEnUS", TeamName),
		sql.Named("ShortName", ShortName),
		sql.Named("Active", Active),
		sql.Named("CurrentPage", CurrentPage),
		sql.Named("PageSize", PageSize),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		sql.Named("StampUser", stampUser),
	)
	list := []model.Team{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, totalRecords, err
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
func CreateMasterTeam(SportId int, Active,
	ShortName, TeamNameEN, TeamNameCN, TeamNameTW, TeamNameTH, TeamNameJP, TeamNameKR, TeamNameVN, TeamNameID, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MASTER_TEAM"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Team", "MASTER TEAM", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", SportId),
		sql.Named("Active", Active),
		sql.Named("TeamNameShortName", ShortName),
		sql.Named("TeamNameEnUS", TeamNameEN),
		sql.Named("TeamNameZhCN", TeamNameCN),
		sql.Named("TeamNameZhTW", TeamNameTW),
		sql.Named("TeamNameThTH", TeamNameTH),
		sql.Named("TeamNameJaJP", TeamNameJP),
		sql.Named("TeamNameKoKR", TeamNameKR),
		sql.Named("TeamNameViVN", TeamNameVN),
		sql.Named("TeamNameIdID", TeamNameID),
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
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	if rs == -1 {
		logManager.WriteStatusError("Team already exists")
		return errors.New("Team already exists")
	}
	return err
}
func UpdateMasterTeam(TeamID int, Active,
	Shortname, TeamNameEN, TeamNameCN, TeamNameTW, TeamNameTH, TeamNameJP, TeamNameKR, TeamNameVN, TeamNameID, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_TEAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Team", "MASTER TEAM", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamID", TeamID),
		sql.Named("Active", Active),
		sql.Named("ShortName", Shortname),
		sql.Named("TeamNameEnUS", TeamNameEN),
		sql.Named("TeamNameZhCN", TeamNameCN),
		sql.Named("TeamNameZhTW", TeamNameTW),
		sql.Named("TeamNameThTH", TeamNameTH),
		sql.Named("TeamNameJaJP", TeamNameJP),
		sql.Named("TeamNameKoKR", TeamNameKR),
		sql.Named("TeamNameViVN", TeamNameVN),
		sql.Named("TeamNameIdID", TeamNameID),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Team_All", TeamID, []string{"Nama_TeamEN", "Nama_TeamCH", "ST_Active"})
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
func UpdateTeamName(teamID int, teamNameEN, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_TEAM_NAME"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Update League Name", "Master Team", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamID", teamID),
		sql.Named("TeamNameEnUS", teamNameEN),
		sql.Named("StampUser", stampUser),
		&rs,
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Team_All", teamID, []string{"Nama_TeamEN", "Nama_TeamCH", "ST_Active"})
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

func DeleteMasterTeam(TeamID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_MASTER_TEAM"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Team", "Master Team", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamID", TeamID),
		sql.Named("StampUser", stampUser),
		&rs,
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Team_All", TeamID, []string{
		"No_Team", "Nama_TeamCH", "Nama_TeamEN", "Nama_TeamID", "Nama_TeamJP", "Nama_TeamKR", "Nama_TeamTH", "Nama_TeamTW", "Nama_TeamVN", "ST_Active"})
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
	if rs == -1 {
		logManager.WriteStatusError("Team ID : already used")
		return errors.New("Team ID : already used")
	}
	return err
}

func GetDetailMasterTeam(TeamId int, stampUser string) (model.DetailTeam, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_MASTER_TEAM_DETAIL"
	var err error
	result := model.DetailTeam{}
	logManager := logger.LogManager{}
	logManager.StartTask("Get Detail Team", "Master Team", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamID", TeamId),
		sql.Named("StampUser", stampUser),
	)
	err = sqlConnections.conn[dbName].QueryRowx(spName, logManager.Parameters...).StructScan(&result)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return result, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return result, err
}
func UpdateCountryMasterTeam(TeamId int, Country, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TEAM_COUNTRY_MASTER_TEAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Country Team", "Master Team", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamID", TeamId),
		sql.Named("CountryCode", Country),
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

func ListTeamAddMatch(website string, sportID int, teamName string, stampUser string) ([]model.TeamSelect, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_TEAM_SEARCH_ADD_MATCH"
	var err error
	result := []model.TeamSelect{}
	logManager := logger.LogManager{}
	logManager.StartTask("Search Team Add Match", "Add Match", stampUser)
	logManager.WriteParameters(
		sql.Named("Website", website),
		sql.Named("SportID", sportID),
		sql.Named("TeamName", teamName),
		sql.Named("StampUser", stampUser),
	)
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)

	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &result)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return result, err
}

func ListTeamAddOutright(sportID int, teamName string, stampUser string) ([]model.TeamSelect, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_TEAM_SEARCH_ADD_OUTRIGHT"
	var err error
	result := []model.TeamSelect{}
	logManager := logger.LogManager{}
	logManager.StartTask("Search Team Add Outright", "ADD OUTRIGHT", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("TeamName", teamName),
		sql.Named("StampUser", stampUser),
	)
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)

	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &result)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return result, err
}

func ListTeamMappingTeam(sportID int, teamName, stampUser string) ([]model.TeamMappingTeam, error) {
	dbName := SoccerBot
	spName := "MGMT_SBA_LIST_TEAM_SEARCH_MAPPING_IBC_TEAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Search Mapping Team", "MAPPING TEAM", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
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

	list := []model.TeamMappingTeam{}
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

func ListTeamMappingTeamRBall(sportID int, teamName, stampUser string) ([]model.TeamMappingTeamRB, error) {
	dbName := RunningBall
	spName := "MGMT_SBA_LIST_TEAM_SEARCH_MAPPING_RB_TEAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Search Mapping Team RBall", "MAPPING RB TEAM", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
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

	list := []model.TeamMappingTeamRB{}
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
