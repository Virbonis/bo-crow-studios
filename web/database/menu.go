package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListMenu(isMulticomp bool, stampUser string) ([]model.Menu, error) {
	dbName := MgmtGames
	spName := "AdminBO_GetMenuList"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Menu", "Menu", stampUser)
	logManager.WriteParameters(
		sql.Named("IsMulticomp", isMulticomp),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.Menu{}
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

func CreateMenu(menuNo int, title string, key string, url string, icon string, category bool, parentid *int, isMulticomp, isForTrader bool, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_CreateMenu"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Create Menu", "Menu", stampUser)
	logManager.WriteParameters(
		sql.Named("MenuNo", menuNo),
		sql.Named("Title", title),
		sql.Named("Key", key),
		sql.Named("Url", url),
		sql.Named("Icon", icon),
		sql.Named("Category", category),
		sql.Named("ParentID", parentid),
		sql.Named("IsMulticomp", isMulticomp),
		sql.Named("Is_ForTrader", isForTrader),
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

func UpdateMenu(menuID, menuNo int, title, key, url, icon string, category bool, parentid *int, isMulticomp, isForTrader bool, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_UpdateMenu"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Menu", "Menu", stampUser)
	logManager.WriteParameters(
		sql.Named("MenuID", menuID),
		sql.Named("MenuNo", menuNo),
		sql.Named("Title", title),
		sql.Named("Key", key),
		sql.Named("Url", url),
		sql.Named("Icon", icon),
		sql.Named("Category", category),
		sql.Named("ParentID", parentid),
		sql.Named("IsMulticomp", isMulticomp),
		sql.Named("Is_ForTrader", isForTrader),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "AdminMenu", menuID, []string{"MenuNo", "Title", "Key", "Url", "Icon", "Category", "ParentID", "IsMulticomp", "Is_ForTrader"})
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

func DeleteMenu(menuID int, stampUser string) error {
	dbName := MgmtGames
	spName := "AdminBO_DeleteMenu"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Menu", "Menu", stampUser)
	logManager.WriteParameters(
		sql.Named("MenuID", menuID),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "AdminMenu", menuID, []string{"MenuNo", "Title", "Key", "Url", "Icon", "Category", "ParentID", "IsMulticomp", "Is_ForTrader"})
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
