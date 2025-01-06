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

func ListPermission(stampUser string) ([]model.Permission, error) {
	dbName := MgmtGames
	spName := "AdminBO_GetPermissionList"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Permission", "Permission", stampUser)
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

	list := []model.Permission{}
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

func CreatePermission(code, description, group string, seq int, isForOperator, isForAdmin bool, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_CreatePermission"
	var err error
	var permissionID int

	logManager := logger.LogManager{}
	logManager.StartTask("Create Permission", "Permission", stampUser)
	logManager.WriteParameters(
		sql.Named("Code", code),
		sql.Named("Description", description),
		sql.Named("Group", group),
		sql.Named("Seq", seq),
		sql.Named("IsForOperator", isForOperator),
		sql.Named("IsForAdmin", isForAdmin),
		sql.Named("PermissionID", sql.Out{Dest: &permissionID}),
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
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}

func UpdatePermission(permissionID int, code, description, group string, seq int, isForOperator, isForAdmin bool, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_UpdatePermission"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Permission", "Permission", stampUser)
	logManager.WriteParameters(
		sql.Named("PermissionID", permissionID),
		sql.Named("Code", code),
		sql.Named("Description", description),
		sql.Named("Group", group),
		sql.Named("Seq", seq),
		sql.Named("IsForOperator", isForOperator),
		sql.Named("IsForAdmin", isForAdmin),
		sql.Named("StampUser", stampUser),
	)

	logManager.PrepareAudit(sqlConnections.conn[dbName], "AdminPermission", permissionID, []string{"Code", "Description", "Group", "SeqNo", "IsForOperator", "IsForAdmin"})
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

func DeletePermission(permissionID int, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_DeletePermission"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Permission", "Permission", stampUser)
	logManager.WriteParameters(
		sql.Named("PermissionID", permissionID),
		sql.Named("StampUser", stampUser),
		&rs,
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "AdminPermission", permissionID, []string{"Code", "Description", "Group", "SeqNo", "IsForOperator", "IsForAdmin"})
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
		logManager.WriteStatusError("Failed to delete, the permission is being used by any role")
		return errors.New("Failed to delete, the permission is being used by any role")
	}
	return err
}
