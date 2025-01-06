package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListRole(prefix, stampUser string) ([]model.Role, error) {
	dbName := MgmtGames
	spName := "AdminBO_GetRoleList"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Role", "Role", stampUser)
	logManager.WriteParameters(
		sql.Named("Prefix", prefix),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.Role{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func CreateRole(name, description, prefix, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_CreateRole"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Create Role", "Role", stampUser)
	logManager.WriteParameters(
		sql.Named("Name", name),
		sql.Named("Description", description),
		sql.Named("Prefix", prefix),
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

func UpdateRole(roleID int, name, description, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_UpdateRole"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Role", "Role", stampUser)
	logManager.WriteParameters(
		sql.Named("RoleID", roleID),
		sql.Named("Name", name),
		sql.Named("Description", description),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "AdminRole", roleID, []string{"Name", "Description"})
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

func DeleteRole(roleID int, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_DeleteRole"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Role", "Role", stampUser)
	logManager.WriteParameters(
		sql.Named("RoleID", roleID),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "AdminMenu", roleID, []string{"Name", "Description"})
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

func ListRoleUser(roleID int, stampUser string) ([]model.RoleUser, error) {
	dbName := MgmtGames
	spName := "AdminBO_GetRoleUserList"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Role User", "Role", stampUser)
	logManager.WriteParameters(
		sql.Named("RoleID", roleID),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.RoleUser{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func UpdateRoleUser(roleID int, userIDs, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_UpdateRoleUser"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Role User", "Role", stampUser)
	logManager.WriteParameters(
		sql.Named("RoleID", roleID),
		sql.Named("UserIDs", userIDs),
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

func ListRoleMenu(roleID int, isForTrader bool, stampUser string) ([]model.RoleMenu, error) {
	dbName := MgmtGames
	spName := "AdminBO_GetRoleMenuList"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Role Menu", "Role", stampUser)
	logManager.WriteParameters(
		sql.Named("RoleID", roleID),
		sql.Named("IsForTrader", isForTrader),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.RoleMenu{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func UpdateRoleMenu(roleID int, menuIDs, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_UpdateRoleMenu"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Role Menu", "Role", stampUser)
	logManager.WriteParameters(
		sql.Named("RoleID", roleID),
		sql.Named("MenuIDs", menuIDs),
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

func ListRolePermission(roleID int, stampUser string) ([]model.RolePermission, error) {
	dbName := MgmtGames
	spName := "AdminBO_GetRolePermissionList"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Role Permission", "Role", stampUser)
	logManager.WriteParameters(
		sql.Named("RoleID", roleID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.RolePermission{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func UpdateRolePermission(roleID int, permissionIDs, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_UpdateRolePermission"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Role Permission", "Role", stampUser)
	logManager.WriteParameters(
		sql.Named("RoleID", roleID),
		sql.Named("PermissionIDs", permissionIDs),
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
