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

func ListSelectUserTeam(stampUser string) ([]model.UserTeam, error) {
	dbName := MgmtGames
	spName := "MGMT_SBA_LIST_USER_TEAMS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Select User Team", "User Team", stampUser)
	logManager.WriteParameters(
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.UserTeam{}
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

func ListUserTeam(TeamID int, stampUser string) ([]model.ListUserTeam, error) {
	dbName := MgmtGames
	spName := "MGMT_SBA_LIST_GRID_USER_TEAMS"
	var err error
	list := []model.ListUserTeam{}

	logManager := logger.LogManager{}
	logManager.StartTask("List User Team", "User Team", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamID", TeamID),
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
func AddUserTeam(TeamName, IsActive, stampUser string) error {
	dbName := MgmtGames
	spName := "MGMT_SBA_PROC_INS_USER_TEAM"
	var err error
	var rs mssql.ReturnStatus
	logManager := logger.LogManager{}
	logManager.StartTask("Insert User Team", "User Team", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamName", TeamName),
		sql.Named("IsActive", IsActive),
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
	if rs == -1 {
		logManager.WriteStatusError("User Team Already Exist")
		return errors.New("User Team Already Exist")
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return nil
}
func UpdUserTeam(TeamID int, TeamName, IsActive, stampUser string) error {
	dbName := "MgmtGames"
	spName := "MGMT_SBA_PROC_UPD_USER_TEAM"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Update User Team", "User Team", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamID", TeamID),
		sql.Named("TeamName", TeamName),
		sql.Named("IsActive", IsActive),
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
func DelUserTeam(TeamID int, stampUser string) error {
	dbName := MgmtGames
	spName := "MGMT_SBA_PROC_DEL_USER_TEAM"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Delete User Team", "User Team", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamID", TeamID),
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
	if rs == 1 {
		logManager.WriteStatusError("Unable to Delete User Team !")
		return errors.New("Unable to Delete User Team !")
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}

	return nil
}

func ListUserUserTeam(TeamID int, stampUser string) ([]model.ListUserUserTeam, error) {
	dbName := "MgmtGames"
	spName := "MGMT_SBA_LIST_GRID_USER_USER_TEAMS"
	var err error
	list := []model.ListUserUserTeam{}
	logManager := logger.LogManager{}
	logManager.StartTask("List User User Team", "User Team", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamID", TeamID),
		sql.Named("StampUser", stampUser),
		sql.Named("UI", "New"),
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
func UpdUserUserTeam(TeamID int, UserID, stampUser string) error {
	dbName := MgmtGames
	spName := "MGMT_SBA_PROC_INS_USER_USER_TEAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert User User Team", "User Team", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamID", TeamID),
		sql.Named("UserIDs", UserID),
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

	return nil
}

func ListUserTeamSub(TeamID int, stampUser string) ([]model.ListTeamSub, error) {
	dbName := MgmtGames
	spName := "MGMT_SBA_LIST_GRID_USER_TEAMS_SUB"
	var err error
	list := []model.ListTeamSub{}

	logManager := logger.LogManager{}
	logManager.StartTask("List User Team Sub", "User Team", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamID", TeamID),
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
func AddUserTeamSub(TeamID int, TeamSubName, stampUser string) error {
	dbName := MgmtGames
	spName := "MGMT_SBA_PROC_INS_USER_TEAM_SUB"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert User Team Sub", "User Team Sub", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamID", TeamID),
		sql.Named("TeamSubName", TeamSubName),
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
	return nil
}
func UpdUserTeamSub(TeamID int, TeamName, stampUser string) error {
	dbName := "MgmtGames"
	spName := "MGMT_SBA_PROC_UPD_USER_TEAM_SUB"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update User Team Sub", "User Team Sub", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamSubID", TeamID),
		sql.Named("TeamSubName", TeamName),
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
	return nil
}
func DelUserTeamSub(TeamSubID int, stampUser string) error {
	dbName := MgmtGames
	spName := "MGMT_SBA_PROC_DEL_USER_TEAM_SUB"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete User Team Sub", "User Team Sub", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamSubID", TeamSubID),
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

	return nil
}

func ListUserUserTeamSub(TeamID int, stampUser string) ([]model.ListUserUserTeam, error) {
	dbName := "MgmtGames"
	spName := "MGMT_SBA_LIST_GRID_USER_USER_TEAMS_SUB"
	var err error
	list := []model.ListUserUserTeam{}
	logManager := logger.LogManager{}
	logManager.StartTask("List User User Team Sub", "User Team", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamSubID", TeamID),
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
func UpdUserUserTeamSub(TeamID int, UserID, stampUser string) error {
	dbName := "MgmtGames"
	spName := "MGMT_SBA_PROC_INS_USER_USER_TEAM_SUB"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert User User Team Sub", "User Team Sub", stampUser)
	logManager.WriteParameters(
		sql.Named("TeamSubID", TeamID),
		sql.Named("UserIDs", UserID),
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

	return nil
}

func ListLeagueUserTeamSub(UserTeamID, UserTeamSubID, SportID int, League string, CurrentPage, PageSize int, stampUser string) ([]model.ListLeagueTeamSub, int, error) {
	dbName := "MgmtGames"
	spName := "MGMT_SBA_LIST_GRID_LEAGUE_USER_TEAM_SUB"
	var err error
	var TotalRecords int
	logManager := logger.LogManager{}
	logManager.StartTask("List League User Team Sub", "User Team", stampUser)
	logManager.WriteParameters(
		sql.Named("UserTeamID", UserTeamID),
		sql.Named("UserTeamSubID", UserTeamSubID),
		sql.Named("SportID", SportID),
		sql.Named("League", League),
		sql.Named("CurrentPage", CurrentPage),
		sql.Named("PageSize", PageSize),
		sql.Named("TotalRecords", sql.Out{Dest: &TotalRecords}),
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
		return nil, 0, err
	}
	defer rows.Close()
	list := []model.ListLeagueTeamSub{}

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, 0, err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, TotalRecords, nil
}
func UpdLeagueUserTeamSub(UserTeamID, UserTeamSubID, SportID int, LeagueRemoved, LeagueAdded, stampUser string) error {
	dbName := "MgmtGames"
	spName := "MGMT_SBA_PROC_INS_LEAGUE_USER_TEAM_SUB"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert League User Team Sub", "User Team", stampUser)
	logManager.WriteParameters(
		sql.Named("UserTeamID", UserTeamID),
		sql.Named("UserTeamSubID", UserTeamSubID),
		sql.Named("SportID", SportID),
		sql.Named("LeagueID_Remove", LeagueRemoved),
		sql.Named("LeagueID_Add", LeagueAdded),
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

	return nil
}
