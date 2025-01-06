package database

import (
	"database/sql"
	"encoding/xml"
	"fmt"

	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListAudit(itemID, itemName, startDate, endDate string, severityID int, sourceName, taskName, user string, currentPage, pageSize int, matchid string, hist bool, stampUser string) ([]model.AuditLog, int, error) {

	var dbName string
	var spName string
	if !hist {
		dbName = Inetsoccer_Log
		spName = "MGMT_SBA_LIST_GRID_AUDIT_TRAIL"
	} else {
		dbName = Inetsoccer_Log_Hist
		spName = "MGMT_SBA_LIST_GRID_AUDIT_TRAIL_HIST"
	}

	list := []model.AuditLog{}
	var totalRecords int
	var currentNewPage int
	rows, err := sqlConnections.conn[dbName].Queryx(spName,
		sql.Named("ItemID", itemID),
		sql.Named("ItemName", itemName),
		sql.Named("StartDate", startDate),
		sql.Named("EndDate", endDate),
		sql.Named("SeverityID", severityID),
		sql.Named("SourceName", sourceName),
		sql.Named("TaskName", taskName),
		sql.Named("User", user),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("matchid", matchid),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		sql.Named("CurrentNewPage", sql.Out{Dest: &currentNewPage}),
	)
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

	for idx, data := range list {
		err = xml.Unmarshal([]byte(data.ExecutionLogString), &list[idx].ExecutionLog)
		if err != nil {
			log.Warnf("[mssql] Failed unmarshalling execution log: %v", err)
			return nil, 0, err
		}
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, totalRecords, nil
}

func ListAuditTask(sourceName, stampUser string) ([]model.AuditTask, error) {
	dbName := Inetsoccer_Log
	spName := "MGMT_SBA_LIST_TASKS_AUDIT_TRAIL"

	list := []model.AuditTask{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName,
		sql.Named("SourceName", sourceName),
	)
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
		log.Debugf("[mssql] EXEC %v", spName)
	}

	fmt.Println("list : ", list)

	return list, nil
}
